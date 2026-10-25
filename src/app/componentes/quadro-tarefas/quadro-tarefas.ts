import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DatePipe } from '@angular/common';

import { Tarefa } from '../../modelos/tarefa';
import { ResumoPipe } from '../../pipes/resumo-pipe';

@Component({
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    ResumoPipe,
  ],
  selector: 'app-quadro-tarefas',
  styleUrl: './quadro-tarefas.scss',
  templateUrl: './quadro-tarefas.html',
})
export class QuadroTarefas {
  readonly ocupado = input(false);
  readonly quantidade = input(0);
  readonly tarefas = input<Tarefa[]>([]);
  readonly titulo = input.required<string>();
  readonly excluir = output<Tarefa>();
  readonly alterarStatus = output<Tarefa>();
  readonly editar = output<Tarefa>();
  readonly visualizar = output<Tarefa>();
}
