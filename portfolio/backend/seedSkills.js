import pool, { initDB } from './config/db.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const skillList = [
  {
    name: 'React.js',
    category: 'frontend',
    level: 90,
    icon: 'code'
  },
  {
    name: 'Node.js',
    category: 'backend',
    level: 85,
    icon: 'server'
  },
  {
    name: 'Express.js',
    category: 'backend',
    level: 85,
    icon: 'cpu'
  },
  {
    name: 'MongoDB',
    category: 'database',
    level: 80,
    icon: 'database'
  },
  {
    name: 'PostgreSQL',
    category: 'database',
    level: 80,
    icon: 'database'
  },
  {
    name: 'AWS Cloud',
    category: 'database',
    level: 85,
    icon: 'cloud'
  },
  {
    name: 'Linux (Bash)',
    category: 'devops',
    level: 75,
    icon: 'terminal'
  },
  {
    name: 'Java',
    category: 'backend',
    level: 80,
    icon: 'code'
  },
  {
    name: 'Git & GitHub',
    category: 'devops',
    level: 85,
    icon: 'git-branch'
  }
];

async function seed() {
  console.log('Seeding Skills...');

  // 1. Seed MongoDB Atlas AWS if MONGO_URI exists
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      const SkillSchema = new mongoose.Schema({
        name: String,
        category: String,
        level: Number,
        icon: String
      }, { timestamps: true });

      const SkillModel = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);

      await SkillModel.deleteMany({});
      for (const item of skillList) {
        await SkillModel.create(item);
      }
      console.log('✅ MongoDB Atlas Skills Seeded Successfully!');
    } catch (err) {
      console.error('[MongoDB Error]:', err.message);
    }
  }

  // 2. Seed PostgreSQL Cloud Table
  try {
    await initDB();
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        level INTEGER DEFAULT 80,
        icon VARCHAR(100) DEFAULT 'code',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query('DELETE FROM skills');
    for (const item of skillList) {
      await pool.query(
        `INSERT INTO skills (name, category, level, icon) VALUES ($1, $2, $3, $4)`,
        [item.name, item.category, item.level, item.icon]
      );
    }
    console.log('✅ PostgreSQL Skills Seeded Successfully!');
  } catch (err) {
    console.error('[PostgreSQL Error]:', err.message);
  }

  console.log('Done!');
  process.exit(0);
}

seed();
