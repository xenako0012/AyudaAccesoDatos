import { UpperCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { EJERCICIOS } from '../../core/data/ejercicios.data';
import { DOCUMENTOS } from '../../core/data/glosario.data';
import { Ejercicio } from '../../core/models';

type Filtro = 'todas' | 'ut1' | 'ut2';

@Component({
  selector: 'app-ejercicios',
  imports: [UpperCasePipe],
  templateUrl: './ejercicios.html',
  styleUrl: './ejercicios.scss',
})
export class EjerciciosPage {
  protected readonly documentos = DOCUMENTOS;
  protected readonly filtro = signal<Filtro>('todas');

  protected readonly ejercicios = computed(() =>
    this.filtro() === 'todas'
      ? EJERCICIOS
      : EJERCICIOS.filter((e) => e.unidad === this.filtro()),
  );

  protected readonly bloques = computed(() => {
    const ordenado = new Map<string, Ejercicio[]>();
    for (const e of this.ejercicios()) {
      const clave = `${e.unidad}::${e.bloque}`;
      const lista = ordenado.get(clave) ?? [];
      lista.push(e);
      ordenado.set(clave, lista);
    }
    return [...ordenado.entries()].map(([clave, lista]) => {
      const [unidad, bloque] = clave.split('::');
      return { unidad, bloque, lista };
    });
  });
}
