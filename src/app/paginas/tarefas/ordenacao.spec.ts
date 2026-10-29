import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { describe, expect, it, vi } from 'vitest';

import { Tarefa } from '../../modelos/tarefa';
import { ConfirmacaoService } from '../../servicos/confirmacao';
import { TarefaService } from '../../servicos/tarefa';
import { Tarefas } from './tarefas';

describe('Persistência da ordem pela página', () => {
  function montar() {
    const servico = {
      pendentes: signal<Tarefa[]>([]),
      concluidas: signal<Tarefa[]>([]),
      reordenar: vi.fn(),
    };
    const aviso = { open: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: TarefaService, useValue: servico },
        { provide: ConfirmacaoService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MatSnackBar, useValue: aviso },
      ],
    });
    return { pagina: TestBed.runInInjectionContext(() => new Tarefas()), servico, aviso };
  }

  it('bloqueia pedidos repetidos e libera após salvar', async () => {
    const { pagina, servico } = montar();
    let concluir!: () => void;
    servico.reordenar.mockReturnValue(
      new Promise<void>((resolve) => {
        concluir = resolve;
      }),
    );
    const operacao = pagina.ordenar([]);
    expect(pagina.ocupado()).toBe(true);
    await pagina.ordenar([]);
    expect(servico.reordenar).toHaveBeenCalledOnce();
    concluir();
    await operacao;
    expect(pagina.ocupado()).toBe(false);
  });

  it('informa a falha e libera os controles', async () => {
    const { pagina, servico, aviso } = montar();
    servico.reordenar.mockRejectedValue(new Error('Falha'));
    await pagina.ordenar([]);
    expect(pagina.ocupado()).toBe(false);
    expect(aviso.open).toHaveBeenCalledWith(
      'Não foi possível salvar a ordem. Tente novamente.',
      'Fechar',
    );
  });
});
