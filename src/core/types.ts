// src/core/types.ts

// 1. CONSTANTES DE PEÇAS
// Vamos exportá-las para que todo o app possa usá-las
export const VAZIO = 0;
export const BRANCA = 1;
export const PRETA = 2;
export const DAMA_BRANCA = 3;
export const DAMA_PRETA = 4;
export const CASA_MORTA = -1; // Para suas fases futuras com tabuleiros diferentes

// 2. TIPOS DE PEÇAS
// Usamos "as const" para dizer ao TypeScript que esses valores NUNCA mudam.
// O "typeof" nos ajuda a criar tipos a partir dos valores das constantes.

// 'Piece' é qualquer valor de peça (incluindo vazio)
export type Piece = typeof VAZIO | typeof BRANCA | typeof PRETA | typeof DAMA_BRANCA | typeof DAMA_PRETA | typeof CASA_MORTA;

// 'PlayerPiece' é apenas uma peça que pertence a um jogador
export type PlayerPiece = typeof BRANCA | typeof PRETA | typeof DAMA_BRANCA | typeof DAMA_PRETA;

// 'Turn' define de quem é a vez
export type Turn = typeof BRANCA | typeof PRETA;

// 3. TIPOS DE ESTRUTURA
// 'Position' define um par de coordenadas [linha, casa]
export type Position = [number, number];

// 'Board' é o nosso tabuleiro, uma matriz 2D de Peças
export type Board = Piece[][];