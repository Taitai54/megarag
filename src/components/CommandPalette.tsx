'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MessageSquare, FileText, Microscope, Settings, X } from 'lucide-react';

interface CommandItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    action: () => void;
    keywords?: string[];
}

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    const commands: CommandItem[] = [
        {
            id: 'chat',
            label: 'Go to Chat',
            icon: <MessageSquare className="h-4 w-4" />,
            action: () => router.push('/dashboard/chat'),
            keywords: ['chat', 'message', 'ask', 'query'],
        },
        {
            id: 'documents',
            label: 'Go to Documents',
            icon: <FileText className="h-4 w-4" />,
            action: () => router.push('/dashboard'),
            keywords: ['documents', 'files', 'upload'],
        },
        {
            id: 'explorer',
            label: 'Go to Explorer',
            icon: <Microscope className="h-4 w-4" />,
            action: () => router.push('/dashboard/explorer'),
            keywords: ['explorer', 'data', 'browse'],
        },
        {
            id: 'admin',
            label: 'Go to Admin',
            icon: <Settings className="h-4 w-4" />,
            action: () => router.push('/admin'),
            keywords: ['admin', 'settings', 'manage'],
        },
    ];

    const filtered = query
        ? commands.filter(
            (cmd) =>
                cmd.label.toLowerCase().includes(query.toLowerCase()) ||
                cmd.keywords?.some((k) => k.includes(query.toLowerCase()))
        )
        : commands;

    const handleSelect = useCallback(
        (cmd: CommandItem) => {
            setIsOpen(false);
            setQuery('');
            cmd.action();
        },
        []
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
                setQuery('');
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 border rounded-md hover:bg-muted transition-colors"
            >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                }}
            />

            {/* Dialog */}
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 animate-in fade-in-0 zoom-in-95">
                <div className="bg-popover border rounded-xl shadow-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 border-b">
                        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                        <input
                            type="text"
                            placeholder="Type a command or search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 py-3 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                            autoFocus
                        />
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setQuery('');
                            }}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="py-2 max-h-64 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                No results found.
                            </div>
                        ) : (
                            filtered.map((cmd) => (
                                <button
                                    key={cmd.id}
                                    onClick={() => handleSelect(cmd)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left"
                                >
                                    <span className="text-muted-foreground">{cmd.icon}</span>
                                    <span>{cmd.label}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
