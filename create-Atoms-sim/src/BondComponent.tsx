// BondComponent.tsx
import React from 'react';
import * as THREE from 'three';
import { AtomComponent } from './AtomComponent';

import { type Molecule, type Atom } from './types'; // 💡 type を付与

interface BondProps {
  fromAtom: Atom;
  toAtom: Atom;
}

export const BondComponent: React.FC<BondProps> = ({ fromAtom, toAtom }) => {
  const posA = new THREE.Vector3(...fromAtom.position);
  const posB = new THREE.Vector3(...toAtom.position);

  // 2点間の計算
  const distance = posA.distanceTo(posB);
  const position = posA.clone().add(posB).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(posB, posA).normalize();
  
  // シリンダーの初期方向(Y軸)をターゲットの方向へ回転させる
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction
  );

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.07, 0.07, distance, 16]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
    </mesh>
  );
};