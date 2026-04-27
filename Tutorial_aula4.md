# Aula 4 — CRUD de estudantes com Reactive Forms

## Tema

Criar a página de estudantes usando **Reactive Forms**.

## Objetivo

Trabalhar uma segunda entidade do sistema **Gerenciador de Estudos**, usando uma abordagem mais robusta de formulários.

Ao final da aula, o aluno deverá conseguir:

* atualizar o modelo `Estudante`;
* criar um `EstudanteService`;
* armazenar a lista de estudantes em um `signal`;
* expor a lista com `asReadonly()`;
* criar formulário reativo com `ReactiveFormsModule`;
* usar `FormGroup`, `FormControl` e `Validators`;
* validar campos no TypeScript;
* exibir mensagens de erro no template com `mat-error`;
* cadastrar estudante;
* editar estudante;
* cancelar edição;
* remover estudante;
* listar estudantes na página `/estudantes`;
* comparar, de forma introdutória, template-driven forms e reactive forms.

---

# 1. Duração da aula

**4 horas**

|       Tempo | Etapa          | Atividade                                                        |
| ----------: | -------------- | ---------------------------------------------------------------- |
| 0h00 – 0h20 | Revisão        | Retomar Aulas 1, 2 e 3                                           |
| 0h20 – 0h40 | Modelo         | Atualizar o modelo `Estudante`                                   |
| 0h40 – 1h15 | Service        | Criar `EstudanteService` com `signal`                            |
| 1h15 – 2h05 | Reactive Forms | Criar o formulário com `FormGroup`, `FormControl` e `Validators` |
| 2h05 – 2h15 | Intervalo      | Pausa                                                            |
| 2h15 – 2h55 | Interface      | Montar o template com Angular Material e mensagens de erro       |
| 2h55 – 3h30 | CRUD           | Implementar cadastro, edição, cancelamento e remoção             |
| 3h30 – 3h50 | Testes         | Testar a página `/estudantes`                                    |
| 3h50 – 4h00 | Fechamento     | Revisão, atividade e desafio                                     |

---

# 2. Estado inicial do projeto

Antes de começar a Aula 4, o projeto deve estar parecido com isto:

```text
src/app
├── components
│   └── tarefa-card
├── models
│   ├── tarefa.model.ts
│   └── estudante.model.ts
├── pages
│   ├── home
│   ├── estudantes
│   ├── tarefas
│   ├── relatorios
│   └── sobre
├── services
│   └── tarefa.service.ts
├── pipes
├── guards
├── interceptors
├── app.ts
├── app.html
├── app.css
├── app.routes.ts
└── app.config.ts
```

A rota `/estudantes` já foi criada na Aula 2, mas ainda não possui CRUD completo. A Aula 4 vai transformar essa página em uma funcionalidade real do sistema.

---

# 3. Resultado esperado da Aula 4

Ao final da aula, a aplicação deverá ter:

```text
Página /estudantes
├── Formulário reativo
├── Validação de nome
├── Validação de e-mail
├── Validação de curso
├── Validação de turno
├── Validação de data de ingresso
├── Cadastro de estudante
├── Edição de estudante
├── Cancelamento de edição
├── Remoção de estudante
└── Listagem de estudantes cadastrados
```

A estrutura final principal será:

```text
src/app
├── models
│   └── estudante.model.ts
├── pages
│   └── estudantes
│       ├── estudantes.ts
│       ├── estudantes.html
│       └── estudantes.css
├── services
│   └── estudante.service.ts
└── ...
```

---

# 4. Módulo 1 — Revisão inicial

## Tempo sugerido

20 minutos.

## Explicação para iniciar a aula

Explique aos alunos:

> Na Aula 1, criamos uma aplicação simples de tarefas e trabalhamos conceitos fundamentais do Angular, como interpolação, eventos, signals, componentes, `input()`, `@for` e `@if`.

Depois:

> Na Aula 2, transformamos a aplicação em um sistema chamado Gerenciador de Estudos. Criamos páginas, rotas, menu lateral com Angular Material, `RouterOutlet` e modelos tipados.

Em seguida:

> Na Aula 3, implementamos o CRUD de tarefas na página `/tarefas`. Criamos um service com `signal`, formulário com `ngModel`, validação visual, componente `TarefaCard`, `input()`, `output()` e injeção moderna com `inject()`.

