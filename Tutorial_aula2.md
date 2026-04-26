Nesta aula, a aplicação deixará de ser apenas uma tela com lista de tarefas e passará a ser a base do sistema:

# Gerenciador de Estudos

A aplicação terá:

* estrutura de pastas mais organizada;
* páginas separadas;
* rotas;
* menu lateral com `mat-sidenav`;
* layout principal com `RouterOutlet`;
* modelos de domínio com tipagem forte.

A documentação oficial do Angular apresenta componentes como blocos fundamentais da aplicação e o roteamento como o mecanismo usado para navegar entre diferentes telas ou views. O `RouterOutlet` marca onde a view roteada será exibida, o `RouterLink` cria links de navegação e o `RouterLinkActive` permite aplicar classe visual ao link da rota ativa. ([Angular][1])

---

# Aula 2 — Reestruturação, rotas, menu lateral e modelagem inicial

## Tema

Transformar a aplicação inicial em uma estrutura de sistema real com páginas, menu lateral e modelos bem definidos.

## Objetivo

Reorganizar o projeto para que ele deixe de ser uma tela única e passe a ser o início do sistema **Gerenciador de Estudos**.

## Duração

**4 horas**

---

# 1. Resultado esperado da aula

Ao final da aula, a aplicação terá:

```text
Gerenciador de Estudos
├── Menu lateral
├── Página inicial
├── Página de estudantes
├── Página de tarefas
├── Página de relatórios
└── Página sobre
```

Com as seguintes rotas:

```text
/             → Home
/estudantes   → Estudantes
/tarefas      → Tarefas
/relatorios   → Relatórios
/sobre        → Sobre
```

E com modelos tipados:

```text
Tarefa
StatusTarefa
PrioridadeTarefa
Estudante
TurnoEstudante
```

---

# 2. Organização da aula

| Tempo       | Etapa      | Conteúdo                                       |
| ----------- | ---------- | ---------------------------------------------- |
| 0h00 – 0h20 | Revisão    | Revisão da Aula 1 e objetivo da reestruturação |
| 0h20 – 1h00 | Módulo 1   | Organização de pastas e criação das páginas    |
| 1h00 – 1h40 | Módulo 2   | Configuração de rotas                          |
| 1h40 – 1h50 | Intervalo  | Pausa                                          |
| 1h50 – 2h50 | Módulo 3   | Menu lateral com Angular Material              |
| 2h50 – 3h30 | Módulo 4   | Modelagem inicial com tipagem forte            |
| 3h30 – 4h00 | Fechamento | Testes, revisão e atividade rápida             |

---

# 3. Ponto de partida

Entre na pasta do projeto criado na Aula 1:

```bash
cd aula-angular-tarefas
```

Execute a aplicação:

```bash
ng serve
```

Ou, se estiver usando o Angular CLI local:

```bash
npx ng serve
```

Abra no navegador:

```text
http://localhost:4200
```

---

# 4. O que muda em relação à Aula 1?

Na Aula 1, o componente principal `App` controlava a tela diretamente.

Ele provavelmente tinha:

```text
título
dados do estudante
lista de tarefas
cards
botões
```

A partir desta Aula 2, o componente `App` passa a ser o **layout geral** do sistema.

Ou seja, ele não será mais a tela de tarefas.

Ele será responsável por:

```text
App
├── mat-sidenav
├── mat-toolbar
└── router-outlet
```

As funcionalidades ficarão em páginas separadas.

---

# Módulo 1 — Organização de pastas e criação de páginas

## Tempo sugerido

**40 minutos**

## Objetivo

Criar uma estrutura mais próxima de um projeto real.

---

## 1.1 Estrutura desejada

Dentro de:

```text
src/app
```

vamos organizar o projeto assim:

```text
src/app
├── pages
├── components
├── services
├── models
├── pipes
├── guards
└── interceptors
```

Nesta aula, usaremos principalmente:

```text
pages
models
```

As demais pastas serão preparadas para as próximas aulas.

---

## 1.2 Criar as pastas principais

No terminal, dentro da pasta do projeto:

```bash
mkdir src/app/pages
mkdir src/app/components
mkdir src/app/services
mkdir src/app/models
mkdir src/app/pipes
mkdir src/app/guards
mkdir src/app/interceptors
```

No Windows PowerShell, caso algum comando não funcione, use:

