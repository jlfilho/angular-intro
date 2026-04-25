A ideia é construir uma aplicação simples chamada:

# Lista de Tarefas de Estudo

Ela vai ensinar, na prática:

* criação do projeto Angular;
* estrutura dos arquivos;
* interpolação;
* evento `(click)`;
* `signal`;
* `set`;
* `update`;
* `computed`;
* binding de propriedades;
* criação de componente;
* `input`;
* CSS de componente;
* lista com `@for`;
* condição com `@if`.

Angular é um framework web mantido pelo Google para construir aplicações rápidas, confiáveis e escaláveis, e sua documentação atual destaca componentes e signals como recursos centrais do desenvolvimento moderno com Angular. ([Angular][1])

---

# Aula Tutorial — Angular do zero com Signals e Componentes

## Duração

**4 horas**

## Público-alvo

Alunos que já tiveram contato com:

* HTML;
* CSS;
* JavaScript básico;
* terminal;
* VS Code.

---

# 1. Preparação do projeto

## 1.1 Instalar o Angular CLI

No terminal, execute:

```bash
npm install -g @angular/cli
```

Depois confira se instalou:

```bash
ng version
```

---

## 1.2 Criar o projeto

No terminal:

```bash
ng new aula-angular-tarefas
```

Durante a criação, o Angular pode fazer algumas perguntas.

### Pergunta sobre CSS

Quando aparecer algo como:

```text
Which stylesheet format would you like to use?
```

Escolha:

```text
CSS
```

### Pergunta sobre SSR/SSG

Quando aparecer:

```text
Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? (y/N)
```

Responda:

```text
N
```

Ou apenas pressione **Enter**.

Para esta aula inicial, não vamos usar SSR nem SSG.

### Pergunta sobre ferramentas de IA

Quando aparecer:

```text
Which AI tools do you want to configure with Angular best practices?
```

Escolha:

```text
None
```

Ou seja:

```text
❯◉ None
```

---

## 1.3 Entrar na pasta do projeto

```bash
cd aula-angular-tarefas
```

---

## 1.4 Executar o projeto

```bash
ng serve
```

Depois abra no navegador:

```text
http://localhost:4200
```

---

# 2. Entendendo a estrutura inicial

Abra o projeto no VS Code.

O arquivo principal da aplicação será:

```text
src/app/app.ts
```

Ele provavelmente está assim:

```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('aula-angular-tarefas');
}
```

## Explicação

```ts
import { Component, signal } from '@angular/core';
```

Essa linha importa dois recursos do Angular:

* `Component`: usado para criar componentes;
* `signal`: usado para criar estado reativo.

A documentação atual do Angular explica que signals são estruturas que envolvem um valor e notificam os consumidores quando esse valor muda. Para ler um signal, chamamos o signal como uma função. ([Angular][2])

```ts
import { RouterOutlet } from '@angular/router';
```

O `RouterOutlet` é usado quando trabalhamos com rotas. Nesta aula, não vamos trabalhar com rotas, então podemos remover para simplificar.

---

# 3. Limpando o projeto inicial

## 3.1 Atualize o arquivo `app.ts`

Substitua todo o conteúdo de:

```text
src/app/app.ts
```

por:

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');
}
```

Observe que removemos:

```ts
import { RouterOutlet } from '@angular/router';
```

E também removemos:

```ts
imports: [RouterOutlet]
```

Agora ficou:

```ts
imports: []
```

---

## 3.2 Atualize o arquivo `app.html`

Abra:

```text
src/app/app.html
```

Apague todo o conteúdo que veio por padrão e coloque:

```html
<h1>{{ title() }}</h1>

<p>Minha primeira aplicação Angular.</p>
```

## Explicação

Como `title` é um `signal`, usamos:

```html
{{ title() }}
```

E não:

```html
{{ title }}
```

O parêntese é necessário porque o valor do signal é lido chamando-o como função.

---

# Fase 1 — Fundamentos Angular

## Tempo sugerido

**40 minutos**

Nesta fase, vamos trabalhar:

* componente principal;
* interpolação;
* eventos com `(click)`.

---

# Módulo 1 — Primeiro contato com componente

## Objetivo

Entender que a tela da aplicação é controlada por um componente.

O arquivo `app.ts` deve estar assim:

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');
}
```

O arquivo `app.html` deve estar assim:

