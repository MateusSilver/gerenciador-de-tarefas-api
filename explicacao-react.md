# Explicação sobre React e Estados

## 1. `useState`: A Memória do Componente

Em JavaScript normal, se você muda o valor de uma variável (`titulo = "Novo"`), a tela do navegador não atualiza sozinha. No React, nós usamos o `useState` para criar variáveis "reativas". Quando o valor delas muda, o React redesenha a tela automaticamente.

Ele sempre devolve duas coisas (um par): a variável que guarda o valor, e a função que altera esse valor.

```javascript
// const [oValor, aFuncaoQueMudaOValor] = useState(valorInicial);
const [isLoading, setIsLoading] = useState(true);

// Como usar:
setIsLoading(false); // O React percebe a mudança e atualiza a tela
```

## 2. `useEffect`: O Vigia (Efeitos Colaterais)

O componente do React é feito para renderizar visualmente. Qualquer coisa que aconteça "por fora" disso (buscar dados numa API, conectar a um banco, ler o `localStorage`) é um "Efeito Colateral". O `useEffect` serve para controlar **quando** essas coisas devem acontecer.

Ele recebe uma função e uma **lista de dependências** (o array no final `[]`):

```javascript
useEffect(() => {
  // O código que vai rodar
  buscarTarefas();
}, [status]); // A lista de dependências
```

- **Se o array estiver vazio `[]`:** O código roda **apenas uma vez** quando o componente aparece na tela.
- **Se o array tiver algo `[status]`:** O código roda na primeira vez E toda vez que a variável `status` mudar de valor.
- **Se não tiver array nenhum:** O código roda feito louco em loop infinito a cada milissegundo (o famoso travador de navegadores).

### Explicando mais profundamente

#### `useState`: O Quadro de Menu (O Visual)

O que você falou está certinho: o `useState` altera visualmente a tela.
Ele é o **quadro de menu** na parede do restaurante e o cara que escreve nele.

- Se o preço da pizza no `useState` mudar de R$ 40 para R$ 50, o React imediatamente apaga o 40 da parede e escreve 50.
- **Resumo:** O `useState` guarda a "memória" do componente. Se essa memória muda, a tela pisca e se redesenha automaticamente para refletir o novo valor. Só isso. Ele cuida do **palco**.

#### `useEffect`: O Gerente de Compras (Os Bastidores)

Aqui está o pulo do gato. O `useEffect` **não** serve para dizer "Se o botão A for clicado, mude a cor do botão B". Ele serve para **falar com o mundo exterior**.

O React é ótimo em pintar telas (o salão do restaurante), mas ele é isolado. Ele não sabe ir à feira comprar tomates (buscar dados no banco de dados Neon) e não sabe olhar no relógio (criar um cronômetro).

O `useEffect` é o **Gerente de Compras** do restaurante. Ele faz os "Efeitos Colaterais" (Side Effects), que são tarefas pesadas ou externas que não têm a ver diretamente com o desenho do botão na tela.

**Quando o Gerente trabalha?**
Você dá a ordem a ele através daquela lista de dependências `[]`:

1. **`[]` (Array vazio):** "Gerente, vá ao mercado comprar os ingredientes **apenas uma vez**, logo que o restaurante abrir as portas (quando a página carregar)." -> _Foi o que usamos para buscar as tarefas na sua API pela primeira vez._
2. **`[status]` (Com variável):** "Gerente, toda vez que o nosso _status_ mudar de 'Fechado' para 'Aberto', vá lá fora e acenda o letreiro luminoso da rua." -> _Ele reage a uma mudança para fazer algo no mundo externo._

#### A Diferença na Prática

Pense no seu código do Dashboard:

1. A página abriu. O **`useEffect`** entra em ação imediatamente, vai até a internet (API), pega as suas tarefas e volta.
2. Quando ele volta, ele entrega as tarefas para o **`useState`**.
3. O **`useState`** pega as tarefas, joga na parede (tela) e avisa: "Pessoal, os dados chegaram, redesenhem a tela com esses cards bonitinhos!".

O `useEffect` buscou (bastidores), e o `useState` mostrou (visual).

### Outros reagentes

A boa notícia é que dominando o `useState` e o `useEffect`, você já tem 80% do que precisa para criar qualquer sistema. Os outros Hooks servem para situações mais específicas, principalmente para organizar o código ou melhorar a performance.

Aqui estão os 3 próximos Hooks que você mais vai encontrar na sua jornada:

### 1. `useRef`: O "Apontador a Laser"

Lembra que o `useState` atualiza a tela toda vez que o valor muda? O `useRef` é o primo silencioso dele. Ele guarda um valor, mas **não** redesenha a tela quando esse valor muda.
Além disso, ele é muito usado para "apontar" diretamente para um elemento HTML na tela.

- **Exemplo prático:** Sabe quando você entra numa página e o cursor do mouse já começa piscando dentro do campo de "E-mail", pronto para você digitar? Fazemos isso com o `useRef`. Nós criamos uma referência, "colamos" ela no `<input>` e dizemos: _"Quando a tela carregar, dê o foco ali!"_.

### 2. `useContext`: O "Alto-Falante Global"

No React, para passar uma variável do Componente Avô para o Componente Neto, você precisa passar a variável pelo Componente Pai (isso se chama _Prop Drilling_ ou "telefone sem fio"). Se a árvore de componentes for muito profunda, isso vira um pesadelo.

O `useContext` cria uma "nuvem" de dados por cima do seu aplicativo. Qualquer componente, não importa onde esteja, pode "puxar" os dados dessa nuvem sem precisar receber do pai.

- **Exemplo prático:** O próprio `useSession()` que usamos do NextAuth é um Hook customizado construído em cima do `useContext`! É por isso que você consegue pegar a foto e o e-mail do usuário logado em qualquer página do seu sistema sem precisar ficar passando essas informações de tela em tela manualmente.

### 3. `useMemo` e `useCallback`: Os "Poupadores de Energia"

Esses dois servem para **performance** (otimização). Como o React adora redesenhar a tela inteira quando algo muda, às vezes ele recalcula contas matemáticas pesadas ou recria funções sem necessidade.

- **`useMemo`:** É uma "calculadora com memória". Se você tem uma conta muito complexa (ex: filtrar uma lista de 10 mil clientes) e os clientes não mudaram, ele devolve o resultado salvo em vez de fazer a conta toda de novo.
- **`useCallback`:** Faz a mesma coisa, mas em vez de salvar um resultado matemático, ele salva uma função inteira para ela não ser recriada na memória do navegador à toa.

### E o mais legal: Custom Hooks (Crie os seus)

Quando você começar a repetir muita lógica, o React permite que você crie os seus próprios Hooks! Você poderia criar um `useTasks()` que já embute o `useState` e o `useEffect` lá dentro, deixando sua tela do Dashboard limpinha com apenas uma linha: `const { tasks, isLoading } = useTasks()`.

Com esse conhecimento teórico da trindade do React (`useState`, `useEffect` e o conceito de _Props/Context_), estamos mais que preparados

## 3. Lógica de Objetos e Desestruturação

Objetos são caixas que guardam informações organizadas por "chaves" e "valores". No React, usamos muito um truque chamado **Desestruturação (Destructuring)** para tirar os valores de dentro da caixa mais rápido.

```javascript
const usuario = { nome: "João", cargo: "Dev", idade: 30 };

// Jeito antigo de pegar o nome:
const nomeDoCara = usuario.nome;

// Jeito moderno (Desestruturação):
const { nome, cargo } = usuario;
// Cria duas variáveis com os valores certinhos, em uma linha só!
```

Fizemos muito isso para extrair o `id` da URL: `const { id } = await params;`

## 4. Arrow Functions (`=>`)

São apenas um jeito mais curto e moderno de escrever funções. Elas são incrivelmente úteis no React porque podem ser escritas em uma única linha, o que é perfeito para passar em botões.

```javascript
// Jeito Tradicional:
function somar(a, b) {
  return a + b;
}

// Arrow Function (O retorno é implícito, não precisa da palavra "return"):
const somar = (a, b) => a + b;

// No React (passando uma Arrow Function anônima direto no clique):
<button onClick={() => setIsModalOpen(true)}>Abrir</button>;
```

## 5. O Elemento `e` (O Mensageiro do Evento)

Sempre que algo acontece no navegador (um clique, uma digitação, um formulário enviado), o navegador cria um pacote cheio de informações sobre aquele exato momento e joga para dentro da sua função. Nós costumamos chamar esse pacote de `e` (de _event_).

- **No envio de formulários (`onSubmit`):** O comportamento padrão do HTML é recarregar a página inteira. Nós usamos o `e.preventDefault()` para dizer: _"Ei navegador, não faça o seu padrão. Deixa que meu código JavaScript assume daqui"_.
- **Na digitação (`onChange`):** Usamos para pegar exatamente a letra que o usuário acabou de digitar através do `e.target.value` (o valor do alvo que disparou o evento).

```javascript
<input onChange={(e) => setTitle(e.target.value)} />
```

---
