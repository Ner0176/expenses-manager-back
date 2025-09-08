import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  tag: string;

  @IsString()
  icon: string;
}
