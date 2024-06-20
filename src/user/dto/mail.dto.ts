import { IsString, IsOptional , IsBoolean} from 'class-validator';



export class MailDto {

    @IsString()
    readonly to: string;

    @IsString()
    readonly from: string;

    @IsString()
    readonly subject: string;

    @IsString()
    readonly text: string;

  }