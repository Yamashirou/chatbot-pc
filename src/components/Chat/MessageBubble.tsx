import { useEffect, useState } from 'react';
import type { ChatMessage } from '../../lib/gemini';
import { Bot, User } from 'lucide-react';
import clsx from 'clsx';

interface MessageBubbleProps {
    message: ChatMessage;
    isLast: boolean;
}

export const MessageBubble = ({ message, isLast }: MessageBubbleProps) => {
    const isUser = message.role === 'user';
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // If it's a user message, show immediately
        if (isUser) {
            setDisplayedText(message.text);
            return;
        }

        // If it's not the last message, show immediately
        if (!isLast) {
            setDisplayedText(message.text);
            return;
        }

        setIsTyping(true);
        let i = 0;
        const intervalId = setInterval(() => {
            setDisplayedText(() => {
                if (i >= message.text.length) {
                    clearInterval(intervalId);
                    setIsTyping(false);
                    return message.text;
                }
                return message.text.slice(0, i + 1);
            });
            i++;
        }, 15);

        return () => clearInterval(intervalId);
    }, [message.text, isLast, isUser]);

    return (
        <div className={clsx(
            "flex w-full mb-4",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={clsx(
                "flex max-w-[80%] md:max-w-[70%] px-4 py-3 shadow-sm border",
                isUser
                    ? "bg-purple-600 text-white border-purple-500"
                    : "bg-black text-gray-100 border-purple-800"
            )}>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                        {isUser ? <User size={14} /> : <Bot size={14} />}
                        <span>{isUser ? 'You' : 'Gemini'}</span>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                        {displayedText}
                        {isTyping && <span className="animate-pulse inline-block w-1.5 h-4 ml-1 align-middle bg-purple-400" />}
                    </div>
                </div>
            </div>
        </div>
    );
};
