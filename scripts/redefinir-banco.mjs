import { access, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const origem = resolve('banco.base.json');
const destino = resolve('banco.json');

try {
  await access(origem);
  await copyFile(origem, destino);
  console.log('Banco local restaurado a partir de banco.base.json');
} catch (erro) {
  console.log('Não foi possível restaurar o banco local.', erro);
  process.exitCode = 1;
}
