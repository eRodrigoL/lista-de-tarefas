import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { Tarefa } from '../../modelos/tarefa';
import { QuadroTarefas } from './quadro-tarefas';

describe('QuadroTarefas', () => {
  async function montar() {
    await TestBed.configureTestingModule({
      imports: [QuadroTarefas],
    }).compileComponents();

    const fixture = TestBed.createComponent(QuadroTarefas);

    fixture.componentRef.setInput('titulo', 'Pendentes');
    fixture.detectChanges();

    return fixture;
  }

  it('exibe título, contagem e quadro vazio', async () => {
    const fixture = await montar();
    const tela: HTMLElement = fixture.nativeElement;

    expect(tela.querySelector('h2')?.textContent).toContain('Pendentes');
    expect(tela.querySelector('.cabecalho span')?.textContent?.trim()).toBe('0');
    expect(tela.querySelectorAll('mat-card')).toHaveLength(0);

    fixture.componentRef.setInput('quantidade', 5);
    fixture.detectChanges();

    expect(tela.querySelector('.cabecalho span')?.textContent?.trim()).toBe('5');
  });

  it('exibe os dados das tarefas recebidas', async () => {
    const fixture = await montar();
    const tarefa: Tarefa = {
      id: '1',
      titulo: 'Organizar documentos',
      descricao: 'Separar por data',
      prazo: '2030-10-10',
      status: 'pendente',
      criadaEm: '2026-10-06T09:00:00.000Z',
    };

    fixture.componentRef.setInput('tarefas', [tarefa]);
    fixture.componentRef.setInput('quantidade', 1);
    fixture.detectChanges();

    const tela: HTMLElement = fixture.nativeElement;

    expect(tela.querySelectorAll('mat-card')).toHaveLength(1);
    expect(tela.querySelector('h3')?.textContent).toBe(tarefa.titulo);
    expect(tela.querySelector('app-texto-formatado')?.textContent).toContain(tarefa.descricao);
  });

  it('abre a visualização ao clicar no conteúdo do card', async () => {
    const fixture = await montar();
    const tarefa: Tarefa = {
      id: '1',
      titulo: 'Organizar documentos',
      descricao: 'Separar por data',
      prazo: '2030-10-10',
      status: 'pendente',
      criadaEm: '2026-10-06T09:00:00.000Z',
    };

    fixture.componentRef.setInput('tarefas', [tarefa]);
    fixture.detectChanges();

    const visualizar = vi.fn();

    fixture.componentInstance.visualizar.subscribe(visualizar);
    (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('h3')!.click();

    expect(visualizar).toHaveBeenCalledExactlyOnceWith(tarefa);
  });

  it('formata o prazo sem trocar o dia e preserva o texto do resumo', async () => {
    const fixture = await montar();

    fixture.componentRef.setInput('tarefas', [
      {
        id: '1',
        titulo: 'Longa',
        descricao: 'a'.repeat(121),
        prazo: '2030-10-10',
        status: 'pendente',
        criadaEm: '2026-10-06T09:00:00.000Z',
      },
    ]);
    fixture.detectChanges();

    const tela: HTMLElement = fixture.nativeElement;

    expect(tela.querySelector('.prazo')?.textContent).toContain('10/10/2030');
    expect(tela.querySelector('app-texto-formatado')?.textContent).toContain('a'.repeat(121));
  });

  it.each(['Enter', ' '])('abre pelo teclado com %s e respeita bloqueio', async (tecla) => {
    const fixture = await montar();
    const tarefa: Tarefa = {
      id: '1',
      titulo: 'Organizar documentos',
      descricao: 'Separar por data',
      prazo: '2030-10-10',
      status: 'pendente',
      criadaEm: '2026-10-06T09:00:00.000Z',
    };

    fixture.componentRef.setInput('tarefas', [tarefa]);
    fixture.detectChanges();

    const visualizar = vi.fn();

    fixture.componentInstance.visualizar.subscribe(visualizar);

    const tela: HTMLElement = fixture.nativeElement;
    const conteudo = tela.querySelector<HTMLElement>('.conteudo')!;

    conteudo.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: tecla,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(visualizar).toHaveBeenCalledExactlyOnceWith(tarefa);

    fixture.componentRef.setInput('ocupado', true);
    fixture.detectChanges();

    conteudo.click();
    conteudo.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: tecla,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(visualizar).toHaveBeenCalledOnce();
    expect(Array.from(tela.querySelectorAll('button')).every((botao) => botao.disabled)).toBe(true);
  });

  it('editar e excluir emitem suas ações sem abrir a visualização', async () => {
    const fixture = await montar();
    const tarefa: Tarefa = {
      id: '1',
      titulo: 'Organizar documentos',
      descricao: 'Separar por data',
      prazo: '2030-10-10',
      status: 'pendente',
      criadaEm: '2026-10-06T09:00:00.000Z',
    };

    fixture.componentRef.setInput('tarefas', [tarefa]);
    fixture.detectChanges();

    const editar = vi.fn();
    const excluir = vi.fn();
    const visualizar = vi.fn();

    fixture.componentInstance.editar.subscribe(editar);
    fixture.componentInstance.excluir.subscribe(excluir);
    fixture.componentInstance.visualizar.subscribe(visualizar);

    const tela: HTMLElement = fixture.nativeElement;

    tela
      .querySelector<HTMLButtonElement>('button[aria-label="Editar Organizar documentos"]')!
      .click();
    tela
      .querySelector<HTMLButtonElement>('button[aria-label="Excluir Organizar documentos"]')!
      .click();

    expect(editar).toHaveBeenCalledExactlyOnceWith(tarefa);
    expect(excluir).toHaveBeenCalledExactlyOnceWith(tarefa);
    expect(visualizar).not.toHaveBeenCalled();
  });
});
