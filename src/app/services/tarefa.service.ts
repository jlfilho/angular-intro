import { Injectable, Signal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Tarefa } from '../models/tarefa.model';

type TarefaApi = Omit<Tarefa, 'dataEntrega'> & {
  dataEntrega: string;
};

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/tarefas';

  private readonly tarefas = signal<Tarefa[]>([]);
  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);

  listar(): Signal<Tarefa[]> {
    return this.tarefas.asReadonly();
  }

  estaCarregando(): Signal<boolean> {
    return this.carregando.asReadonly();
  }

  mensagemErro(): Signal<string | null> {
    return this.erro.asReadonly();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.get<TarefaApi[]>(this.apiUrl).subscribe({
      next: (dados) => {
        const tarefasConvertidas: Tarefa[] = dados.map(tarefa =>
          this.converterDaApi(tarefa)
        );

        this.tarefas.set(tarefasConvertidas);
        this.carregando.set(false);

        console.log('Tarefas carregadas com sucesso:', tarefasConvertidas);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as tarefas.');
        this.carregando.set(false);
      }
    });
  }

  buscarPorId(id: string): Tarefa | undefined {
    return this.tarefas().find(tarefa => tarefa.id === id);
  }

  cadastrar(tarefa: Omit<Tarefa, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    const tarefaApi = this.converterParaApi(tarefa);

    this.http.post<TarefaApi>(this.apiUrl, tarefaApi).subscribe({
      next: (novaTarefa) => {
        this.tarefas.update(listaAtual => [
          ...listaAtual,
          this.converterDaApi(novaTarefa)
        ]);

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível cadastrar a tarefa.');
        this.carregando.set(false);
      }
    });
  }


  editar(id: string, tarefaAtualizada: Omit<Tarefa, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    const tarefaApi = {
      id,
      ...this.converterParaApi(tarefaAtualizada)
    };

    this.http.put<TarefaApi>(`${this.apiUrl}/${id}`, tarefaApi).subscribe({
      next: (tarefaEditada) => {
        this.tarefas.update(listaAtual =>
          listaAtual.map(tarefa =>
            tarefa.id === id ? this.converterDaApi(tarefaEditada) : tarefa
          )
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível editar a tarefa.');
        this.carregando.set(false);
      }
    });
  }

  remover(id: string): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.tarefas.update(listaAtual =>
          listaAtual.filter(tarefa => tarefa.id !== id)
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível remover a tarefa.');
        this.carregando.set(false);
      }
    });
  }

  private converterDaApi(tarefa: TarefaApi): Tarefa {
    return {
      ...tarefa,
      dataEntrega: new Date(tarefa.dataEntrega)
    };
  }

  private converterParaApi(tarefa: Omit<Tarefa, 'id'>): Omit<TarefaApi, 'id'> {
    return {
      ...tarefa,
      dataEntrega: this.formatarDataParaApi(tarefa.dataEntrega)
    };
  }

  private formatarDataParaApi(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }
}
