import { Component, input } from '@angular/core';

import { Tarefa } from '../../modelos/tarefa';

@Component({
  imports: [],
  selector: 'app-quadro-tarefas',
  styleUrl: './quadro-tarefas.scss',
  templateUrl: './quadro-tarefas.html',
})
export class QuadroTarefas {
  readonly titulo = input.required<string>();
  readonly quantidade = input(0);
  readonly tarefas = input<Tarefa[]>([]);

  estado(): string {
    return JSON.stringify(this.tarefas());
  }
}
