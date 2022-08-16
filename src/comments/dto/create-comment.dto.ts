import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID('4')
  @IsOptional()
  parentCommentId: string;

  @IsString()
  comment: string;
}
