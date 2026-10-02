# Mostra de Projetos 2026-02 — IFMG

Site da disciplina IA Aplicada para Negócios Sem Código. Catálogo público com cadastro, edição e exclusão de projetos, sem login.

## Desenvolvimento

Requer Node.js 22.13 ou superior.

```bash
npm ci
npm run db:generate
npm run dev
```

O banco de dados é Cloudflare D1, configurado pela plataforma Sites em `.openai/hosting.json`. As migrações de esquema estão em `drizzle/`. Para publicar uma cópia funcional, configure um binding D1 chamado `DB` e aplique as migrações. O comando `npm run build` gera a aplicação para Cloudflare Workers.

## Acesso

O site não utiliza login. Qualquer visitante com acesso à página pode cadastrar, editar e excluir qualquer projeto.
