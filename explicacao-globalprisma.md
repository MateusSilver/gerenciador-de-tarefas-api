# Explicação do Global do Prisma

O que aplicamos ali é uma variação de um conceito famoso na programação chamado Design Pattern: Singleton (Padrão Singleton), adaptado para o ambiente de desenvolvimento do Next.js.

Vamos dissecar o porquê de precisarmos disso e como o código funciona linha por linha:

## O Problema: O "Hot Reload" do Next.js

Quando você roda o projeto com npm run dev, o Next.js usa um recurso chamado Hot Module Replacement (HMR). Isso significa que, toda vez que você aperta Ctrl + S para salvar um arquivo, o Next.js reinicia parte do seu servidor instantaneamente para refletir as mudanças na tela.

Se nós criássemos a conexão de forma simples, assim:

```TypeScript
export const prisma = new PrismaClient();
```

A cada Ctrl + S que você desse, o Next.js rodaria essa linha de novo e abriria uma nova conexão com o seu banco lá no Neon. Em poucos minutos de trabalho, você teria dezenas de conexões abertas (vazamento de memória), atingiria o limite do banco de dados e ele derrubaria a sua aplicação com um erro de Too many connections.

## A Solução: O Padrão Singleton

A ideia do Singleton é garantir que exista uma e apenas uma instância da conexão rodando durante toda a vida da aplicação.

Aqui está a lógica do código que escrevemos:

### 1. Acessando a Memória Global do Node.js

```TypeScript
const globalForPrisma = globalThis as unknown as {
prisma: PrismaClient | undefined;
};
```

O globalThis é um objeto especial que representa a memória global do servidor Node.js. Diferente dos seus arquivos .ts normais, essa memória global não é apagada quando o Next.js faz o Hot Reload. Nós "sequestramos" um pedacinho dessa memória global para guardar a nossa conexão do Prisma.

### 2. A Regra do "Ou um, Ou outro"

```TypeScript
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
```

Aqui usamos o operador de coalescência nula (??). Ele faz a seguinte pergunta:

"Já existe uma conexão guardada no globalForPrisma?"

Se SIM (você acabou de dar um Ctrl + S), ele reaproveita a conexão que já estava aberta.

Se NÃO (você acabou de ligar o servidor pela primeira vez), ele executa o new PrismaClient() e abre a conexão com o Neon.

### 3. Protegendo a Produção

```TypeScript
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Quando você colocar o projeto no ar pela Vercel (Fase 5), o ambiente muda para production. Em produção, o código não fica reiniciando toda hora, ele roda de forma contínua e limpa. Portanto, em produção, não precisamos fazer essa gambiarra de salvar na memória global. Essa linha garante que o truque do globalThis só aconteça enquanto você estiver programando no seu computador (development).

Em resumo: esse arquivo atua como um "guardião" inteligente. Ele protege o seu banco de dados no Neon de ser bombardeado por múltiplas conexões enquanto você desenvolve.

Fez sentido a mecânica por trás desse código? Se sim, podemos criar a pasta app/api/tasks/route.ts e colar aquele código do GET e POST para você testar no Thunder Client!
