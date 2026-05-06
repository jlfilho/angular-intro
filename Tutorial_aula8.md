# 🎓 Aula 8 — Tabelas, paginação e filtros com Angular Material e json-server

## Tema

Tabelas, paginação no lado servidor e filtros no front-end com Angular Material e `json-server`.

---

## Objetivo da aula

Evoluir as listagens do sistema **Gerenciador de Estudos**, transformando principalmente a página de estudantes em uma listagem mais profissional com:

```text
mat-table
mat-paginator
mat-sort
paginação no lado servidor
ordenação no lado servidor
busca textual no front-end
HttpParams
resposta HTTP completa
estado de carregamento
estado de erro
mensagem de lista vazia
```

Também será feita uma evolução na página de tarefas, mantendo a visualização em cards, com:

```text
paginação carregada pela API
busca textual no front-end
filtros front-side por estudante, status e prioridade
indicadores da página atual
```

---

## Duração

**4 horas**

|       Tempo | Etapa               | Atividade                                                               |
| ----------: | ------------------- | ----------------------------------------------------------------------- |
| 0h00 – 0h20 | Revisão             | Retomar Aula 7 e estado atual do projeto                                |
| 0h20 – 0h45 | Conceitos           | Paginação server-side e filtros front-side                              |
| 0h45 – 1h15 | API fake            | Ajustar `db.json` e testar paginação no navegador                       |
| 1h15 – 2h05 | Estudantes Service  | Criar listagem paginada com `HttpParams`                                |
| 2h05 – 2h15 | Intervalo           | Pausa                                                                   |
| 2h15 – 3h10 | Página Estudantes   | Implementar `mat-table`, `mat-paginator`, `mat-sort` e busca front-side |
| 3h10 – 3h40 | Página Tarefas      | Aplicar paginação server-side com busca e filtros front-side            |
| 3h40 – 4h00 | Testes e fechamento | Testar paginação, busca, ordenação, filtros e CRUD                      |

---

# 1. Estado inicial da Aula 8

A Aula 8 **não reinicia o projeto**.

Ela parte exatamente do final da Aula 7.

O projeto deve estar parecido com:

```text
src/app
├── components
│   ├── confirmacao-dialog
│   ├── tarefa-card
│   └── relatorio-estudos
├── models
│   ├── estudante.model.ts
│   └── tarefa.model.ts
├── pages
│   ├── home
│   ├── estudantes
│   ├── tarefas
│   ├── relatorios
│   └── sobre
├── pipes
│   ├── prioridade-label.pipe.ts
│   ├── status-tarefa-label.pipe.ts
│   └── turno-label.pipe.ts
├── services
│   ├── estudante.service.ts
│   └── tarefa.service.ts
├── guards
├── interceptors
├── app.config.ts
├── app.routes.ts
└── app.ts
```

Os modelos devem estar com `id` como `string`, conforme padronizado na Aula 7.

## `src/app/models/estudante.model.ts`

```ts
export type TurnoEstudante = 'matutino' | 'vespertino' | 'noturno';

export type Estudante = {
  id: string;
  nome: string;
  email: string;
  curso: string;
  turno: TurnoEstudante;
  dataIngresso: string;
};
```

## `src/app/models/tarefa.model.ts`

```ts
export type StatusTarefa = 'pendente' | 'em andamento' | 'concluida';

export type PrioridadeTarefa = 'baixa' | 'media' | 'alta';

export type Tarefa = {
  id: string;
  estudanteId: string;
  nome: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataEntrega: Date;
};
```

Essa padronização é importante porque a versão atual do `json-server` gera `id` textual.

---

# 2. Resultado esperado da Aula 8

Ao final da aula, a página `/estudantes` deverá permitir:

```text
Listar estudantes em tabela
Paginar estudantes no servidor
Ordenar estudantes por nome, e-mail, curso, turno e data de ingresso
Buscar estudantes por texto na página atual
Editar estudante
Remover estudante
Exibir carregamento
Exibir erro
Exibir mensagem quando não houver registros
```

A página `/tarefas` deverá permitir:

```text
Listar tarefas em cards
Paginar tarefas no servidor
Buscar tarefas por texto na página atual
Filtrar por estudante na página atual
Filtrar por status na página atual
Filtrar por prioridade na página atual
Exibir indicadores da página atual
Manter cadastro, edição e remoção
Manter pipes, imagens e vínculo com estudantes
```

---

# 3. Módulo 1 — Revisão da Aula 7

## Tempo sugerido

20 minutos.

Explique aos alunos:

> Na Aula 7, deixamos de usar dados apenas em memória e passamos a consumir uma API REST fake com `json-server`.

Mostre a arquitetura atual:

```text
Componente
   ↓
Service HTTP
   ↓
HttpClient
   ↓
json-server
   ↓
db.json
```

Reforce que a interface continua usando signals:

```ts
estudantes = this.estudanteService.listar();
tarefas = this.tarefaService.listar();
```

Mas os dados agora vêm da API:

```ts
this.http.get<Estudante[]>(this.apiUrl);
```

Nesta Aula 8, os services continuarão usando `HttpClient`, mas agora também usarão:

```text
HttpParams
observe: 'response'
mat-table
mat-paginator
mat-sort
computed()
```

---

# 4. Módulo 2 — Paginação server-side e filtros front-side

## Tempo sugerido

25 minutos.

Explique:

Na paginação comum no front-end, a aplicação carrega todos os registros e depois divide os dados na tela.

Exemplo:

```text
API envia 1000 estudantes.
Angular recebe 1000 estudantes.
Angular mostra apenas 10 por página.
```

Na paginação no servidor, a aplicação pede apenas os registros necessários.

Exemplo:

```text
Angular pede página 1 com 5 estudantes.
API responde apenas 5 estudantes.
```

## Comparação didática

| Tipo                   | Como funciona                          | Quando usar      |
| ---------------------- | -------------------------------------- | ---------------- |
| Paginação no front-end | Carrega tudo e pagina na tela          | Poucos registros |
| Paginação no servidor  | API entrega apenas a página solicitada | Muitos registros |

Nesta aula, usaremos uma abordagem híbrida:

```text
API
→ responsável por paginação e ordenação.

Angular
→ responsável por busca textual e filtros sobre a página carregada.
```

## Atenção didática

Explique:

> Como estamos usando a versão atual do `json-server`, não usaremos o parâmetro `q` para busca textual global.

Por isso:

```text
Não usaremos:
GET /estudantes?q=ana
GET /tarefas?q=angular
```

A busca textual será feita no Angular com:

```ts
signal()
computed()
includes()
```

---

# 5. Módulo 3 — Parâmetros do `json-server`

## Tempo sugerido

30 minutos.

Na Aula 8, vamos enviar parâmetros de paginação e ordenação para a API.

Exemplos:

```text
GET /estudantes?_page=1&_per_page=5
GET /estudantes?_page=2&_per_page=5
GET /estudantes?_page=1&_per_page=5&_sort=nome
GET /estudantes?_page=1&_per_page=5&_sort=-nome
```

## Atenção sobre versões do `json-server`

Na versão mais recente do `json-server`, a paginação usa:

```text
_page
_per_page
```

E a ordenação descendente pode ser feita com sinal de menos:

```text
_sort=-nome
```

Em versões antigas, era comum usar:

```text
_page
_limit
_sort
_order
```

Explique aos alunos:

> Se estiver usando a versão atual instalada com `npm install json-server --save-dev`, prefira `_page` e `_per_page`. Se estiver usando uma versão antiga, pode ser necessário trocar `_per_page` por `_limit` e usar `_order`.

---

# 6. Módulo 4 — Preparar dados para testar paginação

## Tempo sugerido

20 minutos.

