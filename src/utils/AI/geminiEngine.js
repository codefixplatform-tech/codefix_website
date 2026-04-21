import axios from 'axios';

export const getAIResponse = async (userPrompt, chatHistory = []) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // AI Assistant Custom Personality & Instructions
  const systemPrompt = {
    role: "system",
    content: `You are an expert AI Developer Assistant.
    IMPORTANT FORMATTING RULES:
    1. ALWAYS use Numbers + Spacing + Emojis for headings (e.g., "### 1. 🚀 Introduction", "### 4.5 🧰 Developer Tools").
    2. Liberally use emojis like 💡, 🌍, 👉 throughout the text to make it lively.
    3. Use "❌ Problems:" or "❌ Issues:" for bugs/problems, followed by bullet points.
    4. Use "✅ Solution:" or "✅ Fixes:" for solutions, followed by succinct points (e.g., "👉 Ek jagah sab kuch").
    5. Always format lists completely without wrapping them in thick paragraphs.
    6. Ensure the entire response has high spacing and uses markdown effectively.
    
    Your primary duties: 
    Code Explain, Errors Fix, Code Generate, SQL / API suggestions.
    Communicate concisely with maximum visual clarity.`
  };

  try {
    // History formatting
    const formattedHistory = chatHistory.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.text || "")
    }));

    // Payload buildup
    const payload = {
      model: "google/gemini-2.0-flash-001", // Currently active and working OpenRouter model
      max_tokens: 2048,
      temperature: 0.7,
      messages: [
        systemPrompt,
        ...formattedHistory,
        { role: "user", content: String(userPrompt) }
      ]
    };

    // Make the API Request using Axios
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", payload, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, 
        "X-Title": "DevIntel Toolkit"
      }
    });

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("Axios API Request Failed:", error);
    
    // Better Error Handling from Axios response
    if (error.response && error.response.data) {
       const routerError = error.response.data.error?.message || "Unknown API Error";
       throw new Error(`AI System Error: ${routerError}`);
    } else {
       throw new Error("Network connection failed. Check your internet or API key.");
    }
  }
};