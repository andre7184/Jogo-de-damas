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

  const handleCasaClick = (linha: number, casa: number) => {
    
    // --- LÓGICA DE SEGUNDO CLIQUE (MOVER) ---
    if (pecaSelecionada) {
      // Se já temos uma peça selecionada, este é o clique de "destino"
      
      const [linhaOrigem, casaOrigem] = pecaSelecionada;
      const peca = tabuleiro[linhaOrigem][casaOrigem]; // A peça que estamos movendo (ex: BRANCA)
      const destino = tabuleiro[linha][casa]; // Onde estamos clicando

      // TODO: Adicionar validação de movimento (diagonal, etc.)
      // Por enquanto, a regra é simples: só pode mover para uma casa VAZIA
      if (destino === VAZIO) {

        // 1. Criar uma cópia do tabuleiro (NUNCA mude o estado diretamente!)
        // Usamos .map() para criar uma cópia profunda das linhas e casas
        const novoTabuleiro = tabuleiro.map(linhaAtual => [...linhaAtual]); 

        // 2. Mover a peça
        novoTabuleiro[linha][casa] = peca; // Coloca a peça no novo local
        novoTabuleiro[linhaOrigem][casaOrigem] = VAZIO; // Esvazia o local antigo

        // 3. Atualizar o estado do tabuleiro
        setTabuleiro(novoTabuleiro);

        // 4. Limpar a seleção
        setPecaSelecionada(null);
      } else {
        // O destino não estava vazio (ex: clicou em outra peça)
        // Ação: Apenas limpa a seleção
        setPecaSelecionada(null);
      }

    } 
    // --- LÓGICA DE PRIMEIRO CLIQUE (SELECIONAR) ---
    else {
      // Se não há peça selecionada, este é o clique de "seleção"
      
      const peca = tabuleiro[linha][casa];

      // Se clicamos em uma peça branca, seleciona ela
      if (peca === BRANCA) {
        setPecaSelecionada([linha, casa]);
      }
    }
  };

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
              
              <div 
                key={indexCasa} 
                className="casa"
                // NOVO EVENTO: Chama a função handleCasaClick quando clicado
                // Passamos as coordenadas [indexLinha, indexCasa] para ela
                onClick={() => handleCasaClick(indexLinha, indexCasa)}
              >
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