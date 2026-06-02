# 🧮 TypeScript 数式マネージャー (Formula App)

入力した LaTeX 形式の数式をその場で美しくレンダリングし、自分だけのコレクションとして保存・管理できる Web アプリケーションです。
React と TypeScript の型安全性を活かし、快適な数式入力をサポートする様々な機能を搭載しています。

👉 **[デモサイトはこちら](https://hirof35.github.io/formula-app/)**
<img width="1217" height="1053" alt="スクリーンショット 2026-06-02 100201" src="https://github.com/user-attachments/assets/2222d635-8d28-41ad-b953-5019c4be8c44" />

---

## ✨ 主な機能

- **🎨 リアルタイム数式プレビュー**
  - 高速数式レンダリングエンジン「KaTeX」を採用。入力した数式を即座に美しく表示します。
- **⚠️ リアルタイム構文エラー検知**
  - LaTeX のタイポや構文エラーを即座に検知し、赤字で通知。不完全な数式がリストに登録されるのを防ぎます。
- **⌨️ スマートカーソル付き入力補助ボタン**
  - 分数（`\frac{}{}`）やルート（`\sqrt{}`）などの定番シンボルをワンクリックで挿入。
  - 挿入後、自動的にカッコの中（入力位置）へカーソルがジャンプする快適な操作性を実現。
- **💾 LocalStorage によるデータ永続化**
  - 保存した数式リストはブラウザに自動保存されます。タブを閉じたりリロードしたりしてもデータは消えません。
- **📋 ワンクリック・クリップボードコピー**
  - 保存した数式の LaTeX コードをワンクリックでコピー可能。Notion、Obsidian、ブログ等の執筆への連携がスムーズです。
- **📱 レスポンシブ対応**
  - スマートフォンやタブレットからでも数式の閲覧・追加が可能です。

---

## 🛠️ 使用技術 (Tech Stack)

- **Frontend**: React (Hooks)
- **Language**: TypeScript
- **Math Rendering**: KaTeX
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

---

## 🚀 ローカルでの実行方法

リポジトリをクローンし、ローカル環境で起動する手順です。

```bash
# 1. リポジトリのクローン
git clone [https://github.com/hirof35/Formula-App.git](https://github.com/hirof35/Formula-App.git)

# 2. プロジェクトフォルダへ移動
cd Formula-App

# 3. 依存パッケージのインストール
npm install

# 4. 開発サーバーの起動
npm run dev
起動後、ブラウザで http://localhost:5173/ にアクセスしてください。

📦 ビルドとデプロイ
プロダクション用にビルド、または GitHub Pages へデプロイする場合のコマンドです。

Bash
# ビルドの実行
npm run build

# GitHub Pages へのデプロイ
npm run deploy
📄 ライセンス
This project is licensed under the MIT License.