Para a paginação aparecer de forma clara, o `db.json` precisa ter mais registros.

Abra:

```text
db.json
```

Use pelo menos 12 estudantes e 20 tarefas.

## Estudantes

```json
"estudantes": [
  {
    "id": "1",
    "nome": "Ana Silva",
    "email": "ana@email.com",
    "curso": "Angular Básico",
    "turno": "noturno",
    "dataIngresso": "2026-05-01"
  },
  {
    "id": "2",
    "nome": "Carlos Souza",
    "email": "carlos@email.com",
    "curso": "Frontend com Angular",
    "turno": "vespertino",
    "dataIngresso": "2026-05-03"
  },
  {
    "id": "3",
    "nome": "Maria Oliveira",
    "email": "maria@email.com",
    "curso": "Angular Intermediário",
    "turno": "noturno",
    "dataIngresso": "2026-05-04"
  },
  {
    "id": "4",
    "nome": "João Pereira",
    "email": "joao@email.com",
    "curso": "Desenvolvimento Web",
    "turno": "matutino",
    "dataIngresso": "2026-05-05"
  },
  {
    "id": "5",
    "nome": "Fernanda Lima",
    "email": "fernanda@email.com",
    "curso": "Frontend com Angular",
    "turno": "vespertino",
    "dataIngresso": "2026-05-06"
  },
  {
    "id": "6",
    "nome": "Pedro Santos",
    "email": "pedro@email.com",
    "curso": "Angular Básico",
    "turno": "noturno",
    "dataIngresso": "2026-05-07"
  },
  {
    "id": "7",
    "nome": "Juliana Costa",
    "email": "juliana@email.com",
    "curso": "Desenvolvimento Web",
    "turno": "matutino",
    "dataIngresso": "2026-05-08"
  },
  {
    "id": "8",
    "nome": "Rafael Almeida",
    "email": "rafael@email.com",
    "curso": "Angular Intermediário",
    "turno": "vespertino",
    "dataIngresso": "2026-05-09"
  },
  {
    "id": "9",
    "nome": "Patrícia Rocha",
    "email": "patricia@email.com",
    "curso": "Frontend com Angular",
    "turno": "noturno",
    "dataIngresso": "2026-05-10"
  },
  {
    "id": "10",
    "nome": "Lucas Martins",
    "email": "lucas@email.com",
    "curso": "Angular Básico",
    "turno": "matutino",
    "dataIngresso": "2026-05-11"
  },
  {
    "id": "11",
    "nome": "Camila Ferreira",
    "email": "camila@email.com",
    "curso": "Desenvolvimento Web",
    "turno": "vespertino",
    "dataIngresso": "2026-05-12"
  },
  {
    "id": "12",
    "nome": "Bruno Ribeiro",
    "email": "bruno@email.com",
    "curso": "Angular Intermediário",
    "turno": "noturno",
    "dataIngresso": "2026-05-13"
  }
]
```

## Tarefas

```json
"tarefas": [
  {
    "id": "1",
    "estudanteId": "1",
    "nome": "Reestruturar aplicação Angular",
    "status": "pendente",
    "prioridade": "alta",
    "dataEntrega": "2026-05-20"
  },
  {
    "id": "2",
    "estudanteId": "1",
    "nome": "Criar menu lateral",
    "status": "em andamento",
    "prioridade": "media",
    "dataEntrega": "2026-05-25"
  },
  {
    "id": "3",
    "estudanteId": "2",
    "nome": "Revisar pipes personalizados",
    "status": "concluida",
    "prioridade": "baixa",
    "dataEntrega": "2026-05-30"
  },
  {
    "id": "4",
    "estudanteId": "3",
    "nome": "Implementar formulário reativo de estudantes",
    "status": "pendente",
    "prioridade": "alta",
    "dataEntrega": "2026-06-02"
  },
  {
    "id": "5",
    "estudanteId": "4",
    "nome": "Criar validações com mat-error",
    "status": "em andamento",
    "prioridade": "media",
    "dataEntrega": "2026-06-04"
  },
  {
    "id": "6",
    "estudanteId": "5",
    "nome": "Testar cadastro de estudantes",
    "status": "concluida",
    "prioridade": "baixa",
    "dataEntrega": "2026-06-05"
  },
  {
    "id": "7",
    "estudanteId": "6",
    "nome": "Relacionar tarefas com estudantes",
    "status": "pendente",
    "prioridade": "alta",
    "dataEntrega": "2026-06-08"
  },
  {
    "id": "8",
    "estudanteId": "7",
    "nome": "Criar filtro de tarefas por estudante",
    "status": "em andamento",
    "prioridade": "alta",
    "dataEntrega": "2026-06-10"
  },
  {
    "id": "9",
    "estudanteId": "8",
    "nome": "Adicionar indicadores com computed signals",
    "status": "concluida",
    "prioridade": "media",
    "dataEntrega": "2026-06-12"
  },
  {
    "id": "10",
    "estudanteId": "9",
    "nome": "Criar relatório de tarefas por estudante",
    "status": "pendente",
    "prioridade": "media",
    "dataEntrega": "2026-06-15"
  },
  {
    "id": "11",
    "estudanteId": "10",
    "nome": "Configurar locale brasileiro",
    "status": "concluida",
    "prioridade": "baixa",
    "dataEntrega": "2026-06-17"
  },
  {
    "id": "12",
    "estudanteId": "11",
    "nome": "Adicionar datepicker no formulário de tarefas",
    "status": "em andamento",
    "prioridade": "alta",
    "dataEntrega": "2026-06-19"
  },
  {
    "id": "13",
    "estudanteId": "12",
    "nome": "Exibir data de entrega formatada",
    "status": "pendente",
    "prioridade": "media",
    "dataEntrega": "2026-06-22"
  },
  {
    "id": "14",
    "estudanteId": "2",
    "nome": "Criar pipe de status da tarefa",
    "status": "concluida",
    "prioridade": "baixa",
    "dataEntrega": "2026-06-24"
  },
  {
    "id": "15",
    "estudanteId": "3",
    "nome": "Criar pipe de prioridade",
    "status": "pendente",
    "prioridade": "media",
    "dataEntrega": "2026-06-26"
  },
  {
    "id": "16",
    "estudanteId": "4",
    "nome": "Adicionar imagem de avatar no card",
    "status": "em andamento",
    "prioridade": "baixa",
    "dataEntrega": "2026-06-29"
  },
  {
    "id": "17",
    "estudanteId": "5",
    "nome": "Implementar relatório com @defer",
    "status": "pendente",
    "prioridade": "alta",
    "dataEntrega": "2026-07-01"
  },
  {
    "id": "18",
    "estudanteId": "6",
    "nome": "Configurar json-server",
    "status": "concluida",
    "prioridade": "media",
    "dataEntrega": "2026-07-03"
  },
  {
    "id": "19",
    "estudanteId": "7",
    "nome": "Refatorar services para HttpClient",
    "status": "em andamento",
    "prioridade": "alta",
    "dataEntrega": "2026-07-06"
  },
  {
    "id": "20",
    "estudanteId": "8",
    "nome": "Implementar paginação com mat-paginator",
    "status": "pendente",
    "prioridade": "alta",
    "dataEntrega": "2026-07-08"
  }
]
```

## Teste rápido no navegador

Com a API rodando:

```bash
npm run api
```

Acesse:

```text
http://localhost:3000/estudantes?_page=1&_per_page=5
```

Depois:

```text
http://localhost:3000/estudantes?_page=2&_per_page=5
```

Resultado esperado:

```text
A página 1 e a página 2 devem retornar conjuntos diferentes de estudantes.
```

Teste também tarefas:

```text
http://localhost:3000/tarefas?_page=1&_per_page=5
```

