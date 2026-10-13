import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DialogTarefa } from '../../componentes/dialog-tarefa/dialog-tarefa';
import { QuadroTarefas } from '../../componentes/quadro-tarefas/quadro-tarefas';
import { Tarefa } from '../../modelos/tarefa';
import { TarefaService } from '../../servicos/tarefa';

@Component({
  imports: [QuadroTarefas],
  selector: 'app-tarefas',
  styleUrl: './tarefas.scss',
  templateUrl: './tarefas.html',
})
export class Tarefas implements OnInit {
  private readonly servico = inject(TarefaService);
  private readonly dialog = inject(MatDialog);

  readonly pendentes = this.servico.pendentes;
  readonly concluidas = this.servico.concluidas;

  ngOnInit(): void {
    void this.servico.carregar();
  }

  visualizar(tarefa: Tarefa): void {
    this.dialog.open(DialogTarefa, {
      width: '560px',
      maxWidth: '95vw',
      data: { tarefa, somenteLeitura: true },
    });
  }
}
