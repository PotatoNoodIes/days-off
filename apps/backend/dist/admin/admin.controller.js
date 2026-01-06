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
const schedules_service_1 = require("../schedules/schedules.service");
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
    schedulesService;
    timeEntryRepo;
    userRepo;
    leaveRequestRepo;
    constructor(attendanceService, leavesService, schedulesService, timeEntryRepo, userRepo, leaveRequestRepo) {
        this.attendanceService = attendanceService;
        this.leavesService = leavesService;
        this.schedulesService = schedulesService;
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
            totalUsers,
            recentActivity,
        };
    }
    async getWorkforceStatus() {
        const users = await this.userRepo.find({
            select: ['id', 'firstName', 'lastName', 'role', 'email'],
        });
        const statusList = await Promise.all(users.map(async (user) => {
            const activeEntry = await this.timeEntryRepo.findOne({
                where: { userId: user.id, clockOut: (0, typeorm_2.IsNull)() },
            });
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const entriesToday = await this.timeEntryRepo.find({
                where: { userId: user.id, clockIn: (0, typeorm_2.MoreThanOrEqual)(today) },
            });
            let totalSecondsToday = 0;
            entriesToday.forEach(entry => {
                if (entry.durationSeconds) {
                    totalSecondsToday += entry.durationSeconds;
                }
                else {
                    totalSecondsToday += Math.floor((new Date().getTime() - entry.clockIn.getTime()) / 1000);
                }
            });
            return {
                ...user,
                isClockedIn: !!activeEntry,
                clockInTime: activeEntry?.clockIn || null,
                hoursToday: parseFloat((totalSecondsToday / 3600).toFixed(2)),
            };
        }));
        return statusList;
    }
    async getSchedules(start, end) {
        if (!start || !end)
            throw new common_1.BadRequestException('Start and end dates required');
        return this.schedulesService.getForDateRange(new Date(start), new Date(end));
    }
    async updateTimeEntry(id, data) {
        const entry = await this.timeEntryRepo.findOne({ where: { id } });
        if (!entry)
            throw new common_1.BadRequestException('Entry not found');
        if (data.clockIn)
            entry.clockIn = new Date(data.clockIn);
        if (data.clockOut)
            entry.clockOut = new Date(data.clockOut);
        if (entry.clockOut) {
            const diff = entry.clockOut.getTime() - entry.clockIn.getTime();
            entry.durationSeconds = Math.floor(diff / 1000);
        }
        return this.timeEntryRepo.save(entry);
    }
    async createTimeEntry(data) {
        if (!data.userId || !data.clockIn)
            throw new common_1.BadRequestException('UserId and ClockIn required');
        const entry = new time_entry_entity_1.TimeEntry();
        entry.userId = data.userId;
        entry.clockIn = new Date(data.clockIn);
        if (data.clockOut) {
            entry.clockOut = new Date(data.clockOut);
            const diff = entry.clockOut.getTime() - entry.clockIn.getTime();
            entry.durationSeconds = Math.floor(diff / 1000);
        }
        return this.timeEntryRepo.save(entry);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('workforce-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getWorkforceStatus", null);
__decorate([
    (0, common_1.Get)('schedules'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSchedules", null);
__decorate([
    (0, common_1.Patch)('time-entries/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateTimeEntry", null);
__decorate([
    (0, common_1.Post)('time-entries'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createTimeEntry", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Controller)('admin'),
    __param(3, (0, typeorm_1.InjectRepository)(time_entry_entity_1.TimeEntry)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(leave_request_entity_1.LeaveRequest)),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService,
        leaves_service_1.LeavesService,
        schedules_service_1.SchedulesService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminController);
//# sourceMappingURL=admin.controller.js.map