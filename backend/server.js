import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./Dokumen/biroumroh.sqlite');

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) return reject(err);
    resolve(this);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) return reject(err);
    resolve(rows);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) return reject(err);
    resolve(row);
  });
});

// ---------- Paket ----------
app.get('/paket', async (req, res) => {
  const rows = await all('SELECT * FROM pakets WHERE deleted = 0 ORDER BY id');
  res.json(rows);
});

app.post('/paket/baru', async (req, res) => {
  const { nama, tipe = 'umrah', durasi = 14, harga = 0 } = req.body;
  const id = uuidv4();
  await run('INSERT INTO pakets (id, nama, tipe, durasi, harga, deleted) VALUES (?, ?, ?, ?, ?, 0)', [id, nama, tipe, durasi, harga]);
  res.json({ id, nama, tipe, durasi, harga, deleted: 0 });
});

app.post('/paket/ubah', async (req, res) => {
  const { id, nama, tipe, durasi, harga } = req.body;
  await run('UPDATE pakets SET nama = ?, tipe = ?, durasi = ?, harga = ? WHERE id = ? AND deleted = 0', [nama, tipe, durasi, harga, id]);
  res.json({ success: true });
});

app.post('/paket/hapus', async (req, res) => {
  const { id } = req.body;
  await run('UPDATE pakets SET deleted = 1 WHERE id = ?', [id]);
  res.json({ success: true });
});

// ---------- Jamaah ----------
app.get('/jamaah/list', async (req, res) => {
  const rows = await all('SELECT * FROM jamaahs WHERE deleted = 0 ORDER BY id DESC LIMIT 100');
  res.json(rows);
});

app.post('/jamaah/baru', async (req, res) => {
  const { nama, tg_lahir, alamat, nomor_hp, status = 'prospect' } = req.body;
  const id = uuidv4();
  await run('INSERT INTO jamaahs (id, nama, tg_lahir, alamat, nomor_hp, status, deleted) VALUES (?, ?, ?, ?, ?, ?, 0)', [id, nama, tg_lahir, alamat, nomor_hp, status]);
  res.json({ id, nama, tg_lahir, alamat, nomor_hp, status, deleted: 0 });
});

app.get('/jamaah/info', async (req, res) => {
  const { uuid } = req.query;
  const row = await get('SELECT * FROM jamaahs WHERE id = ? AND deleted = 0', [uuid]);
  res.json(row);
});

app.post('/jamaah/ganti', async (req, res) => {
  const { id, nama, tg_lahir, alamat, nomor_hp, status } = req.body;
  await run('UPDATE jamaahs SET nama = ?, tg_lahir = ?, alamat = ?, nomor_hp = ?, status = ? WHERE id = ? AND deleted = 0', [nama, tg_lahir, alamat, nomor_hp, status, id]);
  res.json({ success: true });
});

app.post('/jamaah/batal', async (req, res) => {
  const { id } = req.body;
  await run('UPDATE jamaahs SET deleted = 1 WHERE id = ?', [id]);
  res.json({ success: true });
});

// ---------- Trip ----------
app.get('/trip/list', async (req, res) => {
  const rows = await all(`SELECT t.*, p.nama AS paket_nama FROM trips t LEFT JOIN pakets p ON t.paket_id = p.id WHERE t.deleted = 0 AND t.status = ? ORDER BY t.id DESC LIMIT 50`, ['waiting']);
  res.json(rows);
});

app.post('/trip/baru', async (req, res) => {
  const { nama_trip, paket_id, tanggal_pergi, quota = 0, status = 'waiting' } = req.body;
  const id = uuidv4();
  await run('INSERT INTO trips (id, nama_trip, paket_id, tanggal_pergi, quota, status, deleted) VALUES (?, ?, ?, ?, ?, ?, 0)', [id, nama_trip, paket_id, tanggal_pergi, quota, status]);
  res.json({ id, nama_trip, paket_id, tanggal_pergi, quota, status, deleted: 0 });
});

app.post('/trip/ganti', async (req, res) => {
  const { id, nama_trip, paket_id, tanggal_pergi, quota, status } = req.body;
  await run('UPDATE trips SET nama_trip = ?, paket_id = ?, tanggal_pergi = ?, quota = ?, status = ? WHERE id = ? AND deleted = 0', [nama_trip, paket_id, tanggal_pergi, quota, status, id]);
  res.json({ success: true });
});

app.post('/trip/batal', async (req, res) => {
  const { id } = req.body;
  await run('UPDATE trips SET deleted = 1 WHERE id = ?', [id]);
  res.json({ success: true });
});

// ---------- Registration ----------
app.get('/registration/list', async (req, res) => {
  const rows = await all(`SELECT r.*, t.nama_trip, p.nama AS paket_nama, j.nama AS jamaah_nama, j.alamat, j.nomor_hp
     FROM registrations r
     JOIN trips t ON r.trip_id = t.id
     JOIN pakets p ON t.paket_id = p.id
     JOIN jamaahs j ON r.jamaah_id = j.id
     WHERE r.deleted = 0
     ORDER BY r.id DESC`);
  res.json(rows);
});

