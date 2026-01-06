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
exports.Schedule = exports.ScheduleType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var ScheduleType;
(function (ScheduleType) {
    ScheduleType["REGULAR"] = "REGULAR";
    ScheduleType["OVERTIME"] = "OVERTIME";
    ScheduleType["REMOTE"] = "REMOTE";
})(ScheduleType || (exports.ScheduleType = ScheduleType = {}));
let Schedule = class Schedule {
    id;
    user;
    userId;
    startTime;
    endTime;
    type;
    createdAt;
    updatedAt;
};
exports.Schedule = Schedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Schedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Schedule.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Schedule.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'timestamp' }),
    __metadata("design:type", Date)
], Schedule.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'timestamp' }),
    __metadata("design:type", Date)
], Schedule.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScheduleType, default: ScheduleType.REGULAR }),
    __metadata("design:type", String)
], Schedule.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Schedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Schedule.prototype, "updatedAt", void 0);
exports.Schedule = Schedule = __decorate([
    (0, typeorm_1.Entity)('schedules')
], Schedule);
//# sourceMappingURL=schedule.entity.js.map