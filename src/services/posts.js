import supabase from "./supabase";

/**
 * Funcion que nos permite crear nuevos posteos en la base de datos y los asocia al perfil que los creo
 * 
 * @param {{user_id: string, title: string, content: string, created_at: string}} postData 
 */
export async function createNewPost(postData) {
  const { error } = await supabase
    .from('posts') // Asegurate que el nombre de la tabla es exactamente este
    .insert(postData);

  if (error) {
    console.error('[posts.js createNewPost] Error al crear el post: ', error);
    throw error;
  }
}


/**
 * Funcion que nos permite traer todos los posteos de un mismo perfil.
 * 
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export async function getPostsByUserId(userId) {
  const { data, error } = await supabase
      .from('posts')
      .select('*') // o especificá columnas si querés optimizar
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // opcional, para que salgan los más recientes primero

  if (error) {
      console.error('[posts.js getPostsByUserId] Error al traer los posts del usuario: ', error);
      throw error;
  }

  return data;
}

