import { Component, inject } from '@angular/core';

import { QuadroTarefas } from '../../componentes/quadro-tarefas/quadro-tarefas';
import { TarefaService } from '../../servicos/tarefa';
import { ThumbPosition } from '@angular/material/slider/testing';

@Component({
  imports: [QuadroTarefas],
  selector: 'app-tarefas',
  styleUrl: './tarefas.scss',
  templateUrl: './tarefas.html',
})
export class Tarefas {
  private readonly servico = inject(TarefaService);
  readonly tarefas = this.servico.tarefas;
}
