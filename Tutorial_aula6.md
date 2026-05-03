# 🎓 Aula 6 — Pipes, Imagens, Datepicker e Deferrable Views

## Tema

Formatação de dados, imagens, campo de data com Angular Material e carregamento sob demanda.

## Objetivo

Melhorar a apresentação do sistema **Gerenciador de Estudos**, introduzindo pipes nativos, pipe personalizado, imagens, campo de data com `mat-datepicker` e relatório carregado com `@defer`.

A Aula 6 parte do estado final da Aula 5, em que as tarefas já estão vinculadas aos estudantes por `estudanteId`, há filtros, indicadores e relatório simples com `computed signals`. 

---

# ⏱️ Organização da aula — 4 horas

|     Tempo | Etapa                        | Conteúdo                                           |
| --------: | ---------------------------- | -------------------------------------------------- |
| 0h00–0h20 | Revisão                      | Aula 5                                             |
| 0h20–1h00 | Data da tarefa               | Model, service e formulário                        |
| 1h00–1h40 | Datepicker + locale BR       | `mat-datepicker`, `MAT_DATE_LOCALE`, `LOCALE_ID`   |
| 1h40–1h50 | Intervalo                    | Pausa                                              |
| 1h50–2h30 | Pipes nativos e customizados | `titlecase`, `lowercase`, `date`, pipes de domínio |
| 2h30–3h10 | Imagens                      | Avatar e acessibilidade                            |
| 3h10–3h50 | Deferrable Views             | `@defer`, `@placeholder`, `@loading`, `@error`     |
| 3h50–4h00 | Fechamento                   | Testes e revisão                                   |

---

# 📌 Módulo 1 — Revisão da Aula 5

Na Aula 5, o sistema passou a trabalhar com relacionamento entre entidades:

```text
Tarefa.estudanteId → Estudante.id
```

A página de tarefas também passou a usar:

```text
filtro por estudante
filtro por status
filtro por prioridade
indicadores com computed
relatório por estudante
```

Esse relatório simples já observava simultaneamente `tarefas()` e `estudantes()`, recalculando automaticamente quando uma tarefa era cadastrada, editada ou removida. 

Agora, a Aula 6 melhora a qualidade visual e técnica da aplicação.

---

# 📌 Módulo 2 — Atualizar o model de tarefa com `Date`

## Objetivo

Adicionar a data de entrega como parte obrigatória da tarefa.

Na Aula 5, o campo `dataEntrega` aparecia como opcional e em formato `string`.  Agora, vamos padronizar como `Date`.

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
  estudanteId: number;
  nome: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataEntrega: Date;  // 🔥 NOVO
};
```

## Explicação didática

```text
Antes:
dataEntrega?: string

Agora:
dataEntrega: Date
```

Explique aos alunos:

```text
Como agora vamos usar o Angular Material Datepicker, o campo será tratado como Date no TypeScript.
```

---

# 📌 Módulo 3 — Atualizar o `TarefaService`

Abra:

```text
src/app/services/tarefa.service.ts
```

Atualize os dados iniciais:

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
      estudanteId: 1,
      nome: 'Reestruturar aplicação Angular',
      status: 'pendente',
      prioridade: 'alta',
      dataEntrega: new Date(2026, 4, 20) // 🔥 NOVO
    },
    {
      id: 2,
      estudanteId: 1,
      nome: 'Criar menu lateral',
      status: 'em andamento',
      prioridade: 'media',
      dataEntrega: new Date(2026, 4, 25) // 🔥 NOVO
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
      ...tarefa
    };

    this.tarefas.update(listaAtual => [
      ...listaAtual,
      novaTarefa
    ]);

    this.proximoId++;
  }

  //Atualizado
  editar(id: number, tarefaAtualizada: Omit<Tarefa, 'id'>): void {
    this.tarefas.update(listaAtual =>
      listaAtual.map(tarefa =>
        tarefa.id === id
          ? {
              id,
              ...tarefaAtualizada
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

## Atenção importante

No JavaScript, o mês começa em zero:

```ts
new Date(2026, 4, 20)
```

representa:

```text
20/05/2026
```

porque:

```text
0 = janeiro
1 = fevereiro
2 = março
3 = abril
4 = maio
```

A função editar percorre toda a lista de tarefas.
Quando encontra a tarefa com o id informado,
ela substitui pelos novos dados.
As demais tarefas permanecem iguais.

---

# 📌 Módulo 4 — Configurar locale brasileiro

O `DatePipe` usa o `LOCALE_ID` quando nenhum locale é informado explicitamente; por padrão, o Angular usa `en-US`. ([Angular][1])

## 1. Atualizar `main.ts`

Abra:

```text
src/main.ts
```

Adicione:

```ts
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);
```

O arquivo ficará parecido com:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { App } from './app/app';
import { appConfig } from './app/app.config';

registerLocaleData(localePt);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

O `registerLocaleData` registra dados de locale para uso interno do Angular. ([Angular][2])

---

## 2. Atualizar `app.config.ts`

Abra:

```text
src/app/app.config.ts
```

Adicione os providers:

```ts
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
};
```

## Explicação didática

```text
LOCALE_ID
→ influencia pipes como date.

