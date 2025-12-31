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
exports.TimeEntry = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let TimeEntry = class TimeEntry {
    id;
    user;
    userId;
    clockIn;
    clockOut;
    durationSeconds;
    location_in;
    location_out;
    createdAt;
};
exports.TimeEntry = TimeEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TimeEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], TimeEntry.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], TimeEntry.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clock_in', type: 'timestamp' }),
    __metadata("design:type", Date)
], TimeEntry.prototype, "clockIn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clock_out', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], TimeEntry.prototype, "clockOut", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_seconds', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], TimeEntry.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TimeEntry.prototype, "location_in", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TimeEntry.prototype, "location_out", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TimeEntry.prototype, "createdAt", void 0);
exports.TimeEntry = TimeEntry = __decorate([
    (0, typeorm_1.Entity)('time_entries')
], TimeEntry);
//# sourceMappingURL=time-entry.entity.js.map