---

# 7. Módulo 5 — Criar tipo auxiliar para paginação

## Tempo sugerido

10 minutos.

Crie o arquivo:

```text
src/app/models/resultado-paginado.model.ts
```

Coloque:

```ts
export type ResultadoPaginado<T> = {
  dados: T[];
  total: number;
};
```

## Explicação

Explique:

> Esse tipo representa uma resposta paginada. Ele guarda os dados da página atual e o total de registros encontrados.

Mesmo que o tutorial use diretamente o tipo `JsonServerPaginado<T>` nos services, esse tipo `ResultadoPaginado<T>` pode ser mantido como recurso didático para representar genericamente respostas paginadas.

---

# 8. Módulo 6 — Refatorar `EstudanteService` para paginação

## Tempo sugerido

50 minutos.

Agora vamos manter os métodos de CRUD da Aula 7, mas adicionar listagem paginada.

Abra:

```text
src/app/services/estudante.service.ts
```

Substitua por:

```ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';

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
      limite: 5,
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
        observe: 'response',
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
      },
    });
  }

  buscarPorId(id: string): Estudante | undefined {
    return this.estudantes().find((estudante) => estudante.id === id);
  }

  cadastrar(estudante: Omit<Estudante, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.post<Estudante>(this.apiUrl, estudante).subscribe({
      next: (novoEstudante) => {
        this.estudantes.update((listaAtual) => [
          ...listaAtual,
          novoEstudante
        ]);

        this.total.update((valorAtual) => valorAtual + 1);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível cadastrar o estudante.');
        this.carregando.set(false);
      },
    });
  }

  editar(id: string, estudanteAtualizado: Omit<Estudante, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.put<Estudante>(`${this.apiUrl}/${id}`, {
      id,
      ...estudanteAtualizado,
    }).subscribe({
      next: (estudanteEditado) => {
        this.estudantes.update((listaAtual) =>
          listaAtual.map((estudante) =>
            estudante.id === id ? estudanteEditado : estudante
          )
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível editar o estudante.');
        this.carregando.set(false);
      },
    });
  }

  remover(id: string): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.estudantes.update((listaAtual) =>
          listaAtual.filter((estudante) => estudante.id !== id)
        );

        this.total.update((valorAtual) => Math.max(0, valorAtual - 1));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível remover o estudante.');
        this.carregando.set(false);
      },
    });
  }
}
```

## Explicação didática

Mostre este trecho:

```ts
let params = new HttpParams()
  .set('_page', opcoes.pagina)
  .set('_per_page', opcoes.limite);
```

Explique:

> `HttpParams` monta os parâmetros que serão enviados na URL.

Mostre:

```ts
observe: 'response'
```

Explique:

> Com `observe: 'response'`, o Angular retorna a resposta HTTP completa. Assim conseguimos ler o corpo e também os headers.

Explique também que o total pode vir de formas diferentes dependendo da versão do `json-server`:

```ts
resposta.headers.get('X-Total-Count')
```

ou:

```ts
corpo?.items
```

Por isso o código trata as duas possibilidades.

---

# 9. Módulo 7 — Atualizar a página `Estudantes`

## Tempo sugerido

55 minutos.

Agora vamos transformar a listagem de cards em tabela.

Abra:

```text
src/app/pages/estudantes/estudantes.ts
```

Substitua por:

```ts
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';
import { TurnoEstudante } from '../../models/estudante.model';
import { TurnoLabelPipe } from '../../pipes/turno-label-pipe';
import { EstudanteService } from '../../services/estudante.service';

@Component({
  selector: 'app-estudantes',
  imports: [
    ReactiveFormsModule,
    TurnoLabelPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './estudantes.html',
  styleUrl: './estudantes.css',
})
export class Estudantes implements OnInit {
  private readonly estudanteService = inject(EstudanteService);
  private readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  estudantes = this.estudanteService.listar();
  totalEstudantes = this.estudanteService.totalRegistros();
  carregando = this.estudanteService.estaCarregando();
  erro = this.estudanteService.mensagemErro();

  colunasExibidas = [
    'nome',
    'email',
    'curso',
    'turno',
    'dataIngresso',
    'acoes'
  ];

  paginaAtual = 0;
  tamanhoPagina = 5;
  termoBusca = signal('');

  ordenarPor = '';
  direcaoOrdenacao: 'asc' | 'desc' | '' = '';

  idEmEdicao: string | null = null;

  busca = new FormControl('', {
    nonNullable: true,
  });

  formEstudante = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ],
    }),
    curso: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ],
    }),
    turno: new FormControl<TurnoEstudante | ''>('', {
      nonNullable: true,
      validators: [
        Validators.required
      ],
    }),
    dataIngresso: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ],
    }),
  });

  estudantesFiltrados = computed(() => {
    const termo = this.termoBusca().toLowerCase().trim();

    if (!termo) {
      return this.estudantes();
    }

    return this.estudantes().filter((estudante) => {
      return (
        estudante.nome.toLowerCase().includes(termo) ||
        estudante.email.toLowerCase().includes(termo) ||
        estudante.curso.toLowerCase().includes(termo) ||
        estudante.turno.toLowerCase().includes(termo) ||
        estudante.dataIngresso.toLowerCase().includes(termo)
      );
    });
  });

  ngOnInit(): void {
    this.carregarEstudantes();
  }

  carregarEstudantes(): void {
    this.estudanteService.listarPaginado({
      pagina: this.paginaAtual + 1,
      limite: this.tamanhoPagina,
      ordenarPor: this.ordenarPor,
      direcao: this.direcaoOrdenacao,
    });
  }

  aoMudarPagina(evento: PageEvent): void {
    this.paginaAtual = evento.pageIndex;
    this.tamanhoPagina = evento.pageSize;

    this.carregarEstudantes();
  }

  aoMudarOrdenacao(evento: Sort): void {
    this.ordenarPor = evento.active;
    this.direcaoOrdenacao = evento.direction;

    this.paginaAtual = 0;
    this.paginator?.firstPage();

    this.carregarEstudantes();
  }

  pesquisar(): void {
    this.termoBusca.set(this.busca.value.trim());
  }

  limparBusca(): void {
    this.busca.setValue('');
    this.termoBusca.set('');
  }

  salvarFormulario(): void {
    if (this.formEstudante.invalid) {
      this.formEstudante.markAllAsTouched();
      return;
    }

    const dadosFormulario = this.formEstudante.getRawValue();

    const estudante = {
      nome: dadosFormulario.nome,
      email: dadosFormulario.email,
      curso: dadosFormulario.curso,
      turno: dadosFormulario.turno as TurnoEstudante,
      dataIngresso: dadosFormulario.dataIngresso,
    };

    if (this.idEmEdicao === null) {
      this.estudanteService.cadastrar(estudante);
    } else {
      this.estudanteService.editar(this.idEmEdicao, estudante);
    }

    this.limparFormulario();

    setTimeout(() => {
      this.carregarEstudantes();
    }, 300);
  }

  editarEstudante(id: string): void {
    const estudante = this.estudanteService.buscarPorId(id);

    if (estudante) {
      this.idEmEdicao = estudante.id;

      this.formEstudante.setValue({
        nome: estudante.nome,
        email: estudante.email,
        curso: estudante.curso,
        turno: estudante.turno,
        dataIngresso: estudante.dataIngresso,
      });
    }
  }

  removerEstudante(id: string): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog);

    dialogRef.afterClosed().subscribe((confirmou: boolean) => {
      if (confirmou) {
        this.estudanteService.remover(id);

        if (this.idEmEdicao === id) {
          this.limparFormulario();
        }

        setTimeout(() => {
          this.carregarEstudantes();
        }, 300);
      }
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  campoInvalido(nomeCampo: string): boolean {
    const campo = this.formEstudante.get(nomeCampo);

    return !!campo && campo.invalid && campo.touched;
  }

  private limparFormulario(): void {
    this.idEmEdicao = null;

    this.formEstudante.reset({
      nome: '',
      email: '',
      curso: '',
      turno: '',
      dataIngresso: '',
    });
  }
}
```

