import { Component, input, output } from '@angular/core';
import { TitleCasePipe, DatePipe, JsonPipe, LowerCasePipe, UpperCasePipe } from '@angular/common';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { PrioridadeTarefa, StatusTarefa } from '../../models/tarefa.model';

import { PrioridadeLabelPipe } from '../../pipes/prioridade-label-pipe';
import { StatusTarefaLabelPipe } from '../../pipes/status-tarefa-label-pipe';

@Component({
  selector: 'app-tarefa-card',
  imports: [
    DatePipe,
    JsonPipe,
    TitleCasePipe,
    MatCardModule,
    MatButtonModule,
    PrioridadeLabelPipe,
    StatusTarefaLabelPipe
  ],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css',
})
export class TarefaCard {

  id = input.required<string>();
  nome = input.required<string>();
  status = input.required<StatusTarefa>();
  prioridade = input.required<PrioridadeTarefa>();
  estudanteNome = input.required<string>();
  dataEntrega = input.required<Date>();
  dadosDebug = input<unknown>();

  editar = output<string>();
  remover = output<string>();

  aoClicarEditar(): void {
    this.editar.emit(this.id());
  }

  aoClicarRemover(): void {
    this.remover.emit(this.id());
  }
}

