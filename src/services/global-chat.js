import supabase from '../services/supabase';

// Versión con "Postgres Changes".
/**
 * Trae los últimos mensajes de la base de datos.
 * 
 * @returns {Promise<{id: number, email: string, body: string|null, created_at: string}[]>}
 */
export async function loadLastGlobalChatMessages() {
    const { data, error } = await supabase
        .from('global_chat')
        .select();

    if(error) {
        console.error('[global-chat.js loadLastGlobalChatMessage] Error al traer los mensajes: ', error);
        throw error;
    }

    // Retornamos los mensajes.
    return data;
}

/**
 * Graba un nuevo mensaje de chat.
 * 
 * @param {{email: string, body: string, user_id: string}} data 
 * @returns {Promise}
 */
export async function saveGlobalChatMessage(data) {
    const { error } = await supabase
        
        .from('global_chat')
       
        .insert({
            user_id: data.user_id,
            email: data.email,
            body: data.body,
        });

  
    if(error) {
        console.error('[global-chat.js saveGlobalChatMessage] Error al insertar el registro: ', error);
        throw error;
    }
}

/**
 * Se suscribe para recibir los nuevos mensajes de chat.
 * 
 * @param {({}) => void} callback
 * @returns Promise
 */
export async function subscribeToGlobalChatNewMessages(callback) {
    
    const chatChannel = supabase.channel('global-chat', {
        config: {
            broadcast: {
                self: true,
            },
        },
    });
    chatChannel.on(
        'postgres_changes',
        {
            
            event: 'INSERT',
            schema: 'public',
            table: 'global_chat', 
        },
        data => {
            
            callback(data.new);
        }
    );
    
    chatChannel.subscribe();
}

