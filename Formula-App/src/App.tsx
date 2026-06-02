import React, { useState, useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// ==========================================
// 1. 型定義 と 定数（入力補助ボタン）
// ==========================================

// 保存する数式データの型定義
interface FormulaItem {
  id: string;
  title: string;
  latex: string;
}

// 入力補助ボタンの型定義
interface HelperButton {
  label: string;
  snippet: string;
  offset: number; // 挿入後、カーソルを何文字左に戻すか
}

// 定番シンボルのリスト
const HELPER_BUTTONS: HelperButton[] = [
  { label: '分数 (分数)', snippet: '\\frac{}{}', offset: 3 },
  { label: '√ (平方根)', snippet: '\\sqrt{}', offset: 1 },
  { label: '上付き (x²)', snippet: '^{}', offset: 1 },
  { label: '下付き (xₙ)', snippet: '_{}', offset: 1 },
  { label: '∫ (積分)', snippet: '\\int_{}^{} ', offset: 4 },
  { label: '∑ (総和)', snippet: '\\sum_{}^{} ', offset: 4 },
  { label: 'π (パイ)', snippet: '\\pi ', offset: 0 },
  { label: '∞ (無限大)', snippet: '\\infty ', offset: 0 },
];

// ==========================================
// 2. ローカルストレージ用のヘルパー関数
// ==========================================
const getInitialFormulaList = (): FormulaItem[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('saved_formulas');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('ローカルストレージのパースに失敗しました:', e);
    }
  }
  // 初期データ（データが空のとき）
  return [
    {
      id: 'default-1',
      title: 'ガウス積分',
      latex: '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}',
    },
  ];
};

// ==========================================
// 3. メインコンポーネント
// ==========================================
export const FormulaApp: React.FC = () => {
  // --- 状態管理 (State) ---
  const [title, setTitle] = useState<string>('');
  const [latex, setLatex] = useState<string>('f(x) = \\dots');
  const [formulaList, setFormulaList] = useState<FormulaItem[]>(getInitialFormulaList);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- 参照 (Ref) ---
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- 副作用 (Effect) ---
  // リストに変更があったら自動でLocalStorageへ保存
  useEffect(() => {
    localStorage.setItem('saved_formulas', JSON.stringify(formulaList));
  }, [formulaList]);

  // --- ロジック関数 ---
  
  // LaTeX構文のリアルタイムチェック
  const handleLatexChange = (val: string) => {
    setLatex(val);
    try {
      // 構文に問題がないかKaTeXにダミーパースさせる
      katex.renderToString(val, { throwOnError: true });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 定番スニペットの挿入 & カーソル位置制御
  const insertSnippet = (snippet: string, offset: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    // カーソル位置に文字列を挿入
    const newVal = currentVal.substring(0, start) + snippet + currentVal.substring(end);
    
    setLatex(newVal);
    handleLatexChange(newVal);

    // 次のレンダリング確定後にカーソルをカッコの中へジャンプさせる
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + snippet.length - offset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // クリップボードへのコピー
  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // 2秒後にコピー完了表示を消す
    } catch (err) {
      console.error('コピー失敗:', err);
      alert('コピーに失敗しました。');
    }
  };

  // リストへの追加
  const handleAddFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!latex.trim() || error) return;

    const newItem: FormulaItem = {
      id: Date.now().toString(),
      title: title.trim() || `数式 #${formulaList.length + 1}`,
      latex: latex.trim(),
    };

    setFormulaList([newItem, ...formulaList]); // 新しいものを上に追加
    setTitle('');
  };

  // リストからの削除
  const handleDelete = (id: string) => {
    if (window.confirm('この数式を削除してもよろしいですか？')) {
      setFormulaList(formulaList.filter((item) => item.id !== id));
    }
  };

  // --- 画面描画 (JSX) ---
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px', fontFamily: 'system-ui, sans-serif', color: '#333' }}>
      <h2 style={{ borderBottom: '2px solid #0070f3', paddingBottom: '10px' }}>TypeScript 数式マネージャー</h2>

      {/* --- 入力・追加フォーム --- */}
      <form onSubmit={handleAddFormula} style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', background: '#fafafa' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>新しい数式の登録</h3>
        
        {/* タイトル入力 */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>タイトル:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 二次方程式の解の公式"
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 数式入力 & 補助ボタン */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>LaTeX コード:</label>
          
          {/* 補助ボタンエリア */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
            {HELPER_BUTTONS.map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={() => insertSnippet(btn.snippet, btn.offset)}
                style={{ padding: '6px 10px', fontSize: '0.8rem', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.1s' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* テキストエリア */}
          <textarea
            ref={textareaRef}
            value={latex}
            onChange={(e) => handleLatexChange(e.target.value)}
            rows={3}
            placeholder="ここにLaTeXコードを入力"
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '1rem' }}
          />
        </div>

        {/* リアルタイムプレビュー */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '6px', marginBottom: '15px', minHeight: '80px', position: 'relative' }}>
          <span style={{ fontSize: '0.75rem', color: '#888', position: 'absolute', top: '5px', left: '8px' }}>リアルタイムプレビュー</span>
          {error ? (
            <div style={{ color: '#ff4d4f', fontSize: '0.85rem', marginTop: '15px', fontFamily: 'monospace' }}>⚠️ {error}</div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60px', marginTop: '10px' }}>
              <MathRender latex={latex} />
            </div>
          )}
        </div>

        {/* 追加ボタン */}
        <button
          type="submit"
          disabled={!!error || !latex.trim()}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: error || !latex.trim() ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: error || !latex.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          リストに追加・保存
        </button>
      </form>

      {/* --- 保存済みリスト --- */}
      <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>保存されたコレクション ({formulaList.length})</h3>
      {formulaList.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>保存されている数式はありません。</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {formulaList.map((item) => (
            <div
              key={item.id}
              style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '18px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              {/* リストヘッダー */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <strong style={{ fontSize: '1.1rem', color: '#111' }}>{item.title}</strong>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  削除
                </button>
              </div>
              
              {/* 数式レンダリング部分 */}
              <div style={{ overflowX: 'auto', padding: '15px 0', background: '#fafafa', borderRadius: '6px', textAlign: 'center', marginBottom: '12px' }}>
                <MathRender latex={item.latex} />
              </div>

              {/* コピー＆コード表示バー */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f1f3f5', padding: '8px 12px', borderRadius: '4px' }}>
                <code style={{ fontSize: '0.85rem', color: '#495057', overflowX: 'auto', whiteSpace: 'nowrap', marginRight: '15px', fontFamily: 'monospace' }}>
                  {item.latex}
                </code>
                <button
                  onClick={() => handleCopy(item.id, item.latex)}
                  style={{
                    backgroundColor: copiedId === item.id ? '#52c41a' : '#212529',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    minWidth: '90px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {copiedId === item.id ? '✓ Copied' : 'コードコピー'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. KaTeX安全描画用サブコンポーネント
// ==========================================
const MathRender: React.FC<{ latex: string }> = ({ latex }) => {
  try {
    // 完全にレンダリング不可能な文字列が入ったとき用のセーフガード
    const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
    return <div dangerouslySetInnerHTML={{ __html: html }} style={{ width: '100%' }} />;
  } catch {
    return <span style={{ color: '#ff4d4f' }}>Render Error</span>;
  }
};
export default FormulaApp;