Agora:

> Na Aula 4, vamos criar o CRUD de estudantes. Mas, em vez de usar formulário template-driven como na Aula 3, vamos usar Reactive Forms. Isso significa que a estrutura e as validações do formulário ficarão mais concentradas no TypeScript.

---

# 5. Módulo 2 — Atualizar o modelo de estudante

## Tempo sugerido

20 minutos.

Na Aula 2, o modelo de estudante foi criado assim:

```ts
export type TurnoEstudante = 'matutino' | 'vespertino' | 'noturno';

export type Estudante = {
  id: number;
  nome: string;
  email: string;
  curso: string;
  turno: TurnoEstudante;
};
```

Agora vamos adicionar o campo:

```ts
dataIngresso: string;
```

Esse campo será uma string no formato de data, por exemplo:

```text
2026-04-26
```

---

## Passo 1 — Atualizar `estudante.model.ts`

Abra:

```text
src/app/models/estudante.model.ts
```

Substitua o conteúdo por:

```ts
export type TurnoEstudante = 'matutino' | 'vespertino' | 'noturno';

export type Estudante = {
  id: number;
  nome: string;
  email: string;
  curso: string;
  turno: TurnoEstudante;
  dataIngresso: string;
};
```

---

## Explicação didática

Explique:

> O modelo `Estudante` representa a estrutura dos dados de um estudante no sistema.

Agora um estudante precisa ter:

```text
id
nome
email
curso
turno
dataIngresso
```

Explique também:

> O campo `turno` continua tipado. Isso significa que ele só aceita três valores: `matutino`, `vespertino` ou `noturno`.

Exemplo válido:

```ts
const estudante: Estudante = {
  id: 1,
  nome: 'Ana Silva',
  email: 'ana@email.com',
  curso: 'Angular',
  turno: 'noturno',
  dataIngresso: '2026-04-26'
};
```

Exemplo inválido:

```ts
const estudante: Estudante = {
  id: 1,
  nome: 'Ana Silva',
  email: 'ana@email.com',
  curso: 'Angular',
  turno: 'integral',
  dataIngresso: '2026-04-26'
};
```

O erro ocorre porque:

```ts
'integral'
```

não pertence ao tipo:

```ts
TurnoEstudante
```

---

# 6. Módulo 3 — Criar o service local de estudantes

## Tempo sugerido

35 minutos.

Na Aula 3, o CRUD de tarefas foi organizado com um service. Agora faremos o mesmo para estudantes.

A página não deve guardar diretamente a lista principal de estudantes. Essa responsabilidade ficará no service.

A lógica será:

```text
Página Estudantes → cuida da interface e do formulário
EstudanteService → cuida dos dados e das operações de CRUD
```

---

## Passo 1 — Criar o service

No terminal, dentro da pasta do projeto, execute:

```bash
ng generate service services/estudante.service --skip-tests
```

Ou:

```bash
ng g s services/estudante.service --skip-tests
```

O Angular criará o arquivo:

```text
src/app/services/estudante.service.ts
```

---

## Passo 2 — Implementar `EstudanteService`

Abra:

```text
src/app/services/estudante.service.ts
```

Substitua o conteúdo por:

