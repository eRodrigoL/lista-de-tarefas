import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  readonly formulario = inject(FormBuilder).nonNullable.group({
    titulo: [''],
    descricao: [''],
    prazo: [''],
    ordem: [1],
  });
}
