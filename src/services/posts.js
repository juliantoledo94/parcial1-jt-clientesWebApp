import supabase from "./supabase";

/**
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
