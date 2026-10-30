export type ParteTexto =
  | { tipo: 'texto'; texto: string }
  | { tipo: 'negrito' | 'italico' | 'sublinhado' | 'tachado'; partes: ParteTexto[] };

export interface ItemTexto {
  numero?: number;
  partes: ParteTexto[];
}

export interface BlocoTexto {
  tipo: 'paragrafo' | 'topicos' | 'numeracao';
  itens: ItemTexto[];
}

export function formatarDescricao(texto: string): BlocoTexto[] {
  const blocos: BlocoTexto[] = [];

  for (const linha of texto.split(/\r?\n/)) {
    const marcador = linha.match(/^(-|\d+\.)\s+(.+)$/);
    const tipo = !marcador ? 'paragrafo' : marcador[1] === '-' ? 'topicos' : 'numeracao';
    const item: ItemTexto = {
      partes: formatarPartes(marcador ? marcador[2] : linha),
    };

    if (tipo === 'numeracao') {
      item.numero = Number.parseInt(marcador![1], 10);
    }

    const anterior = blocos.at(-1);

    if (tipo !== 'paragrafo' && anterior?.tipo === tipo) {
      anterior.itens.push(item);
    } else {
      blocos.push({ tipo, itens: [item] });
    }
  }

  return blocos;
}

export function descricaoSimples(texto: string): string {
  return formatarDescricao(texto)
    .flatMap((bloco) => bloco.itens.map((item) => textoDasPartes(item.partes)))
    .join('\n');
}

function formatarPartes(texto: string): ParteTexto[] {
  const partes: ParteTexto[] = [];
  const tipos = {
    '**': 'negrito',
    '*': 'italico',
    __: 'sublinhado',
    '~~': 'tachado',
  } as const;

  let inicio = 0;

  for (const trecho of texto.matchAll(/(\*\*|__|~~|\*)(.+?)\1(?!\*)/g)) {
    if (trecho.index > inicio) {
      partes.push({
        tipo: 'texto',
        texto: texto.slice(inicio, trecho.index),
      });
    }

    const marcador = trecho[1] as keyof typeof tipos;

    partes.push({
      tipo: tipos[marcador],
      partes: formatarPartes(trecho[2]),
    });

    inicio = trecho.index + trecho[0].length;
  }

  if (inicio < texto.length) {
    partes.push({ tipo: 'texto', texto: texto.slice(inicio) });
  }

  return partes;
}

function textoDasPartes(partes: ParteTexto[]): string {
  return partes
    .map((parte) => (parte.tipo === 'texto' ? parte.texto : textoDasPartes(parte.partes)))
    .join('');
}
