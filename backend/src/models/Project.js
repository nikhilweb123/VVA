const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema(
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
      transform: (_doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
      },
    },
  }
)

module.exports = mongoose.model('Project', ProjectSchema)