MAT_DATE_LOCALE
→ influencia o datepicker do Angular Material.

provideNativeDateAdapter()
→ permite que o datepicker trabalhe com Date nativo do JavaScript.
```

---

# 📌 Módulo 5 — Atualizar a página de tarefas

Abra:

```text
src/app/pages/tarefas/tarefas.ts
```

Atualize os imports:

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
```

No array `imports`, adicione:

```ts
imports: [
  FormsModule,
  KeyValuePipe,
  TitleCasePipe,
  DatePipe,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  TarefaCard
]
```

Pipes como `titlecase` transformam texto no template; em componentes standalone, é necessário importar o pipe ou o `CommonModule` no componente que usa esse recurso. ([Angular][3])

---

## Adicionar propriedade da data

Dentro da classe `Tarefas`, adicione:

```ts
novaDataEntrega: Date | null = null;
```

---

## Atualizar `salvarFormulario()`

```ts
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
```

---

## Atualizar edição

No método `editarTarefaPorId`, inclua:

```ts
editarTarefaPorId(id: number): void {
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
```

---

## Atualizar limpeza do formulário

```ts
private limparFormulario(): void {
  this.idEmEdicao = null;
  this.novoNome = '';
  this.novoStatus = 'pendente';
  this.novaPrioridade = 'media';
  this.novoEstudanteId = null;
  this.novaDataEntrega = null;
}
```

---

# 📌 Módulo 6 — Atualizar o formulário com `mat-datepicker`

Abra:

```text
src/app/pages/tarefas/tarefas.html
```

Dentro do formulário, após o campo de prioridade ou após o campo de estudante, adicione:

```html
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
    [for]="pickerDataEntrega">
  </mat-datepicker-toggle>
  <mat-datepicker #pickerDataEntrega></mat-datepicker>
  @if (dataEntrega.invalid && dataEntrega.touched) {
    <mat-error>A data de entrega é obrigatória.</mat-error>
  }
</mat-form-field>
```

## Explicação didática

```text
mat-datepicker
→ componente visual de calendário.

[(ngModel)]
→ conecta o campo à propriedade novaDataEntrega.

required
→ torna a data obrigatória.

MAT_DATE_LOCALE
→ faz o calendário usar o padrão brasileiro.
```

---

# 📌 Módulo 7 — Atualizar o `TarefaCard` com data, imagem e pipes nativos

Neste módulo, vamos melhorar a apresentação visual do card de tarefas usando:

```text
DatePipe
TitleCasePipe
UpperCasePipe
LowerCasePipe
JsonPipe
imagem local
dataEntrega
```

---

## 1. Atualizar `tarefa-card.ts`

Abra:

```text
src/app/components/tarefa-card/tarefa-card.ts
```

Atualize os imports:

