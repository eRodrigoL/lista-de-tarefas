import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Cabecalho } from './componentes/cabecalho/cabecalho';
import { DialogTarefa } from './componentes/dialog-tarefa/dialog-tarefa';

@Component({
  imports: [RouterOutlet, Cabecalho],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('lista-de-tarefas');

  private readonly dialog = inject(MatDialog);

  abrirCriacao(): void {
    this.dialog.open(DialogTarefa, {
      width: '560px',
      maxWidth: '95vw',
    });
  }
}
