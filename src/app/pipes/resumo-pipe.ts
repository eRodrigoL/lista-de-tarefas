import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resumo',
})
export class ResumoPipe implements PipeTransform {
  transform(texto: string, limite = 120): string {
    return texto.length > limite ? texto.slice(0, limite).trimEnd() + '…' : texto;
  }
}
