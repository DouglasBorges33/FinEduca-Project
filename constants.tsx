import React from 'react';
import { Course } from './types';

export const INITIAL_COURSE_TOPICS = [
  { 
    id: 'impostos-iniciantes', 
    title: 'Impostos para Iniciantes',
  },
  { 
    id: 'investimentos-zero',
    title: 'Como Investir do Zero',
  },
  { 
    id: 'orcamento-pessoal',
    title: 'Criando um Orçamento Pessoal',
  },
];

export const ICONS = {
    tax: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 01.75.75v.75m0 0h.75a.75.75 0 01.75.75v.75m0 0V9A.75.75 0 015.25 9h-.75M3.75 9h-.75A.75.75 0 012.25 8.25v-.75m0 0a.75.75 0 01.75-.75h.75m0 0h.75a.75.75 0 01.75.75v.75m0 0h.75a.75.75 0 01.75.75v.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
    ),
    investment: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
    ),
    budget: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
    ),
};

export const INITIAL_COURSES_DATA: Course[] = [
  {
    id: 'impostos-iniciantes',
    title: 'Impostos para Iniciantes',
    description: 'Perca o medo da Receita Federal! Entenda os principais impostos que afetam sua vida e como eles funcionam.',
    icon: 'tax',
    difficulty: 'beginner',
    lessons: [
      {
        title: 'O que são impostos?',
        content: `Impostos são valores que pagamos ao governo para financiar serviços públicos como saúde, educação e segurança. Pense neles como uma contribuição de todos para o bem-estar da sociedade.\n\nExistem diferentes tipos de impostos: federais (como o Imposto de Renda), estaduais (como o IPVA do seu carro) e municipais (como o IPTU da sua casa).\n\nEntender essa divisão é o primeiro passo para saber para onde seu dinheiro vai e como ele é usado para manter o país funcionando.`,
        quiz: [
          { question: 'Para que servem os impostos?', options: ['Para enriquecer os políticos', 'Para financiar serviços públicos', 'Para pagar a conta de luz do presidente', 'Para construir shoppings'], correctAnswerIndex: 1 },
          { question: 'Qual destes é um imposto municipal?', options: ['Imposto de Renda', 'IPVA', 'IPTU', 'IOF'], correctAnswerIndex: 2 },
          { question: 'Quem cobra o Imposto de Renda?', options: ['A prefeitura', 'O governo do estado', 'O governo federal', 'A escola do seu bairro'], correctAnswerIndex: 2 },
        ]
      },
      {
        title: 'Imposto de Renda (IRPF)',
        content: `O Imposto de Renda de Pessoa Física (IRPF) é um dos mais conhecidos. Ele incide sobre a sua renda, como salários, aluguéis e investimentos. A cada ano, você precisa "prestar contas" ao governo através da Declaração de IRPF.\n\nNem todo mundo precisa declarar. Existem regras de isenção, geralmente baseadas no total de rendimentos que você teve no ano anterior. Quem ganha abaixo de um certo teto, por exemplo, não precisa se preocupar.\n\nNa declaração, você informa tudo o que ganhou e também pode deduzir alguns gastos, como despesas com saúde e educação. Isso pode diminuir o valor do imposto a pagar ou até gerar uma restituição (dinheiro de volta!).`,
        quiz: [
          { question: 'Sobre o que o IRPF incide?', options: ['Apenas sobre salários', 'Sobre sua renda (salários, aluguéis, etc.)', 'Apenas sobre prêmios de loteria', 'Sobre o valor do seu carro'], correctAnswerIndex: 1 },
          { question: 'O que pode diminuir o valor do Imposto de Renda a pagar?', options: ['Gastos com viagens', 'Gastos com saúde e educação', 'Comprar um celular novo', 'Fazer compras no supermercado'], correctAnswerIndex: 1 },
          { question: 'O que é "restituição" do IRPF?', options: ['Uma multa por atraso', 'Um imposto extra', 'O dinheiro que o governo te devolve', 'O nome do formulário de declaração'], correctAnswerIndex: 2 },
        ]
      },
      {
        title: 'Impostos sobre o Consumo',
        content: `Você paga impostos todos os dias, mesmo sem perceber! Eles estão "embutidos" nos preços dos produtos e serviços que você consome. Os principais são o ICMS (estadual) e o ISS (municipal).\n\nO ICMS (Imposto sobre Circulação de Mercadorias e Serviços) está presente em quase tudo que você compra, desde um pão na padaria até um eletrodoméstico. Cada estado tem sua própria alíquota (percentual).\n\nJá o ISS (Imposto Sobre Serviços) incide sobre serviços como cabeleireiro, academia, cinema, etc. Quando você vê a nota fiscal de um serviço, parte daquele valor é destinada a esse imposto para o município.`,
        quiz: [
          { question: 'Onde encontramos os impostos sobre o consumo?', options: ['Apenas na declaração de IRPF', 'Embutidos nos preços de produtos e serviços', 'Apenas na conta de luz', 'Somente em compras internacionais'], correctAnswerIndex: 1 },
          { question: 'Qual imposto incide sobre um corte de cabelo?', options: ['IPVA', 'IPTU', 'ICMS', 'ISS'], correctAnswerIndex: 3 },
          { question: 'O ICMS é um imposto cobrado por quem?', options: ['Pelo município', 'Pelo estado', 'Pela União', 'Pela loja'], correctAnswerIndex: 1 },
        ]
      }
    ]
  },
  {
    id: 'investimentos-zero',
    title: 'Como Investir do Zero',
    description: 'Descubra que investir não é um bicho de sete cabeças. Aprenda os conceitos básicos para fazer seu dinheiro render.',
    icon: 'investment',
    difficulty: 'beginner',
    lessons: [
      {
        title: 'Por que investir?',
        content: `Investir é o ato de aplicar seu dinheiro hoje para que ele cresça e trabalhe para você no futuro. É diferente de poupar, que é apenas guardar. Ao investir, você busca uma rentabilidade que supere a inflação, garantindo que seu poder de compra aumente com o tempo.\n\nOs objetivos para investir são variados: comprar uma casa, fazer uma viagem, garantir uma aposentadoria tranquila ou simplesmente construir um patrimônio. Ter um objetivo claro ajuda a definir a melhor estratégia.\n\nO maior aliado do investidor é o tempo. Graças aos juros compostos (juros sobre juros), quanto antes você começar, mesmo com pouco dinheiro, maior será o resultado lá na frente. O importante é dar o primeiro passo!`,
        quiz: [
          { question: 'Qual a principal diferença entre poupar e investir?', options: ['Poupar é mais arriscado', 'Investir busca rentabilidade para o dinheiro crescer', 'Poupar rende mais que investir', 'Não há diferença'], correctAnswerIndex: 1 },
          { question: 'O que são os "juros compostos"?', options: ['Uma taxa extra cobrada pelo banco', 'Juros que rendem apenas sobre o valor inicial', 'Juros que rendem sobre o valor inicial e sobre os juros já acumulados', 'Um tipo de imposto'], correctAnswerIndex: 2 },
          { question: 'Por que é importante ter um objetivo ao investir?', options: ['Para se gabar para os amigos', 'Porque o gerente do banco exige', 'Para ajudar a definir a melhor estratégia de investimento', 'Para pagar menos impostos'], correctAnswerIndex: 2 },
        ]
      },
      {
        title: 'Renda Fixa vs. Renda Variável',
        content: `Os investimentos se dividem em duas grandes categorias: Renda Fixa e Renda Variável. Entender a diferença é fundamental.\n\n**Renda Fixa:** É como emprestar dinheiro para alguém (governo, bancos ou empresas) e saber, no momento da aplicação, qual será a regra de remuneração. É considerada mais segura e previsível. Exemplos: Tesouro Direto, CDBs e LCIs.\n\n**Renda Variável:** Aqui, a rentabilidade não é previsível. O valor do seu investimento pode variar muito, tanto para cima quanto para baixo. O potencial de ganho é maior, mas o risco também. O exemplo mais famoso são as Ações de empresas na Bolsa de Valores.`,
        quiz: [
          { question: 'Qual categoria de investimento é considerada mais segura e previsível?', options: ['Renda Variável', 'Renda Mista', 'Renda Fixa', 'Renda Alternativa'], correctAnswerIndex: 2 },
          { question: 'Comprar uma Ação na Bolsa de Valores é um exemplo de:', options: ['Renda Fixa', 'Poupança', 'Renda Variável', 'Tesouro Direto'], correctAnswerIndex: 2 },
          { question: 'Ao investir em um CDB, você está emprestando dinheiro para quem?', options: ['Para o governo', 'Para um banco', 'Para outra pessoa', 'Para a Bolsa de Valores'], correctAnswerIndex: 1 },
        ]
      },
      {
        title: 'Primeiros Passos: A Reserva de Emergência',
        content: `Antes de pensar em investimentos arrojados, o primeiro passo de todo investidor é construir a Reserva de Emergência. É um dinheiro guardado para imprevistos, como uma despesa médica ou a perda do emprego.\n\nO ideal é que essa reserva cubra de 6 a 12 meses do seu custo de vida mensal. Se você gasta R$ 2.000 por mês, sua reserva deve ser entre R$ 12.000 e R$ 24.000.\n\nEsse dinheiro deve ser aplicado em um investimento de Renda Fixa muito seguro e com liquidez diária (que você possa resgatar a qualquer momento sem perdas). Boas opções são o Tesouro Selic ou um CDB de liquidez diária que pague 100% do CDI.`,
        quiz: [
          { question: 'Qual o principal objetivo da Reserva de Emergência?', options: ['Ficar rico rapidamente', 'Cobrir custos de imprevistos', 'Comprar um carro novo', 'Especular na bolsa'], correctAnswerIndex: 1 },
          { question: 'Onde se deve investir a Reserva de Emergência?', options: ['Em Ações de alto risco', 'Em um investimento seguro e de fácil resgate', 'Na poupança, pois é a única opção', 'Em criptomoedas'], correctAnswerIndex: 1 },
          { question: 'Quantos meses do seu custo de vida a reserva deve cobrir, idealmente?', options: ['1 mês', '2 a 3 meses', '6 a 12 meses', '24 meses'], correctAnswerIndex: 2 },
        ]
      }
    ]
  },
  {
    id: 'orcamento-pessoal',
    title: 'Criando um Orçamento Pessoal',
    description: 'Assuma o controle do seu dinheiro. Aprenda a criar um orçamento que funciona para você e alcance seus objetivos.',
    icon: 'budget',
    difficulty: 'beginner',
    lessons: [
      {
        title: 'Para onde vai seu dinheiro?',
        content: `O primeiro passo para criar um orçamento é saber exatamente quanto você ganha e quanto gasta. Parece simples, mas muitas pessoas não têm essa clareza. Durante um mês, anote **todas** as suas despesas, desde o aluguel até o cafezinho.\n\nVocê pode usar um caderno, uma planilha ou um aplicativo de celular. O importante é registrar tudo. Isso vai te dar um "mapa" da sua vida financeira.\n\nAo final do mês, separe os gastos por categorias, como: Moradia, Alimentação, Transporte, Lazer, etc. Você pode se surpreender ao descobrir para onde seu dinheiro está realmente indo.`,
        quiz: [
          { question: 'Qual o primeiro passo para criar um orçamento?', options: ['Cortar todos os gastos com lazer', 'Saber quanto você ganha e gasta', 'Pedir um aumento', 'Investir na bolsa'], correctAnswerIndex: 1 },
          { question: 'Por que é útil categorizar os gastos?', options: ['Para o gerente do banco ver', 'Para mostrar para os amigos', 'Para identificar para onde o dinheiro está indo', 'Porque o aplicativo obriga'], correctAnswerIndex: 2 },
          { question: 'Qual ferramenta NÃO é útil para registrar gastos?', options: ['Caderno', 'Planilha', 'Aplicativo de finanças', 'Apenas a memória'], correctAnswerIndex: 3 },
        ]
      },
      {
        title: 'Montando seu Orçamento',
        content: `Com o mapa de gastos em mãos, é hora de montar o orçamento. Um método popular é o 50/30/20. Ele sugere dividir sua renda líquida (o que sobra após os impostos) da seguinte forma:\n\n* **50% para Gastos Essenciais:** Aluguel, contas de luz e água, supermercado, transporte, saúde. Tudo o que é indispensável para viver.\n* **30% para Gastos Pessoais (Desejos):** Lazer, restaurantes, streaming, compras, viagens. Tudo o que torna a vida mais divertida.\n* **20% para Metas Financeiras:** Pagar dívidas, investir, guardar para a aposentadoria ou para a reserva de emergência.`,
        quiz: [
          { question: 'No método 50/30/20, o que os 50% representam?', options: ['Investimentos', 'Lazer', 'Gastos Essenciais', 'Poupança'], correctAnswerIndex: 2 },
          { question: 'Ir ao cinema entra em qual categoria do método 50/30/20?', options: ['Essenciais (50%)', 'Pessoais/Desejos (30%)', 'Metas Financeiras (20%)', 'Nenhuma das anteriores'], correctAnswerIndex: 1 },
          { question: 'A parcela de 20% deve ser prioritariamente usada para quê?', options: ['Compras no shopping', 'Pagar dívidas e investir', 'Jantar fora com mais frequência', 'Assinar mais serviços de streaming'], correctAnswerIndex: 1 },
        ]
      },
      {
        title: 'Ajustando e Mantendo o Orçamento',
        content: `Um orçamento não é algo escrito em pedra. Ele deve ser flexível e se adaptar à sua vida. Se você perceber que está gastando muito em uma categoria, veja onde pode fazer pequenos cortes. O objetivo não é se privar de tudo, mas sim ter controle e fazer escolhas conscientes.\n\nRevise seu orçamento todo mês. Seus gastos e sua renda podem mudar. O importante é manter o hábito de acompanhar suas finanças.\n\nCom o tempo, você verá que ter um orçamento te dá mais liberdade, e não menos. Ele te permite gastar sem culpa nas coisas que você valoriza e, ao mesmo tempo, te deixa tranquilo ao saber que seu futuro financeiro está sendo construído.`,
        quiz: [
          { question: 'Com que frequência você deve revisar seu orçamento?', options: ['Uma vez por ano', 'A cada 5 anos', 'Todo mês', 'Nunca'], correctAnswerIndex: 2 },
          { question: 'Qual o principal objetivo de um orçamento?', options: ['Impedir você de gastar dinheiro', 'Ter controle e fazer escolhas financeiras conscientes', 'Apenas guardar dinheiro na poupança', 'Impressionar o banco'], correctAnswerIndex: 1 },
          { question: 'Se um gasto inesperado acontece, o que você deve fazer?', options: ['Ignorar e fingir que não aconteceu', 'Desistir do orçamento para sempre', 'Ajustar o orçamento do mês para acomodar o gasto', 'Entrar no cheque especial sem pensar'], correctAnswerIndex: 2 },
        ]
      }
    ]
  }
];