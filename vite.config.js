// Importamos nuestro plugin de Vite para Vue.
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default {
    // Incluimos el plugin. Los plugins son simples funciones que se invocan.
    plugins: [vue(), tailwindcss(),],
}