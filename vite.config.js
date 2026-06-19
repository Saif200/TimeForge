import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: change '/timeforge/' below to '/<your-repo-name>/'
// when you deploy to GitHub Pages. If you use a custom domain
// or deploy to the root, set base to '/'.
export default defineConfig({
  plugins: [react()],
  base: '/timeforge/',
})