app.post('/registration/baru', async (req, res) => {
  const { trip_id, jamaah_id, tanggal = new Date().toISOString().split('T')[0], payment_status = 'unpaid' } = req.body;
  const id = uuidv4();
  await run('INSERT INTO registrations (id, tanggal, trip_id, jamaah_id, payment_status, deleted) VALUES (?, ?, ?, ?, ?, 0)', [id, tanggal, trip_id, jamaah_id, payment_status]);
  res.json({ id, tanggal, trip_id, jamaah_id, payment_status, deleted: 0 });
});

app.post('/registration/batal', async (req, res) => {
  const { id } = req.body;
  await run('UPDATE registrations SET deleted = 1 WHERE id = ?', [id]);
  res.json({ success: true });
});

// ---------- Nomor pendaftaran helper ----------
async function nextNomorPendaftaran() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `${yy}${mm}`;
  const row = await get("SELECT COUNT(*) AS c FROM registrations WHERE nomor_pendaftaran LIKE ?", [`${prefix}-%`]);
  const xxx = String((row.c || 0) + 1).padStart(3, '0');
  return `${prefix}-${xxx}`;
}

// ---------- Registration list (for rombongan) ----------
app.get('/registration/list', async (req, res) => {  const { trip_id } = req.query;
  let sql = `SELECT r.id, r.nomor_pendaftaran, r.tanggal, r.trip_id, r.jamaah_id, r.payment_status, r.deleted,
                    t.nama_trip, p.nama AS paket_nama, p.harga,
                    j.nama AS jamaah_nama, j.alamat, j.nomor_hp
             FROM registrations r
             JOIN trips t ON r.trip_id = t.id
             JOIN pakets p ON t.paket_id = p.id
             JOIN jamaahs j ON r.jamaah_id = j.id
             WHERE r.deleted = 0`;
  const params = [];
  if (trip_id) {
    sql += ' AND r.trip_id = ?';
    params.push(trip_id);
  }
  sql += ' ORDER BY r.tanggal DESC, r.id DESC';
  const rows = await all(sql, params);
  res.json(rows);
});

// ---------- Registration invoice detail ----------
app.get('/registration/invoice/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const row = await get(`SELECT r.id, r.nomor_pendaftaran, r.tanggal, r.trip_id, r.jamaah_id, r.payment_status, r.deleted,
                    t.nama_trip, t.tanggal_pergi, p.nama AS paket_nama, p.harga,
                    j.nama AS jamaah_nama, j.alamat, j.nomor_hp
             FROM registrations r
             JOIN trips t ON r.trip_id = t.id
             JOIN pakets p ON t.paket_id = p.id
             JOIN jamaahs j ON r.jamaah_id = j.id
             WHERE r.id = ? AND r.deleted = 0`, [uuid]);
  res.json(row);
});

// ---------- Registration set paid ----------
app.post('/registration/paid/:nomor_pendaftaran', async (req, res) => {
  const { nomor_pendaftaran } = req.params;
  const { registration_id } = req.body;
  const targetId = registration_id || nomor_pendaftaran;
  const row = await get('SELECT id FROM registrations WHERE nomor_pendaftaran = ? AND deleted = 0', [nomor_pendaftaran]);
  if (!row) {
    return res.status(404).json({ error: 'Pendaftaran tidak ditemukan' });
  }
  await run('UPDATE registrations SET payment_status = ? WHERE id = ? AND deleted = 0', ['paid', row.id]);
  res.json({ success: true, id: row.id, payment_status: 'paid' });
});

// ---------- Rombongan baru ----------
app.post('/rombongan/baru', async (req, res) => {
  const { trip_id, jamaah_id, tanggal = new Date().toISOString().split('T')[0], payment_status = 'unpaid' } = req.body;
  const id = uuidv4();
  const nomor_pendaftaran = await nextNomorPendaftaran();
  await run('INSERT INTO registrations (id, nomor_pendaftaran, tanggal, trip_id, jamaah_id, payment_status, deleted) VALUES (?, ?, ?, ?, ?, ?, 0)', [id, nomor_pendaftaran, tanggal, trip_id, jamaah_id, payment_status]);
  res.json({ id, nomor_pendaftaran, tanggal, trip_id, jamaah_id, payment_status, deleted: 0 });
});

// ---------- Rombongan batal (soft delete multiple) ----------
app.post('/rombongan/batal', async (req, res) => {
  const { ids = [] } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids required' });
  }
  const placeholders = ids.map(() => '?').join(',');
  await run(`UPDATE registrations SET deleted = 1 WHERE id IN (${placeholders})`, ids);
  res.json({ success: true, deleted: ids.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
