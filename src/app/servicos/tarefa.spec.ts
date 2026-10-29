// src/app/servicos/tarefa.spec.ts

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
  const dados: NovaTarefa = {
    titulo: 'Organizar documentos',
    descricao: 'Separar por data',
    prazo: '2030-10-10',
    status: 'pendente',
  };
  const antiga: Tarefa = { ...dados, id: '1', criadaEm: '2026-10-06T09:00:00.000Z' };
  const recente: Tarefa = {
    ...antiga,
    id: '2',
    status: 'concluida',
    criadaEm: '2026-10-06T10:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servico = TestBed.inject(TarefaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('registra criação em UTC e inclui a tarefa somente após sucesso', async () => {
    const inicio = Date.now();
    const operacao = servico.criar(dados);
    const requisicao = http.expectOne(url);
    expect(requisicao.request.method).toBe('POST');
    const enviada = requisicao.request.body;
    expect(enviada).toEqual({ ...dados, criadaEm: expect.any(String) });
    expect(new Date(enviada.criadaEm).toISOString()).toBe(enviada.criadaEm);
    expect(Date.parse(enviada.criadaEm)).toBeGreaterThanOrEqual(inicio);
    expect(Date.parse(enviada.criadaEm)).toBeLessThanOrEqual(Date.now());
    expect(servico.tarefas()).toEqual([]);
    requisicao.flush({ ...enviada, id: '3' });
    await operacao;
    expect(servico.tarefas()[0].id).toBe('3');
  });

  it('não inclui a tarefa quando criar falha', async () => {
    const operacao = servico.criar(dados);
    const falha = expect(operacao).rejects.toBeDefined();
    http.expectOne(url).flush('Erro', { status: 500, statusText: 'Erro' });
    await falha;
    expect(servico.tarefas()).toEqual([]);
  });

  it('carrega por criação decrescente e separa os status', async () => {
    const operacao = servico.carregar();
    http.expectOne(`${API_URL}/preferencias/ordenacao`).flush({ id: 'ordenacao', ids: [] });
    const requisicao = http.expectOne(url);
    expect(requisicao.request.method).toBe('GET');
    requisicao.flush([antiga, recente]);
    await operacao;
    expect(servico.tarefas()).toEqual([recente, antiga]);
    expect(servico.pendentes()).toEqual([antiga]);
    expect(servico.concluidas()).toEqual([recente]);
  });

  it('aceita banco vazio e preserva estado se a leitura seguinte falhar', async () => {
    const vazia = servico.carregar();
    http.expectOne(`${API_URL}/preferencias/ordenacao`).flush({ id: 'ordenacao', ids: [] });
    http.expectOne(url).flush([]);
    await vazia;
    expect(servico.tarefas()).toEqual([]);
    const carregando = servico.carregar();
    http.expectOne(`${API_URL}/preferencias/ordenacao`).flush({ id: 'ordenacao', ids: [] });
    http.expectOne(url).flush([antiga]);
    await carregando;
    const operacao = servico.carregar();
    http.expectOne(`${API_URL}/preferencias/ordenacao`).flush({ id: 'ordenacao', ids: [] });
    const falha = expect(operacao).rejects.toBeDefined();
    http.expectOne(url).flush('Erro', { status: 500, statusText: 'Erro' });
    await falha;
    expect(servico.tarefas()).toEqual([antiga]);
  });

  it('atualiza sem duplicar, preserva criação e reposiciona por status', async () => {
    const carregando = servico.carregar();
    http.expectOne(`${API_URL}/preferencias/ordenacao`).flush({ id: 'ordenacao', ids: [] });
    http.expectOne(url).flush([antiga, recente]);
    await carregando;
    const alterada: Tarefa = { ...antiga, titulo: 'Alterada', status: 'concluida' };
    const operacao = servico.atualizar(alterada);
    const requisicao = http.expectOne(`${url}/${antiga.id}`);
    expect(requisicao.request.method).toBe('PUT');
    expect(requisicao.request.body.criadaEm).toBe(antiga.criadaEm);
    requisicao.flush(alterada);
    await operacao;
    expect(servico.tarefas()).toEqual([recente, alterada]);
    expect(servico.pendentes()).toEqual([]);
    expect(servico.concluidas()).toHaveLength(2);
  });

  it('preserva dados anteriores se atualizar falhar', async () => {
    const carregando = servico.carregar();
    http.expectOne(`${API_URL}/preferencias/ordenacao`).flush({ id: 'ordenacao', ids: [] });
    http.expectOne(url).flush([antiga]);
    await carregando;
    const operacao = servico.atualizar({ ...antiga, titulo: 'Alterada' });
    const falha = expect(operacao).rejects.toBeDefined();
    http.expectOne(`${url}/${antiga.id}`).flush('Erro', { status: 500, statusText: 'Erro' });
    await falha;
    expect(servico.tarefas()).toEqual([antiga]);
  });

  it('remove somente após resposta da API e preserva a tarefa em caso de erro', async () => {
    const carregando = servico.carregar();
    http.expectOne(`${API_URL}/preferencias/ordenacao`).flush({ id: 'ordenacao', ids: [] });
    http.expectOne(url).flush([antiga, recente]);
    await carregando;
    const operacao = servico.excluir(antiga.id);
    const falha = expect(operacao).rejects.toBeDefined();
    http.expectOne(`${url}/${antiga.id}`).flush('Erro', { status: 500, statusText: 'Erro' });
    await falha;
    expect(servico.tarefas()).toEqual([recente, antiga]);
    const excluindo = servico.excluir(antiga.id);
    const requisicao = http.expectOne(`${url}/${antiga.id}`);
    expect(requisicao.request.method).toBe('DELETE');
    expect(servico.tarefas()).toHaveLength(2);
    requisicao.flush(null);
    await excluindo;
    expect(servico.tarefas()).toEqual([recente]);
  });
});
