import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-quadro-tarefas',
  styleUrl: './quadro-tarefas.scss',
  templateUrl: './quadro-tarefas.html',
})
export class QuadroTarefas {
  readonly titulo = input.required<string>();
}