```ts
import { Injectable, Signal, signal } from '@angular/core';

import { Estudante } from '../models/estudante.model';

@Injectable({
  providedIn: 'root',
})
export class EstudanteService {
  private readonly estudantes = signal<Estudante[]>([
    {
      id: 1,
      nome: 'Ana Silva',
      email: 'ana@email.com',
      curso: 'Angular Básico',
      turno: 'noturno',
      dataIngresso: '2026-04-01'
    },
    {
      id: 2,
      nome: 'Carlos Souza',
      email: 'carlos@email.com',
      curso: 'Frontend com Angular',
      turno: 'vespertino',
      dataIngresso: '2026-04-10'
    }
  ]);

  private proximoId = 3;

  listar(): Signal<Estudante[]> {
    return this.estudantes.asReadonly();
  }

  buscarPorId(id: number): Estudante | undefined {
    return this.estudantes().find(estudante => estudante.id === id);
  }

  cadastrar(estudante: Omit<Estudante, 'id'>): void {
    const novoEstudante: Estudante = {
      id: this.proximoId,
      nome: estudante.nome,
      email: estudante.email,
      curso: estudante.curso,
      turno: estudante.turno,
      dataIngresso: estudante.dataIngresso
    };

    this.estudantes.update(listaAtual => [
      ...listaAtual,
      novoEstudante
    ]);

    this.proximoId++;
  }

  editar(id: number, estudanteAtualizado: Omit<Estudante, 'id'>): void {
    this.estudantes.update(listaAtual =>
      listaAtual.map(estudante =>
        estudante.id === id
          ? {
              id,
              nome: estudanteAtualizado.nome,
              email: estudanteAtualizado.email,
              curso: estudanteAtualizado.curso,
              turno: estudanteAtualizado.turno,
              dataIngresso: estudanteAtualizado.dataIngresso
            }
          : estudante
      )
    );
  }

  remover(id: number): void {
    this.estudantes.update(listaAtual =>
      listaAtual.filter(estudante => estudante.id !== id)
    );
  }
}
```

---

## Explicação didática

Explique:

> A lista de estudantes está dentro do service porque ela representa o estado da funcionalidade de estudantes.

O signal principal é privado:

```ts
private readonly estudantes = signal<Estudante[]>([]);
```

Isso impede que a página altere diretamente a lista.

A página acessará a lista por meio de:

```ts
listar(): Signal<Estudante[]> {
  return this.estudantes.asReadonly();
}
```

O `asReadonly()` permite que outros arquivos leiam o signal, mas não consigam chamar `set()` ou `update()` diretamente. A documentação de signals do Angular apresenta os signals como valores reativos que notificam consumidores quando mudam, e a Aula 3 já usou essa mesma ideia no `TarefaService`. ([Angular][2])

Explique:

> O service centraliza as alterações. A página não faz `update()` diretamente. Ela chama `cadastrar`, `editar` ou `remover`.

---

# 7. Módulo 4 — Introdução a Reactive Forms

## Tempo sugerido

20 minutos.

Antes de implementar, faça uma comparação com a Aula 3.

Na Aula 3, o formulário de tarefas usava:

```text
FormsModule
ngModel
ngForm
ngSubmit
```

Essa abordagem é chamada de **template-driven forms**.

Na Aula 4, vamos usar:

```text
ReactiveFormsModule
FormGroup
FormControl
Validators
```

Essa abordagem é chamada de **reactive forms**.

A documentação oficial do Angular explica que os reactive forms usam uma abordagem explícita e imutável para gerenciar o estado do formulário, com a estrutura do formulário definida diretamente no TypeScript. ([Angular][3])

---

## Comparação didática

| Aula 3 — Template-driven              | Aula 4 — Reactive Forms                           |
| ------------------------------------- | ------------------------------------------------- |
| Formulário mais controlado pelo HTML  | Formulário mais controlado pelo TypeScript        |
| Usa `FormsModule`                     | Usa `ReactiveFormsModule`                         |
| Usa `[(ngModel)]`                     | Usa `formControlName`                             |
| Usa `#form="ngForm"`                  | Usa `FormGroup`                                   |
| Validações aparecem muito no template | Validações ficam mais centralizadas no TypeScript |

Explique:

> Nenhuma abordagem é “errada”. A diferença é que Reactive Forms facilita formulários maiores, com mais validações e regras mais complexas.

---

# 8. Módulo 5 — Atualizar a página `estudantes.ts`

## Tempo sugerido

50 minutos.

Agora vamos transformar a página `/estudantes` em uma tela funcional.

Abra:

```text
src/app/pages/estudantes/estudantes.ts
```

Substitua o conteúdo por:

```ts
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';
import { TurnoEstudante } from '../../models/estudante.model';
import { EstudanteService } from '../../services/estudante.service';

@Component({
  selector: 'app-estudantes',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './estudantes.html',
  styleUrl: './estudantes.css',
})
export class Estudantes {
  private readonly estudanteService = inject(EstudanteService);
  private readonly dialog = inject(MatDialog);

  estudantes = this.estudanteService.listar();

  idEmEdicao: number | null = null;

  formEstudante = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),
    curso: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),
    turno: new FormControl<TurnoEstudante | ''>('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    dataIngresso: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })
  });

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
      dataIngresso: dadosFormulario.dataIngresso
    };

    if (this.idEmEdicao === null) {
      this.estudanteService.cadastrar(estudante);
    } else {
      this.estudanteService.editar(this.idEmEdicao, estudante);
    }

    this.limparFormulario();
  }

  editarEstudante(id: number): void {
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

  removerEstudante(id: number): void {
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
      dataIngresso: ''
    });
  }
}
```

