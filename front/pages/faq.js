import ContainerCollapse from '@/components/ContainerCollapse'
import React from 'react'

const listQuestions = [
  {
    id: 1,
    question: "Pergunta 1: Porque isso e aquilo?",
    answer: "Porque aquilo outro é aquilo lá",
  },
  {
    id: 2,
    question: "Pergunta 2: Qual é a importância do sol?",
    answer: "O sol é importante para fornecer energia e regular o clima na Terra.",
  },
  {
    id: 3,
    question: "Pergunta 3: Como funciona a fotossíntese?",
    answer: "A fotossíntese é um processo em que as plantas convertem luz solar, dióxido de carbono e água em glicose e oxigênio.",
  },
  {
    id: 4,
    question: "Pergunta 4: O que são átomos?",
    answer: "Átomos são as menores unidades que compõem a matéria e consistem em prótons, nêutrons e elétrons.",
  },
  {
    id: 5,
    question: "Pergunta 5: O que é a teoria da relatividade?",
    answer: "A teoria da relatividade é uma teoria física de Albert Einstein que descreve a relação entre espaço e tempo.",
  },
  {
    id: 6,
    question: "Pergunta 6: O que é inteligência artificial?",
    answer: "Inteligência artificial é o desenvolvimento de sistemas de computador que podem realizar tarefas que normalmente exigem inteligência humana.",
  },
  {
    id: 7,
    question: "Pergunta 7: Como a internet funciona?",
    answer: "A internet funciona por meio de uma rede global de computadores interconectados que trocam informações entre si.",
  },
  {
    id: 8,
    question: "Pergunta 8: O que é um buraco negro?",
    answer: "Um buraco negro é uma região no espaço onde a gravidade é tão forte que nada pode escapar dela, nem mesmo a luz.",
  },
  {
    id: 9,
    question: "Pergunta 9: O que é evolução?",
    answer: "Evolução é o processo pelo qual as espécies de organismos mudam ao longo do tempo através de variações genéticas e seleção natural.",
  },
  {
    id: 10,
    question: "Pergunta 10: O que é o efeito estufa?",
    answer: "O efeito estufa é um fenômeno natural que ocorre quando certos gases na atmosfera da Terra retêm calor, resultando em um aumento da temperatura média do planeta.",
  },
];

function Faq() {
  return (
    <div>
      <h2 className='font-bold uppercase'>Faq - Dúvidas Frequentes</h2>
      <div>
        {listQuestions(question => {
          <ContainerCollapse key={question.id} title={question.question}>
            {question.answer}
          </ContainerCollapse>

        })}
      </div>
    </div>
  )
}

export default Faq