```powershell
New-Item -ItemType Directory -Path src/app/pages
New-Item -ItemType Directory -Path src/app/components
New-Item -ItemType Directory -Path src/app/services
New-Item -ItemType Directory -Path src/app/models
New-Item -ItemType Directory -Path src/app/pipes
New-Item -ItemType Directory -Path src/app/guards
New-Item -ItemType Directory -Path src/app/interceptors
```

---

## 1.3 Criar as páginas

Agora vamos criar os componentes de página.

Execute:

```bash
ng generate component pages/home --skip-tests
ng generate component pages/estudantes --skip-tests
ng generate component pages/tarefas --skip-tests
ng generate component pages/relatorios --skip-tests
ng generate component pages/sobre --skip-tests
```

Ou, com Angular CLI local:

```bash
npx ng generate component pages/home --skip-tests
npx ng generate component pages/estudantes --skip-tests
npx ng generate component pages/tarefas --skip-tests
npx ng generate component pages/relatorios --skip-tests
npx ng generate component pages/sobre --skip-tests
```

A estrutura ficará parecida com:

```text
src/app/pages
├── home
│   ├── home.ts
│   ├── home.html
│   └── home.css
├── estudantes
│   ├── estudantes.ts
│   ├── estudantes.html
│   └── estudantes.css
├── tarefas
│   ├── tarefas.ts
│   ├── tarefas.html
│   └── tarefas.css
├── relatorios
│   ├── relatorios.ts
│   ├── relatorios.html
│   └── relatorios.css
└── sobre
    ├── sobre.ts
    ├── sobre.html
    └── sobre.css
```

---

## 1.4 Ajustar o conteúdo das páginas

Abra:

```text
src/app/pages/home/home.html
```

Coloque:

```html
<h1>Bem-vindo ao Gerenciador de Estudos</h1>

<p>
  Esta aplicação será usada para gerenciar estudantes e suas tarefas de estudo.
</p>
```

Abra:

```text
src/app/pages/estudantes/estudantes.html
```

Coloque:

```html
<h1>Estudantes</h1>

<p>
  Nesta página será implementado o cadastro de estudantes.
</p>
```

Abra:

```text
src/app/pages/tarefas/tarefas.html
```

Coloque:

```html
<h1>Tarefas</h1>

<p>
  Nesta página será implementado o cadastro e a listagem de tarefas.
</p>
```

Abra:

```text
src/app/pages/relatorios/relatorios.html
```

Coloque:

```html
<h1>Relatórios</h1>

<p>
  Nesta página serão exibidos relatórios sobre estudantes e tarefas.
</p>
```

Abra:

```text
src/app/pages/sobre/sobre.html
```

Coloque:

```html
<h1>Sobre</h1>

<p>
  O Gerenciador de Estudos é uma aplicação Angular criada para fins didáticos.
</p>
```

---

# Módulo 2 — Roteamento básico

## Tempo sugerido

**40 minutos**

## Objetivo

Configurar a navegação entre as páginas.

Em uma SPA, as funcionalidades existem dentro de uma única página HTML, e o navegador renderiza apenas as partes necessárias à medida que o usuário navega pela aplicação. Isso melhora a experiência do usuário porque evita o recarregamento completo da página. ([Angular][2])

---

## 2.1 O que é rota?

Explique aos alunos:

Uma rota associa um endereço da aplicação a um componente.

Exemplo:

```text
/estudantes → Estudantes
```

Quando o usuário acessa:

```text
http://localhost:4200/estudantes
```

o Angular exibe o componente da página de estudantes.

---

## 2.2 O que é `RouterOutlet`?

O `RouterOutlet` é o local onde o Angular exibe a página correspondente à rota atual.

Exemplo:

```html
<router-outlet />
```

A documentação do Angular define `RouterOutlet` como a diretiva que marca onde o roteador deve exibir a view correspondente à rota ativa. ([Angular][1])

---

## 2.3 O que é `RouterLink`?

O `RouterLink` transforma um elemento HTML em um link de navegação interno do Angular.

Exemplo:

```html
<a routerLink="/estudantes">Estudantes</a>
```

Segundo a documentação, o `RouterLink` inicia a navegação para uma rota sem recarregar a página inteira. ([Angular][3])

---

## 2.4 O que é `RouterLinkActive`?

O `RouterLinkActive` aplica uma classe CSS quando o link corresponde à rota ativa.

Exemplo:

```html
<a routerLink="/estudantes" routerLinkActive="ativo">
  Estudantes
</a>
```

A documentação informa que o `RouterLinkActive` adiciona ou remove classes em um elemento conforme a rota associada esteja ativa ou inativa. ([Angular][4])

---

