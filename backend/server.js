import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Skill from './models/Skill.js';
import Milestone from './models/Milestone.js';

// Load route files
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import statsRoutes from './routes/stats.js';
import messageRoutes from './routes/messages.js';
import certificationRoutes from './routes/certifications.js';
import skillsRoutes from './routes/skills.js';
import milestoneRoutes from './routes/milestones.js';
import Certificate from './models/Certificate.js';
import fs from 'fs';
import mongoose from 'mongoose';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to find .env in backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Backend server is running.' }));

// Database connection validation middleware
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database connection is offline. Please ensure MONGO_URI environment variable is configured correctly on Render and pointing to MongoDB Atlas.' 
    });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/milestones', milestoneRoutes);

// Serve Frontend Static Build in Production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // Base route for API check in development
  app.get('/', (req, res) => {
    res.json({ message: 'Developer Portfolio API is running...' });
  });
}

// Seed admin user on start if not already existing
const seedAdmin = async () => {
  try {
    const targetEmail = 'donboscop24@gmail.com';
    const userExists = await User.findOne({ email: targetEmail });
    
    if (!userExists) {
      // Clear out the default admin user if it exists
      await User.deleteMany({ email: 'admin@developer.com' });
      
      const admin = new User({
        email: targetEmail,
        password: 'AdminSecurePass123!'
      });
      await admin.save();
      console.log('\n======================================================');
      console.log('  ADMIN USER SEEDED/UPDATED IN DATABASE');
      console.log(`  Email:    ${targetEmail}`);
      console.log('  Password: AdminSecurePass123!');
      console.log('======================================================\n');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

// Seed default projects if database is empty
const seedProjects = async () => {
  try {
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const defaultProjects = [
        {
          title: 'Profile Cards Display',
          description: 'Developed a responsive web app that displays user profile cards with details like name, image, and contact info. Implemented dynamic rendering and search/filter functionality using React components.',
          technologies: ['React.js', 'HTML5', 'CSS3', 'JavaScript'],
          githubLink: 'https://github.com/don-bosco-29a4b52aa/profile-cards-display',
          liveLink: 'https://profile-cards.donboscop.dev',
          features: ['Dynamic rendering', 'Search and filter components', 'Responsive card grids', 'Clean modular design'],
          challengesFaced: 'Managing multi-field dynamic search state cleanly without lag in typing input rendering.',
          learningOutcomes: 'Mastered React state reconciliation, components modularity, and custom filtering algorithms.'
        },
        {
          title: 'Contact Keeper',
          description: 'Built a personal contact management system built with MongoDB, Express.js, React.js, and Node.js. Allows users to securely store, add, edit, and delete contacts with authentication and cloud-based data storage.',
          technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
          githubLink: 'https://github.com/don-bosco-29a4b52aa/contact-keeper',
          liveLink: 'https://contact-keeper.donboscop.dev',
          features: ['Encrypted JWT authentication session', 'CRUD operations on personal contact records', 'Cloud data synchronization', 'Secure password storage using bcryptjs'],
          challengesFaced: 'Securing API endpoints using a custom headers middleware and protecting React routes on the client.',
          learningOutcomes: 'Solidified knowledge of REST architectures, Mongoose validations, and token authentication life cycles.'
        },
        {
          title: 'Notes Vault',
          description: 'Built a secure note-taking web application built using the MERN stack. Features include encrypted note storage, CRUD operations, user authentication, and a clean, mobile-friendly interface.',
          technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
          githubLink: 'https://github.com/don-bosco-29a4b52aa/notes-vault',
          liveLink: 'https://notes-vault.donboscop.dev',
          features: ['Encrypted notes storage', 'CRUD notes management', 'Tailwind responsive glassmorphic interfaces', 'Protected admin access'],
          challengesFaced: 'Structuring clean data schemas that support both text payloads and categorization tags efficiently.',
          learningOutcomes: 'Learned Tailwind responsive design protocols, MongoDB aggregate lookups, and state synchronization.'
        }
      ];
      await Project.insertMany(defaultProjects);
      console.log('Default projects seeded successfully in MongoDB!');
    }
  } catch (error) {
    console.error('Error seeding projects:', error.message);
  }
};
// Seed default certifications if database is empty
const seedCertificates = async () => {
  try {
    const certCount = await Certificate.countDocuments();
    if (certCount === 0) {
      const srcDir = path.join(__dirname, '..', 'frontend', 'src', 'assets', 'certificate');
      const destDir = path.join(__dirname, 'uploads');
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const defaultCerts = [
        {
          title: 'Full Stack Development Certification',
          issuer: 'NoviTech R&D Private Limited',
          date: 'June 2025',
          credentialId: 'NOV-FS-2025',
          verifyUrl: 'https://novitech.in',
          fileName: 'novitech Full Stack .pdf',
          category: 'practical',
          description: '30-day intensive training in full-stack MERN technologies, including backend API design, database schemas, and responsive UI components.'
        },
        {
          title: 'Web Development Training Certification',
          issuer: 'ILINKS Infotech',
          date: 'July 2025',
          credentialId: 'IL-WD-2025',
          verifyUrl: 'https://ilinksinfotech.com',
          fileName: 'web ilinks.pdf',
          category: 'practical',
          description: 'Acquired practical training in responsive frontend designs, interactive UI development, and debugging real-time web application components.'
        },
        {
          title: 'Web Development Internship Certification',
          issuer: 'EdiGlobe',
          date: 'August 2024',
          credentialId: 'EG-WD-2024',
          verifyUrl: 'https://ediglobe.com',
          fileName: 'Edeglobe Web.pdf',
          category: 'practical',
          description: 'Two-month internship developing web templates and testing responsive, cross-platform layouts using HTML, CSS, JavaScript, and Bootstrap.'
        },
        {
          title: 'Java Foundations Professional Certificate',
          issuer: 'LinkedIn Learning & JetBrains',
          date: 'June 2025',
          credentialId: 'LI-JFP-2025',
          verifyUrl: 'https://linkedin.com',
          fileName: 'CertificateOfCompletion_Java Foundations Professional Certificate by JetBrains.pdf',
          category: 'linkedIn',
          description: 'Verified professional level study of Java foundations, object-oriented concepts, syntax, structure, and basic algorithms partnered with JetBrains.'
        },
        {
          title: 'Java Object-Oriented Programming',
          issuer: 'LinkedIn Learning',
          date: 'May 2025',
          credentialId: 'LI-OOP-8821',
          verifyUrl: 'https://linkedin.com',
          fileName: 'CertificateOfCompletion_Java ObjectOriented Programming.pdf',
          category: 'linkedIn',
          description: 'Covers major Object-Oriented Programming concepts in Java including inheritance, polymorphism, interfaces, and solid design principles.'
        },
        {
          title: 'Java Data Structures',
          issuer: 'LinkedIn Learning',
          date: 'June 2025',
          credentialId: 'LI-JDS-2025',
          verifyUrl: 'https://linkedin.com',
          fileName: 'CertificateOfCompletion_Java Data Structures.pdf',
          category: 'linkedIn',
          description: 'Detailed study and implementation of foundational computer science data structures (arrays, lists, stacks, queues, trees, maps) in Java.'
        },
        {
          title: 'Java Essential Training: Objects and APIs',
          issuer: 'LinkedIn Learning',
          date: 'May 2025',
          credentialId: 'LI-JOA-2025',
          verifyUrl: 'https://linkedin.com',
          fileName: 'CertificateOfCompletion_Java Essential Training Objects and APIs.pdf',
          category: 'linkedIn',
          description: 'Focuses on working with Java APIs, standard libraries, collection frameworks, input/output channels, and custom exceptions.'
        },
        {
          title: 'Java Essential Training: Syntax and Structure',
          issuer: 'LinkedIn Learning',
          date: 'May 2025',
          credentialId: 'LI-JSS-2025',
          verifyUrl: 'https://linkedin.com',
          fileName: 'CertificateOfCompletion_Java Essential Training Syntax and Structure.pdf',
          category: 'linkedIn',
          description: 'Covers basic Java syntax, primitives, control flows, loops, writing functions, and understanding compilation and packages.'
        }
      ];

      const seedData = [];

      for (const cert of defaultCerts) {
        const srcPath = path.join(srcDir, cert.fileName);
        const cleanFileName = cert.fileName.replace(/\s+/g, '_');
        const destPath = path.join(destDir, cleanFileName);

        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied certificate file: ${cert.fileName} -> ${cleanFileName}`);
        } else {
          console.warn(`Warning: Static certificate file not found at ${srcPath}`);
        }

        seedData.push({
          title: cert.title,
          issuer: cert.issuer,
          date: cert.date,
          credentialId: cert.credentialId,
          verifyUrl: cert.verifyUrl,
          pdfUrl: `/uploads/${cleanFileName}`,
          category: cert.category,
          description: cert.description
        });
      }

      await Certificate.insertMany(seedData);
      console.log('Default certificates seeded successfully in MongoDB!');
    }
  } catch (error) {
    console.error('Error seeding certificates:', error.message);
  }
};

const PORT = process.env.PORT || 5000;

// Seed default skills if database is empty
const seedSkills = async () => {
  try {
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const defaultSkills = [
        // Frontend
        { name: 'React.js', level: 90, category: 'frontend' },
        { name: 'JavaScript (ES6+)', level: 95, category: 'frontend' },
        { name: 'HTML5 / CSS3', level: 95, category: 'frontend' },
        { name: 'Tailwind CSS', level: 90, category: 'frontend' },
        { name: 'Redux Toolkit', level: 80, category: 'frontend' },
        { name: 'TypeScript', level: 85, category: 'frontend' },
        // Backend
        { name: 'Node.js', level: 85, category: 'backend' },
        { name: 'Express.js', level: 90, category: 'backend' },
        { name: 'Java (OOP)', level: 80, category: 'backend' },
        { name: 'REST APIs', level: 95, category: 'backend' },
        { name: 'JWT Authentication', level: 90, category: 'backend' },
        { name: 'GraphQL', level: 70, category: 'backend' },
        // Database
        { name: 'MongoDB / Mongoose', level: 88, category: 'database' },
        { name: 'MySQL', level: 75, category: 'database' },
        { name: 'PostgreSQL', level: 80, category: 'database' },
        { name: 'Redis', level: 65, category: 'database' },
        // DevOps / Tools
        { name: 'Git / GitHub', level: 92, category: 'devops' },
        { name: 'Docker', level: 75, category: 'devops' },
        { name: 'Vite / Webpack', level: 85, category: 'devops' },
        { name: 'AWS (S3, EC2)', level: 70, category: 'devops' },
        { name: 'Postman', level: 90, category: 'devops' }
      ];
      await Skill.insertMany(defaultSkills);
      console.log('Default skills seeded successfully in MongoDB!');
    }
  } catch (error) {
    console.error('Error seeding skills:', error.message);
  }
};

// Seed default milestones if database is empty
const seedMilestones = async () => {
  try {
    const milestoneCount = await Milestone.countDocuments();
    if (milestoneCount === 0) {
      const defaultMilestones = [
        {
          year: 'July 2025',
          title: 'Web Development Trainee',
          company: 'ILINKS Infotech',
          description: 'Gained hands-on experience in responsive web development, interactive UI design, frontend debugging, and real-time project implementation.'
        },
        {
          year: 'June 2025',
          title: 'Full Stack Masterclass Trainee',
          company: 'NoviTech R&D Private Limited',
          description: 'Built dynamic full-stack web applications with REST API integration, responsive UI components, and database connectivity.'
        },
        {
          year: '2024 (2 Months)',
          title: 'Web Development Intern',
          company: 'EdiGlobe',
          description: 'Developed responsive and user-friendly web pages using HTML, CSS, JavaScript, and Bootstrap, while improving frontend performance.'
        },
        {
          year: '2022 - 2026',
          title: 'B.Tech in Information Technology',
          company: 'UCE (BIT Campus), Anna University',
          description: 'Pursuing degree with focus on database systems, data structures, and web technologies. Cumulative GPA: 7.75/10.'
        }
      ];
      await Milestone.insertMany(defaultMilestones);
      console.log('Default milestones seeded successfully in MongoDB!');
    }
  } catch (error) {
    console.error('Error seeding milestones:', error.message);
  }
};

// Initialize database connection and seeding
const startServer = async () => {
  try {
    await connectDB();
    // Run seed checks
    await seedAdmin();
    await seedProjects();
    await seedCertificates();
    await seedSkills();
    await seedMilestones();
  } catch (err) {
    console.error('Failed to initialize server and database:', err.message);
  }
};

// Start DB connection & seeding immediately
startServer();

// Listen on port only in local development (not under Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in development/local mode on port ${PORT}`);
  });
}

export default app;