```ts
import {
  DatePipe,
  JsonPipe,
  LowerCasePipe,
  TitleCasePipe,
  UpperCasePipe
} from '@angular/common';

import { Component, input, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {
  PrioridadeTarefa,
  StatusTarefa
} from '../../models/tarefa.model';
```

Atualize o `imports` do componente:

```ts
imports: [
  DatePipe,
  JsonPipe,
  LowerCasePipe,
  TitleCasePipe,
  UpperCasePipe,
  MatCardModule,
  MatButtonModule
],
```

O arquivo completo fica assim:

```ts
import {
  DatePipe,
  JsonPipe,
  LowerCasePipe,
  TitleCasePipe,
  UpperCasePipe
} from '@angular/common';

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
    DatePipe,
    JsonPipe,
    LowerCasePipe,
    TitleCasePipe,
    UpperCasePipe,
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
  estudanteNome = input.required<string>();
  dataEntrega = input.required<Date>();

  editar = output<number>();
  remover = output<number>();

  dadosDebug = input<unknown>();

  aoClicarEditar(): void {
    this.editar.emit(this.id());
  }

  aoClicarRemover(): void {
    this.remover.emit(this.id());
  }
}
```

---

## 2. Explicação dos pipes nativos

Explique aos alunos:

```text
Pipe é um recurso usado para transformar dados diretamente no template.

Ele muda apenas a forma de exibição.
Ele não altera o dado original no TypeScript.
```

Exemplos:

```html
{{ nome() | titlecase }}
{{ estudanteNome() | uppercase }}
{{ status() | lowercase }}
{{ dataEntrega() | date:'dd/MM/yyyy' }}
{{ dadosDebug() | json }}
```

---

## 3. Atualizar `tarefa-card.html`

Abra:

```text
src/app/components/tarefa-card/tarefa-card.html
```

Substitua pelo código abaixo:

```html
<mat-card class="tarefa-card">
  <mat-card-header>
    <img
      src="/avatar-estudante.png"
      alt="Avatar do estudante {{ estudanteNome() }}"
      width="56"
      height="56"
      class="avatar-estudante"
    />

    <div>
      <mat-card-title>
        {{ nome() | titlecase }}
      </mat-card-title>

      <mat-card-subtitle>
        Estudante: {{ estudanteNome() | titlecase }}
      </mat-card-subtitle>
    </div>
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
      <strong>Status em minúsculas:</strong>
      {{ status() | lowercase }}
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

    <p>
      <strong>Prioridade em maiúsculas:</strong>
      {{ prioridade() | uppercase }}
    </p>

    <p>
      <strong>Data de entrega:</strong>
      {{ dataEntrega() | date:'dd/MM/yyyy' }}
    </p>

    <details class="debug-card">
      <summary>Ver dados técnicos da tarefa</summary>

      <pre>{{ dadosDebug() | json }}</pre>
    </details>
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

## 4. Onde cada pipe foi usado?

```text
titlecase
→ nome da tarefa e nome do estudante

lowercase
→ status técnico da tarefa

uppercase
→ prioridade técnica da tarefa

date
→ data de entrega

json
→ visualização técnica dos dados da tarefa
```

---

## 5. Observação didática sobre `json`

Explique:

```text
O pipe json é muito útil para estudo, teste e depuração.

Ele permite ver no HTML como o objeto está chegando ao componente.
```

Mas avise:

```text
Em sistemas reais, normalmente removemos esse bloco antes da versão final.
```

---

## 6. Atualizar `tarefa-card.css`

Abra:

```text
src/app/components/tarefa-card/tarefa-card.css
```

Atualize:

```css
.tarefa-card {
  margin-bottom: 12px;
  background-color: #f8f9ff;
}

mat-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-estudante {
  border-radius: 50%;
  object-fit: cover;
}

mat-card-actions {
  display: flex;
  gap: 8px;
}

.debug-card {
  margin-top: 12px;
}

.debug-card summary {
  cursor: pointer;
  font-weight: 600;
}

