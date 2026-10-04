import { Routes } from '@angular/router';
import { Tarefas } from './paginas/tarefas/tarefas';

export const routes: Routes = [
  { path: '', component: Tarefas },
  { path: '**', redirectTo: '' },
];