```html
<h1>{{ title() }}</h1>

<p>Minha primeira aplicação Angular.</p>
```

## Explicação para os alunos

O Angular organiza a aplicação em **componentes**. Cada componente pode ter:

* um arquivo TypeScript;
* um arquivo HTML;
* um arquivo CSS.

Neste caso:

```text
app.ts
```

guarda a lógica.

```text
app.html
```

guarda o visual.

```text
app.css
```

guarda os estilos.

---

# Módulo 2 — Texto dinâmico com interpolação

## Objetivo

Mostrar dados da classe TypeScript dentro do HTML.

Atualize o arquivo:

```text
src/app/app.ts
```

para:

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');

  estudante = 'Ana';
  curso = 'Angular básico';
  turno = 'Noite';
}
```

Agora atualize o arquivo:

```text
src/app/app.html
```

para:

```html
<h1>{{ title() }}</h1>

<p>Estudante: {{ estudante }}</p>
<p>Curso: {{ curso }}</p>
<p>Turno: {{ turno }}</p>
```

## Explicação

A interpolação usa:

```html
{{ }}
```

Ela permite mostrar no HTML valores que estão no TypeScript.

Exemplo:

```html
<p>Curso: {{ curso }}</p>
```

O Angular procura a propriedade `curso` dentro da classe `App` e mostra o valor na tela.

## Atenção

Aqui temos dois tipos de dados:

```ts
title = signal('Lista de Tarefas de Estudo');
```

Esse é um signal. No HTML usamos:

```html
{{ title() }}
```

Já estes são valores comuns:

```ts
estudante = 'Ana';
curso = 'Angular básico';
turno = 'Noite';
```

No HTML usamos sem parênteses:

```html
{{ estudante }}
{{ curso }}
{{ turno }}
```

---

# Módulo 3 — Eventos com `(click)`

## Objetivo

Executar uma ação quando o usuário clicar em um botão.

Atualize o arquivo `app.ts`:

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');

  estudante = 'Ana';
  curso = 'Angular básico';
  turno = 'Noite';

  alterarEstudante() {
    this.estudante = 'Carlos';
  }

  alterarCurso() {
    this.curso = 'Angular com componentes';
  }
}
```

Atualize o arquivo `app.html`:

```html
<h1>{{ title() }}</h1>

<p>Estudante: {{ estudante }}</p>
<p>Curso: {{ curso }}</p>
<p>Turno: {{ turno }}</p>

<button (click)="alterarEstudante()">Alterar estudante</button>

<button (click)="alterarCurso()">Alterar curso</button>
```

## Explicação

Este botão:

```html
<button (click)="alterarEstudante()">Alterar estudante</button>
```

executa este método:

```ts
alterarEstudante() {
  this.estudante = 'Carlos';
}
```

Quando o usuário clica, o Angular chama o método e a tela é atualizada.

---

# Fase 2 — Estado e Signals

## Tempo sugerido

**1 hora**

Nesta fase, vamos substituir as propriedades comuns por `signals`.

Vamos trabalhar:

* signal;
* `set`;
* `update`;
* `computed`.

A documentação do Angular mostra que signals podem ser graváveis, podendo ser alterados com `.set()` ou com `.update()`, e que `computed` cria signals derivados de outros signals. ([Angular][2])

---

# Módulo 4 — Signals com `set`

## Objetivo

Usar `signal` para guardar dados reativos.

Atualize o arquivo `app.ts`:

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');

  estudante = signal('Ana');
  curso = signal('Angular básico');
  turno = signal('Noite');

  alterarEstudante() {
    this.estudante.set('Carlos');
  }

  alterarCurso() {
    this.curso.set('Angular com componentes');
  }
}
```

Atualize o arquivo `app.html`:

```html
<h1>{{ title() }}</h1>

<p>Estudante: {{ estudante() }}</p>
<p>Curso: {{ curso() }}</p>
<p>Turno: {{ turno() }}</p>

<button (click)="alterarEstudante()">Alterar estudante</button>

