-- ============================================
-- GANI Seed Data - Initial Contacts
-- ============================================

-- Pak Khom (Barber)
INSERT OR IGNORE INTO contacts (phone_number, name, role_type, priority, notes) VALUES 
  ('6285643383832', 'Pak Khom', 'BARBER', 'HIGH', 'Mantan bos barber - pertanyaan seputar inventaris');

-- Barber Inventory - Data lokasi barang
INSERT OR IGNORE INTO barber_inventory (item_name, location, notes) VALUES 
  ('Pengaman Dada', 'Di gantungan dekat stopkontak atau di dalam lemari', 'Sering ditanyakan'),
  ('Lawak Cukur', 'Di gantungan dekat stopkontak', 'Check lemari jika tidak ada'),
  ('Alat Cukur', 'Di laci meja masing-masing', 'Tempat steril'),
  ('Silet', 'Di laci bawah meja nomor 2', 'Stock alert jika < 10'),
  ('Bedak', 'Di rak penyimpanan', 'Stock alert jika < 5');

-- Example teman/keluarga (bisa ditambah sesuai kebutuhan)
-- INSERT OR IGNORE INTO contacts (phone_number, name, role_type, priority, notes) VALUES 
--   ('628xxx', 'Nama Teman', 'TEMAN', 'LOW', 'Teman lama');