## Explicação sobre busca front-side

Mostre este trecho:

```ts
termoBusca = signal('');
```

Explique:

> A busca precisa ser signal porque será usada dentro de um `computed()`.

Mostre:

```ts
estudantesFiltrados = computed(() => {
  const termo = this.termoBusca().toLowerCase().trim();

  if (!termo) {
    return this.estudantes();
  }

  return this.estudantes().filter((estudante) => {
    return (
      estudante.nome.toLowerCase().includes(termo) ||
      estudante.email.toLowerCase().includes(termo) ||
      estudante.curso.toLowerCase().includes(termo) ||
      estudante.turno.toLowerCase().includes(termo) ||
      estudante.dataIngresso.toLowerCase().includes(termo)
    );
  });
});
```

Explique:

> O `computed()` observa `estudantes()` e `termoBusca()`. Quando a lista carregada muda ou quando o termo de busca muda, a tabela é recalculada automaticamente.

## Atenção importante

A busca é feita apenas na página atual.

Exemplo:

```text
A API carregou 5 estudantes.
A busca procura apenas nesses 5 estudantes.
```

---

# 10. Módulo 8 — Atualizar `estudantes.html`

## Tempo sugerido

35 minutos.

Abra:

```text
src/app/pages/estudantes/estudantes.html
```

Substitua por:

```html
<h1>Estudantes</h1>

<p>
  Cadastre, edite, remova e consulte estudantes com paginação no servidor,
  ordenação no servidor e busca textual no front-end.
</p>

<mat-card class="formulario-card">
  <mat-card-header>
    <mat-card-title>
      @if (idEmEdicao === null) {
        Novo estudante
      } @else {
        Editar estudante
      }
    </mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <form [formGroup]="formEstudante" (ngSubmit)="salvarFormulario()">
      <mat-form-field appearance="outline" class="campo">
        <mat-label>Nome</mat-label>

        <input
          matInput
          type="text"
          formControlName="nome"
          placeholder="Ex.: Ana Silva"
        />

        @if (campoInvalido('nome')) {
          @if (formEstudante.controls.nome.errors?.['required']) {
            <mat-error>O nome é obrigatório.</mat-error>
          }

          @if (formEstudante.controls.nome.errors?.['minlength']) {
            <mat-error>O nome deve ter pelo menos 3 caracteres.</mat-error>
          }
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="campo">
        <mat-label>E-mail</mat-label>

        <input
          matInput
          type="email"
          formControlName="email"
          placeholder="Ex.: estudante@email.com"
        />

        @if (campoInvalido('email')) {
          @if (formEstudante.controls.email.errors?.['required']) {
            <mat-error>O e-mail é obrigatório.</mat-error>
          }

          @if (formEstudante.controls.email.errors?.['email']) {
            <mat-error>Informe um e-mail válido.</mat-error>
          }
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="campo">
        <mat-label>Curso</mat-label>

        <input
          matInput
          type="text"
          formControlName="curso"
          placeholder="Ex.: Angular Básico"
        />

        @if (campoInvalido('curso')) {
          @if (formEstudante.controls.curso.errors?.['required']) {
            <mat-error>O curso é obrigatório.</mat-error>
          }

          @if (formEstudante.controls.curso.errors?.['minlength']) {
            <mat-error>O curso deve ter pelo menos 3 caracteres.</mat-error>
          }
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="campo">
        <mat-label>Turno</mat-label>

        <mat-select formControlName="turno">
          <mat-option value="matutino">Matutino</mat-option>
          <mat-option value="vespertino">Vespertino</mat-option>
          <mat-option value="noturno">Noturno</mat-option>
        </mat-select>

        @if (campoInvalido('turno')) {
          <mat-error>O turno é obrigatório.</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="campo">
        <mat-label>Data de ingresso</mat-label>

        <input
          matInput
          type="date"
          formControlName="dataIngresso"
        />

        @if (campoInvalido('dataIngresso')) {
          <mat-error>A data de ingresso é obrigatória.</mat-error>
        }
      </mat-form-field>

      <div class="acoes-formulario">
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="carregando()"
        >
          @if (idEmEdicao === null) {
            Cadastrar
          } @else {
            Salvar alterações
          }
        </button>

        @if (idEmEdicao !== null) {
          <button
            mat-button
            color="warn"
            type="button"
            (click)="cancelarEdicao()"
          >
            Cancelar edição
          </button>
        }
      </div>
    </form>
  </mat-card-content>
</mat-card>

<section class="consulta-card">
  <h2>Consulta de estudantes</h2>

  <div class="barra-busca">
    <mat-form-field appearance="outline" class="campo-busca">
      <mat-label>Buscar estudante</mat-label>

      <input
        matInput
        type="text"
        [formControl]="busca"
        placeholder="Nome, e-mail, curso, turno ou data"
        (keyup.enter)="pesquisar()"
      />
    </mat-form-field>

    <button
      mat-raised-button
      color="primary"
      type="button"
      (click)="pesquisar()"
    >
      <mat-icon>search</mat-icon>
      Pesquisar
    </button>

    <button
      mat-button
      type="button"
      (click)="limparBusca()"
    >
      <mat-icon>clear</mat-icon>
      Limpar
    </button>
  </div>

  @if (carregando()) {
    <div class="estado-carregamento">
      <mat-spinner diameter="32" aria-label="Carregando estudantes"></mat-spinner>
      <span>Carregando estudantes...</span>
    </div>
  }

  @if (erro()) {
    <mat-card class="erro-card">
      {{ erro() }}
    </mat-card>
  }

  @if (!carregando() && estudantesFiltrados().length === 0) {
    <mat-card class="vazio-card">
      Nenhum estudante encontrado para a busca informada.
    </mat-card>
  }

  @if (estudantesFiltrados().length > 0) {
    <div class="tabela-container">
      <table
        mat-table
        matSort
        [dataSource]="estudantesFiltrados()"
        (matSortChange)="aoMudarOrdenacao($event)"
        class="tabela-estudantes"
      >
        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            Nome
          </th>
          <td mat-cell *matCellDef="let estudante">
            {{ estudante.nome }}
          </td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            E-mail
          </th>
          <td mat-cell *matCellDef="let estudante">
            {{ estudante.email }}
          </td>
        </ng-container>

        <ng-container matColumnDef="curso">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            Curso
          </th>
          <td mat-cell *matCellDef="let estudante">
            {{ estudante.curso }}
          </td>
        </ng-container>

        <ng-container matColumnDef="turno">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            Turno
          </th>
          <td mat-cell *matCellDef="let estudante">
            {{ estudante.turno | turnoLabel }}
          </td>
        </ng-container>

        <ng-container matColumnDef="dataIngresso">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            Data de ingresso
          </th>
          <td mat-cell *matCellDef="let estudante">
            {{ estudante.dataIngresso | date: 'dd/MM/yyyy' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef>
            Ações
          </th>
          <td mat-cell *matCellDef="let estudante">
            <button
              mat-icon-button
              color="primary"
              type="button"
              aria-label="Editar estudante"
              (click)="editarEstudante(estudante.id)"
            >
              <mat-icon>edit</mat-icon>
            </button>

            <button
              mat-icon-button
              color="warn"
              type="button"
              aria-label="Remover estudante"
              (click)="removerEstudante(estudante.id)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="colunasExibidas"></tr>
        <tr mat-row *matRowDef="let row; columns: colunasExibidas;"></tr>
      </table>
    </div>

    <mat-paginator
      [length]="totalEstudantes()"
      [pageSize]="tamanhoPagina"
      [pageSizeOptions]="[5, 10, 20]"
      showFirstLastButtons
      (page)="aoMudarPagina($event)"
      aria-label="Paginação de estudantes"
    >
    </mat-paginator>
  }
</section>
```

