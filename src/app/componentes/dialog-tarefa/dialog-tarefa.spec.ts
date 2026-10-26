import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Tarefa } from '../../modelos/tarefa';
import { ConfirmacaoService } from '../../servicos/confirmacao';
import { TarefaService } from '../../servicos/tarefa';
import { DialogTarefa } from './dialog-tarefa';

describe('DialogTarefa', () => {
  const tarefa: Tarefa = {
    id: '1',
    titulo: 'Título',
    descricao: 'Descrição',
    prazo: '2026-10-15',
    status: 'pendente',
    criadaEm: '2026-10-15T10:00:00.000Z',
  };
  let dialog: DialogTarefa;
  let servico: {
    criar: ReturnType<typeof vi.fn>;
    atualizar: ReturnType<typeof vi.fn>;
    excluir: ReturnType<typeof vi.fn>;
  };
  let confirmacao: { excluir: ReturnType<typeof vi.fn> };
  let referencia: { close: ReturnType<typeof vi.fn>; disableClose: boolean };
  let aviso: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    servico = { criar: vi.fn(), atualizar: vi.fn(), excluir: vi.fn() };
    confirmacao = { excluir: vi.fn() };
    referencia = { close: vi.fn(), disableClose: false };
    aviso = { open: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: TarefaService, useValue: servico },
        { provide: ConfirmacaoService, useValue: confirmacao },
        { provide: MatDialogRef, useValue: referencia },
        { provide: MatSnackBar, useValue: aviso },
        { provide: MAT_DIALOG_DATA, useValue: { tarefa, somenteLeitura: true } },
      ],
    });
    dialog = TestBed.runInInjectionContext(() => new DialogTarefa());
  });

  it('habilita edição e preserva criadaEm ao salvar', async () => {
    expect(dialog.formulario.disabled).toBe(true);
    dialog.editar();
    dialog.formulario.controls.titulo.setValue('Alterado');
    await dialog.salvar();
    expect(servico.atualizar).toHaveBeenCalledWith({ ...tarefa, titulo: 'Alterado' });
    expect(referencia.close).toHaveBeenCalledOnce();
  });

  it('preserva o formulário e o dialog quando salvar falha', async () => {
    dialog.editar();
    servico.atualizar.mockRejectedValue(new Error('Falha'));
    await dialog.salvar();
    expect(referencia.close).not.toHaveBeenCalled();
    expect(dialog.formulario.controls.titulo.value).toBe(tarefa.titulo);
    expect(dialog.salvando()).toBe(false);
    expect(referencia.disableClose).toBe(false);
    expect(aviso.open).toHaveBeenCalled();
  });

  it('não exclui nem fecha ao cancelar a confirmação', async () => {
    confirmacao.excluir.mockResolvedValue(false);
    await dialog.excluir();
    expect(servico.excluir).not.toHaveBeenCalled();
    expect(referencia.close).not.toHaveBeenCalled();
    expect(dialog.salvando()).toBe(false);
  });
});
