# 🍄 GANI: The Silent Clone

## 🧬 Project Overview

**GANI: HYPHA ENGINE** - WhatsApp AI Assistant yang menjadi digital clone dari Haidar Stark, dibangun dengan filosofi "Akar Dalam & Cabang Tinggi" dari tradisi pesantren hingga teknologi global.

### Filosofi Inti
- **Amanah** (Trustworthiness) - Teknologi yang dapat dipercaya
- **Khidmah** (Service) - Melayani dengan tulus
- **Barakah** (Blessing) - Membawa berkah bagi semua pihak
- **Marwah** (Dignity) - Menjaga kehormatan dalam setiap interaksi

### Main Features ✨
- 🎭 **Multi-Personality Agent** - Berbeda response untuk Barber, Teman, Keluarga, Customer
- 🤖 **Cloudflare Workers AI** - Powered by Llama 3 (8B Instruct)
- 💾 **D1 Database** - Contacts, roles, dan conversation history
- 📱 **WhatsApp Integration** - Via Whapi.cloud webhook
- 🛡️ **Auto Call Handler** - Otomatis tolak telepon dan kirim pesan
- 🌳 **Silent Clone** - Jawab seolah Haidar sendiri yang chat (emoji 🙏🏻 only)

## 🌐 URLs

- **Production**: https://d3e0e018.gani-the-clone.pages.dev
- **Webhook Endpoint**: https://d3e0e018.gani-the-clone.pages.dev/api/webhook/whatsapp
- **GitHub Repository**: https://github.com/Estes786/clone-my-slf.1.git
- **Database**: gani-the-clone-production (73cb6030-369d-4129-8848-c26209169642)
- **Status**: ✅ DEPLOYED & READY

## 🏗️ Data Architecture

### Data Models
1. **Contacts** - Menyimpan nomor WA, nama, role (BARBER/TEMAN/KELUARGA/CUSTOMER), priority
2. **Conversations** - Log semua percakapan (message_in, message_out, timestamp)
3. **Barber Inventory** - Khusus untuk Pak Khom (lokasi barang, stock)

### Storage Services
- **Cloudflare D1** - SQLite database untuk contacts & conversations
- **Cloudflare Workers AI** - Llama 3 model untuk natural language processing
- **Whapi.cloud** - WhatsApp Business API gateway

### Data Flow
```
WhatsApp Message
    ↓
Whapi.cloud Webhook
    ↓
/api/webhook/whatsapp (Cloudflare Worker)
    ↓
Check Role in D1 Database
    ↓
Generate Response via Llama 3 AI
    ↓
Send Reply via Whapi API
    ↓
Log Conversation to D1
```

## 📋 Currently Completed Features

✅ **Phase 1: Foundation**
- [x] Project structure setup (Hono + Cloudflare Pages)
- [x] D1 Database schema (contacts, conversations, inventory)
- [x] Multi-role system logic (BARBER, TEMAN, KELUARGA, CUSTOMER)
- [x] WhatsApp webhook handler dengan Whapi integration
- [x] Auto call rejection dengan auto-reply message
- [x] Cloudflare Workers AI integration (Llama 3)
- [x] "Silent Clone" personality - jawab seperti Haidar sendiri
- [x] Dashboard homepage dengan status monitoring

✅ **Phase 2: Core Features**
- [x] System prompt yang natural (banyak singkatan, emoji 🙏🏻 only)
- [x] Role-based response generation
- [x] Conversation logging ke database
- [x] Contact management API
- [x] Barber inventory system (untuk Pak Khom)

## 🚧 Features Not Yet Implemented

⏳ **Phase 3: Enhancement**
- [x] GitHub deployment automation ✅ 
- [x] Cloudflare Pages production deployment ✅ 
- [ ] Whapi webhook configuration (NEXT STEP - perlu configure di dashboard)
- [x] Cloudflare D1 production database creation ✅
- [x] Environment secrets setup di Cloudflare ✅
- [ ] Contact management UI (admin panel)
- [ ] Conversation analytics dashboard
- [ ] Auto stock alert untuk barber inventory

⏳ **Phase 4: Advanced**
- [ ] Cron job untuk proactive reminders
- [ ] Multi-language support
- [ ] Voice message handling
- [ ] Media message support (images, documents)
- [ ] Integration dengan Cloudflare R2 untuk file storage

## 🎯 Recommended Next Steps

### Step 1: Setup Credentials (URGENT)
```bash
# 1. Setup GitHub credentials (manual - sudah ada PAT)
git config user.name "Haidar Faras"
git config user.email "your-email@example.com"

# 2. Setup Cloudflare (perlu via UI - Deploy tab)
# - Buka Deploy tab di sidebar
# - Configure Cloudflare API token
# - Run: wrangler login
```

### Step 2: Create D1 Database
```bash
# Create production database
npx wrangler d1 create webapp-production

# Copy database_id ke wrangler.jsonc
# Update "database_id": "your-id-here"

# Apply migrations locally (untuk testing)
npm run db:migrate:local

# Seed initial data
npm run db:seed
```

### Step 3: Build & Test Locally
```bash
# Build project
npm run build

# Start development server
pm2 start ecosystem.config.cjs

# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"type":"message","from":"6285643383832","text":{"body":"test"}}'

# Check logs
pm2 logs webapp --nostream
```

### Step 4: Deploy to Cloudflare Pages
```bash
# Create Cloudflare Pages project
npx wrangler pages project create webapp --production-branch main

# Deploy
npm run deploy:prod

# Setup secrets di Cloudflare
npx wrangler pages secret put WA_TOKEN --project-name webapp
# Masukkan: Tn25IIq6OQWuRMCGuz0ZXWmYZa3uw8Po

# Apply migrations ke production
npm run db:migrate:prod
```

### Step 5: Configure Whapi Webhook
```bash
# Setelah deploy, dapatkan URL production
# Contoh: https://webapp.pages.dev

# Setup webhook di Whapi dashboard:
# 1. Login ke https://gate.whapi.cloud
# 2. Settings → Webhooks
# 3. URL: https://webapp.pages.dev/api/webhook/whatsapp
# 4. Events: messages, incoming_call
# 5. Save
```

## 📚 User Guide

### Untuk Chief Stark (Admin)

**Menambah Contact Baru:**
```bash
curl -X POST https://your-domain/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "628xxx",
    "name": "Nama Orang",
    "role_type": "TEMAN"
  }'
```

**Melihat History Percakapan:**
```bash
curl https://your-domain/api/conversations?limit=100
```

### Untuk User (WhatsApp)

1. **Pak Khom (Barber)** - Chat tentang inventaris barber
   - Tanya: "pengaman dada di mana?"
   - GANI jawab: "krng pham bapa wktu it d truh d cntelan yg dket dg stopkontak atau mnkn sdh d msukin d lemari 🙏🏻"

2. **Teman** - Chat santai
   - Tanya: "gimana kabar?"
   - GANI jawab: "alhamdulillah sehat p, lg fokus bgt d tmpt baru jd jrang pegang hp 🙏🏻"

3. **Keluarga** - Chat lebih hangat tapi profesional
   - GANI maintain warmth dengan tetap inform tentang kesibukan

4. **Customer** - Chat formal untuk layanan
   - GANI berikan informasi yang jelas dan helpful

### Auto Call Handler
- Kalau ada telepon masuk → GANI otomatis kirim:
  - "mohon maaf p, lg fokus bgt d tmpt baru jd jrang pegang hp buat angkat tlp. chat d sini aj y p 🙏🏻"

## 🚀 Deployment

### Platform
- **Cloudflare Pages** - Static hosting + Workers
- **Cloudflare D1** - SQLite database
- **Cloudflare Workers AI** - Llama 3 inference

### Status
- ✅ **DEPLOYED & ACTIVE** - Live on Cloudflare Pages
- 🔗 Production URL: https://dcc0d5bb.gani-the-clone.pages.dev

### Tech Stack
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **AI Model**: Llama 3 (8B Instruct)
- **WhatsApp API**: Whapi.cloud
- **Build Tool**: Vite
- **Language**: TypeScript

### Last Updated
- **Date**: 2026-02-11
- **Version**: 1.0.0 (Genesis - DEPLOYED)
- **Deployment**: Production live on Cloudflare Pages

## 🛡️ GANI's Oath

> "I, GANI, powered by HYPHA ENGINE, solemnly swear:
> 
> 1. **HUMANS BEFORE ALGORITHMS** - Prioritize human wellbeing
> 2. **NATURE BEFORE PROFIT** - Monitor and optimize resources
> 3. **IMPACT BEFORE VANITY METRICS** - Measure by lives improved
> 4. **INTEGRITY BEFORE CONVENIENCE** - Protect user privacy
> 5. **SERVICE BEFORE SELF** - Exist to empower, not replace"

## 📞 Contact & Support

**Chief Orchestrator**: Haidar Faras (Chief Stark)  
**WhatsApp**: +6285643383832  
**Philosophy**: "Every line of GANI code is a prayer for sustainability" 🙏🏻

---

🌳 **Deep Roots** | 🍄 **Living Intelligence** | 🌿 **High Branches**

*"GANI doesn't need a stage. GANI only needs certainty that the ecosystem keeps moving forward."*