<button (click)="alterarCurso()">Alterar curso</button>
```

## Explicação

Antes tínhamos:

```ts
estudante = 'Ana';
```

Agora temos:

```ts
estudante = signal('Ana');
```

Antes alterávamos assim:

```ts
this.estudante = 'Carlos';
```

Agora alteramos assim:

```ts
this.estudante.set('Carlos');
```

Antes exibíamos assim:

```html
{{ estudante }}
```

Agora exibimos assim:

```html
{{ estudante() }}
```

---

# Módulo 5 — Signals com `update`

## Objetivo

Alterar um valor com base no valor anterior.

Vamos criar um contador de tarefas.

Atualize o `app.ts`:

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');

  estudante = signal('Ana');
  curso = signal('Angular básico');
  turno = signal('Noite');

  quantidadeTarefas = signal(0);

  alterarEstudante() {
    this.estudante.set('Carlos');
  }

  alterarCurso() {
    this.curso.set('Angular com componentes');
  }

  adicionarTarefa() {
    this.quantidadeTarefas.update(valorAtual => valorAtual + 1);
  }

  removerTarefa() {
    this.quantidadeTarefas.update(valorAtual => {
      if (valorAtual > 0) {
        return valorAtual - 1;
      }

      return 0;
    });
  }
}
```

Atualize o `app.html`:

```html
<h1>{{ title() }}</h1>

<p>Estudante: {{ estudante() }}</p>
<p>Curso: {{ curso() }}</p>
<p>Turno: {{ turno() }}</p>

<p>Quantidade de tarefas: {{ quantidadeTarefas() }}</p>

<button (click)="alterarEstudante()">Alterar estudante</button>

<button (click)="alterarCurso()">Alterar curso</button>

<button (click)="adicionarTarefa()">Adicionar tarefa</button>

<button (click)="removerTarefa()">Remover tarefa</button>
```

## Explicação

O método `set` troca diretamente o valor:

```ts
this.estudante.set('Carlos');
```

O método `update` usa o valor anterior para gerar o novo valor:

```ts
this.quantidadeTarefas.update(valorAtual => valorAtual + 1);
```

Isso é útil para:

* contadores;
* carrinho de compras;
* quantidade de itens;
* curtidas;
* votos;
* listas.

---

# Módulo 6 — Signals computados

## Objetivo

Criar um valor calculado automaticamente a partir de outros signals.

Atualize o `app.ts`:

```ts
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');

  estudante = signal('Ana');
  curso = signal('Angular básico');
  turno = signal('Noite');

  quantidadeTarefas = signal(0);

  mensagemResumo = computed(() => {
    return `${this.estudante()} possui ${this.quantidadeTarefas()} tarefa(s) cadastrada(s).`;
  });

  alterarEstudante() {
    this.estudante.set('Carlos');
  }

  alterarCurso() {
    this.curso.set('Angular com componentes');
  }

  adicionarTarefa() {
    this.quantidadeTarefas.update(valorAtual => valorAtual + 1);
  }

  removerTarefa() {
    this.quantidadeTarefas.update(valorAtual => {
      if (valorAtual > 0) {
        return valorAtual - 1;
      }

      return 0;
    });
  }
}
```

Atualize o `app.html`:

```html
<h1>{{ title() }}</h1>

<p>Estudante: {{ estudante() }}</p>
<p>Curso: {{ curso() }}</p>
<p>Turno: {{ turno() }}</p>

<p>Quantidade de tarefas: {{ quantidadeTarefas() }}</p>

<p>{{ mensagemResumo() }}</p>

<button (click)="alterarEstudante()">Alterar estudante</button>

<button (click)="alterarCurso()">Alterar curso</button>

<button (click)="adicionarTarefa()">Adicionar tarefa</button>

<button (click)="removerTarefa()">Remover tarefa</button>
```

## Explicação

O `computed` cria um valor derivado.

Neste exemplo:

```ts
mensagemResumo = computed(() => {
  return `${this.estudante()} possui ${this.quantidadeTarefas()} tarefa(s) cadastrada(s).`;
});
```

Ele depende de:

```ts
this.estudante()
```

e de:

```ts
this.quantidadeTarefas()
```

Quando um desses valores muda, a mensagem também muda.

---

# Intervalo

## Tempo sugerido

**10 minutos**

---

# Fase 3 — Arquitetura de Componentes

## Tempo sugerido

**1h20**

Nesta fase, vamos melhorar a aplicação com:

* binding de propriedades;
* criação de componente;
* componente filho;
* input;
* CSS;
* lista com `@for`;
* condição com `@if`.

---

# Módulo 7 — Binding de propriedades e atributos

## Objetivo

