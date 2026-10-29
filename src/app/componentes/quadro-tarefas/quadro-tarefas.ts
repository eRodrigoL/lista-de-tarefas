import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Tarefa } from '../../modelos/tarefa';
import { ResumoPipe } from '../../pipes/resumo-pipe';

@Component({
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
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
  readonly icone = input('schedule');
  readonly ocupado = input(false);
  readonly quantidade = input(0);
  readonly tarefas = input<Tarefa[]>([]);
  readonly titulo = input.required<string>();
  readonly ordenar = output<Tarefa[]>();
  readonly excluir = output<Tarefa>();
  readonly alterarStatus = output<Tarefa>();
  readonly editar = output<Tarefa>();
  readonly visualizar = output<Tarefa>();

  reordenar(evento: CdkDragDrop<Tarefa[]>): void {
    this.mover(evento.previousIndex, evento.currentIndex - evento.previousIndex);
  }

  mover(indice: number, deslocamento: number): void {
    const destino = indice + deslocamento;
    if (this.ocupado() || destino < 0 || destino >= this.tarefas().length || destino === indice)
      return;
    const tarefas = [...this.tarefas()];
    moveItemInArray(tarefas, indice, destino);
    this.ordenar.emit(tarefas);
  }
}
