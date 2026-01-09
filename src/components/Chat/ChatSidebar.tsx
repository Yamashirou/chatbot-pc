import { MessageSquarePlus } from 'lucide-react';
import type { Conversation } from '../../lib/conversationStorage';
import { ConversationItem } from './ConversationItem';

interface ChatSidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewConversation: () => void;
    onDeleteConversation: (id: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const ChatSidebar = ({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    isCollapsed,
    onToggleCollapse,
}: ChatSidebarProps) => {
    const handleSelectConversation = (id: string) => {
        onSelectConversation(id);
        // Auto-close sidebar on mobile after selection
        if (window.innerWidth < 768) {
            onToggleCollapse();
        }
    };
    return (
        <>
            {/* Backdrop overlay for mobile */}
            {!isCollapsed && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onToggleCollapse}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed md:relative inset-y-0 left-0 z-50
                    bg-black border-r border-purple-900/50 
                    transition-transform duration-300 ease-in-out
                    w-72 md:w-72
                    ${isCollapsed ? '-translate-x-full md:translate-x-0 md:w-0' : 'translate-x-0'}
                `}
            >
                <div className={`flex flex-col h-full ${isCollapsed ? 'md:w-0' : 'w-72'} overflow-hidden`}>
                    {/* Sidebar Header */}
                    <div className="p-3 border-b border-purple-900/50">
                        <button
                            onClick={onNewConversation}
                            className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium touch-manipulation"
                        >
                            <MessageSquarePlus size={18} />
                            Chat Baru
                        </button>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-4 text-center text-purple-700 text-sm">
                                Belum ada percakapan
                            </div>
                        ) : (
                            <div className="py-2">
                                {conversations.map((conv) => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={conv.id === activeConversationId}
                                        onClick={() => handleSelectConversation(conv.id)}
                                        onDelete={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Hapus percakapan ini?')) {
                                                onDeleteConversation(conv.id);
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
