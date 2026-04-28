import { Schema, model, models } from 'mongoose';

export interface IEnquiry {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
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

const Enquiry = models.Enquiry || model('Enquiry', EnquirySchema);

export default Enquiry;
