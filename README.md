# Lista de tarefas

Aplicação para organizar tarefas pendentes e concluídas, desenvolvida com Angular, Angular Material e SCSS. Utiliza JSON Server como API local.

## Funcionalidades

- Criar, visualizar, editar e excluir tarefas, com confirmação de exclusão.
- Definir prazo e alternar o status entre pendente e concluída.
- Formatar descrições com listas, negrito, itálico, sublinhado e tachado.
- Reordenar cards dentro de cada quadro por arraste ou pelas setas do controle de ordenação.

## Executar

Com Node.js e npm instalados:

```bash
npm install
npm start
```

A aplicação usa a porta 4200 e a API a porta 3000. No Codespaces, abrir o endereço encaminhado da porta 4200; as chamadas à API passam pelo proxy do Angular.

A cada `npm start`, o banco local é restaurado a partir de `banco.base.json`, descartando tarefas e ordenações da execução anterior. Recarregar a página preserva os dados da execução atual.

Novas tarefas são pendentes e aparecem primeiro. Antes da ordenação manual, a ordem segue a criação mais recente. Editar preserva a data de criação e a posição; o toggle altera o status.

Na descrição, usar `- item` ou `1. item` no início da linha, `**negrito**`, `*itálico*`, `__sublinhado__` e `~~tachado~~`. O dialog mostra a descrição completa formatada; os cards aplicam a mesma formatação em um resumo limitado a três linhas.

## Acessibilidade

A interface acompanha a preferência de maior contraste do sistema ou navegador e respeita as cores forçadas pelo sistema.

## Testes

```bash
npm test -- --watch=false
```

Os testes usam respostas HTTP simuladas, sem depender da API local.

## Build

```bash
npm run build
```

Os arquivos gerados ficam em `dist/`. O proxy é uma configuração do servidor de desenvolvimento; para servir uma build, é necessário encaminhar as rotas da API no servidor que a hospeda ou configurar `API_URL` para um endereço acessível, com CORS quando necessário.

## Créditos

Favicon criado por [Infinyteam](https://icon-icons.com/pt/authors/1146-infinyteam), obtido em [Icon-Icons](https://icon-icons.com/pt/icone/area-de-transferencia-notas-lista-tarefas/191193).