---

## Explicação sobre `inject()`

Na Aula 3, já usamos:

```ts
private readonly tarefaService = inject(TarefaService);
```

Agora usamos:

```ts
private readonly estudanteService = inject(EstudanteService);
```

Explique:

> O `inject()` permite injetar uma dependência sem criar um construtor apenas para isso. É a mesma ideia usada na Aula 3, agora aplicada ao service de estudantes.

A documentação oficial do Angular descreve `inject()` como uma função usada para injetar dependências em contextos compatíveis com o sistema de injeção de dependência do Angular. ([Blog][4])

---

## Explicação sobre `FormGroup`

Mostre este trecho:

```ts
formEstudante = new FormGroup({
  nome: new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  })
});
```

Explique:

> O `FormGroup` representa o formulário inteiro. Cada `FormControl` representa um campo do formulário.

Neste caso:

```text
formEstudante
├── nome
├── email
├── curso
├── turno
└── dataIngresso
```

O `FormGroup` permite consultar se o formulário está válido:

```ts
this.formEstudante.valid
```

ou inválido:

```ts
this.formEstudante.invalid
```

---

## Explicação sobre `Validators`

Explique que as validações ficam no TypeScript:

```ts
Validators.required
Validators.minLength(3)
Validators.email
```

Exemplo:

```ts
email: new FormControl('', {
  nonNullable: true,
  validators: [
    Validators.required,
    Validators.email
  ]
})
```

Esse campo terá duas regras:

```text
1. O e-mail é obrigatório.
2. O e-mail precisa ter formato válido.
```

---

# 9. Módulo 6 — Criar o template `estudantes.html`

## Tempo sugerido

40 minutos.

Abra:

```text
src/app/pages/estudantes/estudantes.html
```

Substitua o conteúdo por:

```html
<h1>Estudantes</h1>

<p>
  Cadastre, edite e remova estudantes do Gerenciador de Estudos.
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

<section class="lista-estudantes">
  <h2>Estudantes cadastrados</h2>

  @if (estudantes().length === 0) {
    <p>
      Nenhum estudante cadastrado. Use o formulário acima para adicionar o primeiro estudante.
    </p>
  } @else {
    <div class="grid-estudantes">
      @for (estudante of estudantes(); track estudante.id) {
        <mat-card class="estudante-card">
          <mat-card-header>
            <mat-card-title>{{ estudante.nome }}</mat-card-title>
            <mat-card-subtitle>{{ estudante.email }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p>
              <strong>Curso:</strong>
              {{ estudante.curso }}
            </p>

            <p>
              <strong>Turno:</strong>
              @if (estudante.turno === 'matutino') {
                Matutino
              } @else if (estudante.turno === 'vespertino') {
                Vespertino
              } @else {
                Noturno
              }
            </p>

            <p>
              <strong>Data de ingresso:</strong>
              {{ estudante.dataIngresso }}
            </p>
          </mat-card-content>

          <mat-card-actions>
            <button
              mat-button
              color="primary"
              type="button"
              (click)="editarEstudante(estudante.id)"
            >
              Editar
            </button>

            <button
              mat-button
              color="warn"
              type="button"
              (click)="removerEstudante(estudante.id)"
            >
              Remover
            </button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  }
</section>
```

---

## Explicação sobre `[formGroup]`

Mostre este trecho:

```html
<form [formGroup]="formEstudante" (ngSubmit)="salvarFormulario()">
```

Explique:

> O `[formGroup]` conecta o formulário HTML ao objeto `formEstudante` criado no TypeScript.

---

## Explicação sobre `formControlName`

Mostre este trecho:

```html
<input matInput formControlName="nome" />
```

Explique:

> O `formControlName` conecta o campo HTML ao controle chamado `nome` dentro do `FormGroup`.

No TypeScript:

```ts
nome: new FormControl(...)
```