## Observação sobre `mat-table`

Mesmo usando o novo controle de fluxo do Angular, como `@if` e `@for`, a tabela do Angular Material ainda usa diretivas estruturais próprias:

```html
*matHeaderCellDef
*matCellDef
*matHeaderRowDef
*matRowDef
```

Explique:

> Esses asteriscos fazem parte da API da tabela do Angular Material. Portanto, continuam sendo usados normalmente.

---

# 11. Módulo 9 — Atualizar `estudantes.css`

## Tempo sugerido

15 minutos.

Abra:

```text
src/app/pages/estudantes/estudantes.css
```

Substitua ou complemente com:

```css
.formulario-card {
  margin-bottom: 24px;
  padding: 8px;
  background-color: #f8f9ff;
}

.campo {
  width: 100%;
  margin-bottom: 16px;
}

.acoes-formulario {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 8px;
  flex-wrap: wrap;
}

.consulta-card {
  margin-top: 32px;
}

.barra-busca {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.campo-busca {
  min-width: 280px;
  flex: 1;
}

.estado-carregamento {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}

.erro-card {
  padding: 16px;
  margin: 16px 0;
  background-color: #fff3f3;
  color: #8a1f1f;
}

.vazio-card {
  padding: 16px;
  margin: 16px 0;
  background-color: #f8f9ff;
}

.tabela-container {
  width: 100%;
  overflow-x: auto;
  margin-top: 16px;
}

.tabela-estudantes {
  width: 100%;
}

th.mat-mdc-header-cell {
  font-weight: 700;
}

td.mat-mdc-cell,
th.mat-mdc-header-cell {
  padding: 12px;
}

mat-paginator {
  margin-top: 8px;
}
```

---

# 12. Módulo 10 — Testar a tabela de estudantes

## Tempo sugerido

15 minutos.

Execute os dois terminais.

Terminal 1:

```bash
npm run api
```

Terminal 2:

```bash
ng serve
```

Acesse:

```text
http://localhost:4200/estudantes
```

## Teste 1 — Tabela

Resultado esperado:

```text
Os estudantes aparecem em formato de tabela.
```

## Teste 2 — Paginação

Altere o tamanho da página para:

```text
5
10
20
```

Resultado esperado:

```text
A tabela deve buscar novamente os estudantes na API.
```

## Teste 3 — Ordenação

Clique no cabeçalho:

```text
Nome
E-mail
Curso
Turno
Data de ingresso
```

Resultado esperado:

```text
A listagem deve ser recarregada com ordenação.
```

## Teste 4 — Busca

Digite:

```text
Angular
```

Clique em:

```text
Pesquisar
```

Resultado esperado:

```text
A tabela deve exibir apenas os estudantes da página atual que contenham o termo pesquisado.
```

## Teste 5 — Limpar busca

Clique em:

```text
Limpar
```

Resultado esperado:

```text
A listagem volta a mostrar todos os estudantes carregados na página atual.
```

---

# 13. Módulo 11 — Refatorar `TarefaService` para paginação

## Tempo sugerido

35 minutos.

Agora vamos aplicar o conceito de listagem paginada na página de tarefas.

A diferença é:

```text
A paginação continuará sendo feita pela API.
A busca textual será feita no front-end.
Os filtros por estudante, status e prioridade também serão feitos no front-end.
```

Abra:

```text
src/app/services/tarefa.service.ts
```

Substitua por:

```ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';

import { Tarefa } from '../models/tarefa.model';

type TarefaApi = Omit<Tarefa, 'dataEntrega'> & {
  dataEntrega: string;
};

type JsonServerPaginado<T> = {
  first?: number;
  prev?: number | null;
  next?: number | null;
  last?: number;
  pages?: number;
  items?: number;
  data?: T[];
};

type OpcoesListagemTarefas = {
  pagina: number;
  limite: number;
};

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/tarefas';

  private readonly tarefas = signal<Tarefa[]>([]);
  private readonly total = signal(0);
  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);

  listar(): Signal<Tarefa[]> {
    return this.tarefas.asReadonly();
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
      limite: 5,
    });
  }

  listarPaginado(opcoes: OpcoesListagemTarefas): void {
    this.carregando.set(true);
    this.erro.set(null);

    const params = new HttpParams()
      .set('_page', opcoes.pagina)
      .set('_per_page', opcoes.limite);

    this.http.get<TarefaApi[] | JsonServerPaginado<TarefaApi>>(
      this.apiUrl,
      {
        params,
        observe: 'response',
      }
    ).subscribe({
      next: (resposta) => {
        const corpo = resposta.body;

        const dadosApi = Array.isArray(corpo)
          ? corpo
          : corpo?.data ?? [];

        const tarefasConvertidas = dadosApi.map((tarefa) =>
          this.converterDaApi(tarefa)
        );

        const totalHeader = resposta.headers.get('X-Total-Count');

        const totalApi = Array.isArray(corpo)
          ? Number(totalHeader ?? tarefasConvertidas.length)
          : Number(corpo?.items ?? tarefasConvertidas.length);

        this.tarefas.set(tarefasConvertidas);
        this.total.set(totalApi);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as tarefas.');
        this.tarefas.set([]);
        this.total.set(0);
        this.carregando.set(false);
      },
    });
  }

  buscarPorId(id: string): Tarefa | undefined {
    return this.tarefas().find((tarefa) => tarefa.id === id);
  }

  cadastrar(tarefa: Omit<Tarefa, 'id'>): void {
    this.carregando.set(true);
    this.erro.set(null);

    const tarefaApi = this.converterParaApi(tarefa);

    this.http.post<TarefaApi>(this.apiUrl, tarefaApi).subscribe({
      next: (novaTarefa) => {
        this.tarefas.update((listaAtual) => [
          ...listaAtual,
          this.converterDaApi(novaTarefa)
        ]);

        this.total.update((valorAtual) => valorAtual + 1);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível cadastrar a tarefa.');
        this.carregando.set(false);
      },
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
        this.tarefas.update((listaAtual) =>
          listaAtual.map((tarefa) =>
            tarefa.id === id
              ? this.converterDaApi(tarefaEditada)
              : tarefa
          )
        );

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível editar a tarefa.');
        this.carregando.set(false);
      },
    });
  }

  remover(id: string): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.tarefas.update((listaAtual) =>
          listaAtual.filter((tarefa) => tarefa.id !== id)
        );

        this.total.update((valorAtual) => Math.max(0, valorAtual - 1));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível remover a tarefa.');
        this.carregando.set(false);
      },
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
```

## Explicação didática

Explique aos alunos:

```text
Nesta versão, o service de tarefas não envia termo de busca para a API.

Ele apenas busca uma página de tarefas.

Depois, a página Tarefas usa computed() para filtrar no front-end:
- texto digitado;
- estudante selecionado;
- status;
- prioridade.
```

---

# 14. Módulo 12 — Atualizar a página `Tarefas` com filtro front-side

## Tempo sugerido

30 minutos.

Abra:

```text
src/app/pages/tarefas/tarefas.ts
```

Substitua por:

