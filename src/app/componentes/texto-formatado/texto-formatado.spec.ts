import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TextoFormatado } from './texto-formatado';

describe('TextoFormatado', () => {
  it('renderiza ênfases e listas sem interpretar HTML digitado', async () => {
    await TestBed.configureTestingModule({
      imports: [TextoFormatado],
    }).compileComponents();

    const fixture = TestBed.createComponent(TextoFormatado);

    fixture.componentRef.setInput(
      'texto',
      '**forte** *leve* __linha__ ~~antigo~~\n- Item\n3. Outro\n<img src=x onerror=alert(1)>',
    );
    fixture.detectChanges();

    const tela: HTMLElement = fixture.nativeElement;

    expect(tela.querySelector('p')?.textContent).toBe('forte leve linha antigo');
    expect(tela.querySelector('strong')?.textContent).toBe('forte');
    expect(tela.querySelector('em')?.textContent).toBe('leve');
    expect(tela.querySelector('u')?.textContent).toBe('linha');
    expect(tela.querySelector('s')?.textContent).toBe('antigo');
    expect(tela.querySelector('ul li')?.textContent?.trim()).toBe('Item');
    expect(tela.querySelector('ol li')?.getAttribute('value')).toBe('3');
    expect(tela.querySelector('img')).toBeNull();
    expect(tela.textContent).toContain('<img src=x onerror=alert(1)>');
  });
});
