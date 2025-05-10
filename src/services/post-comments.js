import supabase from "./supabase";


/**
 * 
 * @param {id: string} postId 
 * @returns 
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
 * Escucha en tiempo real los comentarios nuevos de un post.
 * 
 * @param {*} param0 
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


export function subscribeToPostComments(postId, callback){
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
}

export async function getPostByIdWithUser(postId) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:user_profiles(display_name, email, id)')
      .eq('id', postId)
      .single();
  
    if (error) {
      console.error('[posts.js getPostByIdWithUser] Error al traer el post:', error);
      throw error;
    }
  
    return data;
  }
  