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
exports.LeavesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_request_entity_1 = require("./entities/leave-request.entity");
let LeavesService = class LeavesService {
    leaveRepo;
    constructor(leaveRepo) {
        this.leaveRepo = leaveRepo;
    }
    async createRequest(userId, data) {
        const request = this.leaveRepo.create({
            ...data,
            userId,
            status: leave_request_entity_1.LeaveStatus.PENDING,
        });
        return this.leaveRepo.save(request);
    }
    async getMyRequests(userId) {
        return this.leaveRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getPendingRequests() {
        return this.leaveRepo.find({
            where: { status: leave_request_entity_1.LeaveStatus.PENDING },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
    }
    async updateStatus(id, status, reviewerId) {
        const request = await this.leaveRepo.findOneBy({ id });
        if (!request)
            throw new common_1.BadRequestException('Request not found');
        request.status = status;
        request.reviewerId = reviewerId;
        return this.leaveRepo.save(request);
    }
};
exports.LeavesService = LeavesService;
exports.LeavesService = LeavesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_request_entity_1.LeaveRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LeavesService);
//# sourceMappingURL=leaves.service.js.map