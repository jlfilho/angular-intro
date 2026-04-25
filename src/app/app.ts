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
  protected readonly title = signal('Lista de Tarefas de Estudo');

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

  alterarTurno() {
    this.turno.set('Vespertino');
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

  limparTarefas() {
    this.tarefas.set([]);
  }
}
