import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({timestamps:true})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  tel: string;

  @Prop()
  googleId: string

  @Prop()
  picProfile: string
  
  @Prop({ default: false })
  isVerify: boolean
  
  @Prop({default: ''})
  activationToken : string
  
  @Prop()
  tokenCreatedAt: Date;  // Add this field for token creation time

  @Prop()
  tokenForgetPassword: string

  @Prop()
  tokenForgetPasswordCreatedAt: Date;  // Add this field for token creation time

  @Prop({ default: false})
  setPasswordAllow: boolean //IF Set True = Allow to Reset Password
  
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});