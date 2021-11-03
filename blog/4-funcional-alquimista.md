Funcional Alquimista
====================

O Haskell e outras linguagens funcionais usam tipos algébricos, declarados com a sintaxe "data":

```
data Bool    = True | False
data Jokenpo = Rock | Paper | Scissor
data Pair x  = MakePair x x
data Maybe x = Nothing | Just x
data Nat     = Zero | Succ Nat
data List x  = Nil | Cons x (List x)
data Tree x  = Empty | Branch x (List (Tree x))
```

Se você não entende o que está acontecendo acima, o resto não vai fazer sentido (e tudo bem); nesse caso, recomendo ler algum tutorial de Haskell caso ainda tenha interesse nesse post. Se as linhas acima fazem sentido para você, continue lendo, pois lhe contarei a história de um alquimista funcional que foi longe demais.

Era uma linda tarde de sol, quando um alquimista funcional, como outro qualquer, se perguntou a pergunta que todos fazemos um dia: "se tipos funcionais são chamados algébricos... por que não escrevemos eles como equações algébricas?" Sem saber que essa pergunta lhe levaria a um caminho sem volta que tangeria a porta da verdade, o pobre alquimista pegou um giz e, em seu já desgastado quadro negro, escreveu a seguinte equação:

```
Bool = 1 + 1
```

Em sua cabeça, isso fez sentido, porque Bool é um tipo soma, que pode ter dois valores: True e False. Na linha abaixo, ele escreveu:

```
Jokenpo = 1 + 1 + 1
```

Isso também fez sentido, porque existem 3 movimentos no Jokenpo: Rock, Paper, Scissor. Até aí, tudo parecia uma brincadeira inocente. Mas foi na próxima linha que as coisas começaram a ficar... interessantes. Se tipos soma são representados por uma adição, então tipos produto só podem ser representados com...

```
Pair x = x * x
```

Uma multiplicação! Mas isso realmente funciona? Vamos verificar: de acordo com essa equação, o tipo `Pair Jokenpo Jokenpo` deveria ter um total de `(1 + 1 + 1) * (1 + 1 + 1) = 3 * 3 = 9`, elementos. Vamos contar:

```
(Rock, Rock)
(Rock, Paper)
(Rock, Scissor)
(Paper, Rock)
(Paper, Paper)
(Paper, Scissor)
(Scissor, Rock)
(Scissor, Paper)
(Scissor, Scissor)
```

NANI!? Não pode ser. Será? Na linha abaixo, ele escreveu:

```
Maybe x = 1 + x
```

De acordo com essa equação, o tipo `Maybe Bool` deveria ter `1 + 2 = 3` elementos. Vamos contar:

```
Nothing
Just True
Just False
```

Caramba. Mas o que acontece com tipos infinitos? 

```
Nat = 1 + Nat 
```

Nesse caso, temos um loop:

```
Nat = 1 + 1 + Nat 
Nat = 1 + 1 + 1 + Nat
Nat = 1 + 1 + 1 + 1 + ... Nat
```

O que reflete o fato que existem infinitos números naturais. Logo mais, ele descobriu que o mesmo vale para listas e árvores:

```
List x = 1 + x * List x
```

Pra visualizar essa equação, vamos primeiro contar a quantidade de elementos do tipo `List Bool`, para cada tamanho de lista:

List Bool de tamanho 0 tem 1 elemento:

```
[]
```

List Bool de tamanho 1 tem 2 elementos:

```
[True]
[False]
```

List Bool de tamanho 2 tem 4 elementos:

```
[True,True]
[True,False]
[False,True]
[False,False]
```

List Bool de tamanho 3 tem 8 elementos:

```
[True,True,True]
[True,True,False]
[True,False,True]
[True,False,False]
[False,True,True]
[False,True,False]
[False,False,True]
[False,False,False]
```

Ou seja, ao todo, List Bool tem um total de:

```
1 + 2 + 4 + 8 + 16 + ...
```

Elementos. Será que isso condiz com a equação acima? Vamos tentar aplicá-la:

```
List Bool = 1 + 2 * List Bool
List Bool = 1 + 2 * (1 + 2 * List Bool)
List Bool = 1 + 2 + 4 * List Bool
List Bool = 1 + 2 + 4 * (1 + 2 * List Bool)
List Bool = 1 + 2 + 4 + 8 * List Bool
List Bool = 1 + 2 + 4 + 8 * (1 + 2 * List Bool)
List Bool = 1 + 2 + 4 + 8 + 16 * List Bool
List Bool = ...
```

Uau! Nesse momento, o alquimista estava ciente de que havia encontrado algo realmente interessante. Ele estava à beira da porta da verdade, mas ainda havia tempo para voltar: virar de costas, fingir que aquela brincadeira nunca havia acontecido e levar uma vida normal e pacata. Mas o alquimia tinha sede por verdade, e não temia a inquisição. Então, com sangue nos olhos e as mãos tremendo, ele escreveu mais uma linha. Esta linha, eu lhes transcrevo na forma original:

```
d/dx Pair x = ?
```

Nesse momento, a porta da verdade se abriu.

```
d/dx Pair x =
d/dx (x * x) =
d/dx (x²) =
2x
```

Essa linha lhe disse que a derivada do tipo par, representado por "x * x", é o tipo representado por "x + x", ou seja:

```
data DeltaPair x = Fst x | Snd x
```

Mas qual seria a relação desse tipo, com o tipo par? O alquimista, perplexo, pensou por muito tempo, até formular a seguinte teoria: se a derivada de uma função algébrica é uma função capaz de focar em um ponto infinitesimal da função original, então, a derivada de um tipo algébrico deveria ser um tipo capaz de focar em um ponto do tipo original. Isso fez sentido. Afinal, se temos o par `(5, 7)`, então, podemos focar em dois elementos: o da esquerda, `(*, 7)`, ou o da direita, `(5, *)`. Esses dois pontos de foco podem ser representados pelo tipo DeltaPair, como `Fst 7` ou `Snd 5`, respectivamente. Para confirmar essa teoria, o alquimista tentou aplicar o mesmo ao tipo das listas, o que lhe demandou certa ingenuidade algébrica:

```
List x = 1 + x * List x
List x - x * List x = 1
List x * (1 - x) = 1
List x = 1 / (1 - x)

d/dx List x = d/dx 1 / (1 - x)
d/dx List x = 1 / (1 - x)²
d/dx List x = 1 / (1 - x) * 1 / (1 - x)
d/dx List x = List x * List x

data DeltaList x = Split (DeltaList x) (DeltaList x)
```

Isso nos indica que a derivada do tipo lista é nada mais do que duas listas. E isso também faz sentido, pois, para focar em um ponto de uma lista, precisamos de duas listas: uma com os elementos à esquerda do foco, e outra com os elementos à direita. Por exemplo, se criamos uma lista de 5 elementos, podemos focar no elemento do meio como: `[1, 2, *, 4, 5]`, o que pode ser representado pelo tipo `DeltaList` como `Split [1, 2] [4, 5]`.

Infelizmente, a verdade sobre a interligação entre tipos e equações algébricas foi poderosa demais até para o nosso bravo alquimista, que logo perdeu a sanidade e sumiu do mapa. Seu paradeiro, até hoje, é desconhecido, mas reza a lenda que ele ainda está entre nós, vagando por algum vilarejo pacato, comendo bananas radioativas e tentando derivar o tipo das monadas.