## 2.5 Criar ou atualizar o arquivo de rotas

Abra ou crie o arquivo:

```text
src/app/app.routes.ts
```

Coloque:

```ts
import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Estudantes } from './pages/estudantes/estudantes';
import { Tarefas } from './pages/tarefas/tarefas';
import { Relatorios } from './pages/relatorios/relatorios';
import { Sobre } from './pages/sobre/sobre';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'estudantes', component: Estudantes },
  { path: 'tarefas', component: Tarefas },
  { path: 'relatorios', component: Relatorios },
  { path: 'sobre', component: Sobre },
  { path: '**', redirectTo: '' }
];
```

## Observação importante

Dependendo da versão do Angular, os nomes das classes geradas podem variar. Se o Angular gerar algo como:

```ts
export class HomeComponent {}
```

então o import deverá ser:

```ts
import { HomeComponent } from './pages/home/home';
```

e a rota:

```ts
{ path: '', component: HomeComponent }
```

Mas, nas versões mais recentes do Angular CLI, é comum a classe ser gerada com nome simples, como:

```ts
export class Home {}
```

Use o nome que aparecer no arquivo `.ts` de cada página.

---

## 2.6 Configurar o `provideRouter`

Abra:

```text
src/app/app.config.ts
```

Ele pode estar parecido com isto:

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};
```

Atualize para incluir o roteamento:

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
```

---

# Módulo 3 — Menu lateral com Angular Material

## Tempo sugerido

**1 hora**

## Objetivo

Criar o layout principal com `mat-sidenav`.

---

## 3.1 Instalar Angular Material

Se o Angular Material ainda não foi instalado no projeto, execute:

```bash
ng add @angular/material
```

Ou, com Angular CLI local:

```bash
npx ng add @angular/material
```

Quando perguntar o tema, escolha um tema pronto, por exemplo:

```text
Azure/Blue
```

Quando perguntar sobre tipografia:

```text
Set up global Angular Material typography styles?
```

Responda:

```text
y
```

Quando perguntar sobre animações:

```text
Include the Angular animations module?
```

Responda:

```text
y
```

---

## 3.2 Atualizar o componente principal `app.ts`

Abra:

```text
src/app/app.ts
```

Como agora o `App` será apenas o layout geral, substitua o conteúdo por:

```ts
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Gerenciador de Estudos');
}
```

---

## 3.3 Atualizar o template principal `app.html`

Abra:

```text
src/app/app.html
```

Apague o conteúdo anterior da Aula 1 e coloque:

```html
<mat-sidenav-container class="sidenav-container">
  <mat-sidenav mode="side" opened class="sidenav">
    <div class="menu-titulo">
      <h2>Menu</h2>
    </div>

    <mat-nav-list>
      <a
        mat-list-item
        routerLink="/"
        routerLinkActive="ativo"
        [routerLinkActiveOptions]="{ exact: true }"
        ariaCurrentWhenActive="page">
        <mat-icon>home</mat-icon>
        <span>Início</span>
      </a>

      <a
        mat-list-item
        routerLink="/estudantes"
        routerLinkActive="ativo"
        ariaCurrentWhenActive="page">
        <mat-icon>school</mat-icon>
        <span>Estudantes</span>
      </a>

      <a
        mat-list-item
        routerLink="/tarefas"
        routerLinkActive="ativo"
        ariaCurrentWhenActive="page">
        <mat-icon>check_circle</mat-icon>
        <span>Tarefas</span>
      </a>

      <a
        mat-list-item
        routerLink="/relatorios"
        routerLinkActive="ativo"
        ariaCurrentWhenActive="page">
        <mat-icon>bar_chart</mat-icon>
        <span>Relatórios</span>
      </a>

      <a
        mat-list-item
        routerLink="/sobre"
        routerLinkActive="ativo"
        ariaCurrentWhenActive="page">
        <mat-icon>info</mat-icon>
        <span>Sobre</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>

  <mat-sidenav-content>
    <mat-toolbar color="primary" class="toolbar">
      <span>{{ title() }}</span>
    </mat-toolbar>

    <main class="conteudo">
      <router-outlet />
    </main>
  </mat-sidenav-content>
</mat-sidenav-container>
```

## Explicação

O `mat-sidenav-container` é o contêiner principal do layout.

```html
<mat-sidenav-container>
```

O `mat-sidenav` é o menu lateral.

```html
<mat-sidenav mode="side" opened>
```

O `mat-sidenav-content` é a área onde ficam a toolbar e o conteúdo principal.

