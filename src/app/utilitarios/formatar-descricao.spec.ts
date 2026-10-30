import { describe, expect, it } from 'vitest';

import { formatarDescricao } from './formatar-descricao';

describe('Formatação da descrição', () => {
  it('agrupa listas e preserva parágrafos e números escritos', () => {
    const blocos = formatarDescricao('Texto\n- Um\n- Dois\n3. Três\n5. Cinco');

    expect(blocos.map((bloco) => bloco.tipo)).toEqual(['paragrafo', 'topicos', 'numeracao']);
    expect(blocos[1].itens).toHaveLength(2);
    expect(blocos[2].itens.map((item) => item.numero)).toEqual([3, 5]);
  });

  it('interpreta ênfases combinadas e preserva marcações incompletas', () => {
    const [bloco] = formatarDescricao('**forte e *leve***');

    expect(bloco.itens[0].partes).toEqual([
      {
        tipo: 'negrito',
        partes: [
          { tipo: 'texto', texto: 'forte e ' },
          {
            tipo: 'italico',
            partes: [{ tipo: 'texto', texto: 'leve' }],
          },
        ],
      },
    ]);

    expect(formatarDescricao('**sem fechar')[0].itens[0].partes).toEqual([
      { tipo: 'texto', texto: '**sem fechar' },
    ]);
  });

  it('preserva texto vazio e quebras de linha', () => {
    expect(formatarDescricao('')[0].itens[0].partes).toEqual([]);
    expect(formatarDescricao('um\ndois')).toHaveLength(2);
  });
});
