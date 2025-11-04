// src/App.tsx

import './App.css';
import { Tabuleiro } from './components/Tabuleiro';
import { useJogoDeDamas } from './hooks/useJogoDeDamas';
import { BRANCA, PRETA } from './core/types'; // Importa BRANCA para comparar

function App() {
  
  const { 
    tabuleiro, 
    turno, 
    pecaSelecionada, 
    movimentosValidos,
    vencedor,
    pontuacao,
    fase,
    handleCasaClick 
  } = useJogoDeDamas();

  // Mensagem de status
  const getMensagemStatus = () => {
    if (vencedor) {
      const corVencedor = vencedor === BRANCA ? 'Brancas' : 'Pretas';
      return `FIM DE JOGO! Vitórias das ${corVencedor}!`;
    }
    const corTurno = turno === BRANCA ? 'Brancas' : 'Pretas';
    return `Vez de: ${corTurno}`;
  }

  return (
    <div className="jogo">
      <h1>Meu Jogo de Damas</h1>
      {/* HUD (Heads-Up Display) */}
      <div style={{ display: 'flex', gap: '40px', fontSize: '1.5rem', margin: '10px 0' }}>
        <span>Fase: {fase}</span>
        {/* Mostra os pontos de cada um */}
        <span>Brancas: {pontuacao[BRANCA]}</span>
        <span>Pretas: {pontuacao[PRETA]}</span>
      </div>
      
      <h2>{getMensagemStatus()}</h2>

      <Tabuleiro 
        tabuleiro={tabuleiro}
        pecaSelecionada={pecaSelecionada}
        movimentosValidos={movimentosValidos}
        handleCasaClick={handleCasaClick}
      />
      
      {/* Mostra um botão de "Novo Jogo" se o jogo acabou */}
      {vencedor && (
        // TODO: Task 3.3 - Fazer este botão funcionar
        <button 
          style={{ marginTop: '20px', fontSize: '1.2rem', padding: '10px 20px' }}
          onClick={() => alert("TODO: Reiniciar o jogo!")}
        >
          Jogar Novamente
        </button>
      )}
    </div>
  );
}

export default App;