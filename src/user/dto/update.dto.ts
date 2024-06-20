import { IsString, IsBoolean, IsOptional } from 'class-validator';



export class UpdateDTO {


    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly tel: string;

    @IsString()
    @IsOptional()
    readonly googleId: string;

    @IsString()
    @IsOptional()
    readonly picProfile : string

    @IsBoolean()
    @IsOptional()
    readonly isVerify: boolean;

  }