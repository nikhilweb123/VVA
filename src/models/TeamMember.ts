import { Schema, model, models } from 'mongoose';

export interface ISocialLink {
  platform: string;
  url: string;
}

export interface ITeamMember {
  name: string;
  designation: string;
  image: string;
  description?: string;
  socialLinks: ISocialLink[];
  order: number;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        ret.id = (ret._id as object).toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const TeamMember = models.TeamMember || model('TeamMember', TeamMemberSchema);

export default TeamMember;
