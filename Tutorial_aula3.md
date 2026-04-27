# Aula 3 — CRUD de tarefas com Forms, Outputs e Validação

## Tema

Criar a funcionalidade completa da página `/tarefas`, com **CRUD local**, **service com signal**, **formulário template-driven**, **validação visual** e **comunicação entre componente pai e componente filho**.

---

## Objetivo da aula

Construir o CRUD de tarefas dentro da página `/tarefas`, aproveitando a estrutura criada na Aula 2 e mantendo a continuidade com os recursos trabalhados na Aula 1.

Ao final da aula, o aluno deverá conseguir:

* mover o componente `TarefaCard` para a pasta `components`;
* atualizar imports após a movimentação de arquivos;
* criar um `TarefaService`;
* armazenar a lista de tarefas em um `signal`;
* expor a lista como somente leitura com `asReadonly()`;
* cadastrar tarefa;
* editar tarefa;
* cancelar edição;
* remover tarefa;
* criar formulário com `FormsModule`, `ngModel` e `ngSubmit`;
* validar formulário com `ngForm`, `ngModel`, `required`, `minlength` e `mat-error`;
* usar `input()` para enviar dados da página para o card;
* usar `output()` para emitir eventos do card para a página;
* usar `inject()` para injeção moderna de dependência.

---

# 1. Duração da aula

**4 horas**

|       Tempo | Etapa       | Atividade                                                            |
| ----------: | ----------- | -------------------------------------------------------------------- |
| 0h00 – 0h20 | Revisão     | Retomar Aula 1 e Aula 2                                              |
| 0h20 – 0h45 | Refatoração | Mover `TarefaCard` para `components`                                 |
| 0h45 – 1h20 | Service     | Criar `TarefaService` com `signal`                                   |
| 1h20 – 2h10 | Formulário  | Criar formulário com `FormsModule`, `ngModel` e `ngSubmit`           |
| 2h10 – 2h40 | Validação   | Adicionar `required`, `minlength`, `ngForm`, `ngModel` e `mat-error` |
| 2h40 – 3h20 | Outputs     | Adicionar botões Editar e Remover no `TarefaCard`                    |
| 3h20 – 3h50 | Integração  | Conectar página, service e componente filho                          |
| 3h50 – 4h00 | Fechamento  | Testes, revisão e desafios                                           |

---

# 2. Resultado esperado da aula

Ao final da Aula 3, a aplicação deverá ter a seguinte estrutura principal:

```text
src/app
├── components
│   └── tarefa-card
│       ├── tarefa-card.ts
│       ├── tarefa-card.html
│       └── tarefa-card.css
├── models
│   └── tarefa.model.ts
├── pages
│   └── tarefas
│       ├── tarefas.ts
│       ├── tarefas.html
│       └── tarefas.css
├── services
│   └── tarefa.ts
├── app.ts
├── app.html
├── app.css
└── app.routes.ts
```

A página `/tarefas` deverá permitir:

```text
Cadastrar tarefa
Listar tarefas
Editar tarefa
Cancelar edição
Remover tarefa
Validar campos obrigatórios
Validar tamanho mínimo
Desabilitar envio inválido
Exibir tarefas com TarefaCard
Emitir eventos do TarefaCard para a página Tarefas
```

---

# 3. Módulo 1 — Revisão inicial

## Tempo sugerido

20 minutos.

## Explicação para iniciar a aula

Explique aos alunos:

> Na Aula 1, criamos uma lista de tarefas diretamente no componente principal da aplicação. Usamos signals, computed, eventos, `@for`, `@if` e um componente filho chamado `TarefaCard`.

Depois:

> Na Aula 2, reorganizamos a aplicação. O componente `App` deixou de ser a tela principal da lista de tarefas e passou a ser o layout geral do sistema, com menu lateral, toolbar e `router-outlet`.

Agora:

> Na Aula 3, vamos transformar a página `/tarefas` em uma funcionalidade real, com service, formulário, validação, edição, remoção e comunicação entre componente pai e filho.

Mostre a evolução:

```text
Aula 1
App controlava diretamente a lista de tarefas.

Aula 2
App virou layout.
Tarefas virou uma página.
Foram criadas pastas como pages, components, services e models.

Aula 3
A página /tarefas terá CRUD local com service, signal, formulário e output.
```

