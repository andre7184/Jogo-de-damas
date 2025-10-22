import { useState } from 'react'
import './App.css'

// Nossos valores para as peças
const VAZIO = 0;
const BRANCA = 1;
const PRETA = 2;
// (Mais tarde podemos adicionar DAMA_BRANCA = 3, DAMA_PRETA = 4)

function App() {
  
  // Este é o estado que guarda nosso tabuleiro
  const [tabuleiro, setTabuleiro] = useState([
    [VAZIO, PRETA, VAZIO, PRETA, VAZIO, PRETA, VAZIO, PRETA], // Linha 0
    [PRETA, VAZIO, PRETA, VAZIO, PRETA, VAZIO, PRETA, VAZIO], // Linha 1
    [VAZIO, PRETA, VAZIO, PRETA, VAZIO, PRETA, VAZIO, PRETA], // Linha 2
    [VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO], // Linha 3
    [VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO], // Linha 4
    [BRANCA, VAZIO, BRANCA, VAZIO, BRANCA, VAZIO, BRANCA, VAZIO], // Linha 5
    [VAZIO, BRANCA, VAZIO, BRANCA, VAZIO, BRANCA, VAZIO, BRANCA], // Linha 6
    [BRANCA, VAZIO, BRANCA, VAZIO, BRANCA, VAZIO, BRANCA, VAZIO]  // Linha 7
  ]);

  // NOVO ESTADO: Guarda as coordenadas [linha, casa] da peça clicada
  // O <[number, number] | null> é TypeScript. 
  // Significa: "O estado é um array [num, num] OU é nulo (nada selecionado)"
  const [pecaSelecionada, setPecaSelecionada] = useState<[number, number] | null>(null);

  // O return vem aqui embaixo
  return (
<div className="jogo">
      <h1>Damas</h1>
      
      {/* Aqui começa o tabuleiro visual */}
      <div className="tabuleiro">
        {/* Loop 1: Mapeia cada 'linha' do nosso estado 'tabuleiro' */}
        {tabuleiro.map((linha, indexLinha) => (
          
          // 'key' é um ID obrigatório que o React exige em listas
          <div key={indexLinha} className="linha">
            
            {/* Loop 2: Mapeia cada 'casa' dentro da 'linha' atual */}
            {linha.map((casa, indexCasa) => (
              
              <div key={indexCasa} className="casa">
                {/* Aqui está a lógica condicional:
                  Se a casa NÃO for VAZIO, desenhe uma peça.
                */}
                {casa !== VAZIO && (
                  <div className={`peca ${casa === BRANCA ? 'branca' : 'preta'}`}>
                    {/* Mais tarde, podemos colocar um ícone de "coroa" aqui para a Dama */}
                  </div>
                )}

              </div>

            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App