import { HttpClient } from '@angular/common/http';
import { Service, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { NovaTarefa, Tarefa } from '../modelos/tarefa';

@Service()
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/tarefas';
  private readonly estado = signal<Tarefa[]>([]);
  readonly tarefas = this.estado.asReadonly();

  async criar(dados: NovaTarefa): Promise<void> {
    const requisicao = this.http.post<Tarefa>(this.url, dados);
    const tarefa = await firstValueFrom(requisicao);
    this.guardar(tarefa);
  }

  private guardar(tarefa: Tarefa): void {
    const tarefas = this.estado().filter((item) => item.id !== tarefa.id);
    tarefas.push(tarefa);
    this.estado.set(tarefas.sort((a, b) => a.ordem - b.ordem));
  }
}
