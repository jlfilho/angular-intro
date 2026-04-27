# Plano completo — Curso Angular

## Produto final do curso

A aplicação final será um sistema chamado:

```text
Gerenciador de Estudos
```

O sistema permitirá gerenciar:

```text
Estudantes
Tarefas de estudo
Relatórios
Login e rotas protegidas
```

A aplicação evoluirá aula por aula, começando com fundamentos e chegando até API REST fake e autenticação com JWT.

---

# Visão geral da nova organização

| Aula   | Tema                                                    | Produto gerado                                             |
| ------ | ------------------------------------------------------- | ---------------------------------------------------------- |
| Aula 1 | Fundamentos Angular                                     | Lista simples com signals e componentes                    |
| Aula 2 | Reestruturação, rotas, menu lateral e modelagem inicial | Gerenciador de Estudos com `mat-sidenav` e modelos tipados |
| Aula 3 | CRUD de tarefas com Forms, Outputs e validação          | Página de tarefas com CRUD validado                        |
| Aula 4 | CRUD de estudantes com Reactive Forms                   | Página de estudantes com validação robusta                 |
| Aula 5 | Relação estudante-tarefa                                | Tarefas vinculadas a estudantes                            |
| Aula 6 | Pipes, imagens e `@defer`                               | Dados formatados, imagens e relatórios                     |
| Aula 7 | API REST com json-server                                | CRUD consumindo endpoints                                  |
| Aula 8 | JWT, Interceptor e Guard                                | Login, token e rotas protegidas                            |

Carga horária sugerida:

```text
8 aulas × 4 horas = 32 horas
```

Com atividade final/apresentação:

```text
36 horas
```

---

# Aula 1 — Fundamentos Angular

## Tema

Primeira aplicação Angular com componentes, signals e renderização dinâmica.

## Objetivo

Apresentar os fundamentos do Angular por meio de uma aplicação simples de lista de tarefas.

## Conteúdos

* Estrutura de um projeto Angular.
* Anatomia de um componente:

  * arquivo `.ts`;
  * arquivo `.html`;
  * arquivo `.css`.
* Interpolação.
* Event binding com `(click)`.
* Property binding.
* Signals:

  * `signal`;
  * `set`;
  * `update`;
  * `computed`.
* Component composition.
* Component input properties.
* Renderização condicional com `@if`.
* Renderização de listas com `@for`.

## Produto da aula

Uma lista inicial de tarefas de estudo.

Resultado esperado:

```text
Lista de tarefas com cards, signals, contador e renderização dinâmica.
```

## Papel no curso

Essa aula é introdutória. O objetivo é que o aluno entenda a base antes da reestruturação da aplicação nas próximas aulas.

---

# Aula 2 — Reestruturação, rotas, menu lateral e modelagem inicial

## Tema

Transformar a aplicação inicial em uma estrutura de sistema real com páginas, menu lateral e modelos bem definidos.

## Objetivo

Reorganizar o projeto para que ele deixe de ser uma tela única e passe a ser o início do sistema **Gerenciador de Estudos**.

## Conteúdos

### 1. Reestruturação do projeto

Organização em pastas:

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

### 2. Roteamento básico

* O que é SPA.
* O que é rota.
* O que é `RouterOutlet`.
* O que é `RouterLink`.
* O que é `RouterLinkActive`.
* Definição de rotas.

Rotas iniciais:

```text
/             → Home
/estudantes   → Estudantes
/tarefas      → Tarefas
/relatorios   → Relatórios
/sobre        → Sobre
```

### 3. Criação de páginas

Criar páginas:

```text
pages/home
pages/estudantes
pages/tarefas
pages/relatorios
pages/sobre
```

### 4. Menu lateral com Angular Material

Componentes Angular Material:

* `MatSidenavModule`;
* `MatToolbarModule`;
* `MatListModule`;
* `MatIconModule`;
* `MatButtonModule`.

