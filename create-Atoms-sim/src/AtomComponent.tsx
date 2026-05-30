import React, { useState } from 'react';
// 💡 Atom の前に「type」を追加し、型であることを明示します
import { ELEMENT_TABLE } from './types';
import type { Atom } from './types';
interface AtomProps {
  atom: Atom;
  onSelect: (atom: Atom) => void;
}

export const AtomComponent: React.FC<AtomProps> = ({ atom, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const config = ELEMENT_TABLE[atom.element];

  return (
    <mesh
      position={atom.position}
      onClick={(e) => { e.stopPropagation(); onSelect(atom); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <sphereGeometry args={[config.radius, 32, 32]} />
      <meshStandardMaterial color={hovered ? '#f59e0b' : config.color} roughness={0.2} metalness={0.1} />
    </mesh>
  );
};