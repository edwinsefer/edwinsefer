import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToAI } from '../services/geminiService';
import { Button, Input } from './SharedUI';
import { Send, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const AIHistorian: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hello! I am your Family Archivist. Ask me about birthdays, family history, or upcoming events!", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToAI(userMsg.text);
    
    const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px] bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-200">
      {/* Header */}
      <div className="bg-brand-600 p-4 flex items-center text-white shadow-md">
        <div className="p-2 bg-white/20 rounded-full mr-3">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="font-serif font-bold text-lg">Family Archivist AI</h2>
          <p className="text-brand-100 text-xs">Powered by Gemini</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 shadow-sm border border-brand-100 rounded-tl-none'
            }`}>
              <p className="leading-relaxed text-sm md:text-base">{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-brand-200' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-brand-100 flex items-center space-x-2">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-brand-100">
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-brand-50"
            placeholder="Ask about birthdays, history, or write a poem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};