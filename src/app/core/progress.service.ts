import { Injectable, computed, signal } from '@angular/core';
import { ResultadoQuiz } from './models';

interface EstadoProgreso {
  quiz: ResultadoQuiz[];
  flashcardsConocidas: string[];
}

const CLAVE = 'repaso-ad.progreso.v1';

/**
 * Progreso del estudiante, persistido en localStorage:
 * historial de tests y flashcards marcadas como dominadas.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly estado = signal<EstadoProgreso>(this.cargar());

  readonly resultadosQuiz = computed(() => this.estado().quiz);
  readonly flashcardsConocidas = computed(() => this.estado().flashcardsConocidas);

  /** Mejor nota (%) conseguida por ámbito de test: 'ut1', 'ut2', 'todas'. */
  readonly mejorNotaPorAmbito = computed(() => {
    const mapa = new Map<string, number>();
    for (const r of this.estado().quiz) {
      const nota = Math.round((r.aciertos / r.total) * 100);
      mapa.set(r.ambito, Math.max(mapa.get(r.ambito) ?? 0, nota));
    }
    return mapa;
  });

  readonly ultimosResultados = computed(() => this.estado().quiz.slice(-8).reverse());

  registrarResultadoQuiz(resultado: ResultadoQuiz): void {
    const actual = this.estado();
    const quiz = [...actual.quiz, resultado].slice(-40); // conserva los últimos 40
    this.guardar({ ...actual, quiz });
  }

  alternarFlashcardConocida(id: string): void {
    const actual = this.estado();
    const conocidas = actual.flashcardsConocidas.includes(id)
      ? actual.flashcardsConocidas.filter((f) => f !== id)
      : [...actual.flashcardsConocidas, id];
    this.guardar({ ...actual, flashcardsConocidas: conocidas });
  }

  reiniciarFlashcards(): void {
    this.guardar({ ...this.estado(), flashcardsConocidas: [] });
  }

  reiniciarTodo(): void {
    this.guardar({ quiz: [], flashcardsConocidas: [] });
  }

  private cargar(): EstadoProgreso {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (crudo) {
        const datos = JSON.parse(crudo) as EstadoProgreso;
        return {
          quiz: Array.isArray(datos.quiz) ? datos.quiz : [],
          flashcardsConocidas: Array.isArray(datos.flashcardsConocidas) ? datos.flashcardsConocidas : [],
        };
      }
    } catch {
      // localStorage no disponible o JSON corrupto: empezamos de cero
    }
    return { quiz: [], flashcardsConocidas: [] };
  }

  private guardar(estado: EstadoProgreso): void {
    this.estado.set(estado);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      // sin persistencia disponible: el progreso solo vivirá en memoria
    }
  }
}
