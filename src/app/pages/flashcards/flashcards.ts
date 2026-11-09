import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FLASHCARDS } from '../../core/data/flashcards.data';
import { Flashcard } from '../../core/models';
import { ProgressService } from '../../core/progress.service';

type Filtro = 'todas' | 'ut1' | 'ut2';

@Component({
  selector: 'app-flashcards',
  imports: [UpperCasePipe],
  templateUrl: './flashcards.html',
  styleUrl: './flashcards.scss',
})
export class FlashcardsPage {
  private readonly ruta = inject(ActivatedRoute);
  protected readonly progreso = inject(ProgressService);

  protected readonly filtro = signal<Filtro>('todas');
  protected readonly soloPendientes = signal(false);
  protected readonly indice = signal(0);
  protected readonly girada = signal(false);

  protected readonly baraja = computed<Flashcard[]>(() => {
    let cartas = this.filtro() === 'todas'
      ? FLASHCARDS
      : FLASHCARDS.filter((f) => f.unidad === this.filtro());

    if (this.soloPendientes()) {
      const conocidas = new Set(this.progreso.flashcardsConocidas());
      cartas = cartas.filter((f) => !conocidas.has(f.id));
    }
    return cartas;
  });

  protected readonly cartaActual = computed(() => this.baraja()[this.indice()]);

  protected readonly conocidasEnBaraja = computed(() => {
    const conocidas = new Set(this.progreso.flashcardsConocidas());
    return this.baraja().filter((f) => conocidas.has(f.id)).length;
  });

  constructor() {
    const unidadInicial = toSignal(
      this.ruta.queryParamMap.pipe(map((q) => q.get('unidad') as Filtro | null)),
      { initialValue: null },
    );
    const u = unidadInicial();
    if (u === 'ut1' || u === 'ut2') {
      this.filtro.set(u);
    }
  }

  protected elegirFiltro(f: Filtro): void {
    this.filtro.set(f);
    this.reiniciarPosicion();
  }

  protected alternarPendientes(): void {
    this.soloPendientes.update((v) => !v);
    this.reiniciarPosicion();
  }

  protected girar(): void {
    this.girada.update((v) => !v);
  }

  protected anterior(): void {
    if (this.indice() > 0) {
      this.indice.update((i) => i - 1);
      this.girada.set(false);
    }
  }

  protected siguiente(): void {
    if (this.indice() + 1 < this.baraja().length) {
      this.indice.update((i) => i + 1);
      this.girada.set(false);
    }
  }

  protected marcarConocida(conocida: boolean): void {
    const carta = this.cartaActual();
    if (!carta) return;
    const yaConocida = this.progreso.flashcardsConocidas().includes(carta.id);
    if (conocida !== yaConocida) {
      this.progreso.alternarFlashcardConocida(carta.id);
    }
    if (conocida) {
      this.siguiente();
    }
  }

  protected esConocida(id: string): boolean {
    return this.progreso.flashcardsConocidas().includes(id);
  }

  private reiniciarPosicion(): void {
    this.indice.set(0);
    this.girada.set(false);
  }
}
