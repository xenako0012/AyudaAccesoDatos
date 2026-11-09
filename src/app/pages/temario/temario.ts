import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UNIDADES } from '../../core/data/unidades.data';

@Component({
  selector: 'app-temario',
  imports: [RouterLink],
  templateUrl: './temario.html',
  styleUrl: './temario.scss',
})
export class Temario {
  protected readonly unidades = UNIDADES;
}
