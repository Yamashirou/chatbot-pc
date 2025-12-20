import { Trash2, Cpu } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { InputArea } from './InputArea';
import { MessageList } from './MessageList';

export const ChatContainer = () => {
    const {
        messages,
        input,
        setInput,
        isLoading,
        error,
        sendMessage,
        clearHistory
    } = useChat();

    return (
        <div className="flex flex-col h-screen w-full bg-black text-gray-100">
            {/* Header */}
            <header className="flex-none p-4 border-b border-purple-900/50 flex justify-between items-center bg-black sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 flex items-center justify-center">
                        <Cpu size={18} />
                    </div>
                    <div>
                        <h1 className="font-semibold text-sm md:text-base text-purple-300">PC Building Assistant</h1>
                        <span className="text-xs text-purple-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-purple-400"></span>
                            Gemini 2.5 Flash • Grounding Enabled
                        </span>
                    </div>
                </div>

                {messages.length > 0 && (
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to clear the chat history?')) {
                                clearHistory();
                            }
                        }}
                        className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-950/50 transition-colors"
                        title="Clear History"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </header>

            {/* Main Chat Area */}
            <MessageList messages={messages} isLoading={isLoading} />

            {/* Error Toast */}
            {error && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-2 text-sm flex items-center gap-2 shadow-xl">
                    <span>⚠️ {error}</span>
                    <button onClick={() => window.location.reload()} className="hover:underline">Retry</button>
                </div>
            )}

            {/* Input Area */}
            <InputArea
                input={input}
                setInput={setInput}
                onSend={() => sendMessage(input)}
                isLoading={isLoading}
            />
        </div>
    );
};