Estrutura visual:

```text
------------------------------------------------
| Gerenciador de Estudos                       |
------------------------------------------------
| Menu lateral       | Conteúdo da página atual |
|                    |                          |
| Início             | <router-outlet>          |
| Estudantes         |                          |
| Tarefas            |                          |
| Relatórios         |                          |
| Sobre              |                          |
------------------------------------------------
```

O componente principal passa a ser o layout geral:

```text
App
├── mat-sidenav
├── mat-toolbar
└── router-outlet
```

### 5. Modelagem inicial com tipagem forte

Criar os modelos iniciais na pasta:

```text
src/app/models
```

Modelo de tarefa:

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

Modelo de estudante:

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

## Produto da aula

Aplicação reestruturada como **Gerenciador de Estudos**, com:

* menu lateral usando `mat-sidenav`;
* rotas iniciais;
* páginas separadas;
* estrutura de pastas mais organizada;
* modelos de domínio com tipagem forte.

Resultado esperado:

```text
Aplicação com layout principal, menu lateral, navegação entre páginas e modelos tipados.
```

## Observação importante

Nesta aula entra a **tipagem forte do domínio da tarefa**:

```text
StatusTarefa
PrioridadeTarefa
```

Mas ainda não entra validação visual de formulário. Essa parte fica para a Aula 3.

---

# Aula 3 — CRUD de tarefas com Forms, Outputs e validação

## Tema

Criar a página de tarefas com formulário, serviço local, componente filho com outputs e validação visual.

## Objetivo

Construir o CRUD de tarefas dentro da página `/tarefas`, já aproveitando a estrutura com rotas criada na Aula 2.

## Conteúdos

### 1. Serviço local de tarefas

Criar:

```text
services/tarefa.service.ts
```

Responsabilidades:

* listar tarefas;
* cadastrar tarefa;
* editar tarefa;
* remover tarefa;
* buscar tarefa por id.

### 2. Formulário com Template-driven Forms

* `FormsModule`;
* `[(ngModel)]`;
* `ngSubmit`;
* cadastro de tarefa;
* edição de tarefa;
* cancelamento de edição.

Campos:

```text
Nome
Status
Prioridade
```

### 3. Validação visual de formulário

Nesta aula entram os itens:

```text
ngForm
ngModel
mat-error
```

Validações:

* campo obrigatório;
* tamanho mínimo;
* mensagens de erro;
* botão de envio desabilitado quando o formulário estiver inválido.

Exemplo conceitual:

```html
<form #formTarefa="ngForm" (ngSubmit)="salvarFormulario()">
```

Campo com validação:

```html
<input
  matInput
  name="nome"
  [(ngModel)]="novoNome"
  required
  minlength="3"
  #nome="ngModel">
```

Mensagem de erro:

```html
@if (nome.invalid && nome.touched) {
  <mat-error>O nome da tarefa é obrigatório.</mat-error>
}
```

Botão desabilitado:

```html
<button
  mat-raised-button
  type="submit"
  [disabled]="formTarefa.invalid">
  Salvar
</button>
```

### 4. Component output properties

Melhorar o componente `tarefa-card`.

Antes:

```text
TarefaCard apenas exibe dados.
```

Depois:

```text
TarefaCard
├── Exibe tarefa
├── Botão Editar
└── Botão Remover
```

### 5. Comunicação filho → pai

Trabalhar:

```text
input  → pai envia dados ao filho
output → filho envia eventos ao pai
```

Exemplo conceitual:

```ts
editar = output<number>();
remover = output<number>();
```

No componente filho:

```ts
this.editar.emit(this.id());
this.remover.emit(this.id());
```

No componente pai:

```html
<app-tarefa-card
  [id]="tarefa.id"
  [nome]="tarefa.nome"
  [status]="tarefa.status"
  [prioridade]="tarefa.prioridade"
  (editar)="editarTarefaPorId($event)"
  (remover)="removerTarefa($event)" />
```