.debug-card pre {
  margin-top: 8px;
  padding: 12px;
  background-color: #eef2ff;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
}
```

---

## 7. Salvar imagem local

Salve o arquivo:

```text
avatar-estudante.png
```

na pasta:

```text
public/avatar-estudante.png
```

A estrutura deve ficar assim:

```text
projeto-angular
├── public
│   └── avatar-estudante.png
├── src
│   └── app
```

No HTML, a imagem será acessada assim:

```html
src="/avatar-estudante.png"
```

---

# 📌 Módulo 8 — Atualizar chamada do card na página de tarefas

Agora precisamos enviar para o `TarefaCard` todos os dados que ele precisa exibir.

Em:

```text
src/app/pages/tarefas/tarefas.html
```

Localize a chamada do componente:

```html
<app-tarefa-card
  ...
/>
```

Atualize para:

```html
<app-tarefa-card
  [id]="tarefa.id"
  [nome]="tarefa.nome"
  [status]="tarefa.status"
  [prioridade]="tarefa.prioridade"
  [estudanteNome]="buscarNomeEstudante(tarefa.estudanteId)"
  [dataEntrega]="tarefa.dataEntrega"
  [dadosDebug]="tarefa"
  (editar)="editarTarefaPorId($event)"
  (remover)="removerTarefa($event)"
/>
```

---

## Explicação didática

Explique aos alunos:

```text
A página Tarefas conhece a lista de tarefas.
A página Tarefas também conhece os estudantes.

Por isso, ela envia para o card:
- os dados da tarefa;
- o nome do estudante;
- a data de entrega;
- o objeto completo para debug com json.
```

O `TarefaCard` apenas recebe dados por `input()` e emite eventos por `output()`.

---

## Atenção sobre o pipe `json`

O trecho:

```html
[dadosDebug]="tarefa"
```

permite usar no card:

```html
<pre>{{ dadosDebug() | json }}</pre>
```

Isso ajuda os alunos a enxergarem o objeto real:

```json
{
  "id": 1,
  "estudanteId": 1,
  "nome": "Reestruturar aplicação Angular",
  "status": "pendente",
  "prioridade": "alta",
  "dataEntrega": "..."
}
```

---

## Observação importante sobre `TitleCasePipe`, `DatePipe`, `UpperCasePipe`, `LowerCasePipe` e `JsonPipe`

Esses pipes foram importados no `TarefaCard`, porque é no arquivo:

```text
src/app/components/tarefa-card/tarefa-card.html
```

que eles são usados.

Portanto, **não é necessário importar esses pipes em `tarefas.ts`**, a menos que eles também sejam usados diretamente em:

```text
src/app/pages/tarefas/tarefas.html
```

Se `tarefas.ts` estiver com:

```ts
TitleCasePipe,
DatePipe,
UpperCasePipe,
LowerCasePipe,
JsonPipe
```

mas o template `tarefas.html` não usar esses pipes diretamente, o Angular poderá exibir avisos de pipe não utilizado.

---

# 📌 Módulo 9 — Criar pipes personalizados

Agora vamos criar pipes personalizados para formatar valores do domínio da aplicação.

No sistema, alguns valores são armazenados internamente assim:

```text
concluida
media
noturno
```

Mas, para o usuário, queremos exibir assim:

```text
Concluída
Média
Noturno
```

Neste módulo, criaremos três pipes:

```text
statusTarefaLabel
prioridadeLabel
turnoLabel
```

---

## 1. Criar pipe de status da tarefa

No terminal:

```bash
ng g pipe pipes/status-tarefa-label --skip-tests
```

Abra o arquivo criado em:

```text
src/app/pipes/status-tarefa-label-pipe.ts
```

Coloque:

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTarefaLabel'
})
export class StatusTarefaLabelPipe implements PipeTransform {
  transform(valor: string): string {
    switch (valor) {
      case 'pendente':
        return 'Pendente';
      case 'em andamento':
        return 'Em andamento';
      case 'concluida':
        return 'Concluída';
      default:
        return valor;
    }
  }
}
```

