import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'firstName', 'lastName', 'orgId']
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  // NEW METHODS

  async findAllByOrg(orgId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { orgId },
      select: [
        'id',
        'email',
        'role',
        'firstName',
        'lastName',
        'startDate',
        'endDate',
        'department',
        'ptoDays',
        'timeOffHours',
        'leaveBalance',
        'createdAt',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);

    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}