No HTML:

```html
formControlName="nome"
```

Os nomes precisam bater exatamente.

---

## Explicação sobre `mat-error`

A documentação do Angular Material mostra componentes de formulário como `mat-form-field`, `mat-input` e `mat-select` para estruturar campos com aparência Material Design. ([Angular Material][5])

Explique:

> O `mat-error` mostra mensagens de erro quando o campo está inválido.

Exemplo:

```html
@if (campoInvalido('email')) {
  @if (formEstudante.controls.email.errors?.['email']) {
    <mat-error>Informe um e-mail válido.</mat-error>
  }
}
```

O método:

```ts
campoInvalido(nomeCampo: string): boolean {
  const campo = this.formEstudante.get(nomeCampo);

  return !!campo && campo.invalid && campo.touched;
}
```

ajuda a evitar mensagens de erro antes de o aluno interagir com o campo.

---

# 10. Módulo 7 — Estilizar a página `estudantes.css`

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

.lista-estudantes {
  margin-top: 24px;
}

.lista-estudantes h2 {
  margin-bottom: 16px;
}

.grid-estudantes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.estudante-card {
  background-color: #f8f9ff;
}

.estudante-card p {
  margin: 8px 0;
}

mat-card-actions {
  display: flex;
  gap: 8px;
}
```

---

# 11. Módulo 8 — Testar a página `/estudantes`

## Tempo sugerido

30 minutos.

Execute o projeto:

```bash
ng serve
```

Ou:

```bash
npx ng serve
```

Abra no navegador:

```text
http://localhost:4200/estudantes
```

---

## Teste 1 — Abrir a página

Resultado esperado:

A página `/estudantes` deve abrir dentro do layout criado na Aula 2.

Deve aparecer:

```text
Estudantes
Cadastre, edite e remova estudantes do Gerenciador de Estudos.
```

---

## Teste 2 — Ver estudantes iniciais

Resultado esperado:

Devem aparecer os estudantes iniciais cadastrados no service:

```text
Ana Silva
Carlos Souza
```

---

## Teste 3 — Validação de nome obrigatório

Clique no campo **Nome**, deixe vazio e saia do campo.

Resultado esperado:

```text
O nome é obrigatório.
```

---

## Teste 4 — Validação de tamanho mínimo

Digite no campo nome:

```text
Al
```

Resultado esperado:

```text
O nome deve ter pelo menos 3 caracteres.
```

---

## Teste 5 — Validação de e-mail

Digite:

```text
ana.com
```

Resultado esperado:

```text
Informe um e-mail válido.
```

---

## Teste 6 — Cadastro

Preencha:

```text
Nome: Maria Oliveira
E-mail: maria@email.com
Curso: Desenvolvimento Web
Turno: Noturno
Data de ingresso: 2026-04-26
```

Clique em:

```text
Cadastrar
```

Resultado esperado:

O estudante aparece imediatamente na lista.

---

## Teste 7 — Edição

Clique em **Editar** em um estudante.

Resultado esperado:

Os dados aparecem no formulário.

O título muda de:

```text
Novo estudante
```

para:

```text
Editar estudante
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

## Teste 8 — Cancelar edição

Clique em:

```text
Cancelar edição
```

Resultado esperado:

O formulário volta ao modo de cadastro.

---

## Teste 9 — Remoção

Clique em:

```text
Remover
```

Confirme a remoção.

Resultado esperado:

O estudante desaparece da lista.

---

# 12. Problemas comuns e correções

## Problema 1 — Erro com `formGroup`

Erro provável:

```text
Can't bind to 'formGroup' since it isn't a known property of 'form'
```

Causa:

Faltou importar `ReactiveFormsModule`.

Correção em `estudantes.ts`:

```ts
import { ReactiveFormsModule } from '@angular/forms';
```

E no array `imports`:

```ts
imports: [
  ReactiveFormsModule
]
```

---

## Problema 2 — Erro com `mat-form-field`

Erro provável:

```text
'mat-form-field' is not a known element
```

Causa:

Faltou importar `MatFormFieldModule`.

Correção:

```ts
import { MatFormFieldModule } from '@angular/material/form-field';
```

E no array `imports`:

```ts
imports: [
  MatFormFieldModule
]
```

---