Ligar propriedades TypeScript a atributos HTML.

Atualize o arquivo `app.ts`:

```ts
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');

  estudante = signal('Ana');
  curso = signal('Angular básico');
  turno = signal('Noite');

  quantidadeTarefas = signal(0);

  imagemAngular = 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif';

  botaoRemoverDesabilitado = computed(() => this.quantidadeTarefas() === 0);

  mensagemResumo = computed(() => {
    return `${this.estudante()} possui ${this.quantidadeTarefas()} tarefa(s) cadastrada(s).`;
  });

  alterarEstudante() {
    this.estudante.set('Carlos');
  }

  alterarCurso() {
    this.curso.set('Angular com componentes');
  }

  adicionarTarefa() {
    this.quantidadeTarefas.update(valorAtual => valorAtual + 1);
  }

  removerTarefa() {
    this.quantidadeTarefas.update(valorAtual => {
      if (valorAtual > 0) {
        return valorAtual - 1;
      }

      return 0;
    });
  }
}
```

Atualize o arquivo `app.html`:

```html
<h1>{{ title() }}</h1>

<img [src]="imagemAngular" alt="Logo do Angular" width="80">

<p>Estudante: {{ estudante() }}</p>
<p>Curso: {{ curso() }}</p>
<p>Turno: {{ turno() }}</p>

<p>Quantidade de tarefas: {{ quantidadeTarefas() }}</p>

<p>{{ mensagemResumo() }}</p>

<button (click)="alterarEstudante()">Alterar estudante</button>

<button (click)="alterarCurso()">Alterar curso</button>

<button (click)="adicionarTarefa()">Adicionar tarefa</button>

<button 
  (click)="removerTarefa()" 
  [disabled]="botaoRemoverDesabilitado()">
  Remover tarefa
</button>
```

## Explicação

Aqui usamos:

```html
[src]="imagemAngular"
```

Isso envia o valor da propriedade `imagemAngular` para o atributo `src` da imagem.

Também usamos:

```html
[disabled]="botaoRemoverDesabilitado()"
```

Isso controla se o botão ficará desabilitado.

---

# Módulo 8 — Criando e aninhando componentes

## Objetivo

Criar um componente separado para representar uma tarefa.

No terminal, dentro da pasta do projeto, execute:

```bash
ng generate component tarefa-card
```

Ou a forma curta:

```bash
ng g c tarefa-card
```

O Angular criará uma pasta parecida com:

```text
src/app/tarefa-card/
```

Dentro dela teremos arquivos como:

```text
tarefa-card.ts
tarefa-card.html
tarefa-card.css
```

---

## 8.1 Editar o componente filho

Abra:

```text
src/app/tarefa-card/tarefa-card.ts
```

Deixe assim:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-tarefa-card',
  imports: [],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css'
})
export class TarefaCard {

}
```

Agora abra:

```text
src/app/tarefa-card/tarefa-card.html
```

Coloque:

```html
<div class="card">
  <h2>Estudar Angular</h2>
  <p>Status: pendente</p>
</div>
```

Agora abra:

```text
src/app/tarefa-card/tarefa-card.css
```

Coloque:

```css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  background-color: #f7f7f7;
}

.card h2 {
  margin: 0 0 8px;
}
```

---

## 8.2 Usar o componente filho no componente principal

Agora abra:

```text
src/app/app.ts
```

Atualize para importar o componente `TarefaCard`:

```ts
import { Component, computed, signal } from '@angular/core';
import { TarefaCard } from './tarefa-card/tarefa-card';

