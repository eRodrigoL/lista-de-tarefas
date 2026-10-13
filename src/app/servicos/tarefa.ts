import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_URL } from '../configuracoes/api';
import { NovaTarefa, Tarefa } from '../modelos/tarefa';

@Service()
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/tarefas`;
  private readonly estado = signal<Tarefa[]>([]);
  readonly tarefas = this.estado.asReadonly();

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
    const tarefas = await firstValueFrom(this.http.get<Tarefa[]>(this.url));
    this.estado.set(tarefas.sort((a, b) => Date.parse(b.criadaEm) - Date.parse(a.criadaEm)));
  }

  async atualizar(tarefa: Tarefa): Promise<void> {
    const atualizada = await firstValueFrom(
      this.http.put<Tarefa>(`${this.url}/${tarefa.id}`, tarefa),
    );
    this.guardar(atualizada);
  }

  private guardar(tarefa: Tarefa): void {
    const tarefas = this.estado().filter((item) => item.id !== tarefa.id);
    tarefas.push(tarefa);
    this.estado.set(tarefas.sort((a, b) => Date.parse(b.criadaEm) - Date.parse(a.criadaEm)));
  }
}
