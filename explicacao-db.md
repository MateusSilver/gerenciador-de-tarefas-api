# Explicação sobre o Banco

## 1. O que é o Connection Pooling?

Imagine um restaurante muito movimentado (o seu Banco de Dados) e os garçons (as Conexões).

Num modelo tradicional, cada cliente que entra no restaurante exige um garçom exclusivo que fica parado ao lado da mesa até o cliente ir embora. Se o restaurante tiver apenas 100 garçons, o 101º cliente terá que esperar na fila ou a porta do restaurante quebra (o servidor cai).

O **Connection Pooling** (Pool de Conexões) age como um "Gerente de Salão" super eficiente. Ele mantém um número fixo de garçons ativos (ex: 20 conexões abertas) e os reaproveita. Quando um cliente faz um pedido, o garçom anota, entrega na cozinha e já vai atender outra mesa.

**Por que isso é vital hoje?**
Aplicações modernas em Next.js (especialmente as hospedadas na Vercel) usam uma arquitetura _Serverless_ (sem servidor fixo). Isso significa que, se 1.000 usuários acessarem seu site ao mesmo tempo, a Vercel pode subir 1.000 mini-servidores independentes, tentar abrir 1.000 conexões simultâneas com o PostgreSQL e derrubar o banco de dados instantaneamente. O "Pooler" (que o Neon já oferece embutido) fica no meio do caminho, recebe essas 1.000 requisições e as enfileira de forma organizada pelas poucas conexões reais que o banco suporta.

**E por que o Prisma precisa da "Direct URL" para criar as tabelas?**
Operações estruturais (como criar ou alterar uma tabela, o que chamamos de _migration_) são cirúrgicas. Elas precisam de um garçom exclusivo do início ao fim da operação para garantir que nada dê errado no meio do caminho. O Pooler não permite essa exclusividade longa, por isso usamos a URL direta na hora de rodar o comando `migrate`.

---

## 2. O que é o Prisma?

O Prisma é um **ORM (Object-Relational Mapper)** moderno feito para Node.js e TypeScript.

De forma simples, ele é um "tradutor" incrivelmente inteligente. O banco de dados PostgreSQL só entende **SQL** (uma linguagem de texto bruto). Você, por outro lado, está escrevendo código em **TypeScript** (orientado a objetos).

Sem o Prisma, você teria que escrever os comandos SQL manualmente dentro do JavaScript:

```javascript
// O jeito antigo e perigoso (sujeito a erros de digitação e injeção de SQL)
const result = await db.query(
  `SELECT * FROM users WHERE email = '${userEmail}'`,
);
```

Com o Prisma, você modela as tabelas no arquivo `schema.prisma` e ele gera um "cliente" personalizado. Quando você digita `prisma.user.`, o seu VS Code autocompleta todas as colunas disponíveis. Se você tentar buscar uma coluna que não existe, o TypeScript acusa erro antes mesmo de você rodar o projeto.

---

## 3. Miniguia: Como o Prisma traduz para SQL

Aqui está o mapa mental de como os métodos do Prisma se convertem na linguagem do banco de dados (PostgreSQL):

### Criar um registro (Create)

**No Prisma (TypeScript):**

```typescript
const newUser = await prisma.user.create({
  data: {
    name: "Mateus Batista",
    email: "mateus@exemplo.com",
  },
});
```

**Tradução no SQL:**

```sql
INSERT INTO "User" ("id", "name", "email", "createdAt")
VALUES ('abc123cuid', 'Mateus Batista', 'mateus@exemplo.com', CURRENT_TIMESTAMP)
RETURNING *;

```

### Buscar vários registros (Read)

**No Prisma:**

```typescript
// Busca tarefas com status TODO e ordem de criação
const pendingTasks = await prisma.task.findMany({
  where: { status: "TODO" },
  orderBy: { createdAt: "desc" },
});
```

**Tradução no SQL:**

```sql
SELECT "id", "title", "status", "userId" FROM "Task"
WHERE "status" = 'TODO'
ORDER BY "createdAt" DESC;

```

### Atualizar um registro (Update)

**No Prisma:**

```typescript
const updatedTask = await prisma.task.update({
  where: { id: "tarefa_123" },
  data: { status: "DONE" },
});
```

**Tradução no SQL:**

```sql
UPDATE "Task"
SET "status" = 'DONE', "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'tarefa_123';

```

### Buscar com Relacionamentos (O grande trunfo do Prisma)

Buscar um usuário e já trazer as tarefas dele junto, sem precisar escrever JOINs complexos.