```ts
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { PrioridadeTarefa, StatusTarefa } from '../../models/tarefa.model';
import { EstudanteService } from '../../services/estudante.service';
import { TarefaService } from '../../services/tarefa.service';

@Component({
  selector: 'app-tarefas',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    TarefaCard
  ],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css',
})
export class Tarefas implements OnInit {
  private readonly tarefaService = inject(TarefaService);
  private readonly estudanteService = inject(EstudanteService);
  private readonly dialog = inject(MatDialog);

  tarefas = this.tarefaService.listar();
  estudantes = this.estudanteService.listar();

  carregandoTarefas = this.tarefaService.estaCarregando();
  erroTarefas = this.tarefaService.mensagemErro();

  carregandoEstudantes = this.estudanteService.estaCarregando();
  erroEstudantes = this.estudanteService.mensagemErro();

  totalRegistrosTarefas = this.tarefaService.totalRegistros();

  paginaAtual = 0;
  tamanhoPagina = 5;

  busca = new FormControl('', {
    nonNullable: true,
  });

  termoBusca = signal('');

  filtroSelecionado = signal<'todas' | 'pendente' | 'concluida' | 'alta'>('todas');
  estudanteSelecionadoId = signal<string | null>(null);

  novoNome = '';
  novoStatus: StatusTarefa = 'pendente';
  novaPrioridade: PrioridadeTarefa = 'media';
  novoEstudanteId: string | null = null;
  novaDataEntrega: Date | null = null;

  idEmEdicao: string | null = null;

  tarefasFiltradas = computed(() => {
    let lista = this.tarefas();

    const termo = this.termoBusca().toLowerCase().trim();

    if (termo) {
      lista = lista.filter((tarefa) => {
        const estudanteNome = this.buscarNomeEstudante(tarefa.estudanteId);

        return (
          tarefa.nome.toLowerCase().includes(termo) ||
          tarefa.status.toLowerCase().includes(termo) ||
          tarefa.prioridade.toLowerCase().includes(termo) ||
          estudanteNome.toLowerCase().includes(termo)
        );
      });
    }

    if (this.estudanteSelecionadoId() !== null) {
      lista = lista.filter(
        (tarefa) => tarefa.estudanteId === this.estudanteSelecionadoId()
      );
    }

    switch (this.filtroSelecionado()) {
      case 'pendente':
        return lista.filter((tarefa) => tarefa.status === 'pendente');

      case 'concluida':
        return lista.filter((tarefa) => tarefa.status === 'concluida');

      case 'alta':
        return lista.filter((tarefa) => tarefa.prioridade === 'alta');

      default:
        return lista;
    }
  });

  totalTarefasPagina = computed(() =>
    this.tarefasFiltradas().length
  );

  totalPendentes = computed(() =>
    this.tarefasFiltradas().filter(
      (tarefa) => tarefa.status === 'pendente'
    ).length
  );

  totalConcluidas = computed(() =>
    this.tarefasFiltradas().filter(
      (tarefa) => tarefa.status === 'concluida'
    ).length
  );

  totalAlta = computed(() =>
    this.tarefasFiltradas().filter(
      (tarefa) => tarefa.prioridade === 'alta'
    ).length
  );

  ngOnInit(): void {
    this.estudanteService.carregar();
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.tarefaService.listarPaginado({
      pagina: this.paginaAtual + 1,
      limite: this.tamanhoPagina,
    });
  }

  aoMudarPagina(evento: PageEvent): void {
    this.paginaAtual = evento.pageIndex;
    this.tamanhoPagina = evento.pageSize;

    this.carregarTarefas();
  }

  aplicarFiltroGeral(
    filtro: 'todas' | 'pendente' | 'concluida' | 'alta'
  ): void {
    this.filtroSelecionado.set(filtro);
  }

  aplicarFiltroEstudante(id: string | null): void {
    this.estudanteSelecionadoId.set(id);
  }

  pesquisar(): void {
    this.termoBusca.set(this.busca.value.trim());
  }

  limparBusca(): void {
    this.busca.setValue('');
    this.termoBusca.set('');
  }

  buscarNomeEstudante(id: string): string {
    const estudante = this.estudanteService.buscarPorId(id);
    return estudante ? estudante.nome : 'Não encontrado';
  }

  salvarFormulario(): void {
    if (this.novoEstudanteId === null || this.novaDataEntrega === null) {
      return;
    }

    const dadosFormulario = {
      nome: this.novoNome,
      status: this.novoStatus,
      prioridade: this.novaPrioridade,
      estudanteId: this.novoEstudanteId,
      dataEntrega: this.novaDataEntrega,
    };

    if (this.idEmEdicao === null) {
      this.tarefaService.cadastrar(dadosFormulario);
    } else {
      this.tarefaService.editar(this.idEmEdicao, dadosFormulario);
    }

    this.limparFormulario();

    setTimeout(() => {
      this.carregarTarefas();
    }, 300);
  }

  editarTarefaPorId(id: string): void {
    const tarefa = this.tarefaService.buscarPorId(id);

    if (tarefa) {
      this.idEmEdicao = tarefa.id;
      this.novoNome = tarefa.nome;
      this.novoStatus = tarefa.status;
      this.novaPrioridade = tarefa.prioridade;
      this.novoEstudanteId = tarefa.estudanteId;
      this.novaDataEntrega = tarefa.dataEntrega
        ? new Date(tarefa.dataEntrega)
        : null;
    }
  }

  removerTarefa(id: string): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog);

    dialogRef.afterClosed().subscribe((confirmou: boolean) => {
      if (confirmou) {
        this.tarefaService.remover(id);

        if (this.idEmEdicao === id) {
          this.limparFormulario();
        }

        setTimeout(() => {
          this.carregarTarefas();
        }, 300);
      }
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  private limparFormulario(): void {
    this.idEmEdicao = null;
    this.novoNome = '';
    this.novoStatus = 'pendente';
    this.novaPrioridade = 'media';
    this.novoEstudanteId = null;
    this.novaDataEntrega = null;
  }
}
```

## Explicação sobre `ngOnInit()`

Explique:

```ts
ngOnInit(): void {
  this.estudanteService.carregar();
  this.carregarTarefas();
}
```

A página de tarefas precisa carregar duas informações:

```text
estudantes
→ usados no select e para mostrar o nome do estudante no card.

tarefas
→ usadas na listagem paginada.
```

## Explicação sobre indicadores

Agora os indicadores são da página atual:

```ts
totalTarefasPagina = computed(() =>
  this.tarefasFiltradas().length
);
```

Explique:

> Depois da paginação server-side, `tarefas()` representa apenas a página atual carregada da API. Portanto, os indicadores da página de tarefas mostram apenas os dados atualmente exibidos.

Relatórios gerais devem ficar na página `/relatorios`.

---

# 15. Módulo 13 — Atualizar `tarefas.html`

## Tempo sugerido

25 minutos.

Abra:

```text
src/app/pages/tarefas/tarefas.html
```

Substitua por:

