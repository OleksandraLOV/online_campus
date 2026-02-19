"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mock_data_1 = require("../common/mock-data");
let NotificationsService = class NotificationsService {
    items = [...mock_data_1.notifications];
    findByUser(userId) {
        return this.items
            .filter((n) => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    getUnreadCount(userId) {
        return this.items.filter((n) => n.userId === userId && !n.readFlag).length;
    }
    markAsRead(id, userId) {
        const ntf = this.items.find((n) => n.id === id && n.userId === userId);
        if (ntf) {
            ntf.readFlag = true;
        }
        return ntf;
    }
    markAllAsRead(userId) {
        this.items
            .filter((n) => n.userId === userId && !n.readFlag)
            .forEach((n) => (n.readFlag = true));
        return { success: true };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map