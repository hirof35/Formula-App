// App.tsx
import * as React from 'react';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { MOLECULE_DATASET } from './data';
import { MoleculeViewer } from './MoleculeViewer';
import { ELEMENT_TABLE, type Atom, type Molecule } from './types';

export const ChemicalSimulatorApp: React.FC = () => {
  const [currentKey, setCurrentKey] = useState<keyof typeof MOLECULE_DATASET>('water');
  const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);

  const currentMolecule = MOLECULE_DATASET[currentKey];

  const handleMoleculeChange = (key: keyof typeof MOLECULE_DATASET) => {
    setCurrentKey(key);
    setSelectedAtom(null); // 分子切り替え時にポップアップをクリア
  };

  return (
    <div style={containerStyle}>
      {/* サイド / トップ メニューバー */}
      <div style={sidebarStyle}>
        <h1 style={titleStyle}>化学式シミュレーター</h1>
        <p style={subtitleStyle}>TypeScript + React Three Fiber</p>
        
        <hr style={dividerStyle} />

        <div style={sectionTitleStyle}>分子を選択</div>
        <div style={buttonGroupStyle}>
          {Object.keys(MOLECULE_DATASET).map((key) => {
            const mol = MOLECULE_DATASET[key];
            const isActive = currentKey === key;
            return (
              <button
                key={key}
                onClick={() => handleMoleculeChange(key)}
                style={moleculeButtonStyle(isActive)}
              >
                <span>{mol.name}</span>
                <span style={formulaBadgeStyle(isActive)}>{mol.formula}</span>
              </button>
            );
          })}
        </div>

        <hr style={dividerStyle} />

        <div style={sectionTitleStyle}>コントロール</div>
        <label style={checkboxLabelStyle}>
          <input 
            type="checkbox" 
            checked={isAutoRotate} 
            onChange={(e) => setIsAutoRotate(e.target.checked)} 
            style={{ cursor: 'pointer' }}
          />
          自動回転を有効化
        </label>
      </div>

      {/* 3D メインキャンバス領域 */}
      <div style={canvasContainerStyle} onClick={() => setSelectedAtom(null)}>
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-10, -10, -10]} intensity={0.4} color="#a0aec0" />
          
          {/* Stageを使うと、自動で綺麗な影や位置調整を行ってくれます */}
          <Stage environment="city" intensity={0.6} adjustCamera={false}>
            <MoleculeViewer 
              molecule={currentMolecule} 
              onSelectAtom={setSelectedAtom} 
              isAutoRotate={isAutoRotate}
            />
          </Stage>

          <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
        </Canvas>
      </div>

      {/* 原子ディテール情報ポップアップ */}
      {selectedAtom && (
        <div style={popupStyle}>
          <div style={popupHeaderStyle}>
            <span style={{ fontWeight: 'bold' }}>原子インフォメーション</span>
            <button onClick={() => setSelectedAtom(null)} style={popupCloseButtonStyle}>×</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <div style={popupColorIndicatorStyle(ELEMENT_TABLE[selectedAtom.element].color)} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {ELEMENT_TABLE[selectedAtom.element].name} ({selectedAtom.element})
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                ID: {selectedAtom.id} | 座標: [{selectedAtom.position.map(n => n.toFixed(2)).join(', ')}]
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- スタイリング定義群 (CSS in JS) ---
const containerStyle: React.CSSProperties = {
  width: '100vw', height: '100vh', display: 'flex',
  backgroundColor: '#0f172a', overflow: 'hidden', fontFamily: 'sans-serif'
};

const sidebarStyle: React.CSSProperties = {
  width: '320px', height: '100%', backgroundColor: '#1e293b',
  padding: '24px', boxSizing: 'border-box', zIndex: 10,
  boxShadow: '4px 0 25px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column'
};

const titleStyle: React.CSSProperties = {
  color: '#f8fafc', fontSize: '20px', margin: 0, fontWeight: 'bold'
};

const subtitleStyle: React.CSSProperties = {
  color: '#94a3b8', fontSize: '12px', margin: '4px 0 0 0'
};

const dividerStyle: React.CSSProperties = {
  border: 'none', borderTop: '1px solid #334155', margin: '20px 0'
};

const sectionTitleStyle: React.CSSProperties = {
  color: '#94a3b8', fontSize: '12px', fontWeight: 'bold',
  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px'
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '8px'
};

const moleculeButtonStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '12px 16px', borderRadius: '8px', border: 'none',
  backgroundColor: isActive ? '#3b82f6' : '#334155',
  color: '#fff', cursor: 'pointer', textAlign: 'left',
  transition: 'all 0.2s ease', fontWeight: isActive ? 'bold' : 'normal'
});

const formulaBadgeStyle = (isActive: boolean): React.CSSProperties => ({
  fontSize: '11px', padding: '2px 6px', borderRadius: '4px',
  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#1e293b',
  color: isActive ? '#fff' : '#94a3b8'
});

const checkboxLabelStyle: React.CSSProperties = {
  color: '#e2e8f0', fontSize: '14px', display: 'flex',
  alignItems: 'center', gap: '8px', cursor: 'pointer'
};

const canvasContainerStyle: React.CSSProperties = {
  flex: 1, height: '100%', position: 'relative'
};

const popupStyle: React.CSSProperties = {
  position: 'absolute', bottom: '24px', right: '24px', zIndex: 10,
  backgroundColor: 'rgba(30, 41, 59, 0.95)', border: '1px solid #475569',
  padding: '16px', borderRadius: '12px', width: '280px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', color: '#fff',
  backdropFilter: 'blur(8px)'
};

const popupHeaderStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid #334155',
  paddingBottom: '6px'
};

const popupCloseButtonStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px'
};

const popupColorIndicatorStyle = (color: string): React.CSSProperties => ({
  width: '16px', height: '16px', borderRadius: '50%',
  backgroundColor: color, border: '2px solid rgba(255,255,255,0.2)'
});