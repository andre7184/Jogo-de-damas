// src/hooks/useJogoDeDamas.ts

import { useState, useEffect } from "react";
// Importa nossos tipos e constantes!
import { 
  type Board, 
  type Position, 
  type Turn, 
  VAZIO, 
  BRANCA, 
  PRETA, 
  DAMA_BRANCA, 
  DAMA_PRETA, 
  type Piece
} from "../core/types";

// --- O ESTADO INICIAL DO TABULEIRO ---
// (Tiramos isso do App.tsx e colocamos aqui)
const tabuleiroInicial: Board = [
  [VAZIO, PRETA, VAZIO, PRETA, VAZIO, PRETA, VAZIO, PRETA],
  [PRETA, VAZIO, PRETA, VAZIO, PRETA, VAZIO, PRETA, VAZIO],
  [VAZIO, PRETA, VAZIO, PRETA, VAZIO, PRETA, VAZIO, PRETA],
  [VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO],
  [VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO, VAZIO],
  [BRANCA, VAZIO, BRANCA, VAZIO, BRANCA, VAZIO, BRANCA, VAZIO],
  [VAZIO, BRANCA, VAZIO, BRANCA, VAZIO, BRANCA, VAZIO, BRANCA],
  [BRANCA, VAZIO, BRANCA, VAZIO, BRANCA, VAZIO, BRANCA, VAZIO],
];
// --- FIM DO ESTADO INICIAL ---


