import { Injectable, Signal, signal } from '@angular/core';

import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly tarefas = signal<Tarefa[]>([
    {
      id: 1,
      estudanteId: 1,
      nome: 'Reestruturar aplicação Angular',
      status: 'pendente',
      prioridade: 'alta',
      dataEntrega: new Date(2026, 4, 20) // 🔥 NOVO
    },
    {
      id: 2,
      estudanteId: 1,
      nome: 'Criar menu lateral',
      status: 'em andamento',
      prioridade: 'media',
      dataEntrega: new Date(2026, 4, 25) // 🔥 NOVO
    }
  ]);

  private proximoId = 3;

  listar(): Signal<Tarefa[]> {
    return this.tarefas.asReadonly();
  }

  buscarPorId(id: number): Tarefa | undefined {
    return this.tarefas().find(tarefa => tarefa.id === id);
  }

  cadastrar(tarefa: Omit<Tarefa, 'id'>): void {
    const novaTarefa: Tarefa = {
      id: this.proximoId,
      ...tarefa
    };

    this.tarefas.update(lista => [...lista, novaTarefa]);

    this.proximoId++;
  }


  editar(id: number, tarefaAtualizada: Omit<Tarefa, 'id'>): void {
    this.tarefas.update(listaAtual =>
      listaAtual.map(tarefa =>
        tarefa.id === id
          ? {
              id,
              ...tarefaAtualizada
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
