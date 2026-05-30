import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// 💡 { ChemicalSimulatorApp } という正確な名前でインポートします
import { ChemicalSimulatorApp } from './App';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 💡 呼び出すコンポーネント名も一致させます */}
    <ChemicalSimulatorApp />
  </StrictMode>,
);
