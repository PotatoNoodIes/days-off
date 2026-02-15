import { IsEmail, IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  currentPtoBalance?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  annualPtoEntitlement?: number;
}
