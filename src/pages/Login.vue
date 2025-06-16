<script setup>
import { ref } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { login } from '../services/auth';


//API COMPOSICIÓN
const user = ref({
    email: "",
    password: "",
});

const loading = ref(false);

async function handleSubmit(){
    try {
        loading.value = true
        await login(user.value.email, user.value.password);
    } catch (error) {
        console.error("error: ",error)
        throw error;
    }
    loading.value = false
}

// API OPCIONES

/* export default {
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

                this.$router.push('/');
               
            } catch (error) {
                
            }
        }
    }
} */
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
                class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
                v-model="user.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-2">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
                v-model="user.password"
            >
        </div>
        <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Ingresar</button>
    </form>
</template>