import { Send, StopCircle } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface InputAreaProps {
    input: string;
    setInput: (value: string) => void;
    onSend: () => void;
    onStop: () => void;
    isLoading: boolean;
}

export const InputArea = ({ input, setInput, onSend, onStop, isLoading }: InputAreaProps) => {
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
        <div className="p-3 md:p-4 border-t border-purple-900/50 bg-black">
            <div className="max-w-2xl mx-auto relative flex items-end gap-2 p-2 bg-black border border-purple-800 focus-within:border-purple-500 transition-all shadow-lg">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanyakan tentang rakit PC, hardware, kompatibilitas..."
                    rows={1}
                    className="w-full bg-transparent text-gray-100 placeholder-purple-700 px-3 md:px-4 py-3 max-h-40 resize-none focus:outline-none text-sm md:text-base"
                    disabled={isLoading}
                />
                {isLoading ? (
                    <button
                        onClick={() => {
                            console.log('[InputArea] Stop button clicked, isLoading:', isLoading);
                            onStop();
                        }}
                        className="min-w-[44px] min-h-[44px] p-3 bg-red-600 text-white hover:bg-red-500 transition-all touch-manipulation flex items-center justify-center"
                        title="Hentikan respons"
                        aria-label="Stop generation"
                    >
                        <StopCircle size={20} />
                    </button>
                ) : (
                    <button
                        onClick={onSend}
                        disabled={!input.trim()}
                        className="min-w-[44px] min-h-[44px] p-3 bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation flex items-center justify-center"
                        aria-label="Send message"
                    >
                        <Send size={20} />
                    </button>
                )}
            </div>
            <div className="text-center mt-2">
                <p className="text-xs text-purple-700 hidden sm:block">Ahli Rakit PC • Didukung Google Search</p>
                <p className="text-xs text-purple-700 sm:hidden">Ahli Rakit PC</p>
            </div>
        </div>
    );
};
