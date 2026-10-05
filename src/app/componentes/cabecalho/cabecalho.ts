import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-cabecalho',
  styleUrl: './cabecalho.scss',
  templateUrl: './cabecalho.html',
})
export class Cabecalho {
  readonly adicionarTarefa = output<void>();
}
