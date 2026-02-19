import { Notification } from '../common/types/entities';
export declare class NotificationsService {
    private items;
    findByUser(userId: string): Notification[];
    getUnreadCount(userId: string): number;
    markAsRead(id: string, userId: string): Notification | undefined;
    markAllAsRead(userId: string): {
        success: boolean;
    };
}
