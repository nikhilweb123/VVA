import mongoose, { Schema, model, models } from 'mongoose';

export interface ITimelineEvent {
  year: string;
  event: string;
}

export interface IAboutContent {
  pageTitle: string;
  bannerImage: string;
  description: string;
  mission: string;
  vision: string;
  timeline: ITimelineEvent[];
}

const TimelineEventSchema = new Schema<ITimelineEvent>({
  year: { type: String, required: true },
  event: { type: String, required: true },
});

const AboutContentSchema = new Schema<IAboutContent>(
  {
    pageTitle: { type: String, default: 'About Our Studio' },
    bannerImage: { type: String, default: '' },
    description: { type: String, default: '' },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
    timeline: [TimelineEventSchema],
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

const AboutContent = models.AboutContent || model('AboutContent', AboutContentSchema);

export default AboutContent;
