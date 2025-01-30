import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { resolve } from "node:path";

export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [
    vue({
      template: { 
        transformAssetUrls, 
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("app-"),
        },
      },
    }),
    quasar({
      sassVariables: "src/quasar-variables.sass",
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
      assets: resolve(__dirname, "src/assets"),
      components: resolve(__dirname, "src/components"),
      stores: resolve(__dirname, "src/stores"),
    },
  },
  build: {
    cssCodeSplit: false,
    cssMinify: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AppsElement",
      fileName: (format) => `apps-element${format === 'es' ? '' : '.' + format}.js`,
      formats: ["umd"]
    },
  },
})
