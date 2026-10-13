import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { Tarefa } from '../../modelos/tarefa';

@Component({
  imports: [MatCardModule],
  selector: 'app-quadro-tarefas',
  styleUrl: './quadro-tarefas.scss',
  templateUrl: './quadro-tarefas.html',
})
export class QuadroTarefas {
  readonly quantidade = input(0);
  readonly tarefas = input<Tarefa[]>([]);
  readonly titulo = input.required<string>();
  readonly visualizar = output<Tarefa>();
}
