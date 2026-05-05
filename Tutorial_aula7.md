# 🎓 Aula 7 — Consumo de API REST com json-server

## Tema

Substituir os dados locais por uma API REST simulada.

## Objetivo

Fazer a aplicação **Gerenciador de Estudos** consumir endpoints REST usando `HttpClient`, mantendo as páginas, componentes, formulários, filtros, pipes, imagens, datepicker e relatórios já construídos nas aulas anteriores.

Ao final da aula, o aluno deverá conseguir:

```text
Instalar e executar o json-server
Criar o arquivo db.json
Configurar o HttpClient com provideHttpClient()
Refatorar EstudanteService para usar HTTP
Refatorar TarefaService para usar HTTP
Usar GET, POST, PUT e DELETE
Usar subscribe()
Tratar erro de requisição
Controlar estado de carregamento
Manter signals na interface
Persistir dados no db.json
```

O Angular fornece o `HttpClient` para comunicação HTTP com backends, e ele é disponibilizado na aplicação com `provideHttpClient()` em `app.config.ts` ([Angular][1]). Cada método HTTP do `HttpClient` retorna um `Observable`, e a requisição é enviada quando há uma inscrição com `subscribe()` ([Angular][2]).

---

# 1. Duração da aula

**4 horas**

|       Tempo | Etapa            | Atividade                                    |
| ----------: | ---------------- | -------------------------------------------- |
| 0h00 – 0h20 | Revisão          | Retomar o estado final da Aula 6             |
| 0h20 – 0h50 | Conceitos        | API REST, endpoint, JSON e verbos HTTP       |
| 0h50 – 1h20 | json-server      | Instalação, `db.json` e execução da API fake |
| 1h20 – 1h50 | HttpClient       | Configurar `provideHttpClient()`             |
| 1h50 – 2h00 | Intervalo        | Pausa                                        |
| 2h00 – 2h45 | EstudanteService | Refatorar service local para service HTTP    |
| 2h45 – 3h25 | TarefaService    | Refatorar service local para service HTTP    |
| 3h25 – 3h50 | Integração       | Ajustar páginas para carregamento e erro     |
| 3h50 – 4h00 | Fechamento       | Testes, revisão e desafios                   |

---

# 2. Estado inicial da Aula 7

A Aula 7 **não reinicia o projeto**.

O projeto já deve estar parecido com:

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
├── app.ts
├── app.html
├── app.css
├── app.config.ts
└── app.routes.ts
```

Na Aula 6, o modelo de tarefa passou a usar `dataEntrega: Date`, porque o formulário de tarefas trabalha com `mat-datepicker` . Nesta Aula 7, isso exige um cuidado importante: o `json-server` grava datas como **string JSON**, então o service precisará converter `string → Date` ao carregar os dados e `Date → string` ao salvar.

---

# 3. Resultado esperado da Aula 7

Ao final da aula, a aplicação deverá permitir:

```text
Cadastrar estudante via API REST fake
Editar estudante via API REST fake
Remover estudante via API REST fake
Listar estudantes vindos do json-server

Cadastrar tarefa via API REST fake
Editar tarefa via API REST fake
Remover tarefa via API REST fake
Listar tarefas vindas do json-server

Manter:
- relacionamento tarefa-estudante
- filtros
- indicadores
- relatório
- pipes
- imagens
- datepicker
- @defer
```

Resultado final:

```text
Dados persistidos no db.json e consumidos via HttpClient.
```

---

# 4. Módulo 1 — Revisão inicial

## Tempo sugerido

20 minutos.

Explique aos alunos:

> Na Aula 3, criamos o CRUD de tarefas com um service local usando `signal`.

> Na Aula 4, criamos o CRUD de estudantes com Reactive Forms.

> Na Aula 5, relacionamos tarefas e estudantes por meio de `estudanteId`.

> Na Aula 6, melhoramos a apresentação com pipes, imagens, datepicker e relatório carregado sob demanda com `@defer`.

Agora:

> Na Aula 7, vamos trocar os dados locais por uma API REST fake usando `json-server`.

Mostre a mudança principal:

```text
Antes:

