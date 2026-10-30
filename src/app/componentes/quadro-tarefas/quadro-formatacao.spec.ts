import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { QuadroTarefas } from './quadro-tarefas';

describe('Descrição formatada nos cards', () => {
  it('renderiza formatação e preserva o conteúdo completo ao abrir', async () => {
    await TestBed.configureTestingModule({
      imports: [QuadroTarefas],
    }).compileComponents();

    const fixture = TestBed.createComponent(QuadroTarefas);
    const tarefa = {
      id: '1',
      titulo: 'Organizar documentos',
      descricao: '**Importante**\n- Primeiro item\n<img src=x>\n' + 'Texto longo '.repeat(30),
      prazo: '2030-10-10',
      status: 'pendente' as const,
      criadaEm: '2026-10-06T09:00:00.000Z',
    };

    fixture.componentRef.setInput('titulo', 'Pendentes');
    fixture.componentRef.setInput('tarefas', [tarefa]);
    fixture.detectChanges();

    const tela: HTMLElement = fixture.nativeElement;

    expect(tela.querySelector('.resumo strong')?.textContent).toBe('Importante');
    expect(tela.querySelector('.resumo ul li')?.textContent?.trim()).toBe('Primeiro item');
    expect(tela.querySelector('.resumo img')).toBeNull();
    expect(tela.querySelector('.resumo')?.textContent).toContain('<img src=x>');
    expect(tela.querySelector('.resumo')?.textContent).toContain('Texto longo '.repeat(30));

    const recebidas: unknown[] = [];

    fixture.componentInstance.visualizar.subscribe((valor) => recebidas.push(valor));
    tela.querySelector<HTMLElement>('.conteudo')!.click();

    expect(recebidas).toEqual([tarefa]);
  });
});
