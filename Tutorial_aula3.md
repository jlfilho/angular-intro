# Aula 3 — Outputs, validação e melhoria da componentização

## Tema

Melhorar a comunicação entre componentes e validar o formulário de tarefas.

## Objetivo geral

Ao final da aula, o aluno deverá compreender como um componente filho pode enviar eventos para um componente pai usando `output()` e como validar formulários orientados por template com `ngModel`.

A documentação atual do Angular apresenta os componentes como blocos fundamentais de uma aplicação, permitindo dividir a interface em partes menores, reutilizáveis e com responsabilidades claras. Também apresenta `input()` para receber dados e `output()` para emitir eventos para componentes pais. ([Angular][1])

---

# 1. Contexto da Aula 3

Nas aulas anteriores, a aplicação evoluiu para um CRUD local de tarefas.

Atualmente, a aplicação já possui:

```text
src/app/app.ts
src/app/app.html
src/app/app.css

src/app/tarefa.ts
src/app/tarefa.model.ts

src/app/tarefa-card/tarefa-card.ts
src/app/tarefa-card/tarefa-card.html
src/app/tarefa-card/tarefa-card.css
```

Na Aula 2, o componente `tarefa-card` apenas exibia os dados da tarefa:

```text
nome
status
prioridade
```

Os botões **Editar** e **Remover** estavam no componente pai, dentro de `app.html`.

Nesta Aula 3, vamos melhorar isso.

O componente filho `tarefa-card` passará a ter seus próprios botões:

```text
TarefaCard
├── Exibe tarefa
├── Botão Editar
└── Botão Remover
```

Mas o componente filho **não vai editar nem remover diretamente**. Ele apenas vai avisar o componente pai que o usuário clicou em uma ação.

---

# 2. Resultado esperado da aula

Ao final da aula, a aplicação terá:

* componente `tarefa-card` com botões próprios;
* comunicação filho → pai usando `output()`;
* evento de edição emitido pelo componente filho;
* evento de remoção emitido pelo componente filho;
* formulário validado com `ngModel`;
* campo obrigatório;
* tamanho mínimo para o nome da tarefa;
* mensagens de erro;
* botão de envio desabilitado quando o formulário estiver inválido.

---

# 3. Organização da aula de 4 horas

| Tempo       | Etapa      | Conteúdo                              |
| ----------- | ---------- | ------------------------------------- |
| 0h00 – 0h20 | Revisão    | Revisar aplicação da Aula 2           |
| 0h20 – 1h10 | Módulo 1   | `input()` x `output()`                |
| 1h10 – 1h50 | Módulo 2   | Transferir botões para `tarefa-card`  |
| 1h50 – 2h00 | Intervalo  | Pausa                                 |
| 2h00 – 3h00 | Módulo 3   | Validação com `ngModel`               |
| 3h00 – 3h40 | Módulo 4   | Melhorias visuais e mensagens de erro |
| 3h40 – 4h00 | Fechamento | Revisão e desafio prático             |

---

# 4. Ponto de partida

Entre na pasta do projeto:

```bash
cd aula-angular-tarefas
```

Execute:

```bash
ng serve
```

Abra no navegador:

```text
http://localhost:4200
```

---

# Módulo 1 — Entendendo `input()` e `output()`

## Tempo sugerido

**50 minutos**

## Objetivo

Entender a diferença entre dados que entram em um componente e eventos que saem dele.

---

## 1.1 Revisão do `input()`

Na Aula 1 e na Aula 2, usamos `input()` no componente `tarefa-card`.

Abra:

```text
src/app/tarefa-card/tarefa-card.ts
```

O componente provavelmente está parecido com este:

```ts
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tarefa-card',
  imports: [MatCardModule],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css'
})
export class TarefaCard {
  nome = input.required<string>();
  status = input('pendente');
  prioridade = input('média');
}
```

O `input()` permite que o componente pai envie dados para o componente filho. A documentação oficial explica que inputs são propriedades que permitem passar dados para componentes, e que podem ser lidas no template como signals quando usamos a API baseada em `input()`. ([Angular][2])

Exemplo no componente pai:

