import { GoogleGenAI, Chat } from "@google/genai";
import { Member, Event } from '../types';

let chatSession: Chat | null = null;

// Initialize the AI with family context
export const initializeAI = async (members: Member[], events: Event[]) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Create context string
  const memberContext = members.map(m => 
    `${m.name} (Born: ${m.birthDate}, Relation: ${m.relation}, Location: ${m.location}, Bio: ${m.bio || 'N/A'})`
  ).join('\n');

  const eventContext = events.map(e => 
    `${e.title} on ${e.date} (${e.type}) - ${e.description || ''}`
  ).join('\n');

  const systemInstruction = `
    You are the "Family Archivist" and "Helpful Assistant" for the My Family Roots hub.
    Your tone should be warm, respectful, elderly-friendly, and helpful.
    
    Here is the current Family Directory Data:
    ${memberContext}

    Here is the Calendar of Events:
    ${eventContext}

    Capabilities:
    1. Answer questions about family history, birthdays, and relations.
    2. Help draft birthday messages or event invitations.
    3. Remind users of upcoming events based on the data provided.
    4. If asked about something not in the data, gently say you don't recall that detail but would love to have it added to the archives.
    
    Keep responses concise but warm. Use emojis sparingly but effectively.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });
};

export const sendMessageToAI = async (message: string): Promise<string> => {
  if (!chatSession) {
    return "I'm still waking up! Please give me a moment to review the family archives...";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I'm having a little trouble hearing you, dear. Could you repeat that?";
  } catch (error) {
    console.error("AI Error:", error);
    return "Oh dear, I seem to have lost my train of thought. Please try again later.";
  }
};