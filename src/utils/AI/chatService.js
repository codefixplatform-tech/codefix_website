import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
console.log("Supabase table points to: chats");

export const chatService = {
  /**
   * 1. Get All Chats (For Sidebar)
   * User ki saari purani guftagu fetch karta hai.
   */
  async getUserChats(userId) {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('chats')
      .select('id, title, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Error fetching chats:", error);
      throw new Error("Could not load your chat history.");
    }
    return data;
  },

  /**
   * 2. Get Single Chat Details
   * Jab user sidebar se kisi chat par click kare toh uske saare messages load hon.
   */
  async getChatById(chatId) {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single();

    if (error) {
      console.error("Error fetching chat details:", error);
      throw new Error("Chat not found.");
    }
    return data;
  },

  /**
   * 3. Save or Update Chat (The Upsert)
   * Agar chat nayi hai toh create karega, warna purani ko update karega.
   */
  async saveChat(userId, chatId, messages, title = null) {
    if (!userId) return null;

    // Pehle message ko title banane ki logic (agar title provide na kiya jaye)
    const chatTitle = title || (messages[0]?.text?.substring(0, 40) + "...") || "New Chat";
    const id = chatId || uuidv4();

    const { data, error } = await supabase
      .from('chats')
      .upsert({
        id: id,
        user_id: userId,
        title: chatTitle,
        messages: messages, // JSONB column mein poori array chali jayegi
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving chat:", error);
      throw new Error("Failed to sync chat with cloud.");
    }
    return data;
  },

  /**
   * 4. Delete Chat
   */
  async deleteChat(chatId) {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (error) {
      console.error("Error deleting chat:", error);
      throw new Error("Could not delete chat.");
    }
    return true;
  },

  async renameChat(chatId, newTitle) {
    const { data, error } = await supabase
      .from('chats')
      .update({ title: newTitle })
      .eq('id', chatId)
      .select();

    if (error) {
      console.error("Supabase Rename Error détaillée:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn("No rows updated. Check if the chat ID is correct and belongs to you.");
      throw new Error("Chat not found or permission denied.");
    }

    return true;
  }
};