## Problema 3 — Erro com `mat-select`

Erro provável:

```text
'mat-select' is not a known element
```

Causa:

Faltou importar `MatSelectModule`.

Correção:

```ts
import { MatSelectModule } from '@angular/material/select';
```

E no array `imports`:

```ts
imports: [
  MatSelectModule
]
```

---

## Problema 4 — Nome errado no `formControlName`

Erro comum:

```html
<input formControlName="nomeEstudante" />
```

Mas no TypeScript está:

```ts
nome: new FormControl(...)
```

Correto:

```html
<input formControlName="nome" />
```

Explique:

> O nome usado no `formControlName` precisa existir dentro do `FormGroup`.

---

## Problema 5 — Esquecer os parênteses do signal

Errado:

```html
@for (estudante of estudantes; track estudante.id) {
```

Correto:

```html
@for (estudante of estudantes(); track estudante.id) {
```

Explique:

> Como `estudantes` é um signal, precisamos chamar `estudantes()` para ler seu valor.

---

## Problema 6 — Usar turno fora do tipo

Errado:

```ts
turno: 'integral'
```

Correto:

```ts
turno: 'matutino'
```

ou:

```ts
turno: 'vespertino'
```

ou:

```ts
turno: 'noturno'
```

---

# 13. Código final esperado da Aula 4

## `src/app/models/estudante.model.ts`

```ts
export type TurnoEstudante = 'matutino' | 'vespertino' | 'noturno';

export type Estudante = {
  id: number;
  nome: string;
  email: string;
  curso: string;
  turno: TurnoEstudante;
  dataIngresso: string;
};
```

---

## `src/app/services/estudante.service.ts`

```ts
import { Injectable, Signal, signal } from '@angular/core';

import { Estudante } from '../models/estudante.model';

@Injectable({
  providedIn: 'root',
})
export class EstudanteService {
  private readonly estudantes = signal<Estudante[]>([
    {
      id: 1,
      nome: 'Ana Silva',
      email: 'ana@email.com',
      curso: 'Angular Básico',
      turno: 'noturno',
      dataIngresso: '2026-04-01'
    },
    {
      id: 2,
      nome: 'Carlos Souza',
      email: 'carlos@email.com',
      curso: 'Frontend com Angular',
      turno: 'vespertino',
      dataIngresso: '2026-04-10'
    }
  ]);

  private proximoId = 3;

  listar(): Signal<Estudante[]> {
    return this.estudantes.asReadonly();
  }

  buscarPorId(id: number): Estudante | undefined {
    return this.estudantes().find(estudante => estudante.id === id);
  }

  cadastrar(estudante: Omit<Estudante, 'id'>): void {
    const novoEstudante: Estudante = {
      id: this.proximoId,
      nome: estudante.nome,
      email: estudante.email,
      curso: estudante.curso,
      turno: estudante.turno,
      dataIngresso: estudante.dataIngresso
    };

    this.estudantes.update(listaAtual => [
      ...listaAtual,
      novoEstudante
    ]);

    this.proximoId++;
  }

  editar(id: number, estudanteAtualizado: Omit<Estudante, 'id'>): void {
    this.estudantes.update(listaAtual =>
      listaAtual.map(estudante =>
        estudante.id === id
          ? {
              id,
              nome: estudanteAtualizado.nome,
              email: estudanteAtualizado.email,
              curso: estudanteAtualizado.curso,
              turno: estudanteAtualizado.turno,
              dataIngresso: estudanteAtualizado.dataIngresso
            }
          : estudante
      )
    );
  }

  remover(id: number): void {
    this.estudantes.update(listaAtual =>
      listaAtual.filter(estudante => estudante.id !== id)
    );
  }
}
```

---

## `src/app/pages/estudantes/estudantes.ts`

```ts
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';
import { TurnoEstudante } from '../../models/estudante.model';
import { EstudanteService } from '../../services/estudante.service';

@Component({
  selector: 'app-estudantes',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './estudantes.html',
  styleUrl: './estudantes.css',
})
export class Estudantes {
  private readonly estudanteService = inject(EstudanteService);
  private readonly dialog = inject(MatDialog);

  estudantes = this.estudanteService.listar();

  idEmEdicao: number | null = null;

  formEstudante = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),
    curso: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),
    turno: new FormControl<TurnoEstudante | ''>('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    dataIngresso: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })
  });

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
      dataIngresso: dadosFormulario.dataIngresso
    };

    if (this.idEmEdicao === null) {
      this.estudanteService.cadastrar(estudante);
    } else {
      this.estudanteService.editar(this.idEmEdicao, estudante);
    }

    this.limparFormulario();
  }

  editarEstudante(id: number): void {
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

  removerEstudante(id: number): void {
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
      dataIngresso: ''
    });
  }
}
```