```html
<app-tarefa-card
  [nome]="tarefa.nome"
  [status]="tarefa.status"
  [prioridade]="tarefa.prioridade" />
```

Fluxo:

```text
App → TarefaCard
```

Ou seja:

```text
Pai envia dados para o filho.
```

---

## 1.2 Agora entra o `output()`

O `output()` faz o caminho inverso.

Ele permite que o componente filho envie um evento para o componente pai.

A documentação atual do Angular define `output()` como uma função usada para declarar saídas em componentes e diretivas; essas saídas podem emitir valores para componentes pais, que escutam os eventos usando binding no template. ([Angular][3])

Fluxo:

```text
TarefaCard → App
```

Ou seja:

```text
Filho avisa o pai que algo aconteceu.
```

Exemplo conceitual:

```ts
remover = output<number>();
```

O componente filho pode emitir:

```ts
this.remover.emit(1);
```

O componente pai pode escutar:

```html
<app-tarefa-card (remover)="removerTarefa($event)" />
```

---

## 1.3 Diferença principal

Explique aos alunos:

```text
input  → o pai envia dados para o filho
output → o filho envia eventos para o pai
```

Exemplo prático na nossa aplicação:

```text
input:
App envia nome, status e prioridade para TarefaCard.

output:
TarefaCard avisa App que o usuário clicou em Editar ou Remover.
```

---

# Módulo 2 — Transferir botões para o componente `tarefa-card`

## Tempo sugerido

**40 minutos**

## Objetivo

Melhorar a componentização, movendo os botões **Editar** e **Remover** para dentro do componente `tarefa-card`.

---

## 2.1 Atualizar o componente `tarefa-card.ts`

Abra:

```text
src/app/tarefa-card/tarefa-card.ts
```

Substitua o conteúdo por:

```ts
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tarefa-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css'
})
export class TarefaCard {
  id = input.required<number>();
  nome = input.required<string>();
  status = input('pendente');
  prioridade = input('média');

  editar = output<number>();
  remover = output<number>();

  aoEditar() {
    this.editar.emit(this.id());
  }

  aoRemover() {
    this.remover.emit(this.id());
  }
}
```

## Explicação

Agora o componente recebe também o `id` da tarefa:

```ts
id = input.required<number>();
```

Isso é necessário porque, ao clicar em **Editar** ou **Remover**, o componente filho precisa informar ao pai qual tarefa foi escolhida.

Criamos dois outputs:

```ts
editar = output<number>();
remover = output<number>();
```

Eles emitem um número, que será o `id` da tarefa.

Quando clicar em editar:

```ts
aoEditar() {
  this.editar.emit(this.id());
}
```

Quando clicar em remover:

```ts
aoRemover() {
  this.remover.emit(this.id());
}
```

---

## 2.2 Atualizar o template `tarefa-card.html`

Abra:

```text
src/app/tarefa-card/tarefa-card.html
```

Substitua por:

```html
<mat-card class="card">
  <mat-card-title>{{ nome() }}</mat-card-title>

  <mat-card-content>
    <p>Status: {{ status() }}</p>
    <p>Prioridade: {{ prioridade() }}</p>
  </mat-card-content>

  <mat-card-actions class="acoes-card">
    <button mat-button type="button" (click)="aoEditar()">
      Editar
    </button>

    <button mat-button type="button" (click)="aoRemover()">
      Remover
    </button>
  </mat-card-actions>
</mat-card>
```

## Explicação

Agora os botões estão dentro do próprio card da tarefa.

Antes:

```text
App tinha os botões Editar e Remover.
```

Agora:

```text
TarefaCard tem os botões Editar e Remover.
```

Mas a lógica de editar e remover ainda continua no componente pai.

---

## 2.3 Atualizar o estilo do card

Abra:

```text
src/app/tarefa-card/tarefa-card.css
```

Substitua por:

```css
.card {
  width: 100%;
}

.acoes-card {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
```

---

## 2.4 Atualizar o `app.html`

Agora vamos remover os botões que estavam no componente pai.

Abra:

```text
src/app/app.html
```

Procure esta parte da listagem, que provavelmente está assim:

```html
<div class="item-lista">
  <app-tarefa-card
    [nome]="tarefa.nome"
    [status]="tarefa.status"
    [prioridade]="tarefa.prioridade" />

  <div class="botoes-item">
    <button mat-button type="button" (click)="editarTarefa(tarefa)">
      Editar
    </button>

    <button mat-button type="button" (click)="removerTarefa(tarefa.id)">
      Remover
    </button>
  </div>
</div>
```

Substitua por:

```html
<div class="item-lista">
  <app-tarefa-card
    [id]="tarefa.id"
    [nome]="tarefa.nome"
    [status]="tarefa.status"
    [prioridade]="tarefa.prioridade"
    (editar)="editarTarefaPorId($event)"
    (remover)="removerTarefa($event)" />
</div>
```

## Explicação

Agora passamos o `id` da tarefa para o componente filho:

```html
[id]="tarefa.id"
```

E escutamos os eventos emitidos pelo filho:

```html
(editar)="editarTarefaPorId($event)"
```

```html
(remover)="removerTarefa($event)"
```

O `$event` representa o valor enviado pelo componente filho. Neste caso, será o `id` da tarefa.

---

## 2.5 Atualizar o `app.ts`

Abra:

```text
src/app/app.ts
```

Na Aula 2, provavelmente havia um método assim:

```ts
editarTarefa(tarefa: Tarefa) {
  this.tarefaEmEdicaoId = tarefa.id;
  this.novoNome = tarefa.nome;
  this.novoStatus = tarefa.status;
  this.novaPrioridade = tarefa.prioridade;
}
```

Vamos manter esse método, mas criar outro para editar por `id`.

Adicione este método:

```ts
editarTarefaPorId(id: number) {
  const tarefa = this.tarefaService.buscarPorId(id);

  if (!tarefa) {
    return;
  }

  this.editarTarefa(tarefa);
}
```

Com isso, quando o `tarefa-card` emitir o `id`, o componente pai buscará a tarefa e chamará o método de edição.

---

# Módulo 3 — Validação com `ngModel`

## Tempo sugerido

**1 hora**

## Objetivo

Validar o formulário de tarefas com campos obrigatórios, tamanho mínimo e mensagens de erro.

Na Aula 2 usamos `[(ngModel)]` para ligação bidirecional. A documentação oficial explica que, em formulários orientados por template, o `NgModel` cria e gerencia o controle do formulário, e que é possível exportar o `NgModel` para uma variável local do template para verificar estados como válido, inválido, tocado ou alterado. ([Angular][4])

---

## 3.1 Atualizar o formulário com referência local

No `app.html`, encontre:

```html
<form (ngSubmit)="salvarFormulario()">
```

Substitua por:

```html
<form #formTarefa="ngForm" (ngSubmit)="salvarFormulario()">
```

## Explicação

Agora o formulário tem uma referência chamada:

```html
#formTarefa="ngForm"
```

Ela permite verificar se o formulário está válido ou inválido.

Exemplo:

```html
[disabled]="formTarefa.invalid"
```

---

## 3.2 Validar o campo nome

Procure o campo de nome da tarefa:

```html
<input
  matInput
  name="nome"
  type="text"
  [(ngModel)]="novoNome"
  placeholder="Ex.: Estudar Angular Material"
  required>
```

Substitua por:

```html
<input
  matInput
  name="nome"
  type="text"
  [(ngModel)]="novoNome"
  placeholder="Ex.: Estudar Angular Material"
  required
  minlength="3"
  #nome="ngModel">
```

## Explicação

Adicionamos:

```html
required
```

O campo passa a ser obrigatório.

Adicionamos:

```html
minlength="3"
```

O campo precisa ter pelo menos 3 caracteres.

Adicionamos:

```html
#nome="ngModel"
```

Isso permite acessar o estado do campo no template.

A documentação oficial do Angular informa que o `required` adiciona um validador obrigatório ao controle marcado com esse atributo. ([Angular][5])

---

## 3.3 Adicionar mensagens de erro do nome

Logo abaixo do `input`, dentro do mesmo `mat-form-field`, adicione:

```html
@if (nome.invalid && nome.touched) {
  @if (nome.errors?.['required']) {
    <mat-error>O nome da tarefa é obrigatório.</mat-error>
  }

  @if (nome.errors?.['minlength']) {
    <mat-error>O nome deve ter pelo menos 3 caracteres.</mat-error>
  }
}
```

