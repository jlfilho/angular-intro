# 🎓 Aula 5 — Relação Estudante–Tarefa

## Tema

Relacionar tarefas com estudantes (1:N).

## Objetivo

Evoluir o sistema para um cenário **real**, onde:

```text
Cada tarefa pertence a um estudante
```

---

# 🧠 O que muda em relação à Aula 4

Até agora:

```text
Tarefa → independente
Estudante → independente
```

Agora:

```text
Tarefa → pertence a um estudante
```

Ou seja:

```text
Tarefa.estudanteId → aponta para Estudante.id
```

---

# ⏱️ Organização da aula (4 horas)

| Tempo     | Etapa      | Conteúdo                        |
| --------- | ---------- | ------------------------------- |
| 0h00–0h20 | Revisão    | Aula 3 + Aula 4                 |
| 0h20–0h50 | Modelo     | Relacionamento tarefa-estudante |
| 0h50–1h40 | Formulário | Select de estudante             |
| 1h40–1h50 | Intervalo  | Pausa                           |
| 1h50–2h50 | Listagem   | Mostrar estudante na tarefa     |
| 2h50–3h30 | Filtros    | Filtrar tarefas                 |
| 3h30–4h00 | Relatórios | Computed + indicadores          |

---

# 📌 Módulo 1 — Atualizar modelo de tarefa

## Passo 1 — editar o model

Abra:

```text
src/app/models/tarefa.model.ts
```

Atualize para:

```ts
export type StatusTarefa = 'pendente' | 'em andamento' | 'concluida';

export type PrioridadeTarefa = 'baixa' | 'media' | 'alta';

export type Tarefa = {
  id: number;
  estudanteId: number; // 🔥 NOVO
  nome: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataEntrega?: string;
};
```

---

## Explicação didática

```text
estudanteId = chave estrangeira
```

Exemplo:

```ts
{
  id: 1,
  estudanteId: 2,
  nome: 'Estudar Angular',
  status: 'pendente',
  prioridade: 'alta'
}
```

---

# 📌 Módulo 2 — Atualizar TarefaService

## Passo 1 — ajustar cadastro

Abra:

```text
src/app/services/tarefa.service.ts
```

Atualize:

```ts

private readonly tarefas = signal<Tarefa[]>([
    {
      id: 1,
      estudanteId: 1, // 🔥 NOVO
      nome: 'Reestruturar aplicação Angular',
      status: 'pendente',
      prioridade: 'alta'
    },
    {
      id: 2,
      estudanteId: 1, // 🔥 NOVO
      nome: 'Criar menu lateral',
      status: 'em andamento',
      prioridade: 'media'
    }
  ]);



cadastrar(tarefa: Omit<Tarefa, 'id'>): void {
  const novaTarefa: Tarefa = {
    id: this.proximoId,
    ...tarefa
  };

  this.tarefas.update(lista => [...lista, novaTarefa]);

  this.proximoId++;
}


editar(id: number, tarefaAtualizada: Omit<Tarefa, 'id'>): void {
    this.tarefas.update(listaAtual =>
      listaAtual.map(tarefa =>
        tarefa.id === id
          ? {
            id,
            estudanteId: tarefaAtualizada.estudanteId, // 🔥 NOVO
            nome: tarefaAtualizada.nome,
            status: tarefaAtualizada.status,
            prioridade: tarefaAtualizada.prioridade
          }
          : tarefa
      )
    );
```

✔ Agora inclui `estudanteId`

---

# 📌 Módulo 3 — Carregar estudantes na página de tarefas

## Passo 1 — importar service

```ts
import { EstudanteService } from '../../services/estudante.service';
```

---

## Passo 2 — inject()

```ts
private readonly estudanteService = inject(EstudanteService);
```

---

## Passo 3 — criar lista

```ts
estudantes = this.estudanteService.listar();
```

---

# 📌 Módulo 4 — Select de estudante no formulário

## HTML (`tarefas.html`)

Adicionar:

```html
<mat-form-field appearance="outline" class="campo">
  <mat-label>Estudante responsável</mat-label>

  <mat-select name="estudanteId" [(ngModel)]="novoEstudanteId" required #estudanteId="ngModel">
    @for (estudante of estudantes(); track estudante.id) {
    <mat-option [value]="estudante.id"> {{ estudante.nome }} </mat-option>
    }
  </mat-select>

  @if (estudanteId.invalid && estudanteId.touched) {
  <mat-error>Selecione um estudante.</mat-error>
  }
</mat-form-field>
```

---

## TS (`tarefas.ts`)

Adicionar:

```ts
novoEstudanteId: number | null = null;
```

---

## Atualizar salvar:

```ts
const dadosFormulario = {
  nome: this.novoNome,
  status: this.novoStatus,
  prioridade: this.novaPrioridade,
  estudanteId: this.novoEstudanteId!,
};
```

