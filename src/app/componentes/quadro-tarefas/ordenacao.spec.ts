import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { Tarefa } from '../../modelos/tarefa';
import { QuadroTarefas } from './quadro-tarefas';

describe('Reorganização no quadro', () => {
  it('emite uma cópia ordenada e respeita limites e bloqueio', () => {
    const fixture = TestBed.createComponent(QuadroTarefas);
    const antiga: Tarefa = {
      id: '1',
      titulo: 'Uma',
      descricao: 'Descrição',
      prazo: '2030-10-10',
      status: 'pendente',
      criadaEm: '2026-10-06T09:00:00.000Z',
    };
    const outra = { ...antiga, id: '2' };
    const tarefas = [antiga, outra];
    fixture.componentRef.setInput('titulo', 'Pendentes');
    fixture.componentRef.setInput('tarefas', tarefas);
    const ordenar = vi.fn();
    fixture.componentInstance.ordenar.subscribe(ordenar);
    fixture.componentInstance.mover(0, 1);
    expect(ordenar).toHaveBeenCalledExactlyOnceWith([outra, antiga]);
    expect(tarefas).toEqual([antiga, outra]);
    fixture.componentInstance.mover(0, -1);
    fixture.componentRef.setInput('ocupado', true);
    fixture.componentInstance.mover(0, 1);
    expect(ordenar).toHaveBeenCalledOnce();
  });
});
