import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import Spinner from './Spinner';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: 'Olá! Sou o Edu, seu assistente financeiro. Como posso ajudar você hoje?',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await sendChatMessage(userMessage.text);
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Ops, tive um problema para responder. Tente novamente mais tarde.',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Converter Markdown simples (negrito) para visualização
    const formatMessage = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
            {/* Janela do Chat */}
            <div 
                className={`pointer-events-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-80 sm:w-96 flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${
                    isOpen ? 'opacity-100 scale-100 mb-4 h-[500px]' : 'opacity-0 scale-90 h-0 mb-0'
                }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary-dark))] p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[rgb(var(--color-primary))] font-bold">
                            E
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">Edu - Assistente</h3>
                            <p className="text-white/80 text-xs">FinEduca AI</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="Fechar chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.sender === 'user' 
                                        ? 'bg-[rgb(var(--color-primary))] text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-tl-none shadow-sm'
                                }`}
                            >
                                {formatMessage(msg.text)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-600 shadow-sm flex items-center space-x-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite sua dúvida..."
                        className="flex-1 bg-slate-100 dark:bg-slate-700/50 border-transparent focus:bg-white dark:focus:bg-slate-700 border focus:border-[rgb(var(--color-primary))] rounded-full py-2 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isLoading}
                        className="p-2 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-dark))] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Enviar"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 p-1"><Spinner /></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        )}
                    </button>
                </form>
            </div>

            {/* Botão Flutuante (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[rgb(var(--color-primary)/0.3)] ${
                    isOpen 
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rotate-90' 
                        : 'bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-dark))]'
                }`}
                aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;