import supabase from "./supabase";

/**
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @returns {Promise<number>}
 */
async function getPrivateChat(sender_id, receiver_id) {
    let chat_id = await fetchPrivateChat(sender_id, receiver_id);

    if (!chat_id) {
        return await createPrivateChat(sender_id, receiver_id);
    }

    return chat_id;
}

/**
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @returns {Promise<number|null>}
 */
async function fetchPrivateChat(sender_id, receiver_id) {

    //Ordenamos los ids para que simepre queden en un mismo orden

    const userIds = [sender_id, receiver_id].sort();



    const { data, error } = await supabase
        .from("private_chats")
        .select("id")
        .eq("user_id1", userIds[0])
        .eq("user_id2", userIds[1]);

    if (error) {
        console.error("[private-chats.js fetchPrivateChat] Error al traer el chat privado: ", error);
        throw error;
    }

    // usamos el ? por si es undefined o null nos retorne justamente eso.
    return data[0]?.id;
}



/**
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @returns {Promise<number>}
 */
async function createPrivateChat(sender_id, receiver_id) {

    const userIds = [sender_id, receiver_id].sort();

    const { data, error } = await supabase
        .from("private_chats")
        .insert({
            user_id1: userIds[0],
            user_id2: userIds[1],
        })
        .select();
    if (error) {
        console.error("[private-chats.js createPrivateChat] Error al crear el chat privado: ", error);
        throw error;
    }

    return data[0].id;
}

/**
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @param {string} body 
 */
export async function sendPrivateChatMessage(sender_id, receiver_id, body) {

    const chat_id = await getPrivateChat(sender_id, receiver_id);


    const { error } = await supabase
        .from("private_messages")
        .insert({
            chat_id,
            sender_id,
            body,
        })

    if (error) {
        console.error("[private-chats.js sendPrivateChatMessage] Error l envir el mensaje de chat privado: ", error);
        throw error;
    }
}


/**
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @param {() => {}} callback 
 */
export async function suscribeToPrivateNewMessages(sender_id, receiver_id, callback) {
    const chat_id = await getPrivateChat(sender_id, receiver_id);

    const privateChannel = supabase.channel("private-chats");
    privateChannel.on(
        "postgres_changes",
        {
            event: "Insert",
            schema: "public",
            table: "private_messages",
            filter: "chat_id=eq." + chat_id,

        },
        payload => {
            callback(payload.new);
        }
    );
    //1:11 clase 13/05
    privateChannel.subscribe()

}

/**
 * 
 * @param {string} sender_id 
 * @param {string} receiver_id 
 * @returns {Promise<{id:number, chat_id:number, sender_id:string, body:string, created_at:string}[]}
 */
export async function getLastPrivateChatMessages(sender_id, receiver_id, ) {
    const chat_id = await getPrivateChat(sender_id, receiver_id);

    const { data, error }  = await supabase
    .from("private_messages")
    .select()
    .eq("chat_id", chat_id)

    if (error) {
        console.error("[private-chats.js getLastPrivateChatMessages] Error al traer los últimos mensajes  de chat privado: ", error);
        throw error;
    }

    return data;
}