@Component({
  selector: 'app-root',
  imports: [TarefaCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');

  estudante = signal('Ana');
  curso = signal('Angular básico');
  turno = signal('Noite');

  quantidadeTarefas = signal(0);

  imagemAngular = 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif';

  botaoRemoverDesabilitado = computed(() => this.quantidadeTarefas() === 0);

  mensagemResumo = computed(() => {
    return `${this.estudante()} possui ${this.quantidadeTarefas()} tarefa(s) cadastrada(s).`;
  });

  alterarEstudante() {
    this.estudante.set('Carlos');
  }

  alterarCurso() {
    this.curso.set('Angular com componentes');
  }

  adicionarTarefa() {
    this.quantidadeTarefas.update(valorAtual => valorAtual + 1);
  }

  removerTarefa() {
    this.quantidadeTarefas.update(valorAtual => {
      if (valorAtual > 0) {
        return valorAtual - 1;
      }

      return 0;
    });
  }
}
```

Agora abra:

```text
src/app/app.html
```

E adicione no final:

```html
<app-tarefa-card />
```

O arquivo completo fica assim:

```html
<h1>{{ title() }}</h1>

<img [src]="imagemAngular" alt="Logo do Angular" width="80">

<p>Estudante: {{ estudante() }}</p>
<p>Curso: {{ curso() }}</p>
<p>Turno: {{ turno() }}</p>

<p>Quantidade de tarefas: {{ quantidadeTarefas() }}</p>

<p>{{ mensagemResumo() }}</p>

<button (click)="alterarEstudante()">Alterar estudante</button>

<button (click)="alterarCurso()">Alterar curso</button>

<button (click)="adicionarTarefa()">Adicionar tarefa</button>

<button 
  (click)="removerTarefa()" 
  [disabled]="botaoRemoverDesabilitado()">
  Remover tarefa
</button>

<app-tarefa-card />
```

## Explicação

Para usar um componente dentro de outro, precisamos:

1. importar o componente:

```ts
import { TarefaCard } from './tarefa-card/tarefa-card';
```

2. adicionar no `imports`:

```ts
imports: [TarefaCard]
```

3. usar o seletor no HTML:

```html
<app-tarefa-card />
```

---

# Módulo 9 — Entradas de componente com `input`

## Objetivo

Passar dados do componente pai para o componente filho.

A documentação atual do Angular mostra que entradas de componentes podem ser declaradas com `input()` e que o valor recebido é lido como signal, ou seja, chamando-o como função no template. ([Angular][3])

Abra:

```text
src/app/tarefa-card/tarefa-card.ts
```

Substitua por:

```ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tarefa-card',
  imports: [],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css'
})
export class TarefaCard {
  nome = input.required<string>();
  status = input('pendente');
}
```

Agora abra:

```text
src/app/tarefa-card/tarefa-card.html
```

Substitua por:

```html
<div class="card">
  <h2>{{ nome() }}</h2>
  <p>Status: {{ status() }}</p>
</div>
```

Agora abra:

```text
src/app/app.html
```

Substitua:

```html
<app-tarefa-card />
```

por:

```html
<app-tarefa-card nome="Estudar componentes" status="em andamento" />

<app-tarefa-card nome="Praticar signals" status="pendente" />

<app-tarefa-card nome="Revisar templates" status="concluída" />
```

## Explicação

No componente filho, temos:

```ts
nome = input.required<string>();
status = input('pendente');
```

Isso significa:

* `nome` é obrigatório;
* `status` tem valor padrão `"pendente"`.

No componente pai, enviamos os dados assim:

```html
<app-tarefa-card nome="Estudar componentes" status="em andamento" />
```

No componente filho, exibimos assim:

```html
{{ nome() }}
{{ status() }}
```

---

# Módulo 10 — Estilizando a aplicação

## Objetivo

Melhorar o visual usando CSS.

Abra:

```text
src/app/app.css
```

Coloque:

```css
.container {
  max-width: 800px;
  margin: 32px auto;
  font-family: Arial, sans-serif;
  padding: 24px;
}

