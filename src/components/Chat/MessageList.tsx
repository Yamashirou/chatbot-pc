import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../lib/gemini';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
}

const EXAMPLE_QUESTIONS = [
    "Build a PC with a budget of 15 million IDR",
    "Explain AMD vs Intel CPU differences",
    "Compare NVIDIA and AMD GPUs",
    "Check my component compatibility",
    "Recommend upgrade path for my system"
];

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-purple-400 p-8 text-center h-full">
                <div className="w-16 h-16 bg-purple-900/50 flex items-center justify-center mb-4 text-3xl border border-purple-700">🖥️</div>
                <h2 className="text-xl font-semibold text-purple-200 mb-2">PC Building Assistant</h2>
                <p className="max-w-md text-purple-500 mb-6">Expert-level knowledge of PC hardware, component compatibility, and performance optimization.</p>

                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                    {EXAMPLE_QUESTIONS.map((q, i) => (
                        <button
                            key={i}
                            className="px-3 py-2 text-xs text-purple-300 border border-purple-800 hover:bg-purple-900/30 hover:border-purple-600 transition-colors"
                            onClick={() => {
                                // Dispatch a custom event to set the input
                                window.dispatchEvent(new CustomEvent('setInput', { detail: q }));
                            }}
                        >
                            {q}
                        </button>
                    ))}
                </div>
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