---

# 4. Módulo 2 — Mover o TarefaCard para components

## Tempo sugerido

25 minutos.

Na Aula 1, o `TarefaCard` foi criado em:

```text
src/app/tarefa-card
```

Na Aula 2, criamos a pasta:

```text
src/app/components
```

Agora vamos mover o componente para essa pasta, deixando a estrutura mais organizada.

---

## Passo 1 — Conferir a estrutura atual

Antes da movimentação, o projeto deve estar parecido com isto:

```text
src/app
├── tarefa-card
│   ├── tarefa-card.ts
│   ├── tarefa-card.html
│   └── tarefa-card.css
├── pages
├── components
├── services
├── models
└── app.ts
```

---

## Passo 2 — Mover a pasta

No terminal, dentro da pasta do projeto, execute:

```bash
mv src/app/tarefa-card src/app/components/tarefa-card
```

No Windows PowerShell:

```powershell
Move-Item src/app/tarefa-card src/app/components/tarefa-card
```

Também é possível fazer pelo VS Code:

1. Abrir a pasta `src/app`.
2. Arrastar a pasta `tarefa-card`.
3. Soltar dentro de `src/app/components`.

Depois da movimentação, a estrutura ficará assim:

```text
src/app
├── components
│   └── tarefa-card
│       ├── tarefa-card.ts
│       ├── tarefa-card.html
│       └── tarefa-card.css
├── pages
├── services
├── models
└── app.ts
```

---

## Passo 3 — Remover imports antigos no `app.ts`

Na Aula 1, o `App` importava o `TarefaCard` assim:

```ts
import { TarefaCard } from './tarefa-card/tarefa-card';
```

Mas, na Aula 2, o `App` virou o layout principal da aplicação. Então ele não deve mais importar diretamente o `TarefaCard`, pois quem usará esse componente agora será a página `Tarefas`.

Se ainda existir no `app.ts`, remova:

```ts
import { TarefaCard } from './tarefa-card/tarefa-card';
```

E remova também `TarefaCard` do array `imports`.

O `App` deve continuar responsável apenas pelo layout com menu lateral, toolbar e `router-outlet`.

---

# 5. Módulo 3 — Conferir o modelo de tarefa

## Tempo sugerido

10 minutos.

Abra:

```text
src/app/models/tarefa.model.ts
```

O conteúdo deve ser:

```ts
export type StatusTarefa = 'pendente' | 'em andamento' | 'concluida';

export type PrioridadeTarefa = 'baixa' | 'media' | 'alta';

export type Tarefa = {
  id: number;
  nome: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
};
```

## Explicação

Explique que o modelo define quais dados uma tarefa possui.

O campo `status` só aceita:

```ts
'pendente'
'em andamento'
'concluida'
```

O campo `prioridade` só aceita:

```ts
'baixa'
'media'
'alta'
```

Por isso, este objeto é válido:

```ts
const tarefa: Tarefa = {
  id: 1,
  nome: 'Estudar rotas',
  status: 'pendente',
  prioridade: 'alta'
};
```

Mas este objeto está errado:

```ts
const tarefa: Tarefa = {
  id: 1,
  nome: 'Estudar rotas',
  status: 'finalizada',
  prioridade: 'alta'
};
```

Porque:

```ts
'finalizada'
```

não pertence ao tipo:

```ts
StatusTarefa
```

---

# 6. Módulo 4 — Criar o service de tarefas com signal

## Tempo sugerido

35 minutos.

Agora vamos mover a responsabilidade da lista de tarefas para um service.

Na Aula 2, a página `Tarefas` tinha uma lista local com `signal<Tarefa[]>`.

Agora, a lista ficará em:

```text
src/app/services/tarefa.ts
```

---

## Passo 1 — Criar o service

No terminal:

```bash
ng generate service services/tarefa.service --skip-tests
```

Ou:

```bash
ng g s services/tarefa.service --skip-tests
```

Dependendo da versão do Angular CLI, o arquivo pode ser criado como:

```text
src/app/services/tarefa.ts
```

ou:

```text
src/app/services/tarefa.service.ts
```

Neste tutorial, vamos usar:

