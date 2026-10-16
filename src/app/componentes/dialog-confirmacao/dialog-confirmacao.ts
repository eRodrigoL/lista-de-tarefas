import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [MatButtonModule, MatDialogModule],
  selector: 'app-dialog-confirmacao',
  styleUrl: './dialog-confirmacao.scss',
  templateUrl: './dialog-confirmacao.html',
})
export class DialogConfirmacao {
  readonly titulo = inject<string>(MAT_DIALOG_DATA);
}