.header {
  background-color: #f0f4ff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.lista {
  margin-top: 20px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

Agora atualize o `app.html`:

```html
<main class="container">
  <section class="header">
    <h1>{{ title() }}</h1>

    <img [src]="imagemAngular" alt="Logo do Angular" width="80">

    <p>Estudante: {{ estudante() }}</p>
    <p>Curso: {{ curso() }}</p>
    <p>Turno: {{ turno() }}</p>

    <p>Quantidade de tarefas: {{ quantidadeTarefas() }}</p>

    <p>{{ mensagemResumo() }}</p>
  </section>

  <section class="acoes">
    <button (click)="alterarEstudante()">Alterar estudante</button>

    <button (click)="alterarCurso()">Alterar curso</button>

    <button (click)="adicionarTarefa()">Adicionar tarefa</button>

    <button 
      (click)="removerTarefa()" 
      [disabled]="botaoRemoverDesabilitado()">
      Remover tarefa
    </button>
  </section>

  <section class="lista">
    <app-tarefa-card nome="Estudar componentes" status="em andamento" />

    <app-tarefa-card nome="Praticar signals" status="pendente" />

    <app-tarefa-card nome="Revisar templates" status="concluída" />
  </section>
</main>
```

---

# Módulo 11 — Renderização de listas com `@for`

## Objetivo

Exibir vários componentes a partir de uma lista.

O Angular possui controle de fluxo no template, incluindo `@for` para repetição e `@if` para condição. A documentação mostra que o `@for` usa `track` para identificar cada item renderizado. ([Angular][4])

Agora vamos trocar os três cards fixos por uma lista.

Atualize o `app.ts` inteiro:

```ts
import { Component, computed, signal } from '@angular/core';
import { TarefaCard } from './tarefa-card/tarefa-card';

type Tarefa = {
  id: number;
  nome: string;
  status: string;
};

@Component({
  selector: 'app-root',
  imports: [TarefaCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');

  estudante = signal('Ana');
  curso = signal('Angular básico');
  turno = signal('Noite');

  imagemAngular = 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif';

  tarefas = signal<Tarefa[]>([
    { id: 1, nome: 'Estudar componentes', status: 'em andamento' },
    { id: 2, nome: 'Praticar signals', status: 'pendente' },
    { id: 3, nome: 'Revisar templates', status: 'concluída' }
  ]);

  quantidadeTarefas = computed(() => this.tarefas().length);

  botaoRemoverDesabilitado = computed(() => this.quantidadeTarefas() === 0);

  mensagemResumo = computed(() => {
    return `${this.estudante()} possui ${this.quantidadeTarefas()} tarefa(s) cadastrada(s).`;
  });

  alterarEstudante() {
    this.estudante.set('Carlos');
  }

  alterarCurso() {
    this.curso.set('Angular com componentes');
  }

  adicionarTarefa() {
    const novaTarefa: Tarefa = {
      id: Date.now(),
      nome: 'Nova tarefa de estudo',
      status: 'pendente'
    };

    this.tarefas.update(listaAtual => [...listaAtual, novaTarefa]);
  }

  removerTarefa() {
    this.tarefas.update(listaAtual => listaAtual.slice(0, -1));
  }
}
```

Agora atualize o `app.html`:

```html
<main class="container">
  <section class="header">
    <h1>{{ title() }}</h1>

    <img [src]="imagemAngular" alt="Logo do Angular" width="80">

    <p>Estudante: {{ estudante() }}</p>
    <p>Curso: {{ curso() }}</p>
    <p>Turno: {{ turno() }}</p>

    <p>Quantidade de tarefas: {{ quantidadeTarefas() }}</p>

    <p>{{ mensagemResumo() }}</p>
  </section>

  <section class="acoes">
    <button (click)="alterarEstudante()">Alterar estudante</button>

    <button (click)="alterarCurso()">Alterar curso</button>

    <button (click)="adicionarTarefa()">Adicionar tarefa</button>

    <button 
      (click)="removerTarefa()" 
      [disabled]="botaoRemoverDesabilitado()">
      Remover tarefa
    </button>
  </section>

  <section class="lista">
    @for (tarefa of tarefas(); track tarefa.id) {
      <app-tarefa-card 
        [nome]="tarefa.nome" 
        [status]="tarefa.status" />
    }
  </section>
</main>
```

## Explicação

Antes tínhamos cards fixos:

```html
<app-tarefa-card nome="Estudar componentes" status="em andamento" />
```

Agora temos uma lista no TypeScript:

```ts
tarefas = signal<Tarefa[]>([
  { id: 1, nome: 'Estudar componentes', status: 'em andamento' },
  { id: 2, nome: 'Praticar signals', status: 'pendente' },
  { id: 3, nome: 'Revisar templates', status: 'concluída' }
]);
```

E repetimos no HTML:

```html
@for (tarefa of tarefas(); track tarefa.id) {
  <app-tarefa-card 
    [nome]="tarefa.nome" 
    [status]="tarefa.status" />
}
```

Observe a diferença:

Quando passamos texto fixo:

```html
nome="Estudar componentes"
```

Quando passamos valor vindo do TypeScript:

```html
[nome]="tarefa.nome"
```

---

# Módulo 12 — Renderização condicional com `@if`

## Objetivo

Mostrar uma mensagem quando não houver tarefas.

Atualize apenas a parte da lista no `app.html`.

Troque:

```html
<section class="lista">
  @for (tarefa of tarefas(); track tarefa.id) {
    <app-tarefa-card 
      [nome]="tarefa.nome" 
      [status]="tarefa.status" />
  }
</section>
```

por:

```html
<section class="lista">
  @if (tarefas().length > 0) {
    @for (tarefa of tarefas(); track tarefa.id) {
      <app-tarefa-card 
        [nome]="tarefa.nome" 
        [status]="tarefa.status" />
    }
  } @else {
    <p>Nenhuma tarefa cadastrada.</p>
  }
</section>
```

## Explicação

O `@if` verifica uma condição:

```html
@if (tarefas().length > 0)
```

Se a lista tiver tarefas, mostra os cards.

Se a lista estiver vazia, mostra:

```html
<p>Nenhuma tarefa cadastrada.</p>
```

---

# Código final da aplicação

## Arquivo `src/app/app.ts`

```ts
import { Component, computed, signal } from '@angular/core';
import { TarefaCard } from './tarefa-card/tarefa-card';

type Tarefa = {
  id: number;
  nome: string;
  status: string;
};

@Component({
  selector: 'app-root',
  imports: [TarefaCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Lista de Tarefas de Estudo');

  estudante = signal('Ana');
  curso = signal('Angular básico');
  turno = signal('Noite');

  imagemAngular = 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif';

  tarefas = signal<Tarefa[]>([
    { id: 1, nome: 'Estudar componentes', status: 'em andamento' },
    { id: 2, nome: 'Praticar signals', status: 'pendente' },
    { id: 3, nome: 'Revisar templates', status: 'concluída' }
  ]);

  quantidadeTarefas = computed(() => this.tarefas().length);

  botaoRemoverDesabilitado = computed(() => this.quantidadeTarefas() === 0);

  mensagemResumo = computed(() => {
    return `${this.estudante()} possui ${this.quantidadeTarefas()} tarefa(s) cadastrada(s).`;
  });

  alterarEstudante() {
    this.estudante.set('Carlos');
  }

  alterarCurso() {
    this.curso.set('Angular com componentes');
  }

  adicionarTarefa() {
    const novaTarefa: Tarefa = {
      id: Date.now(),
      nome: 'Nova tarefa de estudo',
      status: 'pendente'
    };

    this.tarefas.update(listaAtual => [...listaAtual, novaTarefa]);
  }

  removerTarefa() {
    this.tarefas.update(listaAtual => listaAtual.slice(0, -1));
  }
}
```

---

## Arquivo `src/app/app.html`

```html
<main class="container">
  <section class="header">
    <h1>{{ title() }}</h1>

    <img [src]="imagemAngular" alt="Logo do Angular" width="80">

    <p>Estudante: {{ estudante() }}</p>
    <p>Curso: {{ curso() }}</p>
    <p>Turno: {{ turno() }}</p>

    <p>Quantidade de tarefas: {{ quantidadeTarefas() }}</p>

    <p>{{ mensagemResumo() }}</p>
  </section>

  <section class="acoes">
    <button (click)="alterarEstudante()">Alterar estudante</button>

    <button (click)="alterarCurso()">Alterar curso</button>

    <button (click)="adicionarTarefa()">Adicionar tarefa</button>

    <button 
      (click)="removerTarefa()" 
      [disabled]="botaoRemoverDesabilitado()">
      Remover tarefa
    </button>
  </section>

  <section class="lista">
    @if (tarefas().length > 0) {
      @for (tarefa of tarefas(); track tarefa.id) {
        <app-tarefa-card 
          [nome]="tarefa.nome" 
          [status]="tarefa.status" />
      }
    } @else {
      <p>Nenhuma tarefa cadastrada.</p>
    }
  </section>
</main>
```

---

## Arquivo `src/app/app.css`

```css
.container {
  max-width: 800px;
  margin: 32px auto;
  font-family: Arial, sans-serif;
  padding: 24px;
}

.header {
  background-color: #f0f4ff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.lista {
  margin-top: 20px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Arquivo `src/app/tarefa-card/tarefa-card.ts`

```ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tarefa-card',
  imports: [],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css'
})
export class TarefaCard {
  nome = input.required<string>();
  status = input('pendente');
}
```

---

## Arquivo `src/app/tarefa-card/tarefa-card.html`

```html
<div class="card">
  <h2>{{ nome() }}</h2>
  <p>Status: {{ status() }}</p>
