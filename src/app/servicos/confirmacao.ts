import { inject, Service } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { DialogConfirmacao } from '../componentes/dialog-confirmacao/dialog-confirmacao';

@Service()
export class ConfirmacaoService {
  private readonly dialog = inject(MatDialog);

  async excluir(titulo: string): Promise<boolean> {
    const referencia = this.dialog.open(DialogConfirmacao, {
      width: '400px',
      maxWidth: '95vw',
      data: titulo,
    });
    return (await firstValueFrom(referencia.afterClosed())) === true;
  }
}
