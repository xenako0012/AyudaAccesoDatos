import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Temario } from './pages/temario/temario';
import { UnidadDetalle } from './pages/unidad/unidad';
import { Quiz } from './pages/quiz/quiz';
import { FlashcardsPage } from './pages/flashcards/flashcards';
import { EjerciciosPage } from './pages/ejercicios/ejercicios';
import { GlosarioPage } from './pages/glosario/glosario';

export const routes: Routes = [
  { path: '', component: Home, title: 'Repaso AD · Inicio' },
  { path: 'temario', component: Temario, title: 'Repaso AD · Temario' },
  { path: 'temario/:unidadId', component: UnidadDetalle, title: 'Repaso AD · Unidad' },
  { path: 'test', component: Quiz, title: 'Repaso AD · Test' },
  { path: 'flashcards', component: FlashcardsPage, title: 'Repaso AD · Flashcards' },
  { path: 'ejercicios', component: EjerciciosPage, title: 'Repaso AD · Ejercicios' },
  { path: 'glosario', component: GlosarioPage, title: 'Repaso AD · Glosario' },
  { path: '**', redirectTo: '' },
];