---

# 📌 Módulo 5 — Mostrar estudante na tarefa

## Problema

A tarefa só tem `estudanteId`.

Precisamos buscar o nome.

---

A correção é: **a página `Tarefas` busca o nome do estudante e envia para o `TarefaCard` por input.**

---

## 1. Atualize `tarefa-card.ts`

Em:

```text
src/app/components/tarefa-card/tarefa-card.ts
```

Adicione este input:

```ts
estudanteNome = input.required<string>();
```

Ficando assim:

```ts
export class TarefaCard {
  id = input.required<number>();
  nome = input.required<string>();
  status = input<StatusTarefa>('pendente');
  prioridade = input.required<PrioridadeTarefa>();
  estudanteNome = input.required<string>(); // 🔥 NOVO

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

## 2. Atualize `tarefa-card.html`

Em:

```text
src/app/components/tarefa-card/tarefa-card.html
```

Dentro de `<mat-card-content>`, coloque:

```html
<p>
  <strong>Estudante:</strong>
  {{ estudanteNome() }}
</p>
```

Por exemplo:

```html
<mat-card-content>
  <p>
    <strong>Status:</strong>
    @if (status() === 'pendente') { Pendente } @else if (status() === 'em andamento') { Em andamento
    } @else { Concluída }
  </p>

  <p>
    <strong>Prioridade:</strong>
    @if (prioridade() === 'baixa') { Baixa } @else if (prioridade() === 'media') { Média } @else {
    Alta }
  </p>

  <p>
    <strong>Estudante:</strong>
    {{ estudanteNome() }}
  </p>
</mat-card-content>
```

---

## 3. Atualize `tarefas.html`

Onde o card é chamado, adicione o novo input:

```html
<app-tarefa-card
  [id]="tarefa.id"
  [nome]="tarefa.nome"
  [status]="tarefa.status"
  [prioridade]="tarefa.prioridade"
  [estudanteNome]="buscarNomeEstudante(tarefa.estudanteId)"
  (editar)="editarTarefaPorId($event)"
  (remover)="removerTarefa($event)"
/>
```

---

## 4. Mantenha o método em `tarefas.ts`

```ts
buscarNomeEstudante(id: number): string {
  const estudante = this.estudanteService.buscarPorId(id);
  return estudante ? estudante.nome : 'Não encontrado';
}
```

---

A explicação é:

```text
A página Tarefas conhece os services.
O TarefaCard não busca dados no service.
A página descobre o nome do estudante e envia esse nome para o card por input.
```

---

# 📌 Módulo 6 — Filtros de tarefas

## Por prioridade

## Passo 1 — criar estado

```ts
import { Component, inject, computed, signal } from '@angular/core';

filtroSelecionado = signal<'todas' | 'pendente' | 'concluida' | 'alta'>('todas');
```

---

## Passo 2 — computed

```ts
tarefasFiltradas = computed(() => {
  const lista = this.tarefas();

  switch (this.filtroSelecionado()) {
    case 'pendente':
      return lista.filter((t) => t.status === 'pendente');

    case 'concluida':
      return lista.filter((t) => t.status === 'concluida');

    case 'alta':
      return lista.filter((t) => t.prioridade === 'alta');

    default:
      return lista;
  }
});
```

---

## HTML — botões de filtro

```html
<section class="filtros-tarefas">
  <button mat-raised-button color="primary" type="button" (click)="filtroSelecionado.set('todas')">
    Todas
  </button>

  <button mat-raised-button type="button" (click)="filtroSelecionado.set('pendente')">
    Pendentes
  </button>

  <button mat-raised-button type="button" (click)="filtroSelecionado.set('concluida')">
    Concluídas
  </button>

  <button mat-raised-button type="button" (click)="filtroSelecionado.set('alta')">
    Alta prioridade
  </button>