```html
<mat-sidenav-content>
```

O `router-outlet` é onde a página atual será exibida.

```html
<router-outlet />
```

A navegação ocorre pelos links:

```html
routerLink="/tarefas"
```

A classe visual do link ativo é controlada por:

```html
routerLinkActive="ativo"
```

O atributo:

```html
ariaCurrentWhenActive="page"
```

melhora a acessibilidade, indicando que aquele link representa a página atual. A documentação de acessibilidade do Angular recomenda atenção a atributos ARIA para melhorar experiências para usuários que dependem de tecnologias assistivas. ([Angular][5])

---

## 3.4 Atualizar o estilo principal `app.css`

Abra:

```text
src/app/app.css
```

Substitua por:

```css
.sidenav-container {
  min-height: 100vh;
}

.sidenav {
  width: 240px;
  border-right: 1px solid #d6d9e6;
}

.menu-titulo {
  padding: 16px;
  background-color: #f0f4ff;
}

.menu-titulo h2 {
  margin: 0;
  font-size: 18px;
}

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

.conteudo {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

mat-nav-list a {
  display: flex;
  align-items: center;
  gap: 12px;
}

mat-nav-list a mat-icon {
  margin-right: 8px;
}

.ativo {
  background-color: #e8f0fe;
  font-weight: 600;
}
```

---

# Módulo 4 — Modelagem inicial com tipagem forte

## Tempo sugerido

**40 minutos**

## Objetivo

Criar os modelos iniciais do domínio da aplicação usando TypeScript.

Nesta aula, ainda não criaremos o CRUD completo. O objetivo é preparar o domínio da aplicação.

---

## 4.1 Criar o modelo de tarefa

Crie o arquivo:

```text
src/app/models/tarefa.model.ts
```

Dentro dele, coloque:

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

Aqui estamos usando **tipagem forte** para limitar os valores possíveis.

O `status` não aceita qualquer texto. Ele aceita apenas:

```ts
'pendente' | 'em andamento' | 'concluida'
```

Isso significa que este objeto é válido:

```ts
const tarefa: Tarefa = {
  id: 1,
  nome: 'Estudar rotas',
  status: 'pendente',
  prioridade: 'alta'
};
```

Mas este objeto daria erro:

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

## 4.2 Criar o modelo de estudante

Crie o arquivo:

```text
src/app/models/estudante.model.ts
```

Dentro dele, coloque:

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

## Explicação

O estudante terá:

```text
id
nome
email
curso
turno
```

E o turno também será tipado.

Valores permitidos:

```ts
'matutino' | 'vespertino' | 'noturno'
```

---

## 4.3 Usar os modelos em uma página para demonstração

Para mostrar que os tipos funcionam, abra:

```text
src/app/pages/tarefas/tarefas.ts
```

Substitua o conteúdo por:

```ts
import { Component, signal } from '@angular/core';

import { Tarefa } from '../../models/tarefa.model';

@Component({
  selector: 'app-tarefas',
  imports: [],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css'
})
export class Tarefas {
  tarefas = signal<Tarefa[]>([
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
}
```

Agora abra:

```text
src/app/pages/tarefas/tarefas.html
```

Substitua por:

```html
<h1>Tarefas</h1>

<p>
  Esta página será usada para cadastrar, editar e listar tarefas de estudo.
</p>

<section>
  <h2>Tarefas de exemplo</h2>

  @for (tarefa of tarefas(); track tarefa.id) {
    <article class="tarefa-exemplo">
      <h3>{{ tarefa.nome }}</h3>
      <p>Status: {{ tarefa.status }}</p>
      <p>Prioridade: {{ tarefa.prioridade }}</p>
    </article>
  }
</section>
```

Abra:

```text
src/app/pages/tarefas/tarefas.css
```

Coloque:

```css
.tarefa-exemplo {
  border: 1px solid #d6d9e6;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
  background-color: #f8f9ff;
}

.tarefa-exemplo h3 {
  margin-top: 0;
}
```

---

## 4.4 Usar o modelo de estudante em uma página para demonstração

Abra:

```text
src/app/pages/estudantes/estudantes.ts
```

Substitua por:

```ts
import { Component, signal } from '@angular/core';

import { Estudante } from '../../models/estudante.model';

@Component({
  selector: 'app-estudantes',
  imports: [],
  templateUrl: './estudantes.html',
  styleUrl: './estudantes.css'
})
export class Estudantes {
  estudantes = signal<Estudante[]>([
    {
      id: 1,
      nome: 'Ana Silva',
      email: 'ana@email.com',
      curso: 'Angular Básico',
      turno: 'noturno'
    },
    {
      id: 2,
      nome: 'Carlos Souza',
      email: 'carlos@email.com',
      curso: 'Frontend com Angular',
      turno: 'vespertino'
    }
  ]);
}
```

