import { UpperCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { GLOSARIO } from '../../core/data/glosario.data';

type Filtro = 'todos' | 'ut1' | 'ut2';

@Component({
  selector: 'app-glosario',
  imports: [UpperCasePipe],
  templateUrl: './glosario.html',
  styleUrl: './glosario.scss',
})
export class GlosarioPage {
  protected readonly busqueda = signal('');
  protected readonly filtro = signal<Filtro>('todos');

  protected readonly terminos = computed(() => {
    const texto = this.normalizar(this.busqueda());
    return GLOSARIO.filter((t) => {
      const coincideUnidad = this.filtro() === 'todos' || t.unidad === this.filtro();
      const coincideTexto =
        texto === '' ||
        this.normalizar(t.termino).includes(texto) ||
        this.normalizar(t.definicion).includes(texto);
      return coincideUnidad && coincideTexto;
    });
  });

  protected alEscribir(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  /** Quita acentos y pasa a minúsculas para búsquedas tolerantes. */
  private normalizar(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }
}