### 6. Angular Material na página de tarefas

Usar:

* `mat-card`;
* `mat-form-field`;
* `mat-input`;
* `mat-select`;
* `mat-button`;
* `mat-error`.

## Produto da aula

Página `/tarefas` com CRUD local de tarefas.

Resultado esperado:

```text
Cadastrar, editar, cancelar edição, remover e validar tarefas.
```

O componente `tarefa-card` terá botões próprios e comunicação via `output`.

---

# Aula 4 — CRUD de estudantes com Reactive Forms

## Tema

Criar a página de estudantes usando formulários reativos.

## Objetivo

Trabalhar uma segunda entidade do sistema, usando uma abordagem mais robusta de formulários.

## Conteúdos

### 1. Modelo de estudante

A partir do modelo criado na Aula 2:

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

Pode ser expandido para:

```ts
export type Estudante = {
  id: number;
  nome: string;
  email: string;
  curso: string;
  turno: TurnoEstudante;
  dataIngresso: string;
};
```

### 2. Serviço local de estudantes

Criar:

```text
services/estudante.service.ts
```

Responsabilidades:

* listar estudantes;
* cadastrar estudante;
* editar estudante;
* remover estudante;
* buscar estudante por id.

### 3. Reactive Forms

Trabalhar:

* `ReactiveFormsModule`;
* `FormGroup`;
* `FormControl`;
* `Validators`;
* validação no TypeScript;
* mensagens de erro no template.

Exemplo conceitual:

```ts
formEstudante = new FormGroup({
  nome: new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]),
  email: new FormControl('', [
    Validators.required,
    Validators.email
  ]),
  curso: new FormControl('', Validators.required),
  turno: new FormControl('', Validators.required)
});
```

### 4. CRUD de estudantes

A página `/estudantes` permitirá:

* cadastrar estudante;
* editar estudante;
* cancelar edição;
* remover estudante;
* listar estudantes.

### 5. Angular Material

Usar:

* `mat-card`;
* `mat-form-field`;
* `mat-input`;
* `mat-select`;
* `mat-button`;
* `mat-error`;
* opcionalmente `mat-table` ou cards.

## Produto da aula

Página `/estudantes` com CRUD local de estudantes usando Reactive Forms.

Resultado esperado:

```text
Cadastro de estudantes com validação robusta e formulário controlado pelo TypeScript.
```

---

# Aula 5 — Relação estudante-tarefa

## Tema

Vincular tarefas aos estudantes.

## Objetivo

Transformar a aplicação em um sistema mais realista, em que cada tarefa pertence a um estudante.

## Conteúdos

### 1. Atualização do modelo de tarefa

Adicionar:

```ts
estudanteId: number;
```

Modelo atualizado:

```ts
export type StatusTarefa = 'pendente' | 'em andamento' | 'concluida';

export type PrioridadeTarefa = 'baixa' | 'media' | 'alta';

export type Tarefa = {
  id: number;
  estudanteId: number;
  nome: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataEntrega?: string;
};
```

### 2. Campo estudante no formulário de tarefa

Adicionar um select:

```text
Estudante responsável
```

O formulário de tarefas passa a permitir escolher qual estudante está associado à tarefa.

### 3. Exibir estudante na tarefa

Na listagem de tarefas, mostrar:

```text
Nome da tarefa
Status
Prioridade
Estudante responsável
```

### 4. Filtros

Adicionar filtros:

```text
Todas as tarefas
Tarefas por estudante
Tarefas pendentes
Tarefas concluídas
Tarefas por prioridade
```

### 5. Computed signals para totais

Criar indicadores:

```text
Total de tarefas
Tarefas pendentes
Tarefas concluídas
Tarefas de alta prioridade
```

### 6. Relatório simples

Criar uma seção inicial de relatório com:

```text
Total de estudantes
Total de tarefas
Tarefas por estudante
```

## Produto da aula

