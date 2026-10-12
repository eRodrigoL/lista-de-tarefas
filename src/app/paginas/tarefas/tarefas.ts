import { Component, inject, OnInit } from '@angular/core';

import { QuadroTarefas } from '../../componentes/quadro-tarefas/quadro-tarefas';
import { TarefaService } from '../../servicos/tarefa';

@Component({
  imports: [QuadroTarefas],
  selector: 'app-tarefas',
  styleUrl: './tarefas.scss',
  templateUrl: './tarefas.html',
})
export class Tarefas implements OnInit {
  private readonly servico = inject(TarefaService);
  readonly pendentes = this.servico.pendentes;
  readonly concluidas = this.servico.concluidas;

  ngOnInit(): void {
    void this.servico.carregar();
  }
}
