import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { Tarefa } from '../../modelos/tarefa';

@Component({
  imports: [MatCardModule],
  selector: 'app-quadro-tarefas',
  styleUrl: './quadro-tarefas.scss',
  templateUrl: './quadro-tarefas.html',
})
export class QuadroTarefas {
  readonly titulo = input.required<string>();
  readonly quantidade = input(0);
  readonly tarefas = input<Tarefa[]>([]);
}
