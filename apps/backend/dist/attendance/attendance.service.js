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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const time_entry_entity_1 = require("./entities/time-entry.entity");
let AttendanceService = class AttendanceService {
    timeEntryRepo;
    constructor(timeEntryRepo) {
        this.timeEntryRepo = timeEntryRepo;
    }
    async clockIn(userId, location) {
        const activeEntry = await this.timeEntryRepo.findOne({
            where: { userId, clockOut: (0, typeorm_2.IsNull)() },
        });
        if (activeEntry) {
            throw new common_1.BadRequestException('You are already clocked in.');
        }
        const entry = this.timeEntryRepo.create({
            userId,
            clockIn: new Date(),
            location_in: location,
        });
        return this.timeEntryRepo.save(entry);
    }
    async clockOut(userId, location) {
        const activeEntry = await this.timeEntryRepo.findOne({
            where: { userId, clockOut: (0, typeorm_2.IsNull)() },
        });
        if (!activeEntry) {
            throw new common_1.BadRequestException('You are not clocked in.');
        }
        activeEntry.clockOut = new Date();
        activeEntry.location_out = location;
        const diff = activeEntry.clockOut.getTime() - activeEntry.clockIn.getTime();
        activeEntry.durationSeconds = Math.floor(diff / 1000);
        return this.timeEntryRepo.save(activeEntry);
    }
    async getStatus(userId) {
        const activeEntry = await this.timeEntryRepo.findOne({
            where: { userId, clockOut: (0, typeorm_2.IsNull)() },
        });
        const weeklyHours = await this.calculateWeeklyHours(userId);
        return {
            isClockedIn: !!activeEntry,
            activeEntry,
            weeklyHours,
        };
    }
    async calculateWeeklyHours(userId) {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const entries = await this.timeEntryRepo.find({
            where: {
                userId,
                clockIn: (0, typeorm_2.MoreThanOrEqual)(startOfWeek),
            },
        });
        let totalSeconds = 0;
        entries.forEach(entry => {
            if (entry.durationSeconds) {
                totalSeconds += entry.durationSeconds;
            }
            else if (!entry.clockOut) {
                const diff = new Date().getTime() - entry.clockIn.getTime();
                totalSeconds += Math.floor(diff / 1000);
            }
        });
        return parseFloat((totalSeconds / 3600).toFixed(2));
    }
    async getHistory(userId) {
        return this.timeEntryRepo.find({
            where: { userId },
            order: { clockIn: 'DESC' },
            take: 20,
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(time_entry_entity_1.TimeEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map