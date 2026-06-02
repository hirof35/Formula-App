import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Formula-app/', // ★ここを追加！作成したGitHubのリポジトリ名と同じにします
})
