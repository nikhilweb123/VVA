import mongoose, { Schema, model, models } from 'mongoose';

export interface IProject {
  title: string;
  location: string;
  category: string;
  year: string;
  src: string;
  description: string;
  featured: boolean;
  client?: string;
  area?: string;
  challenge?: string;
  solution?: string;
  gallery: string[];
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    year: { type: String, required: true },
    src: { type: String, required: true },
    description: { type: String, required: true },
    featured: { type: Boolean, default: false },
    client: { type: String },
    area: { type: String },
    challenge: { type: String },
    solution: { type: String },
    gallery: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
