const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env or .env.local
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

// Define Schemas (simplified for seeding)
const ProjectSchema = new mongoose.Schema({
  title: String,
  location: String,
  category: String,
  year: String,
  src: String,
  description: String,
  featured: Boolean,
  client: String,
  area: String,
  challenge: String,
  solution: String,
  gallery: [String],
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
}, { timestamps: true });

const EnquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Seed Categories
    const categoriesPath = path.join(__dirname, 'src', 'data', 'categories.json');
    if (fs.existsSync(categoriesPath)) {
      const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
      console.log(`Found ${categoriesData.length} categories. Migrating...`);
      for (const cat of categoriesData) {
        await Category.findOneAndUpdate(
          { name: cat.name },
          { name: cat.name },
          { upsert: true, new: true }
        );
      }
      console.log('Categories migrated.');
    }

    // Seed Projects
    const projectsPath = path.join(__dirname, 'src', 'data', 'projects.json');
    if (fs.existsSync(projectsPath)) {
      const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
      console.log(`Found ${projectsData.length} projects. Migrating...`);
      for (const proj of projectsData) {
        const { id, ...projWithoutId } = proj;
        await Project.findOneAndUpdate(
          { title: proj.title },
          projWithoutId,
          { upsert: true, new: true }
        );
      }
      console.log('Projects migrated.');
    }

    // Seed Enquiries
    const enquiriesPath = path.join(__dirname, 'src', 'data', 'enquiries.json');
    if (fs.existsSync(enquiriesPath)) {
      const enquiriesData = JSON.parse(fs.readFileSync(enquiriesPath, 'utf8'));
      console.log(`Found ${enquiriesData.length} enquiries. Migrating...`);
      for (const enq of enquiriesData) {
        const { id, ...enqWithoutId } = enq;
        await Enquiry.create(enqWithoutId);
      }
      console.log('Enquiries migrated.');
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
