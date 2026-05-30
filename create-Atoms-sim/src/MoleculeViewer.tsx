// MoleculeViewer.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AtomComponent } from './AtomComponent';
import { BondComponent } from './BondComponent';

import { type Molecule, type Atom } from './types'; // 💡 type を付与

interface MoleculeViewerProps {
  molecule: Molecule;
  onSelectAtom: (atom: Atom) => void;
  isAutoRotate: boolean;
}

export const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ molecule, onSelectAtom, isAutoRotate }) => {
  const groupRef = useRef<THREE.Group>(null);

  // 毎フレーム1回転の軸を少しずつ進めるアニメーション
  useFrame((_, delta) => {
    if (groupRef.current && isAutoRotate) {
      groupRef.current.rotation.y += 0.4 * delta;
      groupRef.current.rotation.x += 0.1 * delta; // 複合回転させてより立体的に見せる
    }
  });

  return (
    <group ref={groupRef}>
      {/* 結合（棒）のレンダリング */}
      {molecule.bonds.map((bond, idx) => {
        const fromAtom = molecule.atoms.find(a => a.id === bond.from);
        const toAtom = molecule.atoms.find(a => a.id === bond.to);
        if (!fromAtom || !toAtom) return null;
        return <BondComponent key={`bond-${molecule.name}-${idx}`} fromAtom={fromAtom} toAtom={toAtom} />;
      })}

      {/* 原子（球）のレンダリング */}
      {molecule.atoms.map(atom => (
        <AtomComponent 
          key={`atom-${molecule.name}-${atom.id}`} 
          atom={atom} 
          onSelect={onSelectAtom} 
        />
      ))}
    </group>
  );
};