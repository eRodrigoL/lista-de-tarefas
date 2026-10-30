import { Pipe, PipeTransform } from '@angular/core';
import { descricaoSimples } from '../utilitarios/formatar-descricao';

@Pipe({
  name: 'resumo',
})
export class ResumoPipe implements PipeTransform {
  transform(texto: string, limite = 120): string {
    const simples = descricaoSimples(texto);
    return simples.length > limite ? simples.slice(0, limite).trimEnd() + '…' : simples;
  }
}