Componente → Service com signal local → Dados em memória

Agora:

Componente → Service HTTP → json-server → db.json
```

Explique:

> A tela continuará usando dados reativos. Mas, em vez de alterar apenas uma lista local em memória, o service fará requisições HTTP para uma API fake.

---

# 5. Módulo 2 — Conceitos iniciais

## Tempo sugerido

30 minutos.

## 5.1 O que é API?

Explique:

```text
API é uma forma de comunicação entre sistemas.
```

No nosso caso:

```text
Angular → conversa com → API REST fake
```

Exemplo:

```text
Angular pede a lista de estudantes.
API responde com dados em JSON.
```

---

## 5.2 O que é API REST?

Explique:

```text
REST é um estilo de organização de APIs baseado em recursos.
```

No sistema:

```text
/estudantes
/tarefas
```

são recursos da API.

---

## 5.3 O que é endpoint?

Explique:

```text
Endpoint é um endereço da API usado para acessar um recurso.
```

Exemplos:

```text
GET http://localhost:3000/estudantes
GET http://localhost:3000/tarefas
```

---

## 5.4 O que é JSON?

Explique:

```text
JSON é um formato de texto usado para representar dados.
```

Exemplo:

```json
{
  "id": "1",
  "nome": "Ana Silva",
  "email": "ana@email.com"
}
```

```text
Nesta aula, usaremos id como string, porque a versão atual do json-server gera ids em formato textual.
```

---

## 5.5 Verbos HTTP

Explique com uma tabela:

| Verbo    | Uso                     | Exemplo               |
| -------- | ----------------------- | --------------------- |
| `GET`    | Buscar dados            | Buscar estudantes     |
| `POST`   | Cadastrar novo dado     | Cadastrar estudante   |
| `PUT`    | Atualizar dado inteiro  | Editar estudante      |
| `PATCH`  | Atualizar parte do dado | Alterar apenas status |
| `DELETE` | Remover dado            | Remover tarefa        |

Nesta aula, vamos usar:

```text
GET
POST
PUT
DELETE
```

O `PATCH` será apenas explicado conceitualmente.

---

# 6. Módulo 3 — Instalar e configurar o json-server

## Tempo sugerido

30 minutos.

O `json-server` permite criar rapidamente uma API REST fake a partir de um arquivo JSON; na versão atual publicada no npm, o comando simples `npx json-server db.json` inicia o servidor em `localhost:3000` ([npm][3]).

## 6.1 Instalar o json-server

No terminal, dentro da pasta do projeto Angular, execute:

```bash
npm install json-server --save-dev
```

---

## 6.2 Criar o arquivo `db.json`

Na raiz do projeto, no mesmo nível de `package.json`, crie:

```text
db.json
```

A estrutura ficará assim:

```text
aula-angular-tarefas
├── db.json
├── package.json
├── public
└── src
```

---

## 6.3 Inserir dados iniciais no `db.json`

Coloque no arquivo:

```json
{
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
    }
  ],
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
    }
  ]
}
```

## Atenção didática

Explique:

> No TypeScript, a Aula 6 usa `dataEntrega: Date`.

> No JSON, a data fica como string: `"2026-05-20"`.

Por isso, o service de tarefas terá métodos de conversão.

---

## 6.4 Adicionar script no `package.json`

Abra:

```text
package.json
```

Dentro de `"scripts"`, adicione:

```json
"api": "json-server db.json"
```

Ficará parecido com:

```json
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "api": "json-server db.json"
}
```

---

## 6.5 Executar a API fake

Abra um terminal para a API:

```bash
npm run api
```

Resultado esperado:

```text
http://localhost:3000/estudantes
http://localhost:3000/tarefas
```

Agora abra no navegador:

```text
http://localhost:3000/estudantes
```

Deve aparecer um JSON com os estudantes.

Depois abra:

```text
http://localhost:3000/tarefas
```

Deve aparecer um JSON com as tarefas.

---

## 6.6 Executar Angular e API ao mesmo tempo

Explique:

> A partir de agora, serão necessários dois terminais.

Terminal 1:

```bash
npm run api
```

Terminal 2:

```bash
ng serve
```

Ou:

```bash
npx ng serve
```

A aplicação Angular continuará em:

```text
http://localhost:4200
```

A API fake ficará em:

```text
http://localhost:3000
```

---

# 7. Módulo 4 — Configurar HttpClient no Angular

## Tempo sugerido

30 minutos.

O `provideHttpClient()` configura o `HttpClient` para ficar disponível por injeção de dependência na aplicação ([Angular][4]).

Abra:

```text
src/app/app.config.ts
```

Antes, o arquivo provavelmente já tinha `provideRouter`, `provideNativeDateAdapter`, `LOCALE_ID` e `MAT_DATE_LOCALE`, por causa das aulas anteriores.

Atualize mantendo o que já existe e adicionando `provideHttpClient`.

```ts
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter
} from '@angular/material/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
};
```

## Explicação

Explique:

```text
provideRouter(routes)
→ mantém as rotas da aplicação.

provideHttpClient()
→ permite usar HttpClient nos services.

provideNativeDateAdapter()
→ mantém o datepicker funcionando.

LOCALE_ID e MAT_DATE_LOCALE
→ mantêm datas no padrão brasileiro.
```

---
# Refatore os Models

```ts
// src/app/models/estudante.model.ts

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
e 

```ts
// src/app/models/tarefa.model.ts

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

Isso é importante porque vários trechos posteriores dependem diretamente dessa mudança.

---
# Atualize também o TarefaCard

```ts
// src/app/components/tarefa-card/tarefa-card.ts

id = input.required<string>();

editar = output<string>();
remover = output<string>();
```

---

# 8. Módulo 5 — Refatorar o EstudanteService para HTTP

## Tempo sugerido

45 minutos.

Agora vamos transformar o service de estudantes.

Antes:

```text
EstudanteService guardava estudantes em signal local.
```

Agora:

```text
EstudanteService buscará estudantes em http://localhost:3000/estudantes.
```

Mas vamos manter um `signal` interno para que a tela continue lendo:

```ts
estudantes = this.estudanteService.listar();
```

Assim, a página muda pouco.

---

## 8.1 Atualizar `estudante.service.ts`

Abra:

```text
src/app/services/estudante.service.ts
```

Substitua por:

```ts
import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Estudante } from '../models/estudante.model';

@Injectable({
  providedIn: 'root',
})
export class EstudanteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/estudantes';

  private readonly estudantes = signal<Estudante[]>([]);
  private readonly carregando = signal(false);
  private readonly erro = signal<string | null>(null);


  listar(): Signal<Estudante[]> {
    return this.estudantes.asReadonly();
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

    this.http.get<Estudante[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.estudantes.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os estudantes.');
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

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível remover o estudante.');
        this.carregando.set(false);
      }
    });
  }
}
```

---

## 8.2 Explicação didática

Explique:

> O service continua tendo um `signal` com a lista de estudantes, mas agora esse signal é preenchido a partir de uma requisição HTTP.

Mostre:

```ts
private readonly http = inject(HttpClient);
```

Explique:

```text
HttpClient é o serviço do Angular usado para fazer requisições HTTP.
```

Mostre:

```ts
this.http.get<Estudante[]>(this.apiUrl)
```

Explique:

```text
GET busca os estudantes na API.
```

Mostre:

```ts
.subscribe({
  next: ...
  error: ...
});
```

Explique:

```text
next é executado quando a resposta chega com sucesso.
error é executado quando ocorre falha.

No POST, não enviamos id. O json-server gera o id automaticamente como string.
```



---

# 9. Módulo 6 — Atualizar a página Estudantes

## Tempo sugerido

20 minutos.

Agora a página precisa chamar:

```ts
this.estudanteService.carregar();
```

quando for aberta.

---

## 9.1 Atualizar `estudantes.ts`

Abra:

```text
src/app/pages/estudantes/estudantes.ts
```

Subistitua todos os id: number por id: string.

No import do Angular, adicione `OnInit`:

```ts
import { Component, OnInit, inject } from '@angular/core';
```

Depois atualize a classe:

```ts
export class Estudantes implements OnInit {
```

Depois das propriedades já existentes, adicione:

```ts
carregando = this.estudanteService.estaCarregando();
erro = this.estudanteService.mensagemErro();

ngOnInit(): void {
  this.estudanteService.carregar();
}
```

O início da classe ficará parecido com:

```ts
export class Estudantes implements OnInit {
  private readonly estudanteService = inject(EstudanteService);
  private readonly dialog = inject(MatDialog);

  estudantes = this.estudanteService.listar();
  carregando = this.estudanteService.estaCarregando();
  erro = this.estudanteService.mensagemErro();

  idEmEdicao: string | null = null;

  ngOnInit(): void {
    this.estudanteService.carregar();
  }

  // restante do código continua...

  editarEstudante(id: string): void {
    const estudante = this.estudanteService.buscarPorId(id);

    if (estudante) {
      this.idEmEdicao = estudante.id;

      this.formEstudante.setValue({
        nome: estudante.nome,
        email: estudante.email,
        curso: estudante.curso,
        turno: estudante.turno,
        dataIngresso: estudante.dataIngresso
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
      }
    });
  }
}
```

---

## 9.2 Importar spinner do Angular Material

No arquivo:

```text
src/app/pages/estudantes/estudantes.ts
```

Adicione:

```ts
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
```

No array `imports`, adicione:

```ts
MatProgressSpinnerModule
```

O `mat-spinner` representa um indicador circular de carregamento em modo indeterminado; a documentação de Material recomenda que ele tenha um rótulo acessível com `aria-label` ou `aria-labelledby` ([Angular Material][5]).

---

## 9.3 Atualizar `estudantes.html`

Logo depois do parágrafo inicial, adicione:

```html
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
```

O restante do template pode continuar igual.

---

## 9.4 Atualizar `estudantes.css`

Adicione:

```css
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

## 9.5 Simular delay pelo navegador

No Chrome ou Edge:

1. Abra o DevTools com F12.
2. Vá na aba Network ou Rede.
3. Localize a opção No throttling.
4. Escolha 3G ou 4G lenta.
5. Recarregue a página.

Com isso, o trecho abaixo passa a aparecer por mais tempo:

@if (carregando()) {
  <div class="estado-carregamento">
    <mat-spinner diameter="32" aria-label="Carregando estudantes"></mat-spinner>
    <span>Carregando estudantes...</span>
  </div>
}

---

# 10. Módulo 7 — Refatorar o TarefaService para HTTP

## Tempo sugerido

40 minutos.

Agora vamos transformar o service de tarefas.

Aqui há um ponto mais importante que em estudantes:

```text
No Angular:
dataEntrega é Date.

No db.json:
dataEntrega é string.
```

Então criaremos um tipo auxiliar para representar a tarefa como vem da API.

---

## 10.1 Atualizar `tarefa.service.ts`

Abra:

```text
src/app/services/tarefa.service.ts
```

Substitua por:

```ts
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
```

---

## 10.2 Explicação didática

Explique:

> A API trabalha com JSON. JSON não guarda um objeto `Date` do JavaScript. Ele guarda a data como texto.

Mostre:

```ts
type TarefaApi = Omit<Tarefa, 'dataEntrega'> & {
  dataEntrega: string;
};
```

Explique:

```text
O Omit cria uma cópia de um tipo, mas deixando de fora uma propriedade.
Neste caso, pegamos Tarefa sem dataEntrega e depois colocamos dataEntrega novamente como string.


Tarefa
→ usada dentro do Angular
→ dataEntrega: Date

TarefaApi
→ usada na comunicação com a API
→ dataEntrega: string
```

Mostre:

```ts
private converterDaApi(tarefa: TarefaApi): Tarefa {
    return {
      ...tarefa,
      dataEntrega: new Date(tarefa.dataEntrega)
    };
  }
```

Explique:

```text
Quando a tarefa chega da API, convertemos string para Date.
```

Mostre:

```ts
private formatarDataParaApi(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}
```

Explique:

```text
Quando a tarefa vai para a API, convertemos Date para string no formato yyyy-MM-dd.
```

---

# 11. Módulo 8 — Atualizar a página Tarefas

## Tempo sugerido

25 minutos.

Agora a página de tarefas precisa carregar tarefas e estudantes da API.

---

## 11.1 Atualizar `tarefas.ts`

Abra:

```text
src/app/pages/tarefas/tarefas.ts
```

Substitua todos os id: number por id: string

No import do Angular, adicione `OnInit`:

```ts
import { Component, OnInit, computed, inject, signal } from '@angular/core';
```

Atualize a classe:

```ts
export class Tarefas implements OnInit {
```

Depois das propriedades de service, adicione:

```ts
carregandoTarefas = this.tarefaService.estaCarregando();
erroTarefas = this.tarefaService.mensagemErro();

carregandoEstudantes = this.estudanteService.estaCarregando();
erroEstudantes = this.estudanteService.mensagemErro();

ngOnInit(): void {
  this.estudanteService.carregar();
  this.tarefaService.carregar();
}
```

O início da classe ficará parecido com:

```ts
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common'; // 🔥 NOVO
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EstudanteService } from '../../services/estudante.service';

import { PrioridadeTarefa, StatusTarefa } from '../../models/tarefa.model';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { TarefaService } from '../../services/tarefa.service';
import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';


@Component({
  selector: 'app-tarefas',
  imports: [
    FormsModule,
    KeyValuePipe,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    TarefaCard
  ],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css',
})
export class Tarefas implements OnInit {
  private readonly tarefaService = inject(TarefaService);
  private readonly dialog = inject(MatDialog);
  private readonly estudanteService = inject(EstudanteService);

  novoEstudanteId: string | null = null;
  tarefas = this.tarefaService.listar();
  estudantes = this.estudanteService.listar();

  novoNome = '';
  novoStatus: StatusTarefa = 'pendente';
  novaPrioridade: PrioridadeTarefa = 'media';
  novaDataEntrega: Date | null = null;

  idEmEdicao: string | null = null;
  filtroSelecionado = signal<'todas' | 'pendente' | 'concluida' | 'alta'>('todas');
  estudanteSelecionadoId = signal<string | null>(null);

  carregandoTarefas = this.tarefaService.estaCarregando();
  erroTarefas = this.tarefaService.mensagemErro();

  carregandoEstudantes = this.estudanteService.estaCarregando();
  erroEstudantes = this.estudanteService.mensagemErro();

  totalTarefas = computed(() => this.tarefas().length);

  totalPendentes = computed(() =>
    this.tarefas().filter(t => t.status === 'pendente').length
  );

  totalConcluidas = computed(() =>
    this.tarefas().filter(t => t.status === 'concluida').length
  );

  totalAlta = computed(() =>
    this.tarefas().filter(t => t.prioridade === 'alta').length
  );

  tarefasPorEstudante = computed(() => {
    const mapa: Record<string, number> = {};

    this.estudantes().forEach(estudante => {
      mapa[estudante.nome] = this.tarefas().filter(
        tarefa => tarefa.estudanteId === estudante.id
      ).length;
    });

    return mapa;
  });

  tarefasFiltradas = computed(() => {
    let lista = this.tarefas();

    // filtro por estudante
    if (this.estudanteSelecionadoId() !== null) {
      lista = lista.filter(
        tarefa => tarefa.estudanteId === this.estudanteSelecionadoId()
      );
    }

    // filtro geral
    switch (this.filtroSelecionado()) {
      case 'pendente':
        return lista.filter(t => t.status === 'pendente');

      case 'concluida':
        return lista.filter(t => t.status === 'concluida');

      case 'alta':
        return lista.filter(t => t.prioridade === 'alta');

      default:
        return lista;
    }
  });

  ngOnInit(): void {
    this.estudanteService.carregar();
    this.tarefaService.carregar();
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
      dataEntrega: this.novaDataEntrega
    };

    if (this.idEmEdicao === null) {
      this.tarefaService.cadastrar(dadosFormulario);
    } else {
      this.tarefaService.editar(this.idEmEdicao, dadosFormulario);
    }

    this.limparFormulario();
  }

  buscarNomeEstudante(id: string): string {
    const estudante = this.estudanteService.buscarPorId(id);
    return estudante ? estudante.nome : 'Não encontrado';
  }

  editarTarefaPorId(id: string): void {
    const tarefa = this.tarefaService.buscarPorId(id);

    if (tarefa) {
      this.idEmEdicao = tarefa.id;
      this.novoNome = tarefa.nome;
      this.novoStatus = tarefa.status;
      this.novaPrioridade = tarefa.prioridade;
      this.novoEstudanteId = tarefa.estudanteId;
      this.novaDataEntrega = tarefa.dataEntrega ? new Date(tarefa.dataEntrega) : null;
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

---

## 11.2 Importar spinner

No arquivo:

```text
src/app/pages/tarefas/tarefas.ts
```

Adicione:

```ts
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
```

No array `imports`, adicione:

```ts
MatProgressSpinnerModule
```

---

## 11.3 Atualizar `tarefas.html`

Logo depois do parágrafo inicial, adicione:

```html
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
```

---

## 11.4 Atualizar `tarefas.css`

Adicione:

```css
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

---

# 12. Módulo 9 — Ajustar relatório carregado com `@defer`

## Tempo sugerido

15 minutos.

O componente:

```text
components/relatorio-estudos
```

também usa:

```text
TarefaService
EstudanteService
```

Na Aula 6, ele lia os dados locais já existentes no service. Agora, como os dados vêm da API, precisamos garantir que ele carregue os dados quando for exibido.

---

## 12.1 Atualizar `relatorio-estudos.ts`

Abra:

```text
src/app/components/relatorio-estudos/relatorio-estudos.ts
```

No import do Angular, adicione `OnInit`:

```ts
import { Component, OnInit, computed, inject } from '@angular/core';
```

Atualize a classe:

```ts
export class RelatorioEstudos implements OnInit {
```

Adicione:

```ts
ngOnInit(): void {
  this.estudanteService.carregar();
  this.tarefaService.carregar();
}
```

O início ficará assim:

```ts
export class RelatorioEstudos implements OnInit {
  private readonly tarefaService = inject(TarefaService);
  private readonly estudanteService = inject(EstudanteService);

  tarefas = this.tarefaService.listar();
  estudantes = this.estudanteService.listar();

  ngOnInit(): void {
    this.estudanteService.carregar();
    this.tarefaService.carregar();
  }

  // restante dos computed continua...
}
```

## Observação didática

Explique:

> O relatório continua usando `computed`, mas os dados que alimentam os signals agora chegam por HTTP.

---

# 13. Módulo 10 — Conferir a página Relatórios

## Tempo sugerido

10 minutos.

Na Aula 6, a página de relatórios passou a usar algo parecido com:

```html
@defer {
  <app-relatorio-estudos />
} @placeholder {
  <p>Relatório disponível para carregamento.</p>
} @loading {
  <p>Carregando relatório...</p>
} @error {
  <p>Erro ao carregar relatório.</p>
}
```

Mantenha esse trecho.

Explique:

```text
@defer
→ carrega o componente de relatório sob demanda.

RelatorioEstudos
→ ao iniciar, carrega dados da API.

computed
→ recalcula os totais quando os dados chegam.
```

---

# 14. Módulo 11 — Testes da Aula 7

## Tempo sugerido

25 minutos.

## 14.1 Verificar se a API está rodando

No navegador, abra:

```text
http://localhost:3000/estudantes
```

Resultado esperado:

```text
Lista de estudantes em JSON.
```

Abra:

```text
http://localhost:3000/tarefas
```

Resultado esperado:

```text
Lista de tarefas em JSON.
```

---

## 14.2 Verificar se o Angular está rodando

Abra:

```text
http://localhost:4200
```

Resultado esperado:

```text
Gerenciador de Estudos abre normalmente.
```

---

## 14.3 Testar página Estudantes

Acesse:

```text
http://localhost:4200/estudantes
```

Teste:

```text
Listar estudantes
Cadastrar estudante
Editar estudante
Remover estudante
```

Depois abra o arquivo:

```text
db.json
```

Resultado esperado:

```text
As alterações aparecem no arquivo db.json.
```

---

## 14.4 Testar página Tarefas

Acesse:

```text
http://localhost:4200/tarefas
```

Teste:

```text
Listar tarefas
Cadastrar tarefa com estudante responsável
Selecionar data de entrega
Editar tarefa
Remover tarefa
Filtrar por estudante
Filtrar por status
Filtrar por prioridade
Ver indicadores
```

Depois confira:

```text
db.json
```

Resultado esperado:

```text
As tarefas cadastradas, editadas ou removidas aparecem no arquivo.
```

---

## 14.5 Testar página Relatórios

Acesse:

```text
http://localhost:4200/relatorios
```

Resultado esperado:

```text
Relatório carregado sob demanda com dados vindos da API.
```

---

# 15. Problemas comuns e correções

## Problema 1 — `NullInjectorError: No provider for HttpClient`

Causa:

```text
Faltou configurar provideHttpClient().
```

Correção em:

```text
src/app/app.config.ts
```

```ts
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};
```

---

## Problema 2 — Erro de conexão com `localhost:3000`

Causa:

```text
O json-server não está rodando.
```

Correção:

```bash
npm run api
```

---

## Problema 3 — A aplicação abre, mas a lista fica vazia

Possíveis causas:

```text
A API não está rodando
O endpoint está errado
O db.json está mal formatado
O service não chamou carregar()
```

Verifique:

```ts
ngOnInit(): void {
  this.estudanteService.carregar();
  this.tarefaService.carregar();
}
```

---

## Problema 4 — Data aparece como inválida

Causa:

```text
A API retorna data como string.
```

Correção:

```ts
dataEntrega: new Date(tarefa.dataEntrega)
```

---

## Problema 5 — Alteração não aparece no `db.json`

Causas possíveis:

```text
Foi usado apenas signal local
A requisição POST/PUT/DELETE falhou
O json-server não está rodando
O endpoint está errado
```

Confira se o service está usando:

```ts
this.http.post(...)
this.http.put(...)
this.http.delete(...)
```

---

## Problema 6 — Cadastro funciona, mas relatório não atualiza

Causa provável:

```text
O relatório não carregou dados da API.
```

Correção em `relatorio-estudos.ts`:

```ts
ngOnInit(): void {
  this.estudanteService.carregar();
  this.tarefaService.carregar();
}
```

---

# 16. Atividade prática em sala

## Proposta

Faça as seguintes melhorias no sistema:

```text
1. Adicione um botão "Recarregar dados" na página de estudantes.
2. Adicione um botão "Recarregar dados" na página de tarefas.
3. Exiba uma mensagem quando a API estiver indisponível.
4. Teste o que acontece ao desligar o json-server.
5. Cadastre pelo menos 3 estudantes novos.
6. Cadastre pelo menos 5 tarefas vinculadas aos estudantes.
7. Confira se tudo foi salvo no db.json.
```

---

## Exemplo — Botão Recarregar em Estudantes

Em:

```text
src/app/pages/estudantes/estudantes.ts
```

Adicione:

```ts
recarregarDados(): void {
  this.estudanteService.carregar();
}
```

Em:

```text
src/app/pages/estudantes/estudantes.html
```

Adicione abaixo do parágrafo inicial:

```html
<button
  mat-raised-button
  color="primary"
  type="button"
  (click)="recarregarDados()"
>
  Recarregar estudantes
</button>
```

---

## Exemplo — Botão Recarregar em Tarefas

Em:

```text
src/app/pages/tarefas/tarefas.ts
```

Adicione:

```ts
recarregarDados(): void {
  this.estudanteService.carregar();
  this.tarefaService.carregar();
}
```

Em:

```text
src/app/pages/tarefas/tarefas.html
```

Adicione abaixo do parágrafo inicial:

```html
<button
  mat-raised-button
  color="primary"
  type="button"
  (click)="recarregarDados()"
>
  Recarregar dados
</button>
```

---

# 17. Perguntas para fixação

1. O que é uma API REST?
2. O que é um endpoint?
3. Qual a diferença entre `GET` e `POST`?
4. Qual a diferença entre `PUT` e `PATCH`?
5. Para que serve o `DELETE`?
6. O que é JSON?
7. Para que serve o `json-server`?
8. Por que precisamos executar Angular e json-server ao mesmo tempo?
9. Para que serve o `HttpClient`?
10. Onde configuramos o `provideHttpClient()`?
11. Por que usamos `subscribe()`?
12. O que significa o bloco `next` no `subscribe()`?
13. O que significa o bloco `error` no `subscribe()`?
14. Por que a data da tarefa precisa ser convertida?
15. O que mudou no `TarefaService` em relação à Aula 6?
16. O que mudou no `EstudanteService` em relação à Aula 4?
17. O que continua sendo responsabilidade da página?
18. O que continua sendo responsabilidade do service?
19. Por que mantivemos signals nos services?
20. Como verificar se os dados foram persistidos?

---

# 18. Fechamento didático

Finalize a aula explicando:

```text
Até a Aula 6, os dados existiam apenas dentro da aplicação Angular.

Na Aula 7, os dados passaram a existir fora da aplicação, em uma API REST fake.

Isso aproxima o projeto de um sistema real, porque agora o frontend conversa com um backend, mesmo que simulado.
```

Resumo da evolução:

```text
Aula 1 → fundamentos, signals e componentes
Aula 2 → rotas, layout e modelos
Aula 3 → CRUD local de tarefas
Aula 4 → CRUD local de estudantes
Aula 5 → relacionamento estudante-tarefa
Aula 6 → pipes, imagens, datepicker e @defer
Aula 7 → API REST fake com json-server e HttpClient
```

Frase final para os alunos:

> “A partir de agora, o Gerenciador de Estudos deixa de ser apenas uma aplicação com dados locais e passa a se comportar como um frontend que consome uma API.”

---

# 19. Produto final da Aula 7

```text
Gerenciador de Estudos
├── Estudantes consumidos de /estudantes
├── Tarefas consumidas de /tarefas
├── Cadastro via POST
├── Edição via PUT
├── Remoção via DELETE
├── Listagem via GET
├── Estado de carregamento
├── Tratamento de erro
├── Dados persistidos no db.json
└── Interface mantendo signals, Material, pipes, filtros e relatórios
```

Resultado esperado:

```text
Dados persistidos no json-server e consumidos via HttpClient.
```

[1]: https://angular.dev/guide/http?utm_source=chatgpt.com "HTTP Client • Overview"
[2]: https://angular.dev/guide/http/making-requests?utm_source=chatgpt.com "Making HTTP requests"
[3]: https://www.npmjs.com/package/json-server?utm_source=chatgpt.com "json-server"
[4]: https://angular.dev/api/common/http/provideHttpClient?utm_source=chatgpt.com "provideHttpClient"
[5]: https://v9.material.angular.dev/docs-content/overviews/material/progress-spinner/progress-spinner?utm_source=chatgpt.com "Progress mode"

