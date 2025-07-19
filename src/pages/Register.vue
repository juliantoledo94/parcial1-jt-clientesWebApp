<script setup>
import { ref } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { register } from '../services/auth';
import MainLoader from '../components/MainLoader.vue';


const { user, loading, handleSubmit } = useRegisterForm()

function useRegisterForm() {

    const user = ref({
        email: "",
        password: "",
    });

    const loading = ref(false);

    async function handleSubmit() {
        try {
            loading.value = true;
            await register(user.value.email, user.value.password);
        } catch (error) {
            console.error("Error al registrarse:", error.message);
            /* throw error; */
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        handleSubmit
    }

}


</script>

<template>
    <MainH1>Crear una nueva cuenta</MainH1>

    <MainLoader v-if="loading" class="mx-auto my-10" />

    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input type="email" id="email"
                class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
                v-model="user.email">
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-2">Contraseña</label>
            <input type="password" id="password"
                class="w-full p-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg"
                v-model="user.password">
        </div>
        <button type="submit"
            class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Crear
            cuenta</button>
    </form>
</template>