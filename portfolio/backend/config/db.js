import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import dns from 'dns';

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PG_URI;

let poolConfig = {
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  keepAlive: true
};

if (connectionString) {
  const isCloud = connectionString.includes('neon.tech') || connectionString.includes('amazonaws.com') || connectionString.includes('supabase.co');
  poolConfig = {
    ...poolConfig,
    connectionString,
    ssl: isCloud || process.env.PGSSLMODE === 'require' || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
} else {
  const host = process.env.PGHOST || process.env.DB_HOST || 'localhost';
  const isCloudHost = host.includes('neon.tech') || host.includes('amazonaws.com') || host.includes('supabase.co');
  poolConfig = {
    ...poolConfig,
    host,
    port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432', 10),
    user: process.env.PGUSER || process.env.DB_USER || 'postgres',
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
    database: process.env.PGDATABASE || process.env.DB_NAME || 'neondb',
    ssl: isCloudHost || process.env.PGSSLMODE === 'require' || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.warn('PostgreSQL idle pool socket error:', err.message);
});

let isInitialized = false;

export const initDB = async () => {
  if (isInitialized) return true;
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('PostgreSQL Database schema verified.');
    }
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Error initializing PostgreSQL schema:', error.message);
    return false;
  }
};

export const query = (text, params) => pool.query(text, params);

export default pool;
