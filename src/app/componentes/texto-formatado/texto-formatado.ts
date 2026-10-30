import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { formatarDescricao } from '../../utilitarios/formatar-descricao';

@Component({
  host: { '[class.compacto]': 'compacto()' },
  imports: [NgTemplateOutlet],
  selector: 'app-texto-formatado',
  styleUrl: './texto-formatado.scss',
  templateUrl: './texto-formatado.html',
})
export class TextoFormatado {
  readonly compacto = input(false);
  readonly texto = input.required<string>();

  readonly blocos = computed(() => formatarDescricao(this.texto()));
}
