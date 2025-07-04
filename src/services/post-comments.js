import supabase from "./supabase";


/**
 * Trae todos los comentarios asociados a un post específico, incluyendo los datos del usuario que comentó.
 * 
 * @param {string} postId - ID del post del cual se quieren obtener los comentarios.
 * @returns {Promise<Array>} - Array de objetos de comentarios con datos de usuario.
 */
export async function loadCommentsForPost(postId){
    const {data, error} = await supabase
    .from("comments")
    .select("*, user:user_profiles(display_name,email,id)")
    .eq("post_id", postId)
    .order("created_at",{ascending: true});

    if(error){
        console.error("[post-comment.js loadCommentsForPost] Error:",error);
        throw error;
    }

    return data;
}

/**
 * Guarda un nuevo comentario en la base de datos.
 * 
 * @param {{ post_id: string, user_id: string, email: string, content: string, created_at?: string }} commentData - 
 * Objeto con los datos del comentario a guardar.
 * @returns {Promise<void>}
 */
export async function saveComment({post_id, user_id, email, content}){
    const {error} = await supabase
    .from("comments")
    .insert({post_id, user_id, email, content});

    if(error){
        console.error("[post-comments.js saveComment] Error:", error);
        throw error
    }
}

/**
 * ESTE CÓDIGO NO TRAIA LOS COMENTARIOS EN TIEMPO REAL
 
/* export function subscribeToPostComments(postId, callback){
    const channel = supabase.channel(`comments-${postId}`,{
        config: { broadcast: { self: true } },
    });

    channel.on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "comments",
            filter: `post_id=eq.${postId}`
        },
        payload => callback(payload.new)
    )
} */

/**
 * Escucha en tiempo real nuevos comentarios agregados a un post específico.
 * Cuando se detecta un nuevo comentario, lo enriquece con los datos del usuario que lo escribió
 * y lo pasa al callback.
 * 
 * @param {string} postId 
 * @param {(comment: object) => void} callback 
 */
export function subscribeToPostComments(postId, callback) {
  const channel = supabase.channel(`comments-${postId}`, {
    config: { broadcast: { self: true } },
  });

  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "comments",
      filter: `post_id=eq.${postId}`,
    },
    async (payload) => {
      const { id } = payload.new;

      // Trae el comentario con los datos del user
      const { data, error } = await supabase
        .from("comments")
        .select("*, user:user_profiles(display_name,email,id)")
        .eq("id", id)
        .single();

      if (error) {
        console.error("[subscribeToPostComments] Error al enriquecer el comentario:", error);
        return;
      }

      callback(data);
    }
  );

  channel.subscribe();
}




/**
 * Trae un post específico por su ID, incluyendo los datos del usuario que lo creó.
 * 
 * @param {string} postId - ID del post a buscar.
 * @returns {Promise<object>} - Objeto con los datos del post y del usuario relacionado.
 * @throws {Error} - Lanza un error si ocurre algún problema durante la consulta.
 */
export async function getPostByIdWithUser(postId) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:user_profiles(display_name, email, id, photo)')
      .eq('id', postId)
      .single();
  
    if (error) {
      console.error('[posts.js getPostByIdWithUser] Error al traer el post:', error);
      throw error;
    }
  
    return data;
  }
  

export function subscribeToDeletedPosts(callback) {
  const channel = supabase.channel('deleted-posts', {
    config: { broadcast: { self: true } },
  });

  channel.on(
    'postgres_changes',
    {
      event: 'DELETE',
      schema: 'public',
      table: 'posts',
    },
    (payload) => {
      callback(payload.old.id); 
    }
  );

  channel.subscribe();
}