---

## 2. Criar pipe de prioridade da tarefa

No terminal:

```bash
ng g pipe pipes/prioridade-label --skip-tests
```

Abra o arquivo criado em:

```text
src/app/pipes/prioridade-label-pipe.ts
```

Coloque:

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prioridadeLabel'
})
export class PrioridadeLabelPipe implements PipeTransform {
  transform(valor: string): string {
    switch (valor) {
      case 'baixa':
        return 'Baixa';
      case 'media':
        return 'Média';
      case 'alta':
        return 'Alta';
      default:
        return valor;
    }
  }
}
```

---

## 3. Criar pipe de turno do estudante

No terminal:

```bash
ng g pipe pipes/turno-label --skip-tests
```

Abra o arquivo criado em:

```text
src/app/pipes/turno-label-pipe.ts
```

Coloque:

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'turnoLabel'
})
export class TurnoLabelPipe implements PipeTransform {
  transform(valor: string): string {
    switch (valor) {
      case 'matutino':
        return 'Matutino';
      case 'vespertino':
        return 'Vespertino';
      case 'noturno':
        return 'Noturno';
      default:
        return valor;
    }
  }
}
```

---

## 4. Observação sobre Angular 19+

No Angular 19+, componentes, diretivas e pipes são standalone por padrão.

Por isso, o Angular 21 pode criar o pipe assim:

```ts
@Pipe({
  name: 'prioridadeLabel'
})
```

Sem precisar escrever:

```ts
standalone: true
```

Mesmo assim, o pipe pode ser importado diretamente no array `imports` do componente.

---

## 5. Conferir os nomes dos arquivos

Dependendo da versão/configuração do Angular CLI, os arquivos podem ser criados como:

```text
status-tarefa-label-pipe.ts
prioridade-label-pipe.ts
turno-label-pipe.ts
```

ou como:

```text
status-tarefa-label.pipe.ts
prioridade-label.pipe.ts
turno-label.pipe.ts
```

Use no import exatamente o nome do arquivo criado no seu projeto.

Exemplo, se o arquivo criado foi:

```text
src/app/pipes/turno-label-pipe.ts
```

o import será:

```ts
import { TurnoLabelPipe } from '../../pipes/turno-label-pipe';
```

Se o arquivo criado foi:

```text
src/app/pipes/turno-label.pipe.ts
```

o import será:

```ts
import { TurnoLabelPipe } from '../../pipes/turno-label.pipe';
```

---

## 6. Onde usar cada pipe?

```text
statusTarefaLabel
→ no TarefaCard, para exibir o status da tarefa

prioridadeLabel
→ no TarefaCard, para exibir a prioridade da tarefa

turnoLabel
→ na página Estudantes ou em algum card de estudante, para exibir o turno
```

---

# 📌 Módulo 10 — Refatorar o `TarefaCard` para usar os pipes personalizados

Agora que os pipes existem, podemos voltar ao card e substituir os blocos `@if`.

Abra:

```text
src/app/components/tarefa-card/tarefa-card.ts
```

Atualize os imports:

```ts
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {
  PrioridadeTarefa,
  StatusTarefa
} from '../../models/tarefa.model';

import { PrioridadeLabelPipe } from '../../pipes/prioridade-label-pipe';
import { StatusTarefaLabelPipe } from '../../pipes/status-tarefa-label-pipe';
```

E atualize o array `imports`:

```ts
imports: [
  DatePipe,
  TitleCasePipe,
  MatCardModule,
  MatButtonModule,
  PrioridadeLabelPipe,
  StatusTarefaLabelPipe
]
```

O arquivo completo fica:

