import { ArrayMaxSize, IsArray, IsString, MaxLength } from 'class-validator';

export class UpdateFamilyReportSettingsDto {
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @MaxLength(160, { each: true })
  parentReportQuestions: string[];
}
