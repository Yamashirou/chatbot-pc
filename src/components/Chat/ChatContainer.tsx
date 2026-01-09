import { Cpu, PanelLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { InputArea } from './InputArea';
import { MessageList } from './MessageList';
import { ChatSidebar } from './ChatSidebar';

export const ChatContainer = () => {
    const {
        conversations,
        activeConversationId,
        switchConversation,
        createNewConversation,
        deleteConversation,
        messages,
        input,
        setInput,
        isLoading,
        error,
        sendMessage,
        stopGeneration
    } = useChat();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Auto-collapse sidebar on mobile screens on initial load
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarCollapsed(true);
            }
        };

        // Check on mount
        handleResize();

        // Optional: listen for resize events
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-screen w-full bg-black text-gray-100">
            {/* Sidebar */}
            <ChatSidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={switchConversation}
                onNewConversation={createNewConversation}
                onDeleteConversation={deleteConversation}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Header */}
                <header className="flex-none p-4 border-b border-purple-900/50 flex justify-between items-center bg-black sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        {/* Toggle Sidebar Button */}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-2.5 bg-purple-900/50 hover:bg-purple-800/50 border border-purple-700 text-purple-300 transition-all touch-manipulation"
                            title={isSidebarCollapsed ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'}
                            aria-label="Toggle sidebar"
                        >
                            <PanelLeft size={18} className={`transition-transform ${isSidebarCollapsed ? '' : 'rotate-180'}`} />
                        </button>

                        <div className="w-8 h-8 bg-purple-600 flex items-center justify-center">
                            <Cpu size={18} />
                        </div>
                        <div>
                            <h1 className="font-semibold text-sm md:text-base text-purple-300 truncate">BuildMate - PC Building Assistant</h1>
                            <span className="text-xs text-purple-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-purple-400"></span>
                                <span className="hidden sm:inline">Gemini 2.5 Flash • Grounding Enabled</span>
                                <span className="sm:hidden">Online</span>
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Chat Area */}
                <MessageList messages={messages} isLoading={isLoading} />

                {/* Error Toast */}
                {error && (
                    <div className="fixed bottom-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:max-w-md bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-2 text-sm flex items-center gap-2 shadow-xl z-30">
                        <span>⚠️ {error}</span>
                        <button onClick={() => window.location.reload()} className="hover:underline ml-auto">Retry</button>
                    </div>
                )}

                {/* Input Area */}
                <InputArea
                    input={input}
                    setInput={setInput}
                    onSend={() => sendMessage(input)}
                    onStop={stopGeneration}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};
