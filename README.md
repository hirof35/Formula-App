🌀 Raycast Engine TSTypeScriptで構築された、フルスクラッチの2.5Dレイキャストエンジンです。1990年代のレトロなFPS（Wolfenstein 3Dなど）の仕組みを現代のWeb技術で再現しました。🚀 特徴DDA (Digital Differential Analyzer) アルゴリズム: 高速かつ高精度な壁の衝突判定を実現。テクスチャマッピング: 各壁に異なる質感や影を適用。スプライトレンダリング: Zバッファを用いた、壁との前後関係が正しいオブジェクト描画。FPS操作: Pointer Lock APIを使用した直感的な視点移動とWASD操作。モダンな開発環境: Vite + TypeScript による高速なホットリロード。🛠️ 技術スタック言語: TypeScript描画: HTML5 Canvas APIビルドツール: Viteアルゴリズム: Raycasting (DDA)🎮 操作方法キーアクションクリックポインターロック（操作開始）マウス移動視点回転W / S前進 / 後退A / D左移動 / 右移動Esc操作終了（マウス解放）📦 セットアップ依存関係のインストール:Bashnpm install
開発サーバーの起動:Bashnpm run dev
ブラウザで http://localhost:8080 (または表示されたURL) にアクセス。🏗️ フォルダ構成src/main.ts: エンジンのコアロジック、DDA計算、レンダリングループ。index.html: エントリーポイントおよび描画用Canvasの定義。public/: テクスチャやスプライトなどの静的アセット。

<img width="1553" height="1127" alt="スクリーンショット 2026-05-11 140804" src="https://github.com/user-attachments/assets/1b980558-fd18-4691-b038-a3948549d1c3" />
