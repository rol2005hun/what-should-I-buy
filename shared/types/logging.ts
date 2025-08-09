export type LogLevel = 'info' | 'success' | 'warning' | 'error';

export interface DiscordLogMessage {
    level: LogLevel;
    message: string;
    timestamp?: string;
    userId?: string;
    searchQuery?: string;
}