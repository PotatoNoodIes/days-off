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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async clockIn(req, body) {
        return this.attendanceService.clockIn(req.user.userId, body.location);
    }
    async clockOut(req, body) {
        return this.attendanceService.clockOut(req.user.userId, body.location);
    }
    async getStatus(req) {
        return this.attendanceService.getStatus(req.user.userId);
    }
    async getHistory(req) {
        return this.attendanceService.getHistory(req.user.userId);
    }
    async getStatusForUser(userId) {
        return this.attendanceService.getStatus(userId);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('clock-in'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Post)('clock-out'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "clockOut", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('status/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getStatusForUser", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map