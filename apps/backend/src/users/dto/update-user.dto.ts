import { IsEmail, IsString, IsOptional, IsNumber, IsIn } from 'class-validator';
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
  @IsString()
  department?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  leaveBalance?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ptoDays?: number;
}
