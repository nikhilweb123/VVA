import mongoose, { Schema, model, models } from 'mongoose';

export interface IService {
  title: string;
  description: string;
  category: string;
  order?: number;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Service = models.Service || model('Service', ServiceSchema);

export default Service;
