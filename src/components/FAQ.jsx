import { useState } from 'react'

const FAQ_ITEMS = [
  {
    pergunta: 'Como fazer um orçamento?',
    resposta:
      'Para fazer um orçamento é só entrar em contato conosco, vamos entender sua demanda e propor peças que melhorem o seu dia a dia. A partir disso, montamos um desenho técnico que acompanha o orçamento para garantirmos que vamos lhe atender da melhor maneira!',
  },
  {
    pergunta: 'Ainda não tenho um padrão de uniforme, por onde começar?',
    resposta:
      'Não se preocupe! Nossa equipe é especializada em trazer sua identidade visual para os uniformes da melhor maneira. Entre em contato conosco para marcarmos uma reunião de entendimento para propormos as melhores soluções de uniforme!',
  },
  {
    pergunta: 'A partir de quantas peças é possível personalizar?',
    resposta:
      'A partir de 12 peças por modelo, é possível fazer uma produção personalizada dos nossos modelos nas cores e tecidos da sua escolha!',
  },
  {
    pergunta: 'Eu consigo comprar menos que 12 peças?',
    resposta:
      'Claro! Temos algumas peças a pronta entrega para atender os pedidos menores e não deixar você na mão. Entre em contato com nossa equipe ou visite nossa loja para saber mais!',
  },
  {
    pergunta: 'Como escolher uma grade de tamanhos?',
    resposta:
      'Na hora de fazer seu pedido sempre batemos muito na tecla de levantar certinho a grade de tamanhos para garantirmos um melhor caimento a todos. Para isso temos nossas tabelas de medidas para auxiliar você!',
  },
  {
    pergunta: 'Ainda não tenho minha equipe montada, como seleciono os tamanhos?',
    resposta:
      'Estamos aqui para te ajudar! Por atendermos vários restaurantes que ainda não possuem uma equipe fixa, temos algumas sugestões de grade que variam de acordo com o tamanho da equipe e costumam funcionar bem em um primeiro momento!',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section className="faq" id="duvidas">
      <div className="faq__inner">
        <h2 className="faq__title">Dúvidas?</h2>

        <div className="faq__list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            const panelId = `faq-panel-${index}`

            return (
              <div className="faq__item" key={item.pergunta}>
                <button
                  type="button"
                  className="faq__question"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span>{item.pergunta}</span>
                  <span className={`faq__icon${isOpen ? ' faq__icon--open' : ''}`} aria-hidden="true">
                    +
                  </span>
                </button>

                <div
                  className={`faq__answer${isOpen ? ' faq__answer--open' : ''}`}
                  id={panelId}
                  role="region"
                >
                  <div className="faq__answer-inner">
                    <p className="faq__answer-text">{item.resposta}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
