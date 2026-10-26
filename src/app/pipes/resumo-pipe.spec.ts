import { describe, expect, it } from 'vitest';

import { ResumoPipe } from './resumo-pipe';

describe('ResumoPipe', () => {
  const pipe = new ResumoPipe();

  it('mantém texto curto e texto no limite', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform('abc', 3)).toBe('abc');
  });

  it('resume somente acima do limite sem alterar a origem', () => {
    const texto = 'abcd';
    expect(pipe.transform(texto, 3)).toBe('abc…');
    expect(texto).toBe('abcd');
  });
});