---

# 14. Atividade prática em sala

## Atividade 1 — Melhorar a remoção de estudante

Na Aula 3, foi sugerido trocar o `confirm()` por um diálogo do Angular Material.

Agora, peça aos alunos para fazerem o mesmo na página de estudantes.

Objetivo:

```text
Ao clicar em Remover, abrir um diálogo de confirmação usando Angular Material.
```

Sugestão:

* reutilizar o componente `ConfirmacaoDialog`, se ele foi criado na Aula 3;
* ou criar um novo componente `confirmacao-remocao-estudante-dialog`.

---

## Atividade 2 — Adicionar campo de telefone

Peça aos alunos para adicionar o campo:

```ts
telefone: string;
```

Eles deverão atualizar:

```text
src/app/models/estudante.model.ts
src/app/services/estudante.service.ts
src/app/pages/estudantes/estudantes.ts
src/app/pages/estudantes/estudantes.html
```

Requisitos:

```text
O telefone deve ser obrigatório.
O telefone deve aparecer na listagem.
O telefone deve ser carregado ao editar estudante.
O telefone deve ser limpo ao cancelar edição.
```

---

# 15. Desafio extra

Criar um componente separado para exibir estudantes:

```text
src/app/components/estudante-card
```

O componente deverá receber dados com `input()`:

```ts
id
nome
email
curso
turno
dataIngresso
```

E deverá emitir eventos com `output()`:

```ts
editar
remover
```

Esse desafio conecta a Aula 4 ao que foi feito na Aula 3 com o `TarefaCard`.

---

# 16. Perguntas para fixação

1. Qual é a diferença entre template-driven forms e reactive forms?
2. Para que serve o `ReactiveFormsModule`?
3. O que é um `FormGroup`?
4. O que é um `FormControl`?
5. Para que serve `Validators.required`?
6. Para que serve `Validators.email`?
7. O que faz o método `markAllAsTouched()`?
8. Por que usamos `formControlName` no HTML?
9. Por que a lista de estudantes fica no service?
10. Por que usamos `asReadonly()` ao expor o signal?
11. Por que usamos `inject()` em vez de constructor?
12. O que acontece quando esquecemos de chamar `estudantes()` no template?

---

# 17. Fechamento da aula

Finalize com esta síntese:

> Na Aula 1, aprendemos os fundamentos do Angular com signals, eventos, componentes e renderização com `@for` e `@if`. Na Aula 2, organizamos a aplicação como um sistema real, com páginas, rotas, menu lateral e modelos. Na Aula 3, implementamos o CRUD de tarefas usando formulário template-driven, service com signal, `input()` e `output()`. Na Aula 4, criamos uma segunda entidade, estudantes, usando Reactive Forms, centralizando a estrutura e as validações do formulário no TypeScript.

Resultado final da Aula 4:

```text
Página /estudantes com CRUD local de estudantes usando Reactive Forms.
```

Conexão com a próxima aula:

> A Aula 5 pode avançar para relacionamento entre entidades, permitindo associar tarefas a estudantes, filtrar tarefas por estudante ou criar relatórios simples com base nos dados cadastrados.

[1]: https://angular.dev/guide/forms?utm_source=chatgpt.com "Forms • Overview"
[2]: https://angular.dev/guide/signals?utm_source=chatgpt.com "Signals • Overview"
[3]: https://angular.dev/guide/forms/reactive-forms?utm_source=chatgpt.com "Reactive forms"
[4]: https://blog.infovibes.co.uk/dependency-injection-in-angular-14-15-and-16/?utm_source=chatgpt.com "Dependency Injection Function in Angular 14, 15, and 16"
[5]: https://material.angular.dev/components/form-field?utm_source=chatgpt.com "Angular Material UI Component Library"
