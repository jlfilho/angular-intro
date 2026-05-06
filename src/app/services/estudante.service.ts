import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Estudante } from '../models/estudante.model';

type JsonServerPaginado<T> = {
  first?: number;
  prev?: number | null;
  next?: number | null;
  last?: number;
  pages?: number;
  items?: number;
  data?: T[];
};

type OpcoesListagem = {
  pagina: number;
  limite: number;
  ordenarPor?: string;
  direcao?: 'asc' | 'desc' | '';
};
@Injectable({
  providedIn: 'root',
})
export class EstudanteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/estudantes';

  private readonly estudantes = signal<Estudante[]>([]);
  private readonly total = signal(0);
  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);

  listar(): Signal<Estudante[]> {
    return this.estudantes.asReadonly();
  }

  totalRegistros(): Signal<number> {
    return this.total.asReadonly();
  }

  estaCarregando(): Signal<boolean> {
    return this.carregando.asReadonly();
  }

  mensagemErro(): Signal<string | null> {
    return this.erro.asReadonly();
  }

  carregar(): void {
    this.listarPaginado({
      pagina: 1,
      limite: 5
    });
  }

  listarPaginado(opcoes: OpcoesListagem): void {
    this.carregando.set(true);
    this.erro.set(null);

    let params = new HttpParams()
      .set('_page', opcoes.pagina)
      .set('_per_page', opcoes.limite);

    if (opcoes.ordenarPor && opcoes.direcao) {
      const campoOrdenacao =
        opcoes.direcao === 'desc'
          ? `-${opcoes.ordenarPor}`
          : opcoes.ordenarPor;

      params = params.set('_sort', campoOrdenacao);
    }

    this.http.get<Estudante[] | JsonServerPaginado<Estudante>>(
      this.apiUrl,
      {
        params,
        observe: 'response'
      }
    ).subscribe({
      next: (resposta) => {
        const corpo = resposta.body;

        const dados = Array.isArray(corpo)
          ? corpo
          : corpo?.data ?? [];

        const totalHeader = resposta.headers.get('X-Total-Count');
        const totalApi = Array.isArray(corpo)
          ? Number(totalHeader ?? dados.length)
          : Number(corpo?.items ?? dados.length);

        this.estudantes.set(dados);
        this.total.set(totalApi);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os estudantes.');
        this.estudantes.set([]);
        this.total.set(0);
        this.carregando.set(false);
      }
    });
  }

  buscarPorId(id: string): Estudante | undefined {
    return this.estudantes().find(estudante => estudante.id === id);
  }

  cadastrar(estudante: Omit<Estudante, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.post<Estudante>(this.apiUrl, estudante).subscribe({
      next: (novoEstudante) => {
        this.estudantes.update(listaAtual => [
          ...listaAtual,
          novoEstudante
        ]);

        this.total.update(valorAtual => valorAtual + 1);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível cadastrar o estudante.');
        this.carregando.set(false);
      }
    });
  }

  editar(id: string, estudanteAtualizado: Omit<Estudante, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.put<Estudante>(`${this.apiUrl}/${id}`, {
      id,
      ...estudanteAtualizado
    }).subscribe({
      next: (estudanteEditado) => {
        this.estudantes.update(listaAtual =>
          listaAtual.map(estudante =>
            estudante.id === id ? estudanteEditado : estudante
          )
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível editar o estudante.');
        this.carregando.set(false);
      }
    });
  }

  remover(id: string): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.estudantes.update(listaAtual =>
          listaAtual.filter(estudante => estudante.id !== id)
        );

        this.total.update(valorAtual => Math.max(0, valorAtual - 1));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível remover o estudante.');
        this.carregando.set(false);
      }
    });
  }
}
