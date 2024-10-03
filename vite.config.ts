import module, { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import styleImport, {VantResolve} from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  // devServer: {
  //   host: '0.0.0.0',
  //   // https:true,
  //   port: 3000,
  //   client: {
  //     webSocketURL: 'ws://localhost:8080/ws',
  //   },
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //   }
  // },
  plugins: [vue() ,
    styleImport({
    resolves: [VantResolve()],
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: name => `../es/${name}/style`
        }
      ]
  }),
  ],
  server: {
    port: 3000
  }
})






