require('dotenv').config();
const fs = require('fs');
const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔗 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!');

    console.log('📦 Reading SQL schema...');
    const sql = fs.readFileSync('./schema.sql', 'utf8');

    console.log('🚀 Creating tables...');
    await client.query(sql);
    console.log('✅ Tables created successfully!');

    console.log('\n🎉 Database setup complete!');
    console.log('\nNow you can:');
    console.log('1. Run: npm run db:seed (to add demo data)');
    console.log('2. Open: http://localhost:3000\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

setupDatabase();