O trecho completo ficará assim:

```html
<mat-form-field appearance="outline" class="campo-completo">
  <mat-label>Nome da tarefa</mat-label>

  <input
    matInput
    name="nome"
    type="text"
    [(ngModel)]="novoNome"
    placeholder="Ex.: Estudar Angular Material"
    required
    minlength="3"
    #nome="ngModel">

  @if (nome.invalid && nome.touched) {
    @if (nome.errors?.['required']) {
      <mat-error>O nome da tarefa é obrigatório.</mat-error>
    }

    @if (nome.errors?.['minlength']) {
      <mat-error>O nome deve ter pelo menos 3 caracteres.</mat-error>
    }
  }
</mat-form-field>
```

---

## 3.4 Validar o campo status

Procure o campo de status:

```html
<mat-select
  name="status"
  [(ngModel)]="novoStatus">
```

Substitua por:

```html
<mat-select
  name="status"
  [(ngModel)]="novoStatus"
  required
  #status="ngModel">
```

Agora adicione mensagem de erro logo abaixo do `mat-select`:

```html
@if (status.invalid && status.touched) {
  <mat-error>Selecione um status.</mat-error>
}
```

O trecho completo ficará:

```html
<mat-form-field appearance="outline" class="campo-completo">
  <mat-label>Status</mat-label>

  <mat-select
    name="status"
    [(ngModel)]="novoStatus"
    required
    #status="ngModel">
    <mat-option value="pendente">Pendente</mat-option>
    <mat-option value="em andamento">Em andamento</mat-option>
    <mat-option value="concluída">Concluída</mat-option>
  </mat-select>

  @if (status.invalid && status.touched) {
    <mat-error>Selecione um status.</mat-error>
  }
</mat-form-field>
```

---

## 3.5 Validar o campo prioridade

Procure o campo de prioridade:

```html
<mat-select
  name="prioridade"
  [(ngModel)]="novaPrioridade">
```

Substitua por:

```html
<mat-select
  name="prioridade"
  [(ngModel)]="novaPrioridade"
  required
  #prioridade="ngModel">
```

Adicione:

```html
@if (prioridade.invalid && prioridade.touched) {
  <mat-error>Selecione uma prioridade.</mat-error>
}
```

O trecho completo ficará:

```html
<mat-form-field appearance="outline" class="campo-completo">
  <mat-label>Prioridade</mat-label>

  <mat-select
    name="prioridade"
    [(ngModel)]="novaPrioridade"
    required
    #prioridade="ngModel">
    <mat-option value="baixa">Baixa</mat-option>
    <mat-option value="média">Média</mat-option>
    <mat-option value="alta">Alta</mat-option>
  </mat-select>

  @if (prioridade.invalid && prioridade.touched) {
    <mat-error>Selecione uma prioridade.</mat-error>
  }
</mat-form-field>
```

---

## 3.6 Desabilitar o botão quando o formulário estiver inválido

Procure o botão de envio:

```html
<button mat-raised-button color="primary" type="submit">
```

Substitua por:

```html
<button
  mat-raised-button
  color="primary"
  type="submit"
  [disabled]="formTarefa.invalid">
```

O trecho completo ficará:

```html
<button
  mat-raised-button
  color="primary"
  type="submit"
  [disabled]="formTarefa.invalid">
  @if (tarefaEmEdicaoId === null) {
    Cadastrar tarefa
  } @else {
    Salvar alteração
  }
</button>
```

## Explicação

Enquanto o formulário estiver inválido, o botão ficará desabilitado.

```html
[disabled]="formTarefa.invalid"
```

---

# Módulo 4 — Melhorias finais e código completo

## Tempo sugerido

**40 minutos**

Agora vamos organizar o código final da aula.

---

# Código final esperado da Aula 3

## 1. `src/app/tarefa-card/tarefa-card.ts`

```ts
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tarefa-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css'
})
export class TarefaCard {
  id = input.required<number>();
  nome = input.required<string>();
  status = input('pendente');
  prioridade = input('média');

  editar = output<number>();
  remover = output<number>();

  aoEditar() {
    this.editar.emit(this.id());
  }

  aoRemover() {
    this.remover.emit(this.id());
  }
}
```

