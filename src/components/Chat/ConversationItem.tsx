import { Trash2 } from 'lucide-react';
import type { Conversation } from '../../lib/conversationStorage';

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
}

/**
 * Format timestamp to relative time
 */
const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} mnt lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days === 1) return 'Kemarin';
    if (days < 7) return `${days} hari lalu`;

    // Format as date for older conversations
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
};

export const ConversationItem = ({ conversation, isActive, onClick, onDelete }: ConversationItemProps) => {
    return (
        <div
            onClick={onClick}
            className={`
                group relative px-3 py-2.5 cursor-pointer transition-all border-l-2
                ${isActive
                    ? 'bg-purple-950/50 border-purple-500'
                    : 'border-transparent hover:bg-purple-950/30 hover:border-purple-700'
                }
            `}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-purple-200' : 'text-gray-300'}`}>
                        {conversation.title}
                    </p>
                    <p className="text-xs text-purple-600 mt-0.5">
                        {formatTimestamp(conversation.lastModifiedAt)}
                    </p>
                </div>

                <button
                    onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 p-1 text-purple-500 hover:text-red-400 transition-all flex-shrink-0"
                    title="Hapus percakapan"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};
