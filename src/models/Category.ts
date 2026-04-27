import mongoose, { Schema, model, models } from 'mongoose';

export interface ICategory {
  name: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Category = models.Category || model('Category', CategorySchema);

export default Category;
