import { Component, computed, inject, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common'; // 🔥 NOVO
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
    TarefaCard
  ],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css',
})
export class Tarefas {
  private readonly tarefaService = inject(TarefaService);
  private readonly dialog = inject(MatDialog);
  private readonly estudanteService = inject(EstudanteService);

  novoEstudanteId: number | null = null;
  tarefas = this.tarefaService.listar();
  estudantes = this.estudanteService.listar();

  novoNome = '';
  novoStatus: StatusTarefa = 'pendente';
  novaPrioridade: PrioridadeTarefa = 'media';
  novaDataEntrega: Date | null = null;

  idEmEdicao: number | null = null;
  filtroSelecionado = signal<'todas' | 'pendente' | 'concluida' | 'alta'>('todas');
  estudanteSelecionadoId = signal<number | null>(null);

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

  buscarNomeEstudante(id: number): string {
    const estudante = this.estudanteService.buscarPorId(id);
    return estudante ? estudante.nome : 'Não encontrado';
  }

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
