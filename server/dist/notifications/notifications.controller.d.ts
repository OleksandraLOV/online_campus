import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    findMy(req: any): import("../common/types/entities").Notification[];
    getUnreadCount(req: any): {
        count: number;
    };
    markAsRead(id: string, req: any): import("../common/types/entities").Notification | undefined;
    markAllAsRead(req: any): {
        success: boolean;
    };
}
