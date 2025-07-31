<script setup>
import { ref } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { register } from '../services/auth';
import MainLoader from '../components/MainLoader.vue';

const user = ref({ email: '', password: '' });
const loading = ref(false);
const feedback = ref({ type: '', message: null });

async function handleSubmit() {
    feedback.value.message = null;
    loading.value = true;

    try {
        await register(user.value.email, user.value.password);
        feedback.value = {
            type: 'success',
            message: 'Cuenta creada con éxito. Ya podés iniciar sesión.',
        };
        user.value.email = '';
        user.value.password = '';
    } catch (error) {
        console.error("Error al registrarse:", error.message);

        let msg = 'Error al registrarse.';
        if (error.message.includes('User already registered')) {
            msg = 'El correo ya está registrado.';
        } else if (error.message.includes('password')) {
            msg = 'La contraseña debe tener al menos 6 caracteres.';
        }

        feedback.value = {
            type: 'error',
            message: msg,
        };
    } finally {
        loading.value = false;
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
    <div v-if="feedback.message" class="p-4 mb-4 rounded" :class="{
        'bg-red-100 text-red-700': feedback.type === 'error',
        'bg-green-100 text-green-700': feedback.type === 'success',
    }">
        {{ feedback.message }}
    </div>
</template>