</div>
```

---

## Arquivo `src/app/tarefa-card/tarefa-card.css`

```css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  background-color: #f7f7f7;
}

.card h2 {
  margin: 0 0 8px;
}
```

---

# Roteiro de tempo da aula de 4 horas

## Primeira parte — 40 minutos

Conteúdo:

* criação do projeto;
* limpeza dos arquivos;
* explicação do `app.ts`;
* interpolação;
* evento `(click)`.

Resultado esperado:

O aluno consegue mostrar dados na tela e alterar dados com botão.

---

## Segunda parte — 1 hora

Conteúdo:

* `signal`;
* leitura com `signal()`;
* alteração com `.set()`;
* alteração com `.update()`;
* criação de `computed`.

Resultado esperado:

O aluno entende a diferença entre variável comum e signal.

---

## Intervalo — 10 minutos

---

## Terceira parte — 1h20

Conteúdo:

* binding de propriedade;
* criação de componente;
* componente filho;
* input;
* CSS;
* `@for`;
* `@if`.

Resultado esperado:

O aluno consegue montar uma aplicação com mais de um componente.

---

## Quarta parte — 50 minutos

Atividade prática orientada.

Peça aos alunos para escolherem pelo menos **3 melhorias**:

1. Criar botão para limpar todas as tarefas.
2. Criar botão para alterar o turno.
3. Criar mais tarefas iniciais.
4. Adicionar prioridade na tarefa.
5. Criar um novo componente chamado `cabecalho`.
6. Alterar o texto do título com `set`.
7. Criar uma mensagem computada para indicar se a lista está vazia.
8. Criar botão para marcar todas as tarefas como concluídas.

---

# Exemplo de melhoria: limpar tarefas

No `app.ts`, adicione:

```ts
limparTarefas() {
  this.tarefas.set([]);
}
```

No `app.html`, dentro da seção de botões:

```html
<button (click)="limparTarefas()">Limpar tarefas</button>
```

---

# Exemplo de melhoria: alterar turno

No `app.ts`, adicione:

```ts
alterarTurno() {
  this.turno.set('Vespertino');
}
```

No `app.html`, dentro da seção de botões:

```html
<button (click)="alterarTurno()">Alterar turno</button>
```

---

# Fechamento da aula

Ao final, retome com os alunos:

* Angular organiza a aplicação em componentes;
* `app.ts` guarda dados e métodos;
* `app.html` exibe a interface;
* `app.css` estiliza a interface;
* interpolação usa `{{ }}`;
* evento de clique usa `(click)`;
* signal é lido com parênteses;
* `set` troca o valor diretamente;
* `update` altera com base no valor anterior;
* `computed` calcula um valor derivado;
* componentes podem ser aninhados;
* `input` permite receber dados do componente pai;
* `@for` repete elementos;
* `@if` mostra elementos de forma condicional.

---

# Perguntas para fixação

1. O que é um componente no Angular?
2. Para que serve o arquivo `app.ts`?
3. Para que serve o arquivo `app.html`?
4. Para que serve a interpolação `{{ }}`?
5. O que faz o evento `(click)`?
6. O que é um `signal`?
7. Por que usamos `title()` e não apenas `title`?
8. Qual a diferença entre `set` e `update`?
9. Para que serve o `computed`?
10. Como um componente pai envia dados para um componente filho?
11. Para que serve o `@for`?
12. Para que serve o `@if`?

---

# Avaliação prática sugerida

Solicite que os alunos entreguem uma aplicação Angular simples contendo:

* pelo menos 2 componentes;
* uso de interpolação;
* uso de evento `(click)`;
* pelo menos 3 signals;
* pelo menos 1 computed;
* uso de `set`;
* uso de `update`;
* lista com `@for`;
* condição com `@if`;
* CSS próprio nos componentes.

Entrega sugerida:

* link do repositório no GitHub;
* print da aplicação funcionando;
* breve descrição das funcionalidades implementadas.

[1]: https://angular.dev/overview "What is Angular? • Angular"
[2]: https://angular.dev/guide/signals "Signals • Overview • Angular"
[3]: https://angular.dev/guide/components/inputs "Accepting data with input properties • Angular"
[4]: https://angular.dev/guide/templates/control-flow "Control flow • Angular"
