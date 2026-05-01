import { Injectable, Signal, signal } from '@angular/core';

import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly tarefas = signal<Tarefa[]>([
    {
      id: 1,
      estudanteId: 1, // 🔥 NOVO
      nome: 'Reestruturar aplicação Angular',
      status: 'pendente',
      prioridade: 'alta'
    },
    {
      id: 2,
      estudanteId: 1, // 🔥 NOVO
      nome: 'Criar menu lateral',
      status: 'em andamento',
      prioridade: 'media'
    }
  ]);

  private proximoId = 3;

  cadastrar(tarefa: Omit<Tarefa, 'id'>): void {
    const novaTarefa: Tarefa = {
      id: this.proximoId,
      ...tarefa
    };

    this.tarefas.update(lista => [...lista, novaTarefa]);

    this.proximoId++;
  }

  listar(): Signal<Tarefa[]> {
    return this.tarefas.asReadonly();
  }

  buscarPorId(id: number): Tarefa | undefined {
    return this.tarefas().find(tarefa => tarefa.id === id);
  }

  dataEntrega?: string;

  editar(id: number, tarefaAtualizada: Omit<Tarefa, 'id'>): void {
    this.tarefas.update(listaAtual =>
      listaAtual.map(tarefa =>
        tarefa.id === id
          ? {
            id,
            estudanteId: tarefaAtualizada.estudanteId, // 🔥 NOVO
            nome: tarefaAtualizada.nome,
            status: tarefaAtualizada.status,
            prioridade: tarefaAtualizada.prioridade
          }
          : tarefa
      )
    );
  }

  remover(id: number): void {
    this.tarefas.update(listaAtual =>
      listaAtual.filter(tarefa => tarefa.id !== id)
    );
  }
}
