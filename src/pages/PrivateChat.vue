<script>
import { nextTick } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { subscribeToUserState } from '../services/auth';
import { getLastPrivateChatMessages, sendPrivateChatMessage, suscribeToPrivateNewMessages } from '../services/private-chats';
import { getUserProfileById } from '../services/user-profiles';

export default {
    name: "PrivateChat",
    components: { MainH1, MainLoader, MainButton },
    data() {
        return {
            userAuth: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,

            },
            userChat: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,

            },
            loadingUser: false,

            messages: [],

            loadingMessage: false,

            newMessage: {
                body: "",
            }
        }
    },
    methods: {
        async sendMessage() {
            try {
                sendPrivateChatMessage(this.userAuth.id, this.userChat.id, this.newMessage.body);
                this.newMessage.body = "";
            } catch (error) {

            }

        }
    },
    async mounted() {
        try {
            subscribeToUserState(newDataUser => this.userAuth = newDataUser);
            this.loadingUser = true;
            this.loadingMessage = true;


            this.userChat = await getUserProfileById(this.$route.params.id);
            this.loadingUser = false;
            suscribeToPrivateNewMessages(this.userAuth.id, this.userChat.id, async newMessage => {

                this.messages.push(newMessage);
                await nextTick();
                this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;

            });
            this.messages = await getLastPrivateChatMessages(this.userAuth.id, this.userChat.id);

            this.loadingMessage = false;

            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;

        } catch (error) {

        }
    }

}

//min 1:18 clase 20/05
</script>


<template>

    <template v-if="!loadingUser">

        <MainH1>Chat privado con {{ userChat.email }}</MainH1>

        <section ref="chatContainer" class="overflow-y-auto  h-100 p-4 mb-4 border border-gray-400 rounded">
            <h2 class="sr-only">Lista de mensajes</h2>

            <ul v-if="!loadingMessage" class="flex items-start flex-col gap-4">

                <li v-for="message in messages" :key="message.id" class="flex flex-col  gap-0.5 max-w-8/12 p-4 rounded"
                    :class='{
                        "bg-gray-100": message.sender_id !== userAuth.id,
                        "bg-green-200 self-end": message.sender_id === userAuth.id,

                    }'>

                    <div>{{ message.body }}</div>
                    <div class="text-sm text-gray-600">{{ message.created_at }}</div>
                </li>
            </ul>
            <div v-else class="flex justify-center items-center h-full">
                <MainLoader />
            </div>
        </section>

        <section>
            <h2 class="sr-only">Enviar un mensaje</h2>


            <form class="flex items-stretch gap-4" action="#" @submit.prevent="() => sendMessage()">
                <!-- 32:32 -->
                <div class="w-full">
                    <label for="body" class="sr-only">Mensaje</label>

                    <textarea id="body" class="w-full p-2 border border-gray-400 rounded"
                        v-model="newMessage.body"></textarea>
                </div>
                <MainButton>Enviar</MainButton>
            </form>
        </section>

    </template>

    <MainLoader v-else />

</template>