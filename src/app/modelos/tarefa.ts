export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  prazo: string;
  status: 'pendente' | 'concluida';
  criadaEm: string;
}

export type NovaTarefa = Omit<Tarefa, 'id' | 'criadaEm'>;
