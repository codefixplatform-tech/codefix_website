import axios from 'axios';

// 1. Original Non-Streaming Response (Legacy/Backup)
export const getAIResponse = async (userPrompt, chatHistory = []) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const systemPrompt = {
    role: "system",
    content: `You are an expert AI Developer Assistant. Communicate concisely with maximum visual clarity using emojis and markdown.`
  };

  try {
    const historyWindow = chatHistory.slice(-10);
    const formattedHistory = historyWindow.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.text || "")
    }));

    const payload = {
      model: "google/gemini-2.0-flash-lite-001",
      messages: [systemPrompt, ...formattedHistory, { role: "user", content: String(userPrompt) }]
    };




    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", payload, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// 2. NEW: Streaming Response (Real-time Typing)
export const getAIResponseStream = async (userPrompt, chatHistory = [], onChunk) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const systemPrompt = {
    role: "system",
    content: `You are an expert AI Developer Assistant. Use emojis, markdown, and clear headings. Keep code blocks clean.`
  };

  const historyWindow = chatHistory.slice(-10);
  const formattedHistory = historyWindow.map(m => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: String(m.text || "")
  }));

  const payload = {
    model: "google/gemini-2.0-flash-lite-001", 
    stream: true,
    messages: [
      systemPrompt,
      ...formattedHistory,
      { role: "user", content: String(userPrompt) }
    ]
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Stream request failed");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (let line of lines) {
        line = line.trim();
        if (!line || line === "data: [DONE]") continue;
        
        if (line.startsWith("data: ")) {
          try {
            const json = JSON.parse(line.substring(6));
            const content = json.choices[0]?.delta?.content || "";
            if (content) {
              fullText += content;
              onChunk(fullText);
            }
          } catch (e) {
            // Partial JSON chunk, skip
          }
        }
      }
    }

    return fullText;

  } catch (error) {
    console.error("Streaming Failed:", error);
    throw error;
  }
};