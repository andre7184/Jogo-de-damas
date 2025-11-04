// src/components/Casa.tsx
import './Casa.css';

import { VAZIO, BRANCA, DAMA_BRANCA, DAMA_PRETA, type Piece } from "../core/types";

// 1. Define as "Props" que este componente espera receber
type CasaProps = {
  peca: Piece;
  estaSelecionada: boolean;
  eMovimentoValido: boolean;
  onClick: () => void; // Uma função que não recebe nada e não retorna nada
};

// 2. O componente em si
// Ele recebe as props e as usa para se desenhar
export function Casa({ peca, estaSelecionada, eMovimentoValido, onClick }: CasaProps) {
  
  // Esta é a lógica de classes que estava no App.tsx
  const classesDaCasa = `casa ${
    estaSelecionada ? 'selecionada' : ''
  } ${eMovimentoValido ? 'valida' : ''}`;

  // Esta é a lógica de classes da peça
  const classesDaPeca = `peca ${
    peca === BRANCA || peca === DAMA_BRANCA ? 'branca' : 'preta'
  }`;

  return (
    <div className={classesDaCasa} onClick={onClick}>
      {peca !== VAZIO && (
        <div className={classesDaPeca}>
          {(peca === DAMA_BRANCA || peca === DAMA_PRETA) && 'D'}
        </div>
      )}
    </div>
  );
}