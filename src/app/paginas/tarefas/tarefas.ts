import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConfirmacaoService } from '../../servicos/confirmacao';
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
  private readonly aviso = inject(MatSnackBar);
  private readonly confirmacao = inject(ConfirmacaoService);
  private readonly servico = inject(TarefaService);
  private readonly dialog = inject(MatDialog);

  readonly pendentes = this.servico.pendentes;
  readonly concluidas = this.servico.concluidas;

  ngOnInit(): void {
    void this.carregar();
  }

  visualizar(tarefa: Tarefa): void {
    this.dialog.open(DialogTarefa, {
      width: '560px',
      maxWidth: '95vw',
      data: { tarefa, somenteLeitura: true },
    });
  }

  async alterarStatus(tarefa: Tarefa): Promise<void> {
    const status = tarefa.status === 'pendente' ? 'concluida' : 'pendente';
    try {
      await this.servico.atualizar({ ...tarefa, status });
    } catch {
      this.aviso.open('Não foi possível alterar o status. Tente novamente.', 'Fechar');
    }
  }

  editar(tarefa: Tarefa): void {
    this.dialog.open(DialogTarefa, {
      width: '560px',
      maxWidth: '95vw',
      data: { tarefa },
    });
  }

  async excluir(tarefa: Tarefa): Promise<void> {
    try {
      if (!(await this.confirmacao.excluir(tarefa.titulo))) return;
      await this.servico.excluir(tarefa.id);
    } catch {
      this.aviso.open('Não foi possível excluir a tarefa. Tente novamente.', 'Fechar');
    }
  }

  private async carregar(): Promise<void> {
    try {
      await this.servico.carregar();
    } catch {
      this.aviso.open('Não foi possível carregar as tarefas. Recarregue a página.', 'Fechar');
    }
  }
}