Abra:

```text
src/app/pages/estudantes/estudantes.html
```

Substitua por:

```html
<h1>Estudantes</h1>

<p>
  Esta página será usada para cadastrar, editar e listar estudantes.
</p>

<section>
  <h2>Estudantes de exemplo</h2>

  @for (estudante of estudantes(); track estudante.id) {
    <article class="estudante-exemplo">
      <h3>{{ estudante.nome }}</h3>
      <p>E-mail: {{ estudante.email }}</p>
      <p>Curso: {{ estudante.curso }}</p>
      <p>Turno: {{ estudante.turno }}</p>
    </article>
  }
</section>
```

Abra:

```text
src/app/pages/estudantes/estudantes.css
```

Coloque:

```css
.estudante-exemplo {
  border: 1px solid #d6d9e6;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
  background-color: #f8f9ff;
}

.estudante-exemplo h3 {
  margin-top: 0;
}
```

---

# Módulo 5 — Testes da navegação e fechamento

## Tempo sugerido

**30 minutos**

## Objetivo

Testar se o layout, as rotas, o menu lateral e os modelos estão funcionando.

---

## 5.1 Testar as rotas pelo menu

Clique em:

```text
Início
Estudantes
Tarefas
Relatórios
Sobre
```

Resultado esperado:

* a URL deve mudar;
* o conteúdo central deve mudar;
* o menu lateral deve permanecer fixo;
* a toolbar deve permanecer no topo;
* o link ativo deve ficar destacado.

---

## 5.2 Testar rotas diretamente pela URL

No navegador, teste:

```text
http://localhost:4200/
http://localhost:4200/estudantes
http://localhost:4200/tarefas
http://localhost:4200/relatorios
http://localhost:4200/sobre
```

Resultado esperado:

Cada endereço deve abrir sua respectiva página.

---

## 5.3 Testar rota inexistente

Digite:

```text
http://localhost:4200/qualquer-coisa
```

Resultado esperado:

A aplicação deve redirecionar para:

```text
/
```

Isso acontece por causa da rota:

```ts
{ path: '**', redirectTo: '' }
```

---

# Código final esperado da Aula 2

## `src/app/app.ts`

```ts
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Gerenciador de Estudos');
}
```

---

## `src/app/app.html`

```html
<mat-sidenav-container class="sidenav-container">
  <mat-sidenav mode="side" opened class="sidenav">
    <div class="menu-titulo">
      <h2>Menu</h2>
    </div>

    <mat-nav-list>
      <a
        mat-list-item
        routerLink="/"
        routerLinkActive="ativo"
        [routerLinkActiveOptions]="{ exact: true }"
        ariaCurrentWhenActive="page">
        <mat-icon>home</mat-icon>
        <span>Início</span>
      </a>

      <a
        mat-list-item
        routerLink="/estudantes"
        routerLinkActive="ativo"
        ariaCurrentWhenActive="page">
        <mat-icon>school</mat-icon>
        <span>Estudantes</span>
      </a>

      <a
        mat-list-item
        routerLink="/tarefas"
        routerLinkActive="ativo"
        ariaCurrentWhenActive="page">
        <mat-icon>check_circle</mat-icon>
        <span>Tarefas</span>
      </a>

      <a
        mat-list-item
        routerLink="/relatorios"
        routerLinkActive="ativo"
        ariaCurrentWhenActive="page">
        <mat-icon>bar_chart</mat-icon>
        <span>Relatórios</span>
      </a>

      <a
        mat-list-item
        routerLink="/sobre"
        routerLinkActive="ativo"
        ariaCurrentWhenActive="page">
        <mat-icon>info</mat-icon>
        <span>Sobre</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>

  <mat-sidenav-content>
    <mat-toolbar color="primary" class="toolbar">
      <span>{{ title() }}</span>
    </mat-toolbar>

    <main class="conteudo">
      <router-outlet />
    </main>
  </mat-sidenav-content>
</mat-sidenav-container>
```

---

## `src/app/app.css`

