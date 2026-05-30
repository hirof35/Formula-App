export interface ElementInfo {
    name: string;
    color: string;
    radius: number;
  }
  
  export const ELEMENT_TABLE: Record<string, ElementInfo> = {
    H: { name: '水素', color: '#ffffff', radius: 0.35 },
    C: { name: '炭素', color: '#2d3748', radius: 0.65 },
    O: { name: '酸素', color: '#e53e3e', radius: 0.55 },
    N: { name: '窒素', color: '#3182ce', radius: 0.60 },
  };
  
  export interface Atom {
    id: number;
    element: keyof typeof ELEMENT_TABLE;
    position: [number, number, number];
  }
  
  export interface Bond {
    from: number;
    to: number;
    type: 1 | 2 | 3;
  }
  
  export interface Molecule {
    name: string;
    formula: string;
    atoms: Atom[];
    bonds: Bond[];
  }