</section>
```

---

## Atualizar listagem

```html
@for (tarefa of tarefasFiltradas(); track tarefa.id) {
```

## CSS — adicionar em tarefas.css

.filtros-tarefas {
display: flex;
gap: 12px;
flex-wrap: wrap;
margin: 24px 0;
}

## Por prioridade

## 1. Estado do filtro

Em `tarefas.ts`, adicione:

```ts
estudanteSelecionadoId = signal<number | null>(null);
```

---

# 2. Ajustar o computed principal

Atualize seu `tarefasFiltradas`:

```ts
tarefasFiltradas = computed(() => {
  let lista = this.tarefas();

  // filtro por estudante
  if (this.estudanteSelecionadoId() !== null) {
    lista = lista.filter((tarefa) => tarefa.estudanteId === this.estudanteSelecionadoId());
  }

  // filtro geral
  switch (this.filtroSelecionado()) {
    case 'pendente':
      return lista.filter((t) => t.status === 'pendente');

    case 'concluida':
      return lista.filter((t) => t.status === 'concluida');

    case 'alta':
      return lista.filter((t) => t.prioridade === 'alta');

    default:
      return lista;
  }
});
```

---

# 3. Select de estudante no HTML

Adicionar **junto dos filtros**:

```html
<mat-form-field appearance="outline">
  <mat-label>Filtrar por estudante</mat-label>

  <mat-select
    [value]="estudanteSelecionadoId()"
    (selectionChange)="estudanteSelecionadoId.set($event.value)"
  >
    <mat-option [value]="null">Todos</mat-option>

    @for (estudante of estudantes(); track estudante.id) {
    <mat-option [value]="estudante.id"> {{ estudante.nome }} </mat-option>
    }
  </mat-select>
</mat-form-field>
```

---

# 4. Melhorar layout dos filtros

Atualize seu HTML:

```html
<section class="filtros-tarefas">
  <!-- filtro por estudante -->
  <div class="filtro-estudante">
    <mat-form-field appearance="outline">
      <mat-label>Filtrar por estudante</mat-label>

      <mat-select
        [value]="estudanteSelecionadoId()"
        (selectionChange)="estudanteSelecionadoId.set($event.value)"
      >
        <mat-option [value]="null">Todos</mat-option>

        @for (estudante of estudantes(); track estudante.id) {
        <mat-option [value]="estudante.id"> {{ estudante.nome }} </mat-option>
        }
      </mat-select>
    </mat-form-field>
  </div>
  <div class="botoes-filtro">
    <button mat-raised-button (click)="filtroSelecionado.set('todas')">Todas</button>

    <button mat-raised-button (click)="filtroSelecionado.set('pendente')">Pendentes</button>

    <button mat-raised-button (click)="filtroSelecionado.set('concluida')">Concluídas</button>

    <button mat-raised-button (click)="filtroSelecionado.set('alta')">Alta prioridade</button>
  </div>
</section>
```

---

# 5. CSS

```css
.filtros-tarefas {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin: 24px 0;
}

.botoes-filtro {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filtro-estudante {
  min-width: 250px;
}
```

---

# 🧠 Explicação didática (use em sala)

```text
Agora temos dois tipos de filtro:

1. Filtro por características da tarefa (status, prioridade)
2. Filtro por relacionamento (estudante)

Os dois funcionam juntos.
```

Exemplo:

```text
"Mostrar tarefas pendentes do aluno João"
```

---

# 🚀 Resultado final

Agora o sistema permite:

✔ ver todas as tarefas
✔ ver tarefas pendentes
✔ ver tarefas de alta prioridade
✔ 🔥 ver tarefas de um estudante específico
✔ 🔥 combinar filtros

---

# 🎯 Frase forte para aula

> “Agora o sistema não mostra só dados… ele permite análise.”

---

# 📌 Módulo 7 — Computed signals (indicadores)

## Crie os indicadores

Adicionar em:

```text
src/app/pages/tarefas/tarefas.ts
```

```ts
totalTarefas = computed(() => this.tarefas().length);

totalPendentes = computed(() => this.tarefas().filter((t) => t.status === 'pendente').length);

totalConcluidas = computed(() => this.tarefas().filter((t) => t.status === 'concluida').length);

totalAlta = computed(() => this.tarefas().filter((t) => t.prioridade === 'alta').length);
```

---

## HTML

Adicionar em:

```text
src/app/pages/tarefas/tarefas.html
```

Sugestão: colocar **depois do formulário** e **antes dos filtros/listagem**.

A ordem da página fica assim:

```text
Título da página
Texto explicativo
Formulário de tarefa
Indicadores
Filtros
Lista de tarefas
```

Exemplo:

```html
</mat-card>

<section class="indicadores">
  <mat-card>
    <strong>Total</strong>
    <span>{{ totalTarefas() }}</span>
  </mat-card>

  <mat-card>
    <strong>Pendentes</strong>
    <span>{{ totalPendentes() }}</span>
  </mat-card>

  <mat-card>
    <strong>Concluídas</strong>
    <span>{{ totalConcluidas() }}</span>
  </mat-card>

  <mat-card>
    <strong>Alta prioridade</strong>
    <span>{{ totalAlta() }}</span>
  </mat-card>
</section>

<section class="filtros-tarefas">
  ...
</section>
```

---

## CSS para manter o padrão visual

Adicionar em:

```text
src/app/pages/tarefas/tarefas.css
```

```css
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
```

Assim os indicadores ficam na **página Tarefas**, como um resumo visual antes da listagem.

---

O **Módulo 8** deve ser implementado na **página de tarefas**, porque ele usa ao mesmo tempo:

```text
tarefas
estudantes
```

---

# 📌 Módulo 8 — Relatório simples

## Objetivo

Criar um pequeno relatório mostrando:

```text
Quantas tarefas cada estudante possui.
```

Exemplo esperado:

```text
Ana Silva: 2 tarefas
Carlos Souza: 1 tarefa
Maria Oliveira: 0 tarefas
```

---

## 1. Onde adicionar o código TS?

Adicionar em:

```text
src/app/pages/tarefas/tarefas.ts
```

Dentro da classe:

```ts
export class Tarefas {
```

Depois das propriedades de indicadores:

```ts
totalTarefas = computed(() => this.tarefas().length);
totalPendentes = computed(() => ...);
totalConcluidas = computed(() => ...);
totalAlta = computed(() => ...);
```

Adicione:

```ts
tarefasPorEstudante = computed(() => {
  const mapa: Record<string, number> = {};

  this.estudantes().forEach((estudante) => {
    mapa[estudante.nome] = this.tarefas().filter(
      (tarefa) => tarefa.estudanteId === estudante.id,
    ).length;
  });

  return mapa;
});
```

---

## 2. O que esse código faz?

Esta linha cria um objeto vazio:

```ts
const mapa: Record<string, number> = {};
```

Ele vai guardar dados assim:

```ts
{
  'Ana Silva': 2,
  'Carlos Souza': 1,
  'Maria Oliveira': 0
}
```

Depois, para cada estudante:

```ts
this.estudantes().forEach(estudante => {
```

o código conta quantas tarefas possuem o mesmo `estudanteId`:

```ts
this.tarefas().filter((tarefa) => tarefa.estudanteId === estudante.id).length;
```

---

## 3. Onde adicionar no HTML?

Adicionar em:

```text
src/app/pages/tarefas/tarefas.html
```

Sugestão de posição:

```text
Formulário
Indicadores
Filtros
Lista de tarefas
Relatório simples
```

Ou seja, coloque **depois da listagem de tarefas**.

---

## 4. HTML recomendado

```html
<section class="relatorio-tarefas">
  <h2>Relatório por estudante</h2>

  @if (estudantes().length === 0) {
  <p>Nenhum estudante cadastrado para gerar relatório.</p>
  } @else {
  <mat-card class="relatorio-card">
    @for (item of tarefasPorEstudante() | keyvalue; track item.key) {
    <div class="linha-relatorio">
      <span>{{ item.key }}</span>
      <strong>{{ item.value }} tarefa(s)</strong>
    </div>
    }
  </mat-card>
  }
</section>
```

---

## 5. Precisa importar algo?

Sim. Como usamos o pipe `keyvalue`, é mais seguro importar `KeyValuePipe`.

Em:

```text
src/app/pages/tarefas/tarefas.ts
```

Atualize o import:

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
```

E no array `imports`, adicione:

```ts
KeyValuePipe;
```

Exemplo:

```ts
imports: [
  FormsModule,
  KeyValuePipe,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  TarefaCard
],
```

---

## 6. CSS do relatório

Adicionar em:

```text
src/app/pages/tarefas/tarefas.css
```

```css
.relatorio-tarefas {
  margin-top: 32px;
}

.relatorio-card {
  padding: 16px;
  background-color: #f8f9ff;
}

.linha-relatorio {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #d6d9e6;
}

.linha-relatorio:last-child {
  border-bottom: none;
}
```

---

## 7. Explicação para os alunos

Use esta explicação:

```text
A lista de tarefas está em um signal.
A lista de estudantes também está em um signal.

O computed tarefasPorEstudante observa essas duas listas.

Sempre que uma tarefa for cadastrada, editada ou removida,
o relatório é recalculado automaticamente.
```

---

## 8. Resultado esperado

Após cadastrar tarefas vinculadas aos estudantes, o relatório deve mostrar algo como:

```text
Ana Silva                 2 tarefa(s)
Carlos Souza              1 tarefa(s)
Maria Oliveira            0 tarefa(s)
```

Esse módulo reforça bem o uso de:

```text
computed signal
relacionamento entre entidades
leitura de dois services
relatório simples
```

---

# 🧪 Testes esperados

✔ cadastrar tarefa com estudante
✔ listar com nome do estudante
✔ filtrar tarefas
✔ ver totais atualizando automaticamente
✔ relatório por estudante

---

# 🧩 Conexão com aulas anteriores

- Aula 3 → CRUD tarefas
- Aula 4 → CRUD estudantes

Agora:

```text
Integração entre entidades (nível intermediário real)
```

---

# 🎯 Produto final da Aula 5

```text
Tarefas vinculadas a estudantes
+ filtros
+ indicadores
+ relatório simples
```

---

# 🧠 Fechamento didático

Explique assim:

```text
Antes:
Sistema com duas entidades separadas

Agora:
Sistema com relacionamento entre entidades

Próximo passo:
Pipes, imagens e Deferrable Views (Aula 6)
```