```text
src/app/services/tarefa.ts
```

Se o seu projeto gerar `tarefa.service.ts`, basta ajustar o caminho do import depois.

---

## Passo 2 — Implementar o `TarefaService`

Abra:

```text
src/app/services/tarefa.service.ts
```

Substitua o conteúdo por:

```ts
import { Injectable, Signal, signal } from '@angular/core';

import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly tarefas = signal<Tarefa[]>([
    {
      id: 1,
      nome: 'Reestruturar aplicação Angular',
      status: 'pendente',
      prioridade: 'alta'
    },
    {
      id: 2,
      nome: 'Criar menu lateral',
      status: 'em andamento',
      prioridade: 'media'
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
      nome: tarefa.nome,
      status: tarefa.status,
      prioridade: tarefa.prioridade
    };

    this.tarefas.update(listaAtual => [
      ...listaAtual,
      novaTarefa
    ]);

    this.proximoId++;
  }

  editar(id: number, tarefaAtualizada: Omit<Tarefa, 'id'>): void {
    this.tarefas.update(listaAtual =>
      listaAtual.map(tarefa =>
        tarefa.id === id
          ? {
            id,
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
```

---

## Explicação didática

Na Aula 1, os alunos viram uma lista assim:

```ts
tarefas = signal<Tarefa[]>([]);
```

Agora a lista continua sendo `signal`, mas fica dentro de um service:

```ts
private readonly tarefas = signal<Tarefa[]>([]);
```

A palavra `private` significa que a lista só pode ser alterada dentro do próprio service.

A palavra `readonly` indica que a referência dessa propriedade não será trocada por outra.

A página acessa a lista por este método:

```ts
listar(): Signal<Tarefa[]> {
  return this.tarefas.asReadonly();
}
```

O `asReadonly()` retorna uma versão somente leitura do signal. Pela documentação do Angular, um readonly signal pode ser lido, mas não pode ser alterado com `set` ou `update` fora do local onde o signal gravável foi criado. ([Angular][2])

A página não poderá fazer isso:

```ts
this.tarefas.update(...)
```

Ela precisará chamar métodos do service:

```ts
this.tarefaService.cadastrar(...)
this.tarefaService.editar(...)
this.tarefaService.remover(...)
```

Essa separação é importante porque:

```text
Página → cuida da interface
Service → cuida dos dados e regras de alteração
```

---

# 7. Módulo 5 — Atualizar a página de tarefas

## Tempo sugerido

50 minutos.

Abra:

```text
src/app/pages/tarefas/tarefas.ts
```

Na Aula 2, esse arquivo provavelmente tinha uma lista local assim:

```ts
tarefas = signal<Tarefa[]>([
  ...
]);
```

Agora vamos remover essa lista local e usar o `TarefaService`.

---

## Código completo de `tarefas.ts`

```ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  PrioridadeTarefa,
  StatusTarefa
} from '../../models/tarefa.model';

import { TarefaService } from '../../services/tarefa.service';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';

@Component({
  selector: 'app-tarefas',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TarefaCard
  ],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css'
})
export class Tarefas {
  private readonly tarefaService = inject(TarefaService);

  tarefas = this.tarefaService.listar();

  novoNome = '';
  novoStatus: StatusTarefa = 'pendente';
  novaPrioridade: PrioridadeTarefa = 'media';

  idEmEdicao: number | null = null;

  salvarFormulario(): void {
    const dadosFormulario = {
      nome: this.novoNome,
      status: this.novoStatus,
      prioridade: this.novaPrioridade
    };

    if (this.idEmEdicao === null) {
      this.tarefaService.cadastrar(dadosFormulario);
    } else {
      this.tarefaService.editar(this.idEmEdicao, dadosFormulario);
    }

    this.limparFormulario();
  }

  editarTarefaPorId(id: number): void {
    const tarefa = this.tarefaService.buscarPorId(id);

    if (tarefa) {
      this.idEmEdicao = tarefa.id;
      this.novoNome = tarefa.nome;
      this.novoStatus = tarefa.status;
      this.novaPrioridade = tarefa.prioridade;
    }
  }

  removerTarefa(id: number): void {
    this.tarefaService.remover(id);

    if (this.idEmEdicao === id) {
      this.limparFormulario();
    }
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  private limparFormulario(): void {
    this.idEmEdicao = null;
    this.novoNome = '';
    this.novoStatus = 'pendente';
    this.novaPrioridade = 'media';
  }
}
```

