import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Tarefa } from '../../modelos/tarefa';
import { TarefaService } from '../../servicos/tarefa';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-dialog-tarefa',
  styleUrl: './dialog-tarefa.scss',
  templateUrl: './dialog-tarefa.html',
})
export class DialogTarefa {
  private readonly servico = inject(TarefaService);
  private readonly dialogRef = inject(MatDialogRef<DialogTarefa>);

  readonly dados = inject<{ tarefa?: Tarefa; somenteLeitura?: boolean }>(MAT_DIALOG_DATA, {
    optional: true,
  });
  readonly formulario = inject(FormBuilder).nonNullable.group({
    titulo: [this.dados?.tarefa?.titulo ?? '', Validators.required],
    descricao: [this.dados?.tarefa?.descricao ?? '', Validators.required],
    prazo: [this.dados?.tarefa?.prazo ?? '', Validators.required],
  });

  readonly salvando = signal(false);
  readonly visualizando = !!this.dados?.somenteLeitura;

  constructor() {
    if (this.visualizando) this.formulario.disable();
  }

  async salvar(): Promise<void> {
    if (this.visualizando || this.formulario.invalid || this.salvando()) return;
    this.salvando.set(true);
    try {
      await this.servico.criar({ ...this.formulario.getRawValue(), status: 'pendente' });
      this.dialogRef.close();
    } finally {
      this.salvando.set(false);
    }
  }
}