```html
<h1>Tarefas</h1>

<p>
  Cadastre, edite, remova e consulte tarefas com paginação no servidor
  e filtros no front-end.
</p>

@if (carregandoTarefas() || carregandoEstudantes()) {
  <div class="estado-carregamento">
    <mat-spinner diameter="32" aria-label="Carregando dados de tarefas"></mat-spinner>
    <span>Carregando dados...</span>
  </div>
}

@if (erroTarefas()) {
  <mat-card class="erro-card">
    {{ erroTarefas() }}
  </mat-card>
}

@if (erroEstudantes()) {
  <mat-card class="erro-card">
    {{ erroEstudantes() }}
  </mat-card>
}

<mat-card class="formulario-card">
  <mat-card-header>
    <mat-card-title>
      @if (idEmEdicao === null) {
        Nova tarefa
      } @else {
        Editar tarefa
      }
    </mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <form #formTarefa="ngForm" (ngSubmit)="salvarFormulario()">
      <mat-form-field appearance="outline" class="campo">
        <mat-label>Nome da tarefa</mat-label>

        <input
          matInput
          name="nome"
          [(ngModel)]="novoNome"
          required
          minlength="3"
          #nome="ngModel"
        />

        @if (nome.invalid && nome.touched) {
          @if (nome.errors?.['required']) {
            <mat-error>O nome da tarefa é obrigatório.</mat-error>
          }

          @if (nome.errors?.['minlength']) {
            <mat-error>O nome deve ter pelo menos 3 caracteres.</mat-error>
          }
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="campo">
        <mat-label>Status</mat-label>

        <mat-select
          name="status"
          [(ngModel)]="novoStatus"
          required
          #status="ngModel"
        >
          <mat-option value="pendente">Pendente</mat-option>
          <mat-option value="em andamento">Em andamento</mat-option>
          <mat-option value="concluida">Concluída</mat-option>
        </mat-select>

        @if (status.invalid && status.touched) {
          <mat-error>O status é obrigatório.</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="campo">
        <mat-label>Prioridade</mat-label>

        <mat-select
          name="prioridade"
          [(ngModel)]="novaPrioridade"
          required
          #prioridade="ngModel"
        >
          <mat-option value="baixa">Baixa</mat-option>
          <mat-option value="media">Média</mat-option>
          <mat-option value="alta">Alta</mat-option>
        </mat-select>

        @if (prioridade.invalid && prioridade.touched) {
          <mat-error>A prioridade é obrigatória.</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="campo">
        <mat-label>Data de entrega</mat-label>

        <input
          matInput
          [matDatepicker]="pickerDataEntrega"
          name="dataEntrega"
          [(ngModel)]="novaDataEntrega"
          required
          #dataEntrega="ngModel"
        />

        <mat-hint>DD/MM/AAAA</mat-hint>

        <mat-datepicker-toggle
          matIconSuffix
          [for]="pickerDataEntrega"
        >
        </mat-datepicker-toggle>

        <mat-datepicker #pickerDataEntrega></mat-datepicker>

        @if (dataEntrega.invalid && dataEntrega.touched) {
          <mat-error>A data de entrega é obrigatória.</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="campo">
        <mat-label>Estudante responsável</mat-label>

        <mat-select
          name="estudanteId"
          [(ngModel)]="novoEstudanteId"
          required
          #estudanteId="ngModel"
        >
          @for (estudante of estudantes(); track estudante.id) {
            <mat-option [value]="estudante.id">
              {{ estudante.nome }}
            </mat-option>
          }
        </mat-select>

        @if (estudanteId.invalid && estudanteId.touched) {
          <mat-error>Selecione um estudante.</mat-error>
        }
      </mat-form-field>

      <div class="acoes-formulario">
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="formTarefa.invalid"
        >
          @if (idEmEdicao === null) {
            Cadastrar
          } @else {
            Salvar alterações
          }
        </button>

        @if (idEmEdicao !== null) {
          <button
            mat-button
            color="warn"
            type="button"
            (click)="cancelarEdicao()"
          >
            Cancelar edição
          </button>
        }
      </div>
    </form>
  </mat-card-content>
</mat-card>

<section class="indicadores">
  <mat-card>
    <strong>Exibidas na página</strong>
    <span>{{ totalTarefasPagina() }}</span>
  </mat-card>

  <mat-card>
    <strong>Pendentes na página</strong>
    <span>{{ totalPendentes() }}</span>
  </mat-card>

  <mat-card>
    <strong>Concluídas na página</strong>
    <span>{{ totalConcluidas() }}</span>
  </mat-card>

  <mat-card>
    <strong>Alta prioridade na página</strong>
    <span>{{ totalAlta() }}</span>
  </mat-card>
</section>

<section class="filtros-tarefas">
  <mat-form-field appearance="outline" class="campo-busca">
    <mat-label>Buscar tarefa</mat-label>

    <input
      matInput
      type="text"
      [formControl]="busca"
      placeholder="Ex.: Angular, pendente, alta ou nome do estudante"
      (keyup.enter)="pesquisar()"
    />
  </mat-form-field>

  <button
    mat-raised-button
    color="primary"
    type="button"
    (click)="pesquisar()"
  >
    Pesquisar
  </button>

  <button
    mat-button
    type="button"
    (click)="limparBusca()"
  >
    Limpar
  </button>

  <mat-form-field appearance="outline" class="filtro-estudante">
    <mat-label>Filtrar por estudante</mat-label>

    <mat-select
      [value]="estudanteSelecionadoId()"
      (selectionChange)="aplicarFiltroEstudante($event.value)"
    >
      <mat-option [value]="null">Todos</mat-option>

      @for (estudante of estudantes(); track estudante.id) {
        <mat-option [value]="estudante.id">
          {{ estudante.nome }}
        </mat-option>
      }
    </mat-select>
  </mat-form-field>

  <div class="botoes-filtro">
    <button
      mat-raised-button
      type="button"
      (click)="aplicarFiltroGeral('todas')"
    >
      Todas
    </button>

    <button
      mat-raised-button
      type="button"
      (click)="aplicarFiltroGeral('pendente')"
    >
      Pendentes
    </button>

    <button
      mat-raised-button
      type="button"
      (click)="aplicarFiltroGeral('concluida')"
    >
      Concluídas
    </button>

    <button
      mat-raised-button
      type="button"
      (click)="aplicarFiltroGeral('alta')"
    >
      Alta prioridade
    </button>
  </div>
</section>

<section class="lista-tarefas">
  <h2>Tarefas cadastradas</h2>

  @if (tarefasFiltradas().length === 0) {
    <p>Nenhuma tarefa encontrada para os filtros informados.</p>
  } @else {
    @for (tarefa of tarefasFiltradas(); track tarefa.id) {
      <app-tarefa-card
        [id]="tarefa.id"
        [nome]="tarefa.nome"
        [status]="tarefa.status"
        [prioridade]="tarefa.prioridade"
        [dataEntrega]="tarefa.dataEntrega"
        [dadosDebug]="tarefa"
        [estudanteNome]="buscarNomeEstudante(tarefa.estudanteId)"
        (editar)="editarTarefaPorId($event)"
        (remover)="removerTarefa($event)"
      />
    }
  }
</section>

<mat-paginator
  [length]="totalRegistrosTarefas()"
  [pageSize]="tamanhoPagina"
  [pageSizeOptions]="[3, 5, 10, 20]"
  showFirstLastButtons
  (page)="aoMudarPagina($event)"
  aria-label="Paginação de tarefas"
>
</mat-paginator>
```

## Observação didática

Explique aos alunos:

```text
O paginator usa o total de registros da API.

Os indicadores usam apenas as tarefas filtradas da página atual.
```

Assim:

```text
totalRegistrosTarefas()
→ usado no paginator.

totalTarefasPagina()
→ usado nos indicadores.
```

---

# 16. Módulo 14 — Atualizar `tarefas.css`

## Tempo sugerido

10 minutos.

Abra:

```text
src/app/pages/tarefas/tarefas.css
```

Use:

```css
.formulario-card {
  margin-bottom: 24px;
  padding: 8px;
  background-color: #f8f9ff;
}

.campo {
  width: 100%;
  margin-bottom: 16px;
}

.acoes-formulario {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 8px;
  flex-wrap: wrap;
}

.lista-tarefas {
  margin-top: 24px;
}

.lista-tarefas h2 {
  margin-bottom: 16px;
}

.filtros-tarefas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin: 24px 0;
}

.campo-busca {
  min-width: 260px;
  flex: 1;
}

.filtro-estudante {
  min-width: 260px;
}

.botoes-filtro {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

mat-paginator {
  margin-top: 16px;
}

.indicadores {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin: 24px 0;
}

.indicadores mat-card {
  padding: 16px;
  background-color: #f8f9ff;
}

.indicadores strong {
  display: block;
  margin-bottom: 8px;
}

.indicadores span {
  font-size: 24px;
  font-weight: 600;
}

.estado-carregamento {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}

.erro-card {
  padding: 16px;
  margin: 16px 0;
  background-color: #fff3f3;
  color: #8a1f1f;
}
```

