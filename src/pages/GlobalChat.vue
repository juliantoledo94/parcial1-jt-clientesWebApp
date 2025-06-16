<script setup>
import { nextTick, onMounted, ref, useTemplateRef } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { loadLastGlobalChatMessages, saveGlobalChatMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';

import MainLoader from '../components/MainLoader.vue';
import useAuthUserState from '../composables/useAuthUserState';
import useScrollToBottomToBottom from '../composables/useScrollToBottom';

const { user } = useAuthUserState();
const { messages, loadingMessages } = useGlobalChatMessages();
const { newMessage, sendMessage } = useGlobalChatForm(user);
const { moveScrollToBottom } = useScrollToBottomToBottom("chatContainer")

/* async function moveScroll() {
    await nextTick();
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
} */

function useGlobalChatMessages() {

    const messages = ref([]);
    const loadingMessages = ref(true);
    /* const chatContainer = useTemplateRef("chatContainer") */

    onMounted(async () => {
        try {
            messages.value = await loadLastGlobalChatMessages();
            loadingMessages = false;

            subscribeToGlobalChatNewMessages(async newMessage => {
                messages.value.push(newMessage);
                moveScrollToBottom()
            })

            moveScrollToBottom()
        } catch (error) {
            console.error("Error: ", error)
            throw error;
        }
    });

    return {
        messages,
        loadingMessages,
    }
}



function useGlobalChatForm(user) {
    const newMessage = ref({
        body: "",
    });

    async function sendMessage() {
        try {

            await saveGlobalChatMessage({
                user_id: user.value.id,
                email: user.value.email,
                body: newMessage.value.body,
            });

            newMessage.value.body = "";
        } catch (error) {
            console.error("Error: ", error);
            throw error;
        }
    }

    return {
        newMessage,
        sendMessage,
    }

}

/* export default {
    name: 'GlobalChat',
    components: { MainH1, MainLoader },
   
    data() {
        return {
            messages: [],
            loadingMessages: true,

            newMessage: {
                body: '',
            },

            user:{
                id: null,
                email: null,
                bio: null,
                career: null,
                display_name: null,
            }
        }
    },
   
    methods: {
        async sendMessage() {
            await saveGlobalChatMessage({
                body: this.newMessage.body,
                user_id: this.user.id,
                email: this.user.email,
            });
            
            this.newMessage.body = "";
        }
    },
    async mounted() {
        unsubAuth = subscribeToUserState(newUserData => this.user = newUserData);

        subscribeToGlobalChatNewMessages(async newMessageReceived => {
            this.messages.push(newMessageReceived);
            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        });
        
        try {
            this.messages = await loadLastGlobalChatMessages();
            this.loadingMessages = false;

            
            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        } catch (error) {
           
        }
    },
    unmounted() {
        unsubAuth();
    }
} */
</script>

<template>
    <MainH1>Chat global</MainH1>

    <div class="flex gap-4">
        <section ref="chatContainer" class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-400 rounded">
            <h2 class="sr-only">Lista de mensajes</h2>

            <ul v-if="!loadingMessages" class="flex flex-col gap-4">

                <li v-for="message in messages" :key="message.id" class="flex flex-col gap-0.5">
                    <div>
                        <RouterLink :to="`/usuario/${message.user_id}`" class="font-bold text-blue-700 underline">
                            {{ message.email }}
                        </RouterLink>
                        dijo:
                    </div>
                    <div>{{ message.body }}</div>
                    <div class="text-sm text-gray-600">{{ message.created_at }}</div>
                </li>
            </ul>
            <div v-else class="flex justify-center items-center h-full">
                <MainLoader />
            </div>
        </section>
        <section class="w-3/12">
            <h2 class="text-2xl mb-4">Enviar un mensaje</h2>

            <!-- 
            Para asociar un evento a un elemento del form podemos utilizar la directiva "v-on:" seguida del evento, o
            el shortcut "@evento".
            Como valor, se espera recibir una función con lo que queremos que se ejecute.
            Adicionalmente, nos permite agregar modificadores a los eventos, escribiendo ".modificador" a continuación
            del mismo.
            Los modificadores alteran o agregan alguna funcionalidad propia del evento.
            El más común es probablemente ".prevent" (que hace un preventDefault()).
            -->
            <form action="#" @submit.prevent="() => sendMessage()">
                <div class="mb-4">
                    <div class="block mb-2">Email</div>
                    <div class="font-bold">{{ user.email }}</div>
                </div>
                <div class="mb-4">
                    <label for="body" class="block mb-2">Mensaje</label>
                    <!-- 
                    v-model es un shortcut que permite crear un "two-way data binding" entre un valor del state y un
                    control de formulario.
                    "Two-way data binding" es una práctica donde el framework se asegura de que la data del state y
                    del control del form estén sincronizados.
                    Dicho de otra forma, si cambio el valor del state, se actualiza el campo, y si cambio el valor del
                    campo, se actualiza el state.
                    -->
                    <textarea id="body" class="w-full p-2 border border-gray-400 rounded"
                        v-model="newMessage.body"></textarea>
                </div>
                <button type="submit"
                    class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Enviar</button>
            </form>
        </section>
    </div>
</template>