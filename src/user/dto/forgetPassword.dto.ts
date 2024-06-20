import { IsString } from 'class-validator';



export class ForgetPasswordDTO {
  @IsString()
  readonly password: string;

}

export class ForgetPasswordEmailDTO {
  @IsString()
  readonly email: string;

}