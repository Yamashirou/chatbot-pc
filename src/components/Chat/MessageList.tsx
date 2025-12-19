import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../lib/gemini';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-purple-400 p-8 text-center h-full">
                <div className="w-16 h-16 bg-purple-900/50 flex items-center justify-center mb-4 text-3xl border border-purple-700">✨</div>
                <h2 className="text-xl font-semibold text-purple-200 mb-2">Welcome to Gemini Chat</h2>
                <p className="max-w-md text-purple-500">Start a conversation to see the magic happen. Your messages are saved locally automatically.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-2xl mx-auto flex flex-col">
                {messages.map((msg, index) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isLast={index === messages.length - 1}
                    />
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-purple-950/50 border border-purple-800 px-4 py-3 flex gap-1 items-center h-10">
                            <span className="w-2 h-2 bg-purple-500 animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-purple-500 animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-purple-500 animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
