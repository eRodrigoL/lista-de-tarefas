import { Component } from '@angular/core';

import { QuadroTarefas } from '../../componentes/quadro-tarefas/quadro-tarefas';

@Component({
  imports: [QuadroTarefas],
  selector: 'app-tarefas',
  styleUrl: './tarefas.scss',
  templateUrl: './tarefas.html',
})
export class Tarefas {}