**No Prisma:**

```typescript
const userWithTasks = await prisma.user.findUnique({
  where: { email: "mateus@exemplo.com" },
  include: { tasks: true }, // Isso faz a mágica acontecer
});
```

**Tradução no SQL:**
O Prisma faz duas consultas otimizadas ou um `LEFT JOIN` (dependendo da versão do motor), algo conceitualmente como:

```sql
SELECT "User".*, "Task".* FROM "User"
LEFT JOIN "Task" ON "User"."id" = "Task"."userId"
WHERE "User"."email" = 'mateus@exemplo.com';

```

Essa camada de tradução é o que vai acelerar absurdamente a construção da sua API na Fase 2, pois você se preocupa apenas com a lógica de negócio em TypeScript, e o Prisma garante que o SQL gerado por baixo dos panos seja seguro e performático.

## Explicação sobre a linguagem de Schema

A linguagem que usamos no arquivo `schema.prisma` é a **Prisma Schema Language**. Ela é uma linguagem declarativa, ou seja, você descreve o _estado final_ de como quer que os dados sejam organizados, e o Prisma se encarrega de traduzir isso para os comandos complexos de criação de tabelas (`CREATE TABLE`) do PostgreSQL.

Vamos "desmontar" os principais blocos do código que você colou, para entender exatamente como o Prisma lê cada linha:

### 1. Modelos (`model`) = Tabelas

Quando você escreve `model User`, você está dizendo: _"Crie uma tabela chamada User no banco de dados"_. Cada linha dentro das chaves `{}` será uma coluna dessa tabela.

### 2. Colunas e Tipagem

O Prisma exige que toda coluna tenha um tipo bem definido, usando letras maiúsculas.

- **`String`**: Texto (no PostgreSQL, vira `TEXT`).
- **`DateTime`**: Data e hora (vira `TIMESTAMP`).
- **`Status` ou `Priority**`: São os Enums que você criou. O banco só vai aceitar os valores exatos que estão definidos neles (ex: não dá para salvar uma prioridade "SUPER_ALTA", pois ela não existe no Enum).
- **O sinal de interrogação `?**`: Se você escreve `name String?`, significa que esse campo é **opcional**. No banco de dados, ele permite valores nulos (`NULL`). Se não tiver a interrogação, o preenchimento é obrigatório.

### 3. Atributos (Os "Superpoderes" com `@`)

Os atributos que começam com `@` são regras ou comportamentos adicionais aplicados àquela coluna:

- **`@id`**: Diz que esta coluna é a Chave Primária (o identificador principal e inviolável da linha).
- **`@default(cuid())`**: Em vez de usar números sequenciais (1, 2, 3...) que são fáceis de adivinhar, o `cuid()` gera uma string única, aleatória e segura para a web (ex: `clj1g4o7z0000y8q2...`).
- **`@unique`**: Garante que nunca haverá duas linhas com o mesmo valor nesta coluna (útil para `email`).
- **`@default(now())`**: Se você não preencher a data de criação (`createdAt`), o banco preenche sozinho com o segundo exato em que a linha foi salva.
- **`@updatedAt`**: Esse é um atalho incrível do Prisma. Toda vez que você editar essa tarefa no futuro, ele atualiza essa coluna automaticamente com a nova data.

### 4. Relacionamentos (O "Relacional" do Banco)

Este é o ponto mais importante. Como dizemos que uma tarefa pertence a um usuário? Fazemos isso em duas vias:

**Na tabela `Task` (A Filha):**

```prisma
userId      String
user        User     @relation(fields: [userId], references: [id])

```

- A primeira linha (`userId`) é a coluna real que vai guardar o ID do dono.
- A segunda linha (`user`) **não existe** fisicamente no banco de dados. Ela é apenas uma regra para o Prisma entender que o `userId` deve ser igual ao `id` da tabela `User`. Isso cria a famosa **Chave Estrangeira (Foreign Key)**.

**Na tabela `User` (O Pai):**

```prisma
tasks     Task[]

```

- O `[]` indica uma lista (array). Significa que "Um Usuário pode ter várias (Muitas) Tarefas". É assim que o Prisma entende a relação de "1 para N" (Um para Muitos).

---

Tendo dissecado a linguagem, o arquivo que você montou está estruturalmente perfeito e pronto para o ambiente de produção.

Podemos ir em frente e rodar o `npx prisma migrate dev --name init` no terminal para mandar essas tabelas lá para o Neon?
