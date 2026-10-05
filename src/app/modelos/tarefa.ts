export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  prazo: string;
  status: 'pendente' | 'concluida';
  ordem: number;
}

export type NovaTarefa = Omit<Tarefa, 'id'>;
