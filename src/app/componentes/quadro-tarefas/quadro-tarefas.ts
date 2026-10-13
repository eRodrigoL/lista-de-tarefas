import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Tarefa } from '../../modelos/tarefa';

@Component({
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatSlideToggleModule],
  selector: 'app-quadro-tarefas',
  styleUrl: './quadro-tarefas.scss',
  templateUrl: './quadro-tarefas.html',
})
export class QuadroTarefas {
  readonly quantidade = input(0);
  readonly tarefas = input<Tarefa[]>([]);
  readonly titulo = input.required<string>();
  readonly alterarStatus = output<Tarefa>();
  readonly editar = output<Tarefa>();
  readonly visualizar = output<Tarefa>();
}
