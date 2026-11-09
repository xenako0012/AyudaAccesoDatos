import { Component, input, signal } from '@angular/core';

/** Bloque de código con cabecera de fichero y botón de copiar. */
@Component({
  selector: 'app-code-block',
  template: `
    <figure class="codigo">
      <figcaption class="codigo__cabecera">
        <span class="codigo__puntos" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="codigo__fichero">{{ fichero() }}</span>
        <button type="button" class="codigo__copiar" (click)="copiar()">
          @if (copiado()) {
            ✓ Copiado
          } @else {
            ⧉ Copiar
          }
        </button>
      </figcaption>
      <pre><code>{{ codigo() }}</code></pre>
      @if (nota()) {
        <p class="codigo__nota">💡 {{ nota() }}</p>
      }
    </figure>
  `,
  styles: `
    .codigo {
      margin: 1rem 0 0;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: #0a101f;
      overflow: hidden;
    }
    .codigo__cabecera {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.5rem 0.85rem;
      background: rgba(148, 163, 184, 0.07);
      border-bottom: 1px solid var(--border);
    }
    .codigo__puntos { display: inline-flex; gap: 5px; }
    .codigo__puntos i {
      width: 9px; height: 9px; border-radius: 50%;
      background: var(--faint); opacity: 0.7; display: block;
    }
    .codigo__puntos i:nth-child(1) { background: #f87171; }
    .codigo__puntos i:nth-child(2) { background: #fbbf24; }
    .codigo__puntos i:nth-child(3) { background: #34d399; }
    .codigo__fichero {
      font-family: var(--mono);
      font-size: 0.78rem;
      color: var(--muted);
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .codigo__copiar {
      border: 1px solid var(--border-strong);
      background: rgba(148, 163, 184, 0.08);
      color: var(--muted);
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.22rem 0.6rem;
      border-radius: 7px;
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s;
    }
    .codigo__copiar:hover { color: var(--cyan); border-color: rgba(34, 211, 238, 0.45); }
    pre {
      margin: 0;
      padding: 0.9rem 1rem;
      overflow-x: auto;
      font-size: 0.815rem;
      line-height: 1.55;
      color: #d5deef;
    }
    .codigo__nota {
      margin: 0;
      padding: 0.6rem 1rem;
      font-size: 0.82rem;
      color: var(--muted);
      border-top: 1px dashed var(--border);
    }
  `,
})
export class CodeBlock {
  readonly fichero = input.required<string>();
  readonly codigo = input.required<string>();
  readonly nota = input<string | undefined>(undefined);

  protected readonly copiado = signal(false);

  protected async copiar(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.codigo());
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 1800);
    } catch {
      // portapapeles no disponible
    }
  }
}
