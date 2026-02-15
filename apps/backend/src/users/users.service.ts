import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Department } from './entities/department.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    private configService: ConfigService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('EXPO_PUBLIC_SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  private supabase: SupabaseClient;

  async findAllDepartments(): Promise<Department[]> {
    return this.departmentRepository.find({ order: { name: 'ASC' } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'role', 'firstName', 'lastName']
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { id },
      relations: ['department'],
    });
  }


  async create(userData: CreateUserDto): Promise<User> {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || UserRole.EMPLOYEE,
      },
    });

    if (authError) {
      throw new Error(`Supabase Auth Error: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Failed to create user in Supabase Auth');
    }

    // 2. Create user in local database using the same ID
    const user = this.usersRepository.create();
    this.usersRepository.merge(user, {
      ...userData,
      id: authData.user.id, // Link IDs
      email: authData.user.email,
      currentPtoBalance: userData.annualPtoEntitlement || 0, // Initialize balance = entitlement
    });

    return this.usersRepository.save(user);
  }

  async syncUser(userData: Partial<User>): Promise<User> {
    const { id, email, ...rest } = userData;
    
    const existing = await this.findById(id!);
    
    const updateData = {
      id,
      email,
      ...rest,
      firstName: rest.firstName || existing?.firstName || '',
      lastName: rest.lastName || existing?.lastName || '',
      role: rest.role || existing?.role || UserRole.EMPLOYEE,
      currentPtoBalance: rest.currentPtoBalance ?? existing?.currentPtoBalance ?? 0,
      annualPtoEntitlement: rest.annualPtoEntitlement ?? existing?.annualPtoEntitlement ?? 0,
    };

    await this.usersRepository.upsert(updateData, ['id']);

    const user = await this.findById(id!);
    if (!user) throw new NotFoundException('Failed to sync user');
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['department'],
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

  async updateEmployee(id: string, updateData: Partial<User>): Promise<User> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updated = this.usersRepository.merge(existing, updateData);
    return this.usersRepository.save(updated);
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
