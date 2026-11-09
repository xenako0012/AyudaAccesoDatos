import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PREGUNTAS } from '../../core/data/quiz.data';
import { Pregunta } from '../../core/models';
import { ProgressService } from '../../core/progress.service';

type Fase = 'config' | 'jugando' | 'resultados';
type Ambito = 'todas' | 'ut1' | 'ut2';

interface RespuestaUsuario {
  pregunta: Pregunta;
  elegida: number;
  acierta: boolean;
}

@Component({
  selector: 'app-quiz',
  imports: [UpperCasePipe],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  private readonly ruta = inject(ActivatedRoute);
  protected readonly progreso = inject(ProgressService);

  // ---------- configuración ----------
  protected readonly ambito = signal<Ambito>('todas');
  protected readonly cantidad = signal<number>(10);

  protected readonly disponibles = computed(() =>
    this.ambito() === 'todas' ? PREGUNTAS : PREGUNTAS.filter((p) => p.unidad === this.ambito()),
  );

  protected readonly maxPreguntas = computed(() => this.disponibles().length);

  // ---------- partida ----------
  protected readonly fase = signal<Fase>('config');
  protected readonly preguntas = signal<Pregunta[]>([]);
  protected readonly indice = signal(0);
  protected readonly respuestas = signal<RespuestaUsuario[]>([]);
  protected readonly seleccion = signal<number | null>(null);

  protected readonly preguntaActual = computed(() => this.preguntas()[this.indice()]);

  protected readonly aciertos = computed(() => this.respuestas().filter((r) => r.acierta).length);

  protected readonly nota = computed(() => {
    const total = this.preguntas().length;
    return total === 0 ? 0 : Math.round((this.aciertos() / total) * 100);
  });

  protected readonly mensajeNota = computed(() => {
    const n = this.nota();
    if (n >= 90) return { texto: '¡Sobresaliente! Dominas la unidad.', color: 'var(--green)' };
    if (n >= 70) return { texto: 'Notable. Vas muy bien, repasa solo los fallos.', color: 'var(--green)' };
    if (n >= 50) return { texto: 'Aprobado justo: dale otra vuelta al temario.', color: 'var(--amber)' };
    return { texto: 'Toca repasar: empieza por las flashcards y repite el test.', color: 'var(--red)' };
  });

  protected readonly falladas = computed(() => this.respuestas().filter((r) => !r.acierta));

  constructor() {
    const unidadInicial = toSignal(
      this.ruta.queryParamMap.pipe(map((q) => q.get('unidad') as Ambito | null)),
      { initialValue: null },
    );
    const u = unidadInicial();
    if (u === 'ut1' || u === 'ut2') {
      this.ambito.set(u);
    }
  }

  protected elegirAmbito(a: Ambito): void {
    this.ambito.set(a);
    if (this.cantidad() > this.maxPreguntas()) {
      this.cantidad.set(this.maxPreguntas());
    }
  }

  protected empezar(): void {
    const mezcladas = this.barajar([...this.disponibles()]).slice(0, Math.min(this.cantidad(), this.maxPreguntas()));
    this.preguntas.set(mezcladas);
    this.respuestas.set([]);
    this.indice.set(0);
    this.seleccion.set(null);
    this.fase.set('jugando');
  }

  protected elegirOpcion(i: number): void {
    if (this.seleccion() !== null) return; // ya respondida
    this.seleccion.set(i);
    const p = this.preguntaActual();
    this.respuestas.update((rs) => [...rs, { pregunta: p, elegida: i, acierta: i === p.correcta }]);
  }

  protected siguiente(): void {
    if (this.indice() + 1 < this.preguntas().length) {
      this.indice.update((i) => i + 1);
      this.seleccion.set(null);
    } else {
      this.terminar();
    }
  }

  private terminar(): void {
    this.fase.set('resultados');
    this.progreso.registrarResultadoQuiz({
      fecha: new Date().toISOString(),
      ambito: this.ambito(),
      total: this.preguntas().length,
      aciertos: this.aciertos(),
      falladas: this.falladas().map((r) => r.pregunta.id),
    });
  }

  protected repetirFalladas(): void {
    const falladas = this.falladas().map((r) => r.pregunta);
    this.preguntas.set(this.barajar(falladas));
    this.respuestas.set([]);
    this.indice.set(0);
    this.seleccion.set(null);
    this.fase.set('jugando');
  }

  protected volverAConfig(): void {
    this.fase.set('config');
  }

  private barajar<T>(lista: T[]): T[] {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  }

  protected letra(indice: number): string {
    return String.fromCharCode(65 + indice); // A, B, C, D
  }
}
