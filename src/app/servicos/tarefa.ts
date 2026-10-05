import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Tarefa } from '../modelos/tarefa';

@Service()
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/tarefas';
  private readonly estado = signal<Tarefa[]>([]);
  readonly tarefas = this.estado.asReadonly();
}