```ts
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {
  PrioridadeTarefa,
  StatusTarefa
} from '../../models/tarefa.model';

import { PrioridadeLabelPipe } from '../../pipes/prioridade-label.pipe';
import { StatusTarefaLabelPipe } from '../../pipes/status-tarefa-label.pipe';

@Component({
  selector: 'app-tarefa-card',
  imports: [
    DatePipe,
    TitleCasePipe,
    MatCardModule,
    MatButtonModule,
    PrioridadeLabelPipe,
    StatusTarefaLabelPipe
  ],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css'
})
export class TarefaCard {
  id = input.required<number>();
  nome = input.required<string>();
  status = input<StatusTarefa>('pendente');
  prioridade = input.required<PrioridadeTarefa>();
  estudanteNome = input.required<string>();
  dataEntrega = input.required<Date>(); // 🔥 NOVO

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

## Atualizar `tarefa-card.html`

Agora substitua:

```html
@if (status() === 'pendente') {
  Pendente
} @else if (status() === 'em andamento') {
  Em andamento
} @else {
  Concluída
}
```

por:

```html
{{ status() | statusTarefaLabel }}
```

E substitua:

```html
@if (prioridade() === 'baixa') {
  Baixa
} @else if (prioridade() === 'media') {
  Média
} @else {
  Alta
}
```

por:

```html
{{ prioridade() | prioridadeLabel }}
```

O HTML final fica:

```html
<mat-card class="tarefa-card">
  <mat-card-header>
    <img
      src="/avatar-estudante.png"
      alt="Avatar do estudante {{ estudanteNome() }}"
      width="56"
      height="56"
      class="avatar-estudante"
    />

    <div>
      <mat-card-title>{{ nome() | titlecase }}</mat-card-title>

      <mat-card-subtitle>
        {{ estudanteNome() | titlecase }}
      </mat-card-subtitle>
    </div>
  </mat-card-header>

  <mat-card-content>
    <p>
      <strong>Status:</strong>
      {{ status() | statusTarefaLabel }}
    </p>

    <p>
      <strong>Prioridade:</strong>
      {{ prioridade() | prioridadeLabel }}
    </p>

    <p>
      <strong>Data de entrega:</strong>
      {{ dataEntrega() | date:'dd/MM/yyyy' }}
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

## Exemplo de uso do `turnoLabel` na página de estudantes

Abra:

```text
src/app/pages/estudantes/estudantes.ts
```

Importe o pipe:

```ts
import { TurnoLabelPipe } from '../../pipes/turno-label-pipe';
```

Adicione no array `imports`:

```ts
imports: [
  ReactiveFormsModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  TurnoLabelPipe
]
```

Depois, em:

```text
src/app/pages/estudantes/estudantes.html
```

Substitua o bloco antigo:

```html
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
```

por:

```html
<p>
  <strong>Turno:</strong>
  {{ estudante.turno | turnoLabel }}
</p>
```

---

# 🧠 Explicação didática

Use esta explicação em sala:

```text
Os pipes personalizados ajudam a separar regra de apresentação do HTML.

Em vez de repetir vários @if para transformar valores como "concluida" em "Concluída", criamos um pipe.

Assim, o template fica menor, mais legível e mais fácil de manter.
```
---

# ✅ Correção didática da ordem

No tutorial, deixe explícito assim:

```text
1. Primeiro atualizamos o card com dataEntrega, imagem e pipes nativos.
2. Nesse momento, status e prioridade ainda continuam com @if.
3. Depois criamos os pipes personalizados.
4. Só após criar os pipes, refatoramos o card para usá-los.
```

A estrutura final esperada do curso já previa `components/relatorio-estudos` e pipes em `src/app/pipes`, então esta aula também aproxima o projeto da arquitetura final planejada. 

[1]: https://angular.dev/api/common/DatePipe?utm_source=chatgpt.com "DatePipe - Angular"
[2]: https://angular.dev/api/common/registerLocaleData?utm_source=chatgpt.com "registerLocaleData - Angular"
[3]: https://angular.dev/guide/templates/pipes?utm_source=chatgpt.com "Pipes - Angular"
[4]: https://angular.dev/tutorials/learn-angular/10-deferrable-views?utm_source=chatgpt.com "Deferrable views - Angular"
