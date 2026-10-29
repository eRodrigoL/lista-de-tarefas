import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_URL } from '../configuracoes/api';
import { OrdenacaoTarefas } from '../modelos/ordenacao-tarefas';
import { NovaTarefa, Tarefa } from '../modelos/tarefa';

@Service()
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/tarefas`;
  private readonly urlOrdenacao = `${API_URL}/preferencias/ordenacao`;

  private readonly estado = signal<Tarefa[]>([]);
  private readonly ordem = signal<string[]>([]);

  readonly tarefas = computed(() => {
    const posicoes = new Map(this.ordem().map((id, indice) => [id, indice]));

    return [...this.estado()].sort((a, b) => {
      const posicaoA = posicoes.get(a.id) ?? -1;
      const posicaoB = posicoes.get(b.id) ?? -1;

      return posicaoA - posicaoB || Date.parse(b.criadaEm) - Date.parse(a.criadaEm);
    });
  });

  readonly pendentes = computed(() =>
    this.tarefas().filter((tarefa) => tarefa.status === 'pendente'),
  );

  readonly concluidas = computed(() =>
    this.tarefas().filter((tarefa) => tarefa.status === 'concluida'),
  );

  async criar(dados: NovaTarefa): Promise<void> {
    const novaTarefa = { ...dados, criadaEm: new Date().toISOString() };
    const requisicao = this.http.post<Tarefa>(this.url, novaTarefa);
    const tarefa = await firstValueFrom(requisicao);

    this.guardar(tarefa);
  }

  async carregar(): Promise<void> {
    const [tarefas, ordenacao] = await Promise.all([
      firstValueFrom(this.http.get<Tarefa[]>(this.url)),
      firstValueFrom(this.http.get<OrdenacaoTarefas>(this.urlOrdenacao)),
    ]);

    this.estado.set(tarefas);
    this.ordem.set(ordenacao.ids);
  }

  async atualizar(tarefa: Tarefa): Promise<void> {
    const atualizada = await firstValueFrom(
      this.http.put<Tarefa>(`${this.url}/${tarefa.id}`, tarefa),
    );

    this.guardar(atualizada);
  }

  async excluir(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.url}/${id}`));

    this.estado.update((tarefas) => tarefas.filter((tarefa) => tarefa.id !== id));
  }

  async reordenar(ordenadas: Tarefa[]): Promise<void> {
    const movidas = new Set(ordenadas.map((tarefa) => tarefa.id));
    const outras = this.tarefas().filter((tarefa) => !movidas.has(tarefa.id));
    const ids = [...ordenadas, ...outras].map((tarefa) => tarefa.id);

    const ordenacao = await firstValueFrom(
      this.http.put<OrdenacaoTarefas>(this.urlOrdenacao, { id: 'ordenacao', ids }),
    );

    this.ordem.set(ordenacao.ids);
  }

  private guardar(tarefa: Tarefa): void {
    this.estado.update((tarefas) => [tarefa, ...tarefas.filter((item) => item.id !== tarefa.id)]);
  }
}
