import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  readonly formulario = inject(FormBuilder).nonNullable.group({
    titulo: ['', Validators.required],
    descricao: ['', Validators.required],
    prazo: ['', Validators.required],
    ordem: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
  });

  readonly salvando = signal(false);

  async salvar(): Promise<void> {
    if (this.formulario.invalid || this.salvando()) return;
    this.salvando.set(true);
    try {
      await this.servico.criar({ ...this.formulario.getRawValue(), status: 'pendente' });
      this.dialogRef.close();
    } finally {
      this.salvando.set(false);
    }
  }
}
