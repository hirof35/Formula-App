import { ELEMENT_TABLE, type Atom, type Molecule } from './types';

export const MOLECULE_DATASET: Record<string, Molecule> = {
  water: {
    name: "水", formula: "H₂O",
    atoms: [
      { id: 1, element: 'O', position: [0, 0.12, 0] },
      { id: 2, element: 'H', position: [-0.76, -0.48, 0] },
      { id: 3, element: 'H', position: [0.76, -0.48, 0] }
    ],
    bonds: [{ from: 1, to: 2, type: 1 }, { from: 1, to: 3, type: 1 }]
  },
  co2: {
    name: "二酸化炭素", formula: "CO₂",
    atoms: [
      { id: 1, element: 'C', position: [0, 0, 0] },
      { id: 2, element: 'O', position: [-1.16, 0, 0] },
      { id: 3, element: 'O', position: [1.16, 0, 0] }
    ],
    bonds: [{ from: 1, to: 2, type: 2 }, { from: 1, to: 3, type: 2 }]
  }
};