---

## 2. `src/app/tarefa-card/tarefa-card.html`

```html
<mat-card class="card">
  <mat-card-title>{{ nome() }}</mat-card-title>

  <mat-card-content>
    <p>Status: {{ status() }}</p>
    <p>Prioridade: {{ prioridade() }}</p>
  </mat-card-content>

  <mat-card-actions class="acoes-card">
    <button mat-button type="button" (click)="aoEditar()">
      Editar
    </button>

    <button mat-button type="button" (click)="aoRemover()">
      Remover
    </button>
  </mat-card-actions>
</mat-card>
```

---

## 3. `src/app/tarefa-card/tarefa-card.css`

```css
.card {
  width: 100%;
}

.acoes-card {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
```

---

## 4. `src/app/app.ts`

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { TarefaCard } from './tarefa-card/tarefa-card';
import { TarefaService } from './tarefa';
import { Tarefa } from './tarefa.model';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TarefaCard
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private tarefaService = inject(TarefaService);

  title = signal('Lista de Tarefas de Estudo');

  estudante = signal('Ana');
  curso = signal('Angular básico');
  turno = signal('Noite');

  imagemAngular = 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif';

  tarefas = this.tarefaService.tarefas;

  novoNome = '';
  novoStatus = 'pendente';
  novaPrioridade = 'média';

  tarefaEmEdicaoId: number | null = null;

  quantidadeTarefas = computed(() => this.tarefas().length);

  mensagemResumo = computed(() => {
    return `${this.estudante()} possui ${this.quantidadeTarefas()} tarefa(s) cadastrada(s).`;
  });

  salvarFormulario() {
    if (this.tarefaEmEdicaoId === null) {
      this.cadastrarTarefa();
    } else {
      this.salvarEdicao();
    }
  }

  cadastrarTarefa() {
    if (this.novoNome.trim().length < 3) {
      return;
    }

    this.tarefaService.cadastrar({
      nome: this.novoNome,
      status: this.novoStatus,
      prioridade: this.novaPrioridade
    });

    this.limparFormulario();
  }

  editarTarefaPorId(id: number) {
    const tarefa = this.tarefaService.buscarPorId(id);

    if (!tarefa) {
      return;
    }

    this.editarTarefa(tarefa);
  }

  editarTarefa(tarefa: Tarefa) {
    this.tarefaEmEdicaoId = tarefa.id;
    this.novoNome = tarefa.nome;
    this.novoStatus = tarefa.status;
    this.novaPrioridade = tarefa.prioridade;
  }

  salvarEdicao() {
    if (this.tarefaEmEdicaoId === null) {
      return;
    }

    if (this.novoNome.trim().length < 3) {
      return;
    }

    const tarefaAtualizada: Tarefa = {
      id: this.tarefaEmEdicaoId,
      nome: this.novoNome,
      status: this.novoStatus,
      prioridade: this.novaPrioridade
    };

    this.tarefaService.atualizar(tarefaAtualizada);

    this.limparFormulario();
  }

  removerTarefa(id: number) {
    this.tarefaService.remover(id);
  }

  limparFormulario() {
    this.novoNome = '';
    this.novoStatus = 'pendente';
    this.novaPrioridade = 'média';
    this.tarefaEmEdicaoId = null;
  }
}
```

---

## 5. `src/app/app.html`

```html
<mat-toolbar color="primary" class="toolbar">
  <span>{{ title() }}</span>
</mat-toolbar>