Tarefas vinculadas a estudantes.

Resultado esperado:

```text
Cada tarefa pertence a um estudante, e a aplicação permite filtrar e visualizar essa relação.
```

---

# Aula 6 — Pipes, imagens e Deferrable Views

## Tema

Formatação de dados, imagens e carregamento sob demanda.

## Objetivo

Melhorar a apresentação dos dados e introduzir recursos modernos de carregamento.

## Conteúdos

### 1. Pipes nativos

Trabalhar:

* `uppercase`;
* `lowercase`;
* `titlecase`;
* `date`;
* `json`.

Exemplos:

```html
{{ estudante.nome | titlecase }}
{{ estudante.email | lowercase }}
{{ tarefa.dataEntrega | date:'dd/MM/yyyy' }}
```

### 2. Pipe personalizado

Criar pipe para formatar valores do domínio.

Opções:

```text
turnoLabel
prioridadeLabel
statusTarefaLabel
```

Exemplo:

```text
concluida → Concluída
media     → Média
noturno   → Noturno
```

### 3. Imagens

Trabalhar:

* imagens locais na pasta `public`;
* atributo `alt`;
* `width`;
* `height`;
* boas práticas de acessibilidade;
* avatar de estudante.

Exemplo:

```html
<img
  src="/avatar-estudante.png"
  alt="Avatar do estudante"
  width="80"
  height="80">
```

### 4. Deferrable Views

Trabalhar:

* `@defer`;
* `@placeholder`;
* `@loading`;
* `@error`.

Criar um componente:

```text
components/relatorio-estudos
```

O relatório pode exibir:

```text
Total de estudantes
Total de tarefas
Tarefas pendentes
Tarefas concluídas
Tarefas por prioridade
Tarefas por estudante
```

Exemplo conceitual:

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

## Produto da aula

Aplicação com dados formatados, imagens e relatório carregado sob demanda.

Resultado esperado:

```text
Dados mais bem apresentados, pipe personalizado e relatório com @defer.
```

---

# Aula 7 — Consumo de API REST com json-server

## Tema

Substituir os dados locais por uma API REST simulada.

## Objetivo

Fazer a aplicação consumir endpoints usando `HttpClient`.

## Conteúdos

### 1. Conceitos iniciais

* O que é API REST.
* O que é endpoint.
* O que é JSON.
* O que é `json-server`.
* Verbos HTTP:

  * `GET`;
  * `POST`;
  * `PUT`;
  * `PATCH`;
  * `DELETE`.

### 2. json-server

Instalar:

```bash
npm install json-server --save-dev
```

Criar:

```text
db.json
```

Estrutura sugerida:

```json
{
  "estudantes": [
    {
      "id": 1,
      "nome": "Ana Silva",
      "email": "ana@email.com",
      "curso": "Angular Básico",
      "turno": "noturno",
      "dataIngresso": "2026-05-01"
    }
  ],
  "tarefas": [
    {
      "id": 1,
      "estudanteId": 1,
      "nome": "Estudar Angular",
      "status": "pendente",
      "prioridade": "alta",
      "dataEntrega": "2026-05-10"
    }
  ]
}
```

### 3. Endpoints

```text
GET     /estudantes
POST    /estudantes
PUT     /estudantes/:id
DELETE  /estudantes/:id

GET     /tarefas
POST    /tarefas
PUT     /tarefas/:id
DELETE  /tarefas/:id
```

### 4. HttpClient

Trabalhar:

* `HttpClient`;
* `provideHttpClient`;
* `get`;
* `post`;
* `put`;
* `delete`;
* `subscribe`;
* tratamento de erro;
* estado de carregamento.

### 5. Refatoração dos serviços

Transformar:

```text
TarefaService
EstudanteService
```

em serviços HTTP.

## Produto da aula

CRUD de estudantes e tarefas consumindo API REST fake.

Resultado esperado:

```text
Dados persistidos no json-server e consumidos via HttpClient.
```

