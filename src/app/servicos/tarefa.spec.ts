import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { API_URL } from '../configuracoes/api';
import { NovaTarefa, Tarefa } from '../modelos/tarefa';
import { TarefaService } from './tarefa';

describe('TarefaService', () => {
  let servico: TarefaService;
  let http: HttpTestingController;
  const url = `${API_URL}/tarefas`;
  const antiga: Tarefa = {
    id: '1',
    titulo: 'Antiga',
    descricao: 'Descrição',
    prazo: '2026-10-15',
    status: 'pendente',
    criadaEm: '2026-10-14T10:00:00.000Z',
  };
  const recente: Tarefa = {
    ...antiga,
    id: '2',
    titulo: 'Recente',
    status: 'concluida',
    criadaEm: '2026-10-15T10:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servico = TestBed.inject(TarefaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('ordena por criação e separa os status', async () => {
    const carregando = servico.carregar();
    http.expectOne(url).flush([antiga, recente]);
    await carregando;
    expect(servico.tarefas().map((tarefa) => tarefa.id)).toEqual(['2', '1']);
    expect(servico.pendentes()).toEqual([antiga]);
    expect(servico.concluidas()).toEqual([recente]);
  });

  it('envia criadaEm em UTC e inclui a tarefa após a resposta', async () => {
    const dados: NovaTarefa = {
      titulo: 'Nova',
      descricao: 'Descrição',
      prazo: '2026-10-15',
      status: 'pendente',
    };
    const criando = servico.criar(dados);
    const requisicao = http.expectOne(url);
    expect(requisicao.request.method).toBe('POST');
    expect(requisicao.request.body.criadaEm).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
    expect(servico.tarefas()).toEqual([]);
    requisicao.flush({ ...requisicao.request.body, id: '3' });
    await criando;
    expect(servico.pendentes()[0].id).toBe('3');
  });

  it('atualiza o status preservando criação e posição', async () => {
    const carregando = servico.carregar();
    http.expectOne(url).flush([antiga, recente]);
    await carregando;
    const alterada: Tarefa = { ...antiga, status: 'concluida' };
    const atualizando = servico.atualizar(alterada);
    const requisicao = http.expectOne(`${url}/1`);
    expect(requisicao.request.method).toBe('PUT');
    expect(requisicao.request.body.criadaEm).toBe(antiga.criadaEm);
    requisicao.flush(alterada);
    await atualizando;
    expect(servico.pendentes()).toEqual([]);
    expect(servico.concluidas().map((tarefa) => tarefa.id)).toEqual(['2', '1']);
  });

  it('mantém a tarefa se a exclusão falhar e remove após sucesso', async () => {
    const carregando = servico.carregar();
    http.expectOne(url).flush([antiga]);
    await carregando;
    const falhando = servico.excluir('1');
    const rejeicao = expect(falhando).rejects.toBeDefined();
    http.expectOne(`${url}/1`).flush('Erro', { status: 500, statusText: 'Erro' });
    await rejeicao;
    expect(servico.tarefas()).toEqual([antiga]);
    const excluindo = servico.excluir('1');
    const requisicao = http.expectOne(`${url}/1`);
    expect(requisicao.request.method).toBe('DELETE');
    requisicao.flush(null);
    await excluindo;
    expect(servico.tarefas()).toEqual([]);
  });
});
