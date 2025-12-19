import { useState, useEffect, useCallback } from 'react';
import { type ChatMessage, generateResponse } from '../lib/gemini';

const STORAGE_KEY = 'gemini-chat-history';

export const useChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem(STORAGE_KEY);
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }
    }, []);

    // Save to local storage whenever messages change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const newUserMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            text: text,
            timestamp: Date.now(),
        };

        // Optimistically add user message
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const responseText = await generateResponse(messages, text);

            const newAiMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'model',
                text: responseText,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, newAiMessage]);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    return {
        messages,
        input,
        setInput,
        isLoading,
        error,
        sendMessage,
        clearHistory
    };
};