<main class="container">
  <mat-card class="header">
    <mat-card-title>Resumo da aplicação</mat-card-title>

    <mat-card-content>
      <img [src]="imagemAngular" alt="Logo do Angular" width="80">

      <p>Estudante: {{ estudante() }}</p>
      <p>Curso: {{ curso() }}</p>
      <p>Turno: {{ turno() }}</p>

      <p>Quantidade de tarefas: {{ quantidadeTarefas() }}</p>

      <p>{{ mensagemResumo() }}</p>
    </mat-card-content>
  </mat-card>

  <mat-card class="formulario">
    <mat-card-title>
      @if (tarefaEmEdicaoId === null) {
        Nova tarefa
      } @else {
        Editar tarefa
      }
    </mat-card-title>

    <mat-card-content>
      <form #formTarefa="ngForm" (ngSubmit)="salvarFormulario()">
        <mat-form-field appearance="outline" class="campo-completo">
          <mat-label>Nome da tarefa</mat-label>

          <input
            matInput
            name="nome"
            type="text"
            [(ngModel)]="novoNome"
            placeholder="Ex.: Estudar Angular Material"
            required
            minlength="3"
            #nome="ngModel">

          @if (nome.invalid && nome.touched) {
            @if (nome.errors?.['required']) {
              <mat-error>O nome da tarefa é obrigatório.</mat-error>
            }

            @if (nome.errors?.['minlength']) {
              <mat-error>O nome deve ter pelo menos 3 caracteres.</mat-error>
            }
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="campo-completo">
          <mat-label>Status</mat-label>

          <mat-select
            name="status"
            [(ngModel)]="novoStatus"
            required
            #status="ngModel">
            <mat-option value="pendente">Pendente</mat-option>
            <mat-option value="em andamento">Em andamento</mat-option>
            <mat-option value="concluída">Concluída</mat-option>
          </mat-select>

          @if (status.invalid && status.touched) {
            <mat-error>Selecione um status.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="campo-completo">
          <mat-label>Prioridade</mat-label>

          <mat-select
            name="prioridade"
            [(ngModel)]="novaPrioridade"
            required
            #prioridade="ngModel">
            <mat-option value="baixa">Baixa</mat-option>
            <mat-option value="média">Média</mat-option>
            <mat-option value="alta">Alta</mat-option>
          </mat-select>

          @if (prioridade.invalid && prioridade.touched) {
            <mat-error>Selecione uma prioridade.</mat-error>
          }
        </mat-form-field>

        <div class="acoes-formulario">
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="formTarefa.invalid">
            @if (tarefaEmEdicaoId === null) {
              Cadastrar tarefa
            } @else {
              Salvar alteração
            }
          </button>

          @if (tarefaEmEdicaoId !== null) {
            <button mat-button type="button" (click)="limparFormulario()">
              Cancelar edição
            </button>
          }
        </div>
      </form>
    </mat-card-content>
  </mat-card>

  <section class="lista">
    <h2>Tarefas cadastradas</h2>

    @if (tarefas().length > 0) {
      @for (tarefa of tarefas(); track tarefa.id) {
        <div class="item-lista">
          <app-tarefa-card
            [id]="tarefa.id"
            [nome]="tarefa.nome"
            [status]="tarefa.status"
            [prioridade]="tarefa.prioridade"
            (editar)="editarTarefaPorId($event)"
            (remover)="removerTarefa($event)" />
        </div>
      }
    } @else {
      <p>Nenhuma tarefa cadastrada.</p>
    }
  </section>
</main>
```

---

## 6. `src/app/app.css`

Se o seu arquivo já tem os estilos da Aula 2, apenas ajuste ou confirme que ele está assim:

```css
.toolbar {
  display: flex;
  justify-content: center;
  min-height: 64px;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(40, 80, 160, 0.18);
}

.toolbar span {
  text-align: center;
}

.container {
  max-width: 900px;
  margin: 32px auto;
  padding: 0 24px 24px;
}

.header {
  margin-bottom: 20px;
}

.formulario {
  margin-bottom: 24px;
}

.campo-completo {
  width: 100%;
  margin-bottom: 12px;
}

.acoes-formulario {
  display: flex;
  gap: 12px;
  align-items: center;
}

.lista {
  margin-top: 24px;
}

.item-lista {
  margin-bottom: 12px;
}
```

Como os botões agora estão dentro do `tarefa-card`, não precisamos mais de:

```css
.botoes-item {
  display: flex;
  gap: 8px;
}
```

---

# 5. Testes práticos em sala

## Teste 1 — Cadastrar tarefa válida

Preencha:

```text
Nome: Estudar outputs
Status: Pendente
Prioridade: Alta
```

Clique em:

```text
Cadastrar tarefa
```

Resultado esperado:

```text
A tarefa aparece na lista.
```

---

## Teste 2 — Tentar cadastrar nome vazio

Apague o nome da tarefa.

Resultado esperado:

```text
O botão deve ficar desabilitado.
```

Ao tocar no campo e sair dele, deve aparecer:

```text
O nome da tarefa é obrigatório.
```

---

## Teste 3 — Tentar cadastrar nome com menos de 3 caracteres

Digite:

```text
JS
```

Resultado esperado:

```text
O nome deve ter pelo menos 3 caracteres.
```

---

## Teste 4 — Editar tarefa

Clique em **Editar** dentro do card.

Resultado esperado:

```text
Os dados da tarefa aparecem no formulário.
O título muda para Editar tarefa.
O botão muda para Salvar alteração.
```

---

## Teste 5 — Remover tarefa

Clique em **Remover** dentro do card.

Resultado esperado:

```text
A tarefa é removida da lista.
```

---

# 6. Pontos principais para explicar aos alunos

## 6.1 O que mudou na arquitetura?

Antes:

```text
App
├── formulário
├── lista
├── botões editar/remover
└── tarefa-card apenas exibe dados
```

Agora:

```text
App
├── formulário
├── lista
└── tarefa-card
    ├── exibe dados
    ├── botão editar
    └── botão remover
```

O componente pai continua tendo a regra de negócio.

O componente filho apenas emite eventos.

---

## 6.2 Por que isso melhora a componentização?

Porque o `tarefa-card` fica responsável pela interface de uma tarefa.

Ele sabe como exibir uma tarefa e quais ações aparecem visualmente.

Mas ele não decide como editar ou remover.

Essa decisão continua no componente pai.

---

## 6.3 Qual a diferença entre `input` e `output`?

```text
input:
Recebe dados do componente pai.

output:
Envia eventos para o componente pai.
```

Na aplicação:

```text
App envia dados da tarefa para TarefaCard com input.
TarefaCard avisa App sobre editar/remover com output.
```

---

## 6.4 O que é `$event`?

É o valor emitido pelo output.

No filho:

```ts
this.remover.emit(this.id());
```

No pai:

```html
(remover)="removerTarefa($event)"
```

Nesse caso, `$event` é o `id` da tarefa.

---

## 6.5 O que é validação com `ngModel`?

É a verificação do estado de um campo do formulário.

Exemplo:

```html
#nome="ngModel"
```

Permite acessar:

```text
nome.valid
nome.invalid
nome.touched
nome.errors
```

---

# 7. Atividade final da Aula 3

Peça aos alunos para implementar pelo menos **duas melhorias**:

1. Adicionar mensagem de erro quando o nome tiver mais de 50 caracteres.
2. Adicionar campo “descrição” com validação de tamanho mínimo.
3. Adicionar confirmação antes de remover tarefa.
4. Adicionar uma cor ou rótulo visual para prioridade alta.
5. Adicionar um output chamado `concluir`, para marcar tarefa como concluída.
6. Criar uma mensagem quando o formulário estiver em modo edição.
7. Impedir que duas tarefas com o mesmo nome sejam cadastradas.

---

# 8. Fechamento da aula

Ao final, retome:

```text
input envia dados do pai para o filho.
output envia eventos do filho para o pai.
$event carrega o valor emitido.
ngModel pode ser usado para validar campos.
required torna o campo obrigatório.
minlength define tamanho mínimo.
formTarefa.invalid permite bloquear o envio.
```

Resultado final da Aula 3:

```text
CRUD de tarefas com componente filho mais organizado e formulário validado.
```

A aplicação agora está melhor preparada para a próxima etapa do curso: **roteamento, páginas e menu lateral com Angular Material**.

[1]: https://v18.angular.dev/essentials/components/?utm_source=chatgpt.com "Composing with Components"
[2]: https://angular.dev/guide/components/inputs?utm_source=chatgpt.com "Accepting data with input properties"
[3]: https://angular.dev/api/core/output?utm_source=chatgpt.com "output"
[4]: https://angular.dev/guide/forms?utm_source=chatgpt.com "Forms • Overview"
[5]: https://angular.dev/api/forms/RequiredValidator?utm_source=chatgpt.com "RequiredValidator"
