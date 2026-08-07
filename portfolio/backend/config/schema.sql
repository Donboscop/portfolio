-- PostgreSQL Schema for Portfolio Database

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    otp VARCHAR(10),
    otp_expires TIMESTAMP WITH TIME ZONE,
    profile_pic VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technologies TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    github_url VARCHAR(500) DEFAULT '',
    demo_url VARCHAR(500) DEFAULT '',
    github_link VARCHAR(500) DEFAULT '',
    live_link VARCHAR(500) DEFAULT '',
    images TEXT[] DEFAULT '{}',
    image_url VARCHAR(500) DEFAULT '',
    featured BOOLEAN DEFAULT false,
    category VARCHAR(100) DEFAULT 'Web',
    features TEXT[] DEFAULT '{}',
    challenges_faced TEXT DEFAULT '',
    learning_outcomes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 80,
    icon VARCHAR(100) DEFAULT 'code',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date VARCHAR(100),
    date VARCHAR(100),
    credential_id VARCHAR(255),
    credential_url VARCHAR(500),
    verify_url VARCHAR(500),
    pdf_url VARCHAR(500),
    image_url VARCHAR(500),
    category VARCHAR(100) DEFAULT 'practical',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS milestones (
    id SERIAL PRIMARY KEY,
    year VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) DEFAULT '',
    description TEXT,
    icon VARCHAR(100) DEFAULT 'briefcase',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) DEFAULT 'visitors',
    value VARCHAR(100) DEFAULT '0',
    count INTEGER DEFAULT 0,
    icon VARCHAR(100) DEFAULT 'star',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
