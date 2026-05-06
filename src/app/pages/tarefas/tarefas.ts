import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { EstudanteService } from '../../services/estudante.service';

import { PrioridadeTarefa, StatusTarefa } from '../../models/tarefa.model';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { TarefaService } from '../../services/tarefa.service';
import { ConfirmacaoDialog } from '../../components/confirmacao-dialog/confirmacao-dialog';


@Component({
  selector: 'app-tarefas',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    TarefaCard,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css',
})
export class Tarefas implements OnInit {
  private readonly tarefaService = inject(TarefaService);
  private readonly dialog = inject(MatDialog);
  private readonly estudanteService = inject(EstudanteService);

  novoEstudanteId: string | null = null;
  tarefas = this.tarefaService.listar();
  estudantes = this.estudanteService.listar();

  novoNome = '';
  novoStatus: StatusTarefa = 'pendente';
  novaPrioridade: PrioridadeTarefa = 'media';
  novaDataEntrega: Date | null = null;

  idEmEdicao: string | null = null;
  filtroSelecionado = signal<'todas' | 'pendente' | 'concluida' | 'alta'>('todas');
  estudanteSelecionadoId = signal<string | null>(null);

  carregandoTarefas = this.tarefaService.estaCarregando();
  erroTarefas = this.tarefaService.mensagemErro();

  carregandoEstudantes = this.estudanteService.estaCarregando();
  erroEstudantes = this.estudanteService.mensagemErro();

  totalRegistrosTarefas = this.tarefaService.totalRegistros();

  paginaAtual = 0;
  tamanhoPagina = 5;

  busca = new FormControl('', {
    nonNullable: true
  });

  termoBusca = signal('');

  totalTarefasPagina = computed(() =>
    this.tarefasFiltradas().length
  );

  totalPendentes = computed(() =>
    this.tarefasFiltradas().filter(
      (tarefa) => tarefa.status === 'pendente'
    ).length
  );

  totalConcluidas = computed(() =>
    this.tarefasFiltradas().filter(
      (tarefa) => tarefa.status === 'concluida'
    ).length
  );

  totalAlta = computed(() =>
    this.tarefasFiltradas().filter(
      (tarefa) => tarefa.prioridade === 'alta'
    ).length
  );

  tarefasFiltradas = computed(() => {
    let lista = this.tarefas();

    const termo = this.termoBusca().toLowerCase().trim();

    if (termo) {
      lista = lista.filter(tarefa => {
        const estudanteNome = this.buscarNomeEstudante(tarefa.estudanteId);

        return (
          tarefa.nome.toLowerCase().includes(termo) ||
          tarefa.status.toLowerCase().includes(termo) ||
          tarefa.prioridade.toLowerCase().includes(termo) ||
          estudanteNome.toLowerCase().includes(termo)
        );
      });
    }

    if (this.estudanteSelecionadoId() !== null) {
      lista = lista.filter(tarefa =>
        tarefa.estudanteId === this.estudanteSelecionadoId()
      );
    }

    switch (this.filtroSelecionado()) {
      case 'pendente':
        return lista.filter(tarefa => tarefa.status === 'pendente');

      case 'concluida':
        return lista.filter(tarefa => tarefa.status === 'concluida');

      case 'alta':
        return lista.filter(tarefa => tarefa.prioridade === 'alta');

      default:
        return lista;
    }
  });

  ngOnInit(): void {
    this.estudanteService.carregar();
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.tarefaService.listarPaginado({
      pagina: this.paginaAtual + 1,
      limite: this.tamanhoPagina
    });
  }

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

    setTimeout(() => {
      this.carregarTarefas();
    }, 300);
  }

  buscarNomeEstudante(id: string): string {
    const estudante = this.estudanteService.buscarPorId(id);
    return estudante ? estudante.nome : 'Não encontrado';
  }

  editarTarefaPorId(id: string): void {
    const tarefa = this.tarefaService.buscarPorId(id);

    if (tarefa) {
      this.idEmEdicao = tarefa.id;
      this.novoNome = tarefa.nome;
      this.novoStatus = tarefa.status;
      this.novaPrioridade = tarefa.prioridade;
      this.novoEstudanteId = tarefa.estudanteId;
      this.novaDataEntrega = tarefa.dataEntrega
        ? new Date(tarefa.dataEntrega)
        : null;
    }
  }

  removerTarefa(id: string): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog);

    dialogRef.afterClosed().subscribe((confirmou: boolean) => {
      if (confirmou) {
        this.tarefaService.remover(id);

        if (this.idEmEdicao === id) {
          this.limparFormulario();
        }

        setTimeout(() => {
          this.carregarTarefas();
        }, 300);
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

  aoMudarPagina(evento: PageEvent): void {
    this.paginaAtual = evento.pageIndex;
    this.tamanhoPagina = evento.pageSize;

    this.carregarTarefas();
  }

  aplicarFiltroGeral(
    filtro: 'todas' | 'pendente' | 'concluida' | 'alta'
  ): void {
    this.filtroSelecionado.set(filtro);
  }

  aplicarFiltroEstudante(id: string | null): void {
    this.estudanteSelecionadoId.set(id);
  }

  pesquisar(): void {
    this.termoBusca.set(this.busca.value.trim());
  }

  limparBusca(): void {
    this.busca.setValue('');
    this.termoBusca.set('');
  }

}
