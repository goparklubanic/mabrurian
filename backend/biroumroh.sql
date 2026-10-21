-- Biroumroh Database Schema (SQLite)
-- Source: Dokumen/001-paket.md, 002-jamaah.md, 003-schedule.md, 004-rombongan.md

DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS jamaahs;
DROP TABLE IF EXISTS pakets;

CREATE TABLE pakets (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    tipe TEXT DEFAULT 'umrah' NOT NULL CHECK (tipe IN ('haji', 'umrah')),
    durasi INTEGER DEFAULT 14 NOT NULL,
    harga INTEGER DEFAULT 0 NOT NULL,
    deleted INTEGER DEFAULT 0 NOT NULL CHECK (deleted IN (0, 1))
);

CREATE TABLE jamaahs (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    tg_lahir TEXT NOT NULL,
    alamat TEXT NOT NULL,
    nomor_hp TEXT NOT NULL,
    status TEXT DEFAULT 'prospect' NOT NULL CHECK (status IN ('prospect', 'registered')),
    deleted INTEGER DEFAULT 0 NOT NULL CHECK (deleted IN (0, 1))
);

CREATE TABLE trips (
    id TEXT PRIMARY KEY,
    nama_trip TEXT NOT NULL,
    paket_id TEXT REFERENCES pakets(id),
    tanggal_pergi TEXT NOT NULL,
    quota INTEGER DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'waiting' NOT NULL CHECK (status IN ('waiting', 'departed', 'canceled')),
    deleted INTEGER DEFAULT 0 NOT NULL CHECK (deleted IN (0, 1))
);

CREATE TABLE registrations (
    id TEXT PRIMARY KEY,
    nomor_pendaftaran TEXT UNIQUE NOT NULL,
    tanggal TEXT DEFAULT (date('now')) NOT NULL,
    trip_id TEXT REFERENCES trips(id) NOT NULL,
    jamaah_id TEXT REFERENCES jamaahs(id) NOT NULL,
    payment_status TEXT DEFAULT 'unpaid' NOT NULL CHECK (payment_status IN ('unpaid', 'paid')),
    deleted INTEGER DEFAULT 0 NOT NULL CHECK (deleted IN (0, 1))
);
