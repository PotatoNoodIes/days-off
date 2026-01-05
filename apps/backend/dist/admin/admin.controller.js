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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("../attendance/attendance.service");
const leaves_service_1 = require("../leaves/leaves.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const time_entry_entity_1 = require("../attendance/entities/time-entry.entity");
const user_entity_1 = require("../users/entities/user.entity");
const leave_request_entity_1 = require("../leaves/entities/leave-request.entity");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AdminController = class AdminController {
    attendanceService;
    leavesService;
    timeEntryRepo;
    userRepo;
    leaveRequestRepo;
    constructor(attendanceService, leavesService, timeEntryRepo, userRepo, leaveRequestRepo) {
        this.attendanceService = attendanceService;
        this.leavesService = leavesService;
        this.timeEntryRepo = timeEntryRepo;
        this.userRepo = userRepo;
        this.leaveRequestRepo = leaveRequestRepo;
    }
    async getDashboardStats() {
        const pendingLeaves = await this.leavesService.getPendingRequests();
        const activeToday = await this.timeEntryRepo.count({
            where: { clockOut: (0, typeorm_2.IsNull)() },
        });
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const totalUsers = await this.userRepo.count();
        const activeThisWeek = await this.timeEntryRepo
            .createQueryBuilder('entry')
            .where('entry.clockIn >= :startOfWeek', { startOfWeek })
            .select('COUNT(DISTINCT entry.userId)', 'count')
            .getRawOne();
        const attendanceRate = totalUsers > 0
            ? `${Math.round((activeThisWeek.count / totalUsers) * 100)}%`
            : '0%';
        const recentEntries = await this.timeEntryRepo.find({
            relations: ['user'],
            order: { clockIn: 'DESC' },
            take: 5,
        });
        const recentLeaves = await this.leaveRequestRepo.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: 5,
        });
        const recentActivity = [
            ...recentEntries.map((entry, idx) => ({
                id: idx + 1,
                text: `${entry.user.firstName} ${entry.user.lastName} clocked ${entry.clockOut ? 'out' : 'in'} (${new Date(entry.clockIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`,
                type: 'attendance',
            })),
            ...recentLeaves.map((leave, idx) => ({
                id: recentEntries.length + idx + 1,
                text: `${leave.user.firstName} ${leave.user.lastName} requested ${leave.type} Leave`,
                type: 'leave',
            })),
        ]
            .sort((a, b) => b.id - a.id)
            .slice(0, 10);
        return {
            attendanceRate,
            pendingRequests: pendingLeaves.length,
            activeToday,
            recentActivity,
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
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Controller)('admin'),
    __param(2, (0, typeorm_1.InjectRepository)(time_entry_entity_1.TimeEntry)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(leave_request_entity_1.LeaveRequest)),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService,
        leaves_service_1.LeavesService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminController);
//# sourceMappingURL=admin.controller.js.map