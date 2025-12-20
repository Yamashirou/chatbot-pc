import { Send } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface InputAreaProps {
    input: string;
    setInput: (value: string) => void;
    onSend: () => void;
    isLoading: boolean;
}

export const InputArea = ({ input, setInput, onSend, isLoading }: InputAreaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    // Listen for custom event to set input from example questions
    useEffect(() => {
        const handler = (e: CustomEvent) => {
            setInput(e.detail);
            textareaRef.current?.focus();
        };
        window.addEventListener('setInput', handler as EventListener);
        return () => window.removeEventListener('setInput', handler as EventListener);
    }, [setInput]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="p-4 border-t border-purple-900/50 bg-black">
            <div className="max-w-2xl mx-auto relative flex items-end gap-2 p-2 bg-black border border-purple-800 focus-within:border-purple-500 transition-all shadow-lg">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about PC building, hardware, compatibility..."
                    rows={1}
                    className="w-full bg-transparent text-gray-100 placeholder-purple-700 px-4 py-3 max-h-40 resize-none focus:outline-none"
                    disabled={isLoading}
                />
                <button
                    onClick={onSend}
                    disabled={!input.trim() || isLoading}
                    className="p-3 bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-0.5"
                >
                    <Send size={20} />
                </button>
            </div>
            <div className="text-center mt-2">
                <p className="text-xs text-purple-700">PC Building Expert • Grounded with Google Search</p>
            </div>
        </div>
    );
};
