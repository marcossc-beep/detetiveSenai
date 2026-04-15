import React, { useState } from 'react';
import './App.css';

const STORY_DATA = [
  {
    id: 0,
    title: "O Fato Principal",
    text: "O Professor Frodo foi encontrado morto em sua sala as 22h30. A causa preliminar aponta envenenamento pelo vinho deixado na mesa, o relatório completo do legista registra digitais de João Gomez da Silva. Ele estava prestes a concluir uma pesquisa acadêmica explosiva sobre impactos ambientais e saneamento básico.",
    imageDescription: "Foto pericial da mesa de Frodo: papéis de pesquisa espalhados, uma taça de vinho pela metade e a fita amarela de cena de crime.",
    image_link: "crime.jpg"
  },
  {
    id: 1,
    title: "O Álibi da Esposa",
    text: "Fernanda demonstrou traços corporais disfarçados de alegria com a notícia da morte de frodo, a esposa de Frodo é a única beneficiária de um apólice de seguro de vida milionária. Ela alegou que passou a tarde e a noite em casa assistindo Netflix. Contudo, a câmera da portaria a registrou entrando às 17h30 e sainendo às 18h05.",
    imageDescription: "Tela dividida: De um lado o contrato de seguro de vida, do outro a foto da câmera mostrando a esposa na portaria às 17h30.",
    image_link: "esposa.png"
  },
  {
    id: 2,
    title: "O Motivo Corporativo",
    text: "A pesquisa de Frodo iria expor e prejudicar severamente uma grande empresa de saneamento que a anos estava poluindo as praias proximas.",
    imageDescription: "Imagem do Frodo pesquisando o mar",
    image_link: "pesquisa.png"
  },
  {
    id: 3,
    title: "CEO Ricardo",
    text: "O Alibe de Ricardo é muito forte, ele tem provas de que estava em um evento beneficente no horário do crime. O CEO dessa empresa realizou um saque incomum e não justificado de R$ 70.000 em espécie dois dias antes do assassinato.",
    imageDescription: "Extrato bancário em tela de computador, com um círculo vermelho em volta do saque de R$ 70.000,00 na conta do CEO.",
    image_link: "extrato.png"
  },
  {
    id: 4,
    title: "A Suspeita do Vinho",
    text: "João foi identificado como o comprador do que estava na sala com o professor Frodo. Em depoimento, ele disse que foi embora às 22h00 depois de uma noite normal com uma boa conversa com Frodo como de costume. Porém, os registros das câmeras de segurança mostram João entrando na sala de Frodo as 21h00 e saindo do prédio apenas às 6h00 da manhã. O extrato bancário de João mostra um gasto de 300 reais em vinho em uma adega próxima as 20h10.",
    imageDescription: "Gravação de CFTV: Um homem (João) saindo pela porta dos fundos",
    image_link: "joao.png"
  },
  {
    id: 5,
    title: "O Encontro Externo",
    text: "Alice era a aluna favorita de frodo, ficou devastada com a notícia. A linha do tempo fica confusa. Testemunhas e recibos de cartão de crédito confirmam que Alice se encontrou com o Professor Frodo em uma padaria no centro da cidade, permanecendo com ele das 15h00 até as 19h00. Alice informa que estava insegura com o relacionamento escondido com Frodo pois sabia que a esposa de Frodo estava suspeitando e temia as consequências.",
    imageDescription: "Recibo amassado de uma padaria, mostrando o horário de abertura da mesa às 15h00 e o pagamento às 19h00.",
    image_link: "recibo.png"
  },
  {
    id: 6,
    title: "Movimentação Interna",
    text: "Rafael, o porteiro do prédio que estava de plantão durante a noite do crime, comprou repentinamente uma passagem aérea só de ida para a Europa no valor de R$ 4.000, com embarque marcado para amanhã de manhã.",
    imageDescription: "Tela de celular mostrando um e-mail de confirmação de passagem aérea em nome de Rafael, voo internacional, valor R$ 4.000.",
    image_link: "passagem.png"
  }
];

const SUSPECTS = ["João", "Esposa do Frodo", "CEO da Saneamento", "Alice", "Rafael (Porteiro)"];

const RESULT_CONFIG = {
  WIN: {
    title: "CASO ENCERRADO",
    color: "#2ecc71",
    message: "Exato. O porteiro Rafael foi interceptado no aeroporto. Você conectou os fatos com precisão."
  },
  LOSE: {
    title: "GAME OVER",
    color: "#e74c3c",
    message: "Você acusou a pessoa errada. As evidências não sustentam sua conclusão e o verdadeiro assassino escapou."
  }
};

export default function MorteNaCoordenacao() {
  const [currentStep, setCurrentStep] = useState(0);
  const [gameState, setGameState] = useState('STORY'); 
  const [result, setResult] = useState(null);

  const nextStep = () => {
    if (currentStep < STORY_DATA.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setGameState('ACCUSE');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleAccusation = (suspect) => {
    if (suspect === "Rafael (Porteiro)") {
      setResult('WIN');
    } else {
      setResult('LOSE');
    }
    setGameState('RESULT');
  };

  const restartGame = () => {
    setCurrentStep(0);
    setGameState('STORY');
    setResult(null);
  };

  // Variáveis auxiliares para simplificar o return
  const slideAtual = STORY_DATA[currentStep];
  const config = result ? RESULT_CONFIG[result] : null;

  return (
    <div className="container">
      <div className="card">
        
        {gameState === 'STORY' && (
          <>
            <div className="image-area">
              <img src={slideAtual.image_link} className="actual-image" alt="Cena" />
              <p className="image-caption">Descrição: {slideAtual.imageDescription}</p>
            </div>
            <div className="content">
              <h2 className="title">{slideAtual.title}</h2>
              <p className="text">{slideAtual.text}</p>
            </div>
            <div className="footer">
              <button 
                className="button-secondary" 
                onClick={prevStep} 
                style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
              >
                Anterior
              </button>
              <button className="button" onClick={nextStep}>
                {currentStep === STORY_DATA.length - 1 ? "Fazer Acusação" : "Próximo"}
              </button>
            </div>
          </>
        )}

        {gameState === 'ACCUSE' && (
          <div className="content">
            <h2 className="title">Quem matou o Professor Frodo?</h2>
            <p className="text">Cruze a linha do tempo e os álibis. Você só tem uma chance.</p>
            <ul className="list">
              {SUSPECTS.map(s => (
                <li key={s} className="list-item" onClick={() => handleAccusation(s)}>
                  {s}
                </li>
              ))}
            </ul>
            <div className="footer">
               <button className="button-secondary" onClick={() => setGameState('STORY')}>Voltar</button>
            </div>
          </div>
        )}

        {gameState === 'RESULT' && config && (
          <div className="content" style={{ textAlign: 'center' }}>
            <h2 className="title" style={{ color: config.color }}>{config.title}</h2>
            <p className="text">{config.message}</p>
            <button className="button" onClick={restartGame}>Reiniciar Investigação</button>
          </div>
        )}

      </div>
    </div>
  );
}