---

# Aula 8 — Autenticação com JWT, Bearer Token, Interceptor e Guard

## Tema

Implementar autenticação e proteção de rotas.

## Objetivo

Adicionar login, token, envio automático de Bearer Token e proteção de rotas.

## Conteúdos

### 1. Página de login

Criar rota:

```text
/login
```

Formulário de login:

```text
email
senha
```

### 2. AuthService

Responsabilidades:

```text
login
logout
armazenar token
recuperar token
verificar autenticação
```

### 3. JWT e Bearer Token

Explicar:

```text
JWT
Token
Bearer Token
Authorization header
```

Cabeçalho:

```text
Authorization: Bearer TOKEN
```

### 4. localStorage

Armazenar token:

```text
access_token
```

### 5. HTTP Interceptor

Adicionar o token automaticamente nas requisições:

```ts
Authorization: `Bearer ${token}`
```

### 6. Auth Guard

Proteger rotas:

```text
/estudantes
/tarefas
/relatorios
```

Se autenticado:

```text
permite acesso
```

Se não autenticado:

```text
redireciona para /login
```

### 7. Menu lateral com autenticação

Quando não autenticado:

```text
Login
Sobre
```

Quando autenticado:

```text
Início
Estudantes
Tarefas
Relatórios
Sobre
Sair
```

## Produto da aula

Aplicação com login, token, interceptor e rotas protegidas.

Resultado esperado:

```text
Gerenciador de Estudos com autenticação simulada e envio automático de Bearer Token.
```

---

# Estrutura final esperada do projeto

```text
src/app
├── components
│   ├── tarefa-card
│   ├── estudante-card
│   └── relatorio-estudos
├── pages
│   ├── home
│   ├── estudantes
│   ├── tarefas
│   ├── relatorios
│   ├── sobre
│   └── login
├── services
│   ├── tarefa.service.ts
│   ├── estudante.service.ts
│   └── auth.service.ts
├── models
│   ├── tarefa.model.ts
│   └── estudante.model.ts
├── pipes
│   ├── prioridade-label.pipe.ts
│   ├── status-tarefa-label.pipe.ts
│   └── turno-label.pipe.ts
├── guards
│   └── auth.guard.ts
├── interceptors
│   └── auth.interceptor.ts
├── app.ts
├── app.html
├── app.css
├── app.routes.ts
└── app.config.ts
```

---

# Avaliação final sugerida

## Produto

Aplicação Angular chamada:

```text
Gerenciador de Estudos
```

## Requisitos mínimos

A aplicação deve conter:

* layout com menu lateral usando `mat-sidenav`;
* navegação com rotas;
* página inicial;
* página de estudantes;
* página de tarefas;
* página de relatórios;
* página sobre;
* CRUD de estudantes;
* CRUD de tarefas;
* tarefas vinculadas a estudantes;
* tipagem forte para status e prioridade;
* formulário com `ngModel` e validação visual;
* formulário reativo no cadastro de estudantes;
* serviço local e serviço HTTP;
* API fake com `json-server`;
* pipes nativos;
* pipe personalizado;
* componente com `input`;
* componente com `output`;
* imagens com boas práticas;
* relatório carregado com `@defer`;
* login;
* token;
* interceptor;
* guard;
* rotas protegidas;
* versionamento no GitHub.

## Produto final esperado

```text
Sistema Angular de gerenciamento de estudos com estudantes, tarefas, menu lateral, API fake e autenticação simulada.
```

---

# Resumo didático da progressão

```text
Aula 1 → entender Angular
Aula 2 → organizar a aplicação como sistema
Aula 3 → CRUD de tarefas validado
Aula 4 → CRUD de estudantes com formulário reativo
Aula 5 → relacionar estudantes e tarefas
Aula 6 → melhorar apresentação e performance
Aula 7 → consumir API REST
Aula 8 → autenticar e proteger rotas
```

