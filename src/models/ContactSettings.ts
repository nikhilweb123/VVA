import { Schema, model, models } from 'mongoose';

export interface IContactSettings {
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  recipientEmail: string;
}

const ContactSettingsSchema = new Schema<IContactSettings>(
  {
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    recipientEmail: { type: String, default: '' },
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

const ContactSettings =
  models.ContactSettings || model('ContactSettings', ContactSettingsSchema);

export default ContactSettings;
