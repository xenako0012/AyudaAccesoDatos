import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UNIDADES } from '../../core/data/unidades.data';
import { PREGUNTAS } from '../../core/data/quiz.data';
import { FLASHCARDS } from '../../core/data/flashcards.data';
import { EJERCICIOS } from '../../core/data/ejercicios.data';
import { ProgressService } from '../../core/progress.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe, UpperCasePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly progreso = inject(ProgressService);

  protected readonly unidades = UNIDADES;
  protected readonly totalPreguntas = PREGUNTAS.length;
  protected readonly totalFlashcards = FLASHCARDS.length;
  protected readonly totalEjercicios = EJERCICIOS.length;

  protected readonly hayProgreso = computed(
    () => this.progreso.resultadosQuiz().length > 0 || this.progreso.flashcardsConocidas().length > 0,
  );

  protected preguntasDe(unidadId: string): number {
    return PREGUNTAS.filter((p) => p.unidad === unidadId).length;
  }

  protected flashcardsDe(unidadId: string): number {
    return FLASHCARDS.filter((f) => f.unidad === unidadId).length;
  }

  protected conocidasDe(unidadId: string): number {
    const conocidas = new Set(this.progreso.flashcardsConocidas());
    return FLASHCARDS.filter((f) => f.unidad === unidadId && conocidas.has(f.id)).length;
  }

  protected mejorNotaDe(unidadId: string): number | undefined {
    return this.progreso.mejorNotaPorAmbito().get(unidadId);
  }

  protected bloquesDe(unidadId: string) {
    return UNIDADES.find((u) => u.id === unidadId)?.bloques ?? [];
  }
}