```css
.sidenav-container {
  min-height: 100vh;
}

.sidenav {
  width: 240px;
  border-right: 1px solid #d6d9e6;
}

.menu-titulo {
  padding: 16px;
  background-color: #f0f4ff;
}

.menu-titulo h2 {
  margin: 0;
  font-size: 18px;
}

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

.conteudo {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

mat-nav-list a {
  display: flex;
  align-items: center;
  gap: 12px;
}

mat-nav-list a mat-icon {
  margin-right: 8px;
}

.ativo {
  background-color: #e8f0fe;
  font-weight: 600;
}
```

---

## `src/app/app.routes.ts`

```ts
import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Estudantes } from './pages/estudantes/estudantes';
import { Tarefas } from './pages/tarefas/tarefas';
import { Relatorios } from './pages/relatorios/relatorios';
import { Sobre } from './pages/sobre/sobre';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'estudantes', component: Estudantes },
  { path: 'tarefas', component: Tarefas },
  { path: 'relatorios', component: Relatorios },
  { path: 'sobre', component: Sobre },
  { path: '**', redirectTo: '' }
];
```

---

## `src/app/app.config.ts`

Use a versão compatível com o seu projeto.

Se estiver assim:

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};
```

atualize para:

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
```

Se o seu arquivo for mais simples, use:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

---

## `src/app/models/tarefa.model.ts`

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

---

## `src/app/models/estudante.model.ts`

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

---

# Pontos principais para explicar aos alunos

## 1. O componente `App` mudou de função

Antes:

```text
App era a tela principal da aplicação.
```

Agora:

```text
App é o layout geral da aplicação.
```

Ele contém:

```text
menu lateral
toolbar
router-outlet
```

---

## 2. As páginas são componentes

Cada página é um componente Angular:

```text
Home
Estudantes
Tarefas
Relatórios
Sobre
```

A diferença é que esses componentes representam telas completas da aplicação.

---

## 3. Rotas conectam URLs a páginas

Exemplo:

```text
/tarefas → Tarefas
```

A configuração fica em:

```text
app.routes.ts
```

---

## 4. `RouterOutlet` exibe a página atual

O conteúdo da rota ativa aparece aqui:

```html
<router-outlet />
```

---

## 5. `RouterLink` navega sem recarregar a página

Exemplo:

```html
<a routerLink="/estudantes">Estudantes</a>
```

---

## 6. `RouterLinkActive` destaca o link atual

Exemplo:

```html
routerLinkActive="ativo"
```

---

## 7. `mat-sidenav` cria o menu lateral

O menu lateral fica fixo e a área principal troca o conteúdo conforme a rota.

---

## 8. Tipagem forte evita valores inválidos

Com:

```ts
export type StatusTarefa = 'pendente' | 'em andamento' | 'concluida';
```

o TypeScript impede valores como:

```ts
'finalizada'
```

Isso ajuda a reduzir erros no código.

---

# Atividade final da Aula 2

Peça aos alunos para fazerem pelo menos duas melhorias:

1. Alterar o texto da página inicial.
2. Criar uma página chamada `perfil`.
3. Adicionar o link `Perfil` no menu lateral.
4. Criar um novo tipo chamado `Curso`.
5. Adicionar uma tarefa de exemplo na página de tarefas.
6. Adicionar um estudante de exemplo na página de estudantes.
7. Alterar os ícones do menu lateral.
8. Criar uma rota coringa para uma página “Não encontrada” em vez de redirecionar para Home.

---

# Fechamento da aula

Ao final, retome:

```text
App agora é layout.
As páginas são componentes.
RouterOutlet mostra a página atual.
RouterLink permite navegar.
RouterLinkActive destaca a rota ativa.
mat-sidenav cria o menu lateral.
models guardam a estrutura dos dados.
types tornam o domínio mais seguro.
```

Resultado final da Aula 2:

```text
Aplicação com layout principal, menu lateral, navegação entre páginas e modelos tipados.
```

A aplicação agora está preparada para a Aula 3, na qual a página `/tarefas` será transformada em um CRUD de tarefas com formulário, validação visual e comunicação entre componentes.

[1]: https://angular.dev/guide/routing/router-reference?utm_source=chatgpt.com "Router reference"
[2]: https://v18.angular.dev/guide/routing/router-tutorial/?utm_source=chatgpt.com "Routing in single-page applications"
[3]: https://angular.dev/api/router/RouterLink?utm_source=chatgpt.com "RouterLink"
[4]: https://angular.dev/api/router/RouterLinkActive?utm_source=chatgpt.com "RouterLinkActive"
[5]: https://angular.dev/best-practices/a11y?utm_source=chatgpt.com "Accessibility"
