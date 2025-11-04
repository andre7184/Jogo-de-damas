// src/components/Tabuleiro.tsx
import './Tabuleiro.css'; // <-- ADICIONE ESTA LINHA

import type { Board, Position } from "../core/types";
import { Casa } from "./Casa";

// 2. Define as Props que o Tabuleiro espera
// (Basicamente, todo o estado que vem do nosso hook)
type TabuleiroProps = {
  tabuleiro: Board;
  pecaSelecionada: Position | null;
  movimentosValidos: Position[];
  handleCasaClick: (linha: number, casa: number) => void;
};

export function Tabuleiro({ 
  tabuleiro, 
  pecaSelecionada, 
  movimentosValidos, 
  handleCasaClick 
}: TabuleiroProps) {

  // 3. Este é o JSX que estava no App.tsx
  return (
    <div className="tabuleiro">
      {tabuleiro.map((linha, indexLinha) => (
        <div key={indexLinha} className="linha">
          {linha.map((casa, indexCasa) => {
            
            // 4. Lógica para passar as props corretas para cada Casa
            const estaSelecionada =
              pecaSelecionada &&
              pecaSelecionada[0] === indexLinha &&
              pecaSelecionada[1] === indexCasa;

            const eMovimentoValido = movimentosValidos.some(
              (mov) => mov[0] === indexLinha && mov[1] === indexCasa
            );

            // 5. Renderiza o componente Casa com as props
            return (
              <Casa
                key={indexCasa}
                peca={casa}
                estaSelecionada={!!estaSelecionada}
                eMovimentoValido={eMovimentoValido}
                onClick={() => handleCasaClick(indexLinha, indexCasa)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}