---

## Explicação sobre `inject()`

A forma tradicional seria:

```ts
constructor(private tarefaService: TarefaService) {}
```

Nesta aula, vamos usar a forma moderna:

```ts
private readonly tarefaService = inject(TarefaService);
```

A documentação oficial informa que `inject()` pode ser usado em inicializadores de campos de classes criadas pelo sistema de injeção do Angular, como componentes e services. ([Angular][3])

Explique aos alunos:

> O `inject()` permite obter uma dependência diretamente em uma propriedade da classe. Assim, não precisamos criar um construtor apenas para injetar um service.

---

## Atenção ao import do service

Se o arquivo criado foi:

```text
src/app/services/tarefa.ts
```

use:

```ts
import { TarefaService } from '../../services/tarefa';
```

Se o arquivo criado foi:

```text
src/app/services/tarefa.service.ts
```

use:

```ts
import { TarefaService } from '../../services/tarefa.service';
```

---

## Atenção ao import do TarefaCard

Como movemos o card para `components`, o import correto é:

```ts
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
```

Não use mais:

```ts
import { TarefaCard } from '../../tarefa-card/tarefa-card';
```

Esse era o caminho antigo da Aula 1.

---

# 8. Módulo 6 — Criar o formulário com Template-driven Forms

## Tempo sugerido

45 minutos.

Abra:

```text
src/app/pages/tarefas/tarefas.html
```

Substitua o conteúdo por:

```html
<h1>Tarefas</h1>

<p>
  Cadastre, edite e remova tarefas de estudo.
</p>

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

<section class="lista-tarefas">
  <h2>Tarefas cadastradas</h2>

  @if (tarefas().length === 0) {
    <p>Nenhuma tarefa cadastrada.</p>
  } @else {
    @for (tarefa of tarefas(); track tarefa.id) {
      <app-tarefa-card
        [id]="tarefa.id"
        [nome]="tarefa.nome"
        [status]="tarefa.status"
        [prioridade]="tarefa.prioridade"
        (editar)="editarTarefaPorId($event)"
        (remover)="removerTarefa($event)"
      />
    }
  }
</section>
```

---

## Explicação do formulário

A linha:

```html
<form #formTarefa="ngForm" (ngSubmit)="salvarFormulario()">
```

cria uma referência ao formulário.

Com isso, conseguimos verificar se o formulário está inválido:

```html
formTarefa.invalid
```

O botão usa:

```html
[disabled]="formTarefa.invalid"
```

Assim, enquanto houver erro no formulário, o botão permanece desabilitado.

O `ngModel` liga o campo HTML à propriedade TypeScript:

```html
[(ngModel)]="novoNome"
```

A documentação de formulários template-driven do Angular apresenta esse modelo como uma abordagem na qual a estrutura do formulário é conduzida principalmente pelo template, usando diretivas como `ngModel`. ([Angular][4])

---

## Por que os campos do formulário não são signals?

Nesta aula, a lista de tarefas é o estado principal da funcionalidade. Por isso, ela fica como `signal` no service.

Já os campos do formulário ficam como propriedades simples:

```ts
novoNome = '';
novoStatus: StatusTarefa = 'pendente';
novaPrioridade: PrioridadeTarefa = 'media';
```

Isso facilita o uso de:

```html
[(ngModel)]
```

A divisão didática fica clara:

```text
Lista de tarefas → signal no service
Campos do formulário → propriedades simples com ngModel
```

---

# 9. Módulo 7 — Estilizar a página de tarefas

## Tempo sugerido

15 minutos.

Abra:

```text
src/app/pages/tarefas/tarefas.css
```

Substitua ou complemente com:

```css
.formulario-card {
  margin-bottom: 24px;
  padding: 8px;
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
}

.lista-tarefas {
  margin-top: 24px;
}

.lista-tarefas h2 {
  margin-bottom: 16px;
}
```

---

# 10. Módulo 8 — Atualizar o TarefaCard com input e output

