import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath = path.resolve('Dokumen/biroumroh.sqlite');
const db = new sqlite3.Database(dbPath);

const sql = fs.readFileSync(path.resolve('biroumroh.sql'), 'utf8');

db.exec(sql, (err) => {
  if (err) {
    console.error('Error initializing database:', err.message);
    process.exit(1);
  }
  console.log('Database initialized successfully.');
  db.close();
});
