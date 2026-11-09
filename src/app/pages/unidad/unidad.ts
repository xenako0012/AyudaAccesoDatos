import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { buscarUnidad } from '../../core/data/unidades.data';
import { CodeBlock } from '../../shared/code-block';

@Component({
  selector: 'app-unidad-detalle',
  imports: [RouterLink, CodeBlock],
  templateUrl: './unidad.html',
  styleUrl: './unidad.scss',
})
export class UnidadDetalle {
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly paramId = toSignal(
    this.ruta.paramMap.pipe(map((p) => p.get('unidadId') ?? '')),
    { initialValue: '' },
  );

  protected readonly unidad = computed(() => buscarUnidad(this.paramId()));

  constructor() {
    // Si la unidad no existe, volvemos al índice del temario.
    if (!this.unidad()) {
      queueMicrotask(() => this.router.navigate(['/temario']));
    }
  }

  /** Estado de plegado por bloque: todo desplegado al entrar. */
  protected readonly plegados = new Set<string>();

  protected alternarBloque(bloqueId: string): void {
    if (this.plegados.has(bloqueId)) {
      this.plegados.delete(bloqueId);
    } else {
      this.plegados.add(bloqueId);
    }
  }

  protected estaPlegado(bloqueId: string): boolean {
    return this.plegados.has(bloqueId);
  }

  protected irATema(temaId: string): void {
    document.getElementById(temaId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
