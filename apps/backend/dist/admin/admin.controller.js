"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("../attendance/attendance.service");
const leaves_service_1 = require("../leaves/leaves.service");
let AdminController = class AdminController {
    attendanceService;
    leavesService;
    constructor(attendanceService, leavesService) {
        this.attendanceService = attendanceService;
        this.leavesService = leavesService;
    }
    async getDashboardStats() {
        const pendingLeaves = await this.leavesService.getPendingRequests();
        return {
            attendanceRate: '88%',
            pendingRequests: pendingLeaves.length,
            activeToday: 5,
            recentActivity: [
                { id: 1, text: 'John Doe clocked in (09:02 AM)', type: 'attendance' },
                { id: 2, text: 'Sarah Chen requested Sick Leave', type: 'leave' },
            ],
        };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService,
        leaves_service_1.LeavesService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map