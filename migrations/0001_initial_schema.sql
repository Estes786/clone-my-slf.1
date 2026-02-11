-- ============================================
-- GANI Database Schema - D1 SQLite
-- Filosofi: HYPHA Memory System
-- ============================================

-- Contacts Table - Multi-Role System
CREATE TABLE IF NOT EXISTS contacts (
  phone_number TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role_type TEXT NOT NULL CHECK (role_type IN ('BARBER', 'TEMAN', 'KELUARGA', 'CUSTOMER')),
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Conversations Table - Untuk tracking percakapan
CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone_number TEXT NOT NULL,
  role_type TEXT NOT NULL,
  message_in TEXT NOT NULL,
  message_out TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (phone_number) REFERENCES contacts(phone_number)
);

-- Barber Inventory Table - Khusus untuk Pak Khom
CREATE TABLE IF NOT EXISTS barber_inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_name TEXT NOT NULL,
  location TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_contacts_role ON contacts(role_type);
CREATE INDEX IF NOT EXISTS idx_conversations_phone ON conversations(phone_number);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp DESC);
