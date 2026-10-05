import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './componentes/cabecalho/cabecalho';

@Component({
  imports: [RouterOutlet, Cabecalho],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('lista-de-tarefas');
}
