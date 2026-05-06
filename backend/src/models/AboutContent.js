const mongoose = require('mongoose')

const TimelineEventSchema = new mongoose.Schema({
  year: { type: String, required: true },
  event: { type: String, required: true },
})

const AboutContentSchema = new mongoose.Schema(
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
      transform: (_doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
      },
    },
  }
)

module.exports = mongoose.model('AboutContent', AboutContentSchema)
