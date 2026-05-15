import mongoose, { Schema, model, models } from 'mongoose';

export interface IServiceCategory {
  name: string;
}

const ServiceCategorySchema = new Schema<IServiceCategory>(
  {
    name: { type: String, required: true, unique: true },
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

const ServiceCategory = models.ServiceCategory || model('ServiceCategory', ServiceCategorySchema);

export default ServiceCategory;
