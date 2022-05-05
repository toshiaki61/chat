import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId, LeanDocument, FlattenMaps } from 'mongoose';

export type MessageDocument = Message & Document;
export type LeanMessage = LeanDocument<MessageDocument>;
export type JsonMessage = FlattenMaps<LeanMessage>;

@Schema({
  timestamps: { updatedAt: false },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Message {
  @Transform(({ value }) => value.toString())
  _id!: ObjectId;

  @Prop({ required: true })
  account!: string;

  @Prop()
  message!: string;

  @Prop()
  from!: string;

  @Prop()
  to!: string;

  @Prop()
  type!: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
