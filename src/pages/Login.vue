<script>
import MainH1 from '../components/MainH1.vue';
import { login } from '../services/auth';

export default {
    name: 'Login',
    components: { MainH1 },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = true;
                const user = await login(this.user.email, this.user.password);
                this.loading = false;

                // Emitimos un evento "login" con los datos del usuario que se autenticó.
                // De esta forma, cualquier elemento contenedor (como App) va a poder escuchar ese evento y recibir los 
                // datos.
                // this.$emit('login', {id: this.user.id, email: this.user.email});
            } catch (error) {
                // TODO: Manejar
            }
        }
    }
}
</script>

<template>
    <MainH1>Ingresar a mi cuenta</MainH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-400 rounded"
                v-model="user.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-2">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-400 rounded"
                v-model="user.password"
            >
        </div>
        <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Ingresar</button>
    </form>
</template>