import { useState } from 'react'
import './App.css'

// Nossos valores para as peças
// Nossos valores para as peças
const VAZIO = 0;
const BRANCA = 1;
const PRETA = 2;
const DAMA_BRANCA = 3; // NOVO
const DAMA_PRETA = 4;  // NOVO
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

  // NOVO ESTADO: Guarda um array de coordenadas [linha, casa]
  // para os movimentos permitidos.
  const [movimentosValidos, setMovimentosValidos] = useState<[number, number][]>([]);

  // NOVO ESTADO: Controla de quem é a vez. Começa com BRANCA.
  const [turno, setTurno] = useState(BRANCA);

const handleCasaClick = (linha: number, casa: number) => {
    
    // --- LÓGICA DE SEGUNDO CLIQUE (MOVER) ---
    if (pecaSelecionada) {
      const [linhaOrigem, casaOrigem] = pecaSelecionada;
      const peca = tabuleiro[linhaOrigem][casaOrigem];

      // VERIFICA SE O MOVIMENTO É VÁLIDO
      // Checa se [linha, casa] clicada está dentro do array 'movimentosValidos'
      const eMovimentoValido = movimentosValidos.some(
        (mov) => mov[0] === linha && mov[1] === casa
      );

      if (eMovimentoValido) {
        // É válido! Vamos mover a peça
        const novoTabuleiro = tabuleiro.map(linhaAtual => [...linhaAtual]);
        
        // Pega a peça original (BRANCA ou PRETA)
        let pecaMovida = novoTabuleiro[linhaOrigem][casaOrigem]; 

        // 1. CHECAR POR PROMOÇÃO
        // Se uma peça BRANCA chegou na linha 0
        if (pecaMovida === BRANCA && linha === 0) {
          pecaMovida = DAMA_BRANCA;
        }
        // Se uma peça PRETA chegou na linha 7
        else if (pecaMovida === PRETA && linha === 7) {
          pecaMovida = DAMA_PRETA;
        }

        // 2. MOVER A PEÇA (agora possivelmente como Dama)
        novoTabuleiro[linha][casa] = pecaMovida;
        novoTabuleiro[linhaOrigem][casaOrigem] = VAZIO;

        // 3. FOI UMA CAPTURA?
        if (Math.abs(linha - linhaOrigem) === 2) {
          const linhaCapturada = (linha + linhaOrigem) / 2;
          const casaCapturada = (casa + casaOrigem) / 2;
          novoTabuleiro[linhaCapturada][casaCapturada] = VAZIO;
        }

        // 4. ATUALIZAR O ESTADO
        setTabuleiro(novoTabuleiro);

        // 5. PASSAR O TURNO
        setTurno(turno === BRANCA ? PRETA : BRANCA);

        // TODO: Checar por capturas múltiplas
      }
      
      // Limpa a seleção após o movimento (válido ou não)
      setPecaSelecionada(null);
      setMovimentosValidos([]);
      
      // Independentemente de ser válido ou não, o segundo clique limpa tudo
      setPecaSelecionada(null);
      setMovimentosValidos([]);
    } 
    // --- LÓGICA DE PRIMEIRO CLIQUE (SELECIONAR) ---
    else {
      const peca = tabuleiro[linha][casa];
      
      // MUDANÇA AQUI: O jogador só pode selecionar peças do seu próprio turno
      if (peca === turno) {
        // 1. Seleciona a peça
        setPecaSelecionada([linha, casa]);
        
        // 2. Calcula movimentos E capturas
        const movimentos: [number, number][] = [];
        const capturas: [number, number][] = [];
        
        // Define o oponente
        const oponente = (turno === BRANCA) ? PRETA : BRANCA;

        // Define as direções de movimento
        // Peças brancas se movem "para cima" (linha -1)
        // Peças pretas se movem "para baixo" (linha +1)
        const deltaLinhaBase = (turno === BRANCA) ? -1 : 1;
        
        const direcoes = [
          [deltaLinhaBase, -1], // Diagonal 1
          [deltaLinhaBase, 1],  // Diagonal 2
          // TODO: Adicionar diagonais traseiras para Damas
        ];

        for (const [deltaLinha, deltaCasa] of direcoes) {
          const linhaDestino = linha + deltaLinha;
          const casaDestino = casa + deltaCasa;

          if (linhaDestino >= 0 && linhaDestino <= 7 && casaDestino >= 0 && casaDestino <= 7) {
            const pecaNoDestino = tabuleiro[linhaDestino][casaDestino];

            // A) É um movimento simples?
            if (pecaNoDestino === VAZIO) {
              movimentos.push([linhaDestino, casaDestino]);
            }
            // B) É uma captura?
            // MUDANÇA AQUI: Checa pela peça do oponente
            else if (pecaNoDestino === oponente) {
              const linhaPulo = linhaDestino + deltaLinha;
              const casaPulo = casaDestino + deltaCasa;

              if (linhaPulo >= 0 && linhaPulo <= 7 && casaPulo >= 0 && casaPulo <= 7 && tabuleiro[linhaPulo][casaPulo] === VAZIO) {
                capturas.push([linhaPulo, casaPulo]);
              }
            }
          }
        }
        
        if (capturas.length > 0) {
          setMovimentosValidos(capturas);
        } else {
          setMovimentosValidos(movimentos);
        }
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
            {linha.map((casa, indexCasa) => {

              // ---- LÓGICA DE CLASSE DINÂMICA ----
              // 1. Verifica se esta casa é a peça selecionada
              const estaSelecionada = pecaSelecionada && 
                                      pecaSelecionada[0] === indexLinha && 
                                      pecaSelecionada[1] === indexCasa;

              // 2. Verifica se esta casa é um movimento válido
              // O .some() checa se ALGUM item no array 'movimentosValidos'
              // bate com a coordenada [indexLinha, indexCasa]
              const eMovimentoValido = movimentosValidos.some(
                (mov) => mov[0] === indexLinha && mov[1] === indexCasa
              );
              // ---- FIM DA LÓGICA ----


              return (
                <div 
                  key={indexCasa} 
                  // Adicionamos as classes dinâmicas aqui
                  className={`casa ${estaSelecionada ? 'selecionada' : ''} ${eMovimentoValido ? 'valida' : ''}`}
                  onClick={() => handleCasaClick(indexLinha, indexCasa)}
                >

                  {/* Se a casa não for VAZIA, desenha uma peça */}
                  {casa !== VAZIO && (
                    <div 
                      className={`peca ${
                        (casa === BRANCA || casa === DAMA_BRANCA) ? 'branca' : 'preta'
                      }`}
                    >
                      {/* Se for Dama, mostra um "D" */}
                      {(casa === DAMA_BRANCA || casa === DAMA_PRETA) && 'D'}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App