## Tempo sugerido

40 minutos.

Agora vamos editar o componente que foi movido para:

```text
src/app/components/tarefa-card
```

Antes, ele apenas exibia dados.

Agora, ele terá:

```text
TarefaCard
├── Exibe nome da tarefa
├── Exibe status
├── Exibe prioridade
├── Botão Editar
└── Botão Remover
```

---

## Atualizar `tarefa-card.ts`

Abra:

```text
src/app/components/tarefa-card/tarefa-card.ts
```

Substitua por:

```ts
import { Component, input, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {
  PrioridadeTarefa,
  StatusTarefa
} from '../../models/tarefa.model';

@Component({
  selector: 'app-tarefa-card',
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css'
})
export class TarefaCard {
  id = input.required<number>();
  nome = input.required<string>();
  status = input<StatusTarefa>('pendente');
  prioridade = input.required<PrioridadeTarefa>();

  editar = output<number>();
  remover = output<number>();

  aoClicarEditar(): void {
    this.editar.emit(this.id());
  }

  aoClicarRemover(): void {
    this.remover.emit(this.id());
  }
}
```

---

## Explicação sobre `input()`

Os dados entram no componente filho por meio de `input()`:

```ts
nome = input.required<string>();
```

A página pai envia os dados assim:

```html
<app-tarefa-card
  [nome]="tarefa.nome"
/>
```

Como o `input()` funciona como signal, no HTML do componente filho a leitura será:

```html
{{ nome() }}
```

---

## Explicação sobre `output()`

Os eventos saem do componente filho por meio de `output()`:

```ts
editar = output<number>();
remover = output<number>();
```

Quando o usuário clica em **Editar**, o componente filho emite o id da tarefa:

```ts
this.editar.emit(this.id());
```

A página pai escuta esse evento:

```html
(editar)="editarTarefaPorId($event)"
```

A documentação atual do Angular explica que `output()` cria eventos customizados de componentes e que o valor emitido pode ser acessado no template do pai por meio de `$event`. ([Angular][5])

---

# 11. Atualizar o HTML do TarefaCard

Abra:

```text
src/app/components/tarefa-card/tarefa-card.html
```

Substitua por:

```html
<mat-card class="tarefa-card">
  <mat-card-header>
    <mat-card-title>{{ nome() }}</mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <p>
      <strong>Status:</strong>
      @if (status() === 'pendente') {
        Pendente
      } @else if (status() === 'em andamento') {
        Em andamento
      } @else {
        Concluída
      }
    </p>

    <p>
      <strong>Prioridade:</strong>
      @if (prioridade() === 'baixa') {
        Baixa
      } @else if (prioridade() === 'media') {
        Média
      } @else {
        Alta
      }
    </p>
  </mat-card-content>

  <mat-card-actions>
    <button
      mat-button
      color="primary"
      type="button"
      (click)="aoClicarEditar()"
    >
      Editar
    </button>

    <button
      mat-button
      color="warn"
      type="button"
      (click)="aoClicarRemover()"
    >
      Remover
    </button>
  </mat-card-actions>
</mat-card>
```

---

## Explicação importante

Como estamos usando `input()`, as propriedades do card são lidas como signals.

Correto:

```html
{{ nome() }}
```

Errado:

```html
{{ nome }}
```

O mesmo vale para:

```html
status()
prioridade()
id()
```

---

# 12. Atualizar o CSS do TarefaCard

Abra:

```text
src/app/components/tarefa-card/tarefa-card.css
```

Substitua por:

```css
.tarefa-card {
  margin-bottom: 12px;
  background-color: #f8f9ff;
}

mat-card-actions {
  display: flex;
  gap: 8px;
}
```

---

# 13. Módulo 9 — Testar a integração

## Tempo sugerido

30 minutos.

Execute:

```bash
ng serve
```

Acesse:

```text
http://localhost:4200/tarefas
```

---

## Teste 1 — Rota `/tarefas`

Resultado esperado:

A página de tarefas abre dentro do layout criado na Aula 2.

Deve aparecer:

```text
Tarefas
Cadastre, edite e remova tarefas de estudo.
```

---

## Teste 2 — Tarefas iniciais

Devem aparecer as tarefas iniciais vindas do service:

```text
Reestruturar aplicação Angular
Criar menu lateral
```

---

## Teste 3 — Cadastro

Preencha:

```text
Nome: Criar formulário de tarefas
Status: Pendente
Prioridade: Alta
```

Clique em:

```text
Cadastrar
```

Resultado esperado:

A nova tarefa aparece imediatamente na lista.

Isso acontece porque a lista está em um `signal` e foi atualizada com:

```ts
this.tarefas.update(...)
```

---

## Teste 4 — Campo obrigatório

Apague o campo nome.

Resultado esperado:

```text
O nome da tarefa é obrigatório.
```

O botão deve ficar desabilitado.

---

## Teste 5 — Tamanho mínimo

Digite:

```text
AB
```

Resultado esperado:

```text
O nome deve ter pelo menos 3 caracteres.
```

---

## Teste 6 — Edição

Clique em **Editar** em uma tarefa.

Resultado esperado:

Os dados da tarefa aparecem no formulário.

O título muda de:

```text
Nova tarefa
```

para:

```text
Editar tarefa
```

O botão muda de:

```text
Cadastrar
```

para:

```text
Salvar alterações
```

---

## Teste 7 — Cancelar edição

Clique em:

```text
Cancelar edição
```

Resultado esperado:

O formulário volta para o modo de cadastro.

---

## Teste 8 — Remover tarefa

Clique em **Remover**.

Resultado esperado:

A tarefa desaparece da lista.

---

# 14. Problemas comuns e correções

## Problema 1 — Import antigo do TarefaCard

Erro provável:

```text
Cannot find module '../../tarefa-card/tarefa-card'
```

Causa:

O componente foi movido para `components`, mas o import antigo ainda está sendo usado.

Errado:

```ts
import { TarefaCard } from '../../tarefa-card/tarefa-card';
```

Correto:

```ts
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
```

---

## Problema 2 — Erro com `ngModel`

Erro provável:

```text
Can't bind to 'ngModel' since it isn't a known property
```

Causa:

Faltou importar `FormsModule`.

Correção em `tarefas.ts`:

```ts
import { FormsModule } from '@angular/forms';
```

E no array `imports`:

```ts
imports: [
  FormsModule
]
```

---

## Problema 3 — Erro com Angular Material

Erro provável:

```text
'mat-form-field' is not a known element
```

Causa:

Faltou importar os módulos do Angular Material.

Correção:

```ts
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
```

E no array `imports`:

```ts
imports: [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule
]
```

---

## Problema 4 — Esquecer os parênteses do signal

Errado:

```html
@for (tarefa of tarefas; track tarefa.id) {
```

Correto:

```html
@for (tarefa of tarefas(); track tarefa.id) {
```

Como `tarefas` é um signal, precisa ser lido assim:

```ts
tarefas()
```

---

## Problema 5 — Usar valor fora do tipo

Errado:

```ts
status: 'Concluída'
```

Correto:

```ts
status: 'concluida'
```

No HTML, podemos exibir um texto mais amigável:

```html
<mat-option value="concluida">Concluída</mat-option>
```

Ou seja:

```text
Valor interno: concluida
Texto exibido: Concluída
```

---

## Problema 6 — Chamar `inject()` dentro de método

Evite fazer isso:

```ts
salvarFormulario(): void {
  const tarefaService = inject(TarefaService);
}
```

A forma correta nesta aula é:

```ts
private readonly tarefaService = inject(TarefaService);
```

O `inject()` deve ser usado em um contexto de injeção válido, como inicializador de campo da classe do componente. ([Angular][3])

---

# 15. Atividade prática em sala

Depois da implementação guiada, proponha as seguintes melhorias.

---

## Atividade 1 — Confirmar antes de remover


# 1. Criar o componente de diálogo

No terminal:

```bash
ng generate component components/confirmacao-dialog --skip-tests
```

Ou:

```bash
ng g c components/confirmacao-dialog --skip-tests
```

Será criado:

```text
src/app/components/confirmacao-dialog/
├── confirmacao-dialog.ts
├── confirmacao-dialog.html
└── confirmacao-dialog.css
```

---

# 2. Código do diálogo

Abra:

```text
src/app/components/confirmacao-dialog/confirmacao-dialog.ts
```

Coloque:

```ts
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmacao-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './confirmacao-dialog.html',
  styleUrl: './confirmacao-dialog.css'
})
export class ConfirmacaoDialog {}
```

---

# 3. HTML do diálogo

Abra:

```text
src/app/components/confirmacao-dialog/confirmacao-dialog.html
```

Coloque:

```html
<h2 mat-dialog-title>Confirmar remoção</h2>

<mat-dialog-content>
  <p>Deseja realmente remover esta tarefa?</p>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button
    mat-button
    type="button"
    mat-dialog-close="false"
  >
    Cancelar
  </button>

  <button
    mat-raised-button
    color="warn"
    type="button"
    mat-dialog-close="true"
  >
    Remover
  </button>
</mat-dialog-actions>
```

Aqui, o botão **Cancelar** fecha o diálogo retornando `false`.

O botão **Remover** fecha o diálogo retornando `true`.

---

# 4. Atualizar a página `tarefas.ts`

Agora, na página de tarefas, importe o `MatDialog` e o componente de diálogo.

Abra:

```text
src/app/pages/tarefas/tarefas.ts
```

Adicione os imports:

```ts
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';
```

No array `imports`, adicione:

```ts
MatDialogModule
```

Depois, injete o diálogo com `inject()`:

```ts
private readonly dialog = inject(MatDialog);
```

O trecho principal ficará assim:

```ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  PrioridadeTarefa,
  StatusTarefa
} from '../../models/tarefa.model';

import { TarefaService } from '../../services/tarefa';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';

@Component({
  selector: 'app-tarefas',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TarefaCard
  ],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css'
})
export class Tarefas {
  private readonly tarefaService = inject(TarefaService);
  private readonly dialog = inject(MatDialog);

  tarefas = this.tarefaService.listar();

  novoNome = '';
  novoStatus: StatusTarefa = 'pendente';
  novaPrioridade: PrioridadeTarefa = 'media';

  idEmEdicao: number | null = null;

  salvarFormulario(): void {
    const dadosFormulario = {
      nome: this.novoNome,
      status: this.novoStatus,
      prioridade: this.novaPrioridade
    };

    if (this.idEmEdicao === null) {
      this.tarefaService.cadastrar(dadosFormulario);
    } else {
      this.tarefaService.editar(this.idEmEdicao, dadosFormulario);
    }

    this.limparFormulario();
  }

  editarTarefaPorId(id: number): void {
    const tarefa = this.tarefaService.buscarPorId(id);

    if (tarefa) {
      this.idEmEdicao = tarefa.id;
      this.novoNome = tarefa.nome;
      this.novoStatus = tarefa.status;
      this.novaPrioridade = tarefa.prioridade;
    }
  }

  /*novo*/
  removerTarefa(id: number): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog);

    dialogRef.afterClosed().subscribe((confirmou: string | undefined) => {
      if (confirmou === 'true') {
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
  }
}
```

---

# 5. Observação importante sobre `mat-dialog-close`

No exemplo acima, usamos:

```html
mat-dialog-close="true"
```

e:

```html
mat-dialog-close="false"
```

Isso retorna strings: `'true'` ou `'false'`.

Por isso, no TypeScript, verificamos:

```ts
if (confirmou === 'true') {
  // remove
}
```

---

# 6. Forma melhor: retornar booleano verdadeiro

Uma versão mais adequada é usar property binding:

```html
[mat-dialog-close]="true"
```

e:

```html
[mat-dialog-close]="false"
```

Então o HTML do diálogo ficaria assim:

```html
<h2 mat-dialog-title>Confirmar remoção</h2>

<mat-dialog-content>
  <p>Deseja realmente remover esta tarefa?</p>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button
    mat-button
    type="button"
    [mat-dialog-close]="false"
  >
    Cancelar
  </button>

  <button
    mat-raised-button
    color="warn"
    type="button"
    [mat-dialog-close]="true"
  >
    Remover
  </button>
</mat-dialog-actions>
```

E o método `removerTarefa` fica mais limpo:

```ts
removerTarefa(id: number): void {
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
```

---

# 7. Trecho final recomendado para o tutorial

Substitua a atividade com `confirm()` por esta versão:

```ts
removerTarefa(id: number): void {
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
```

E no diálogo use:

```html
<button
  mat-button
  type="button"
  [mat-dialog-close]="false"
>
  Cancelar
</button>

<button
  mat-raised-button
  color="warn"
  type="button"
  [mat-dialog-close]="true"
>
  Remover
</button>
```

Assim a Aula 3 fica mais alinhada ao Angular Material e evita o `confirm()` nativo do navegador.
---

## Atividade 2 — Melhorar a mensagem de lista vazia

Alterar:

```html
<p>Nenhuma tarefa cadastrada.</p>
```

Para:

```html
<p>
  Nenhuma tarefa cadastrada. Use o formulário acima para adicionar sua primeira tarefa.
</p>
```

---


# 16. Desafio para casa

Adicionar o campo:

```ts
dataEntrega: string;
```

O aluno deverá atualizar:

```text
src/app/models/tarefa.model.ts
src/app/services/tarefa.ts
src/app/pages/tarefas/tarefas.ts
src/app/pages/tarefas/tarefas.html
src/app/components/tarefa-card/tarefa-card.ts
src/app/components/tarefa-card/tarefa-card.html
```

Também deverá validar se a data foi preenchida.

---

# 17. Fechamento da aula

Finalize com esta síntese:

> Na Aula 1, criamos uma aplicação simples com lista de tarefas, signals e componente filho. Na Aula 2, reorganizamos a aplicação em páginas, rotas, layout, modelos e pastas. Na Aula 3, movemos o `TarefaCard` para `components` e transformamos a página `/tarefas` em um CRUD local com service, signal, formulário, validação e comunicação por output.

---

# 18. Resumo dos conceitos trabalhados

| Conceito       | Uso na Aula 3                               |
| -------------- | ------------------------------------------- |
| Refatoração    | Mover `TarefaCard` para `components`        |
| `signal`       | Guardar a lista de tarefas no service       |
| `asReadonly()` | Expor a lista sem permitir alteração direta |
| `update()`     | Cadastrar, editar e remover tarefas         |
| `inject()`     | Injetar o `TarefaService` sem construtor    |
| `FormsModule`  | Habilitar formulários template-driven       |
| `ngModel`      | Ligar campos do formulário ao TypeScript    |
| `ngForm`       | Verificar validade do formulário            |
| `ngSubmit`     | Enviar o formulário                         |
| `mat-error`    | Exibir mensagens de validação               |
| `input()`      | Enviar dados da página para o card          |
| `output()`     | Enviar eventos do card para a página        |
| `$event`       | Receber o id emitido pelo componente filho  |
| `@for`         | Listar tarefas                              |
| `@if`          | Exibir condições no template                |

---

# 19. Fluxo final da Aula 3

```text
1. Revisar Aula 1 e Aula 2.
2. Mover src/app/tarefa-card para src/app/components/tarefa-card.
3. Remover imports antigos do App.
4. Conferir o modelo Tarefa.
5. Criar TarefaService.
6. Colocar a lista de tarefas como signal no service.
7. Expor a lista com asReadonly().
8. Criar métodos listar, buscarPorId, cadastrar, editar e remover.
9. Atualizar a página /tarefas para usar inject().
10. Criar formulário com ngForm, ngModel e ngSubmit.
11. Adicionar validação com required, minlength e mat-error.
12. Atualizar TarefaCard com inputs e outputs.
13. Adicionar botões Editar e Remover ao card.
14. Integrar eventos do card com métodos da página.
15. Testar cadastro, edição, cancelamento e remoção.
```

Essa é a versão consolidada e coerente com o que foi construído nas Aulas 1 e 2.

[1]: https://angular.dev/guide/signals?utm_source=chatgpt.com "Signals • Overview"
[2]: https://angular.dev/api/core/WritableSignal?utm_source=chatgpt.com "WritableSignal"
[3]: https://angular.dev/api/core/inject?utm_source=chatgpt.com "inject"
[4]: https://angular.dev/guide/forms/template-driven-forms?utm_source=chatgpt.com "Template-driven forms"
[5]: https://angular.dev/guide/components/outputs?utm_source=chatgpt.com "Custom events with outputs"