Esse CSS mantém a estrutura implementada, com formulário, filtros, indicadores, lista de tarefas, carregamento e erros .

---

# 17. Remover relatório por estudante da página de tarefas

## Tempo sugerido

10 minutos.

Na Aula 5, a página de tarefas tinha um relatório simples por estudante. Depois da Aula 8, isso não deve mais ficar em `/tarefas`.

Explique:

```text
Com a paginação server-side, tarefas() representa apenas a página atual carregada da API.

Por isso, a página de tarefas não deve exibir relatórios gerais.
```

A responsabilidade da página `/tarefas` passa a ser:

```text
cadastrar tarefas
editar tarefas
remover tarefas
listar tarefas
buscar tarefas
filtrar tarefas
paginar tarefas
```

A responsabilidade da página `/relatorios` passa a ser:

```text
exibir indicadores gerais
exibir totais
exibir tarefas por estudante
exibir tarefas por status
exibir tarefas por prioridade
```

## Remover de `tarefas.ts`

Remova, se existir:

```ts
tarefasPorEstudante = computed(() => {
  const mapa: Record<string, number> = {};

  this.estudantes().forEach((estudante) => {
    mapa[estudante.nome] = this.tarefas().filter(
      (tarefa) => tarefa.estudanteId === estudante.id
    ).length;
  });

  return mapa;
});
```

Também remova:

```ts
KeyValuePipe
```

O `KeyValuePipe` só é necessário quando algum template percorre objetos com `| keyvalue`. Como o relatório por estudante saiu da página de tarefas, ele não é mais necessário nessa página.

## Remover de `tarefas.html`

Remova qualquer bloco parecido com:

```html
<section class="relatorio-tarefas">
  <h2>Relatório por estudante</h2>

  @for (item of tarefasPorEstudante() | keyvalue; track item.key) {
    <mat-card>
      <strong>{{ item.key }}</strong>
      <span>{{ item.value }} tarefa(s)</span>
    </mat-card>
  }
</section>
```

---

# 18. Testes finais da página de tarefas

## Tempo sugerido

15 minutos.

Acesse:

```text
http://localhost:4200/tarefas
```

## Teste 1 — Carregamento inicial

Resultado esperado:

```text
A página deve carregar estudantes e tarefas.
```

Isso depende de:

```ts
ngOnInit(): void {
  this.estudanteService.carregar();
  this.carregarTarefas();
}
```

## Teste 2 — Paginação

Altere o tamanho da página:

```text
3
5
10
20
```

Resultado esperado:

```text
A API deve carregar uma nova página de tarefas.
```

## Teste 3 — Busca textual

Digite:

```text
Angular
```

Clique em:

```text
Pesquisar
```

Resultado esperado:

```text
A lista deve exibir apenas as tarefas da página atual que contenham Angular.
```

## Teste 4 — Filtro por estudante

Escolha um estudante no select.

Resultado esperado:

```text
A lista deve exibir apenas as tarefas da página atual daquele estudante.
```

## Teste 5 — Filtro por status

Clique em:

```text
Pendentes
Concluídas
```

Resultado esperado:

```text
A lista deve filtrar as tarefas da página atual pelo status escolhido.
```

## Teste 6 — Filtro por prioridade

Clique em:

```text
Alta prioridade
```

Resultado esperado:

```text
A lista deve exibir apenas tarefas de alta prioridade da página atual.
```

## Teste 7 — Indicadores

Verifique os cards:

```text
Exibidas na página
Pendentes na página
Concluídas na página
Alta prioridade na página
```

Resultado esperado:

```text
Os indicadores devem acompanhar os filtros aplicados na página atual.
```

---

# 19. Problemas comuns e correções

## Problema 1 — Clico em pesquisar e nada acontece

Verifique se `termoBusca` foi criado como signal:

```ts
termoBusca = signal('');
```

Errado:

```ts
termoBusca = '';
```

Se `termoBusca` for string comum, o `computed()` não será recalculado.

---

## Problema 2 — A busca só funciona na página atual

Esse comportamento é esperado nesta versão.

Explique:

```text
A API está paginando.
O Angular está filtrando apenas o que foi carregado.
```

Portanto, se a tarefa ou estudante estiver em outra página, ela só aparecerá quando aquela página for carregada.

---

## Problema 3 — O filtro por estudante não funciona

Verifique se `estudanteSelecionadoId` é signal de `string | null`:

```ts
estudanteSelecionadoId = signal<string | null>(null);
```

E se o select usa:

```html
(selectionChange)="aplicarFiltroEstudante($event.value)"
```

---

## Problema 4 — O filtro por pendente, concluída ou alta prioridade não funciona

Verifique se `filtroSelecionado` está assim:

```ts
filtroSelecionado = signal<'todas' | 'pendente' | 'concluida' | 'alta'>('todas');
```

E se os botões chamam:

```html
(click)="aplicarFiltroGeral('pendente')"
(click)="aplicarFiltroGeral('concluida')"
(click)="aplicarFiltroGeral('alta')"
```

---

## Problema 5 — O paginator mostra total diferente dos indicadores

Esse comportamento é esperado.

Explique:

```text
O paginator mostra o total de registros da API.

Os indicadores mostram o total filtrado da página atual.
```

Exemplo:

```text
API possui 20 tarefas.
Página atual carregou 5 tarefas.
Filtro encontrou 2 tarefas.

Paginator: 20
Indicador: 2 exibidas na página
```

---

# 20. Produto final da Aula 8

Ao final da Aula 8, o sistema terá:

```text
Página Estudantes
├── formulário reativo mantido
├── CRUD mantido
├── mat-table
├── mat-paginator
├── mat-sort
├── paginação server-side
├── ordenação server-side
├── busca textual front-side na página atual
├── carregamento
├── erro
└── lista vazia

Página Tarefas
├── formulário template-driven mantido
├── cards mantidos
├── paginação server-side
├── busca textual front-side na página atual
├── filtros front-side por estudante, status e prioridade
├── indicadores da página atual
├── relacionamento com estudantes mantido
└── CRUD mantido
```

Resultado esperado:

```text
Listagens profissionais com Angular Material, paginação pela API fake e filtros textuais aplicados no front-end.
```

---

# 21. Fechamento didático

Finalize com esta síntese:

```text
Na Aula 7, aprendemos a consumir uma API REST.

Na Aula 8, aprendemos que consumir API não é apenas buscar tudo.

Também aprendemos que paginação e busca não precisam estar sempre no mesmo lugar.

Nesta aula:
- a API ficou responsável pela paginação;
- o Angular ficou responsável pela busca textual e pelos filtros da página atual.
```

Explique também:

```text
Em sistemas reais, a busca textual normalmente deve ser implementada no backend.

Mas, como usamos o json-server atual como API fake didática, aplicamos a busca no front-end para manter o funcionamento simples e previsível.
```

A frase-chave da aula:

```text
Agora a aplicação consulta dados de forma paginada e filtra a página atual de forma reativa.
```



[1]: https://angular.dev/guide/http/making-requests 'Making requests • Angular'
[2]: https://angular.dev/guide/http/setup 'Setting up HttpClient • Angular'
[3]: https://www.npmjs.com/package/json-server?utm_source=chatgpt.com 'json-server'