// O nome do hook (use...) é uma convenção do React
export function useJogoDeDamas() {
  
    // --- NOSSOS ESTADOS ---
  const [tabuleiro, setTabuleiro] = useState<Board>(tabuleiroInicial);
  const [turno, setTurno] = useState<Turn>(BRANCA);
  const [pecaSelecionada, setPecaSelecionada] = useState<Position | null>(null);
  const [movimentosValidos, setMovimentosValidos] = useState<Position[]>([]);
  const [vencedor, setVencedor] = useState<Turn | null>(null);
  
  // NOVO ESTADO (Task 4.3)
  const [pontuacao, setPontuacao] = useState({
    [BRANCA]: 0,
    [PRETA]: 0
    });
  // NOVO ESTADO (Task 4.4)
  const [fase, setFase] = useState<number>(1);
  
  // NOVA FUNÇÃO AJUDANTE (Extraída da lógica do "primeiro clique")
  const calcularMovimentosPossiveis = (peca: Piece, linha: number, casa: number, tabuleiroAtual: Board) => {
    const movimentos: Position[] = [];
    const capturas: Position[] = [];

    // Define o jogador e oponentes baseado na peça
    const jogador = (peca === BRANCA || peca === DAMA_BRANCA) ? BRANCA : PRETA;
    const oponente = (jogador === BRANCA) ? PRETA : BRANCA;
    const oponenteDama = (jogador === BRANCA) ? DAMA_PRETA : DAMA_BRANCA;
    const eOponente = (p: Piece) => p === oponente || p === oponenteDama;

    const eDama = (peca === DAMA_BRANCA || peca === DAMA_PRETA);

    // Define as direções de busca
    const direcoesBase = [
      [-1, -1], // Cima-Esquerda
      [-1, 1],  // Cima-Direita
      [1, -1],  // Baixo-Esquerda
      [1, 1],   // Baixo-Direita
    ];

    const direcoes = eDama 
      ? direcoesBase 
      : (jogador === BRANCA ? direcoesBase.slice(0, 2) : direcoesBase.slice(2, 4));

    // Loop principal de busca de movimentos
    for (const [deltaLinha, deltaCasa] of direcoes) {
      if (eDama) {
        // --- LÓGICA DA DAMA (Deslizante) ---
        let l = linha + deltaLinha;
        let c = casa + deltaCasa;
        let oponenteEncontrado: Position | null = null;

        while (l >= 0 && l <= 7 && c >= 0 && c <= 7) {
          const pecaNoDestino = tabuleiroAtual[l][c];

          if (pecaNoDestino === VAZIO) {
            if (oponenteEncontrado) {
              capturas.push([l, c]);
            } else {
              movimentos.push([l, c]);
            }
          } else if (eOponente(pecaNoDestino)) {
            if (oponenteEncontrado) {
              break;
            }
            oponenteEncontrado = [l, c];
          } else {
            break;
          }
          l += deltaLinha;
          c += deltaCasa;
        }

      } else {
        // --- LÓGICA DA PEÇA COMUM (Pulo simples) ---
        const l = linha + deltaLinha;
        const c = casa + deltaCasa;

        if (l >= 0 && l <= 7 && c >= 0 && c <= 7) {
          const pecaNoDestino = tabuleiroAtual[l][c];

          if (pecaNoDestino === VAZIO) {
            movimentos.push([l, c]);
          } else if (eOponente(pecaNoDestino)) {
            const linhaPulo = l + deltaLinha;
            const casaPulo = c + deltaCasa;
            if (linhaPulo >= 0 && linhaPulo <= 7 && casaPulo >= 0 && casaPulo <= 7 && tabuleiroAtual[linhaPulo][casaPulo] === VAZIO) {
              capturas.push([linhaPulo, casaPulo]);
            }
          }
        }
      }
    } // Fim do for...direcoes

    return { movimentos, capturas };
  }

  /**
   * Verifica o tabuleiro para ver se um jogador venceu.
   * Retorna o jogador vencedor (BRANCA ou PRETA) ou null se o jogo continuar.
   */
  const checarVitoria = (tabuleiroAtual: Board, turnoAtual: Turn): Turn | null => {
    // O jogador que *acabou* de jogar (e que pode ter vencido)
    const jogadorAtual = turnoAtual === BRANCA ? PRETA : BRANCA; 
    // O jogador que está prestes a jogar (e que pode ter perdido)
    const proximoJogador = turnoAtual; 
    
    let pecasDoProximoJogador = 0;
    let movimentosTotais = 0;

    // Itera por todo o tabuleiro
    for (let l = 0; l < 8; l++) {
      for (let c = 0; c < 8; c++) {
        const peca = tabuleiroAtual[l][c];

        // Verifica se a peça pertence ao jogador que fará o próximo movimento
        const eDoProximoJogador = (proximoJogador === BRANCA && (peca === BRANCA || peca === DAMA_BRANCA)) ||
                                (proximoJogador === PRETA && (peca === PRETA || peca === DAMA_PRETA));

        if (eDoProximoJogador) {
          pecasDoProximoJogador++;
          
          // Calcula os movimentos para esta peça
          const { movimentos, capturas } = calcularMovimentosPossiveis(peca, l, c, tabuleiroAtual);
          
          movimentosTotais += movimentos.length + capturas.length;
        }
      }
    }

    // CONDIÇÃO 1: O oponente não tem mais peças
    if (pecasDoProximoJogador === 0) {
      return jogadorAtual; // O jogador que acabou de mover vence!
    }

    // CONDIÇÃO 2: O oponente tem peças, mas não tem movimentos (bloqueado)
    if (movimentosTotais === 0) {
      return jogadorAtual; // O jogador que acabou de mover vence!
    }

    // O jogo continua
    return null; 
  }

  // NOVO HOOK DE EFEITO (Task 3.1: Salvar Jogo)
  // ===================================================================
  useEffect(() => {
    // Não salva o jogo se alguém já venceu
    if (vencedor) return; 

    // 1. Cria um objeto com todo o estado do jogo
    const estadoDoJogo = {
      tabuleiro,
      turno,
      pontuacao,
      fase,
    };

    // 2. Converte o objeto para uma string JSON e salva no localStorage
    localStorage.setItem('jogoDeDamasSave', JSON.stringify(estadoDoJogo));
    
  }, [tabuleiro, turno, pontuacao, fase, vencedor]); // 3. O "Array de Dependências"
  // Este hook vai rodar AUTOMATICAMENTE sempre que

  // --- TODA A LÓGICA DE CLIQUE VEM PARA CÁ --- (Task 1.4)
  const handleCasaClick = (linha: number, casa: number) => {
    
    // --- LÓGICA DE SEGUNDO CLIQUE (MOVER) ---
    if (pecaSelecionada) {
      const [linhaOrigem, casaOrigem] = pecaSelecionada;
      
      const eMovimentoValido = movimentosValidos.some(
        (mov) => mov[0] === linha && mov[1] === casa
      );

      // O movimento é inválido, então apenas limpa a seleção
      if (!eMovimentoValido) {
        setPecaSelecionada(null);
        setMovimentosValidos([]);
        return;
      }
      
      // O movimento é válido, vamos processá-lo
      const novoTabuleiro = tabuleiro.map((linhaAtual) => [...linhaAtual]);
      let pecaMovida = novoTabuleiro[linhaOrigem][casaOrigem];
      
      // 1. CHECAR POR PROMOÇÃO
      // Atualiza a pontuação do jogador do turno atual
     setPontuacao(pontosAtuais => ({
        ...pontosAtuais, // Mantém a pontuação do outro jogador
        [turno]: pontosAtuais[turno] + 50 // Adiciona 50 ao jogador do turno
     }));

      // 2. MOVER A PEÇA
      novoTabuleiro[linha][casa] = pecaMovida;
      novoTabuleiro[linhaOrigem][casaOrigem] = VAZIO;

      // 3. FOI UMA CAPTURA?
      let foiCaptura = false;
      const deltaLinha = Math.sign(linha - linhaOrigem);
      const deltaCasa = Math.sign(casa - casaOrigem);
      let l = linhaOrigem + deltaLinha;
      let c = casaOrigem + deltaCasa;

      while (l !== linha || c !== casa) {
        if (tabuleiro[l][c] !== VAZIO) {
          novoTabuleiro[l][c] = VAZIO; 
          foiCaptura = true;
          setPontuacao(pontosAtuais => ({
            ...pontosAtuais, // Mantém a pontuação do outro jogador
            [turno]: pontosAtuais[turno] + 10 // Adiciona 10 ao jogador do turno
          }));
          break;
        }
        l += deltaLinha;
        c += deltaCasa;
      }
      
      // 4. ATUALIZAR O ESTADO DO TABULEIRO
      setTabuleiro(novoTabuleiro);

      // 5. LÓGICA DE MULTI-CAPTURA (Task 2.3)
      if (foiCaptura) {
        // Verifica se há novas capturas *a partir da casa de aterrissagem*
        const { capturas: novasCapturas } = calcularMovimentosPossiveis(
          pecaMovida, 
          linha, // Nova linha
          casa,  // Nova casa
          novoTabuleiro
        );

        if (novasCapturas.length > 0) {
          // HÁ MAIS CAPTURAS! Força o jogador a continuar.
          setPecaSelecionada([linha, casa]); // A seleção muda para a nova casa
          setMovimentosValidos(novasCapturas); // Mostra os novos pulos
          return; // Não passa o turno e sai da função
        }
      }
      
      // 6. CHECAR VITÓRIA E PASSAR O TURNO
      
      // O próximo turno (para quem estamos passando)
      const proximoTurno = turno === BRANCA ? PRETA : BRANCA;
      
      // Checa se o 'proximoTurno' tem alguma jogada
      const vencedorEncontrado = checarVitoria(novoTabuleiro, proximoTurno);

      if (vencedorEncontrado) {
        // JOGO ACABOU!
        setVencedor(vencedorEncontrado);
        // Não limpamos a seleção para que o tabuleiro "congele" no estado final
      } else {
        // O jogo continua: passa o turno e limpa
        setTurno(proximoTurno);
        setPecaSelecionada(null);
        setMovimentosValidos([]);
      }
    } 
    
    // --- LÓGICA DE PRIMEIRO CLIQUE (SELECIONAR) ---
    else {
      const peca = tabuleiro[linha][casa];
      const eDamaDoTurno = (turno === BRANCA && peca === DAMA_BRANCA) || (turno === PRETA && peca === DAMA_PRETA);
      
      if (peca === turno || eDamaDoTurno) {
        // 1. Seleciona a peça
        setPecaSelecionada([linha, casa]);
        
        // 2. Usa a nova função ajudante para calcular movimentos
        const { movimentos, capturas } = calcularMovimentosPossiveis(peca, linha, casa, tabuleiro);
        
        // 3. Regra de captura obrigatória
        if (capturas.length > 0) {
          setMovimentosValidos(capturas);
        } else {
          setMovimentosValidos(movimentos);
        }
      }
    }
  };

  // --- O HOOK RETORNA TUDO QUE O VISUAL PRECISA SABER ---
  return {
    tabuleiro,
    turno,
    pecaSelecionada,
    movimentosValidos,
    vencedor,
    pontuacao, 
    fase,
    handleCasaClick,
    // (Mais tarde, retornaremos tbm 'pontos', 'fase', etc.)
  };
}