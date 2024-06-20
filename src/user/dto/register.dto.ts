import { IsString, IsOptional , IsBoolean} from 'class-validator';



export class RegisterDTO {

    @IsString()
    readonly email: string;

    @IsString()
    @IsOptional()
    readonly password: string;

    @IsString()
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
    readonly isVerify : boolean

    @IsString()
    @IsOptional()
    readonly activationToken : string

  }