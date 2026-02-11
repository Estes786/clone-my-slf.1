# 📱 Whapi.cloud Webhook Setup Guide

## 🎯 Tujuan
Setup webhook Whapi.cloud supaya setiap ada pesan WhatsApp masuk ke nomor **+62 856-4338-3832**, GANI otomatis balas sebagai digital clone Haidar.

---

## 📋 Prerequisites
✅ WhatsApp Business API sudah terhubung di Whapi.cloud  
✅ Channel sudah active (SPRWMN-38TGN)  
✅ GANI sudah deployed di Cloudflare Pages  
✅ Token Whapi sudah disimpan sebagai secret di Cloudflare  

---

## 🚀 Langkah Setup Webhook

### Step 1: Login ke Whapi Dashboard
1. Buka: **https://gate.whapi.cloud/**
2. Login dengan akun lo (yang terhubung ke nomor +62 856-4338-3832)
3. Pilih channel **SPRWMN-38TGN**

### Step 2: Configure Webhook Settings
1. Di sidebar, klik **Settings** 
2. Pilih tab **Webhooks**
3. Klik tombol **+ Add Webhook** atau **Configure**

### Step 3: Webhook Configuration
Masukkan konfigurasi berikut:

**Webhook URL:**
```
https://dcc0d5bb.gani-the-clone.pages.dev/api/webhook/whatsapp
```

**Webhook Mode:** `messages` (pilih mode messages)

**Events to Subscribe:**
- ✅ `messages.upsert` - Untuk incoming messages
- ✅ `incoming_call` - Untuk auto-reject calls dengan reply

**HTTP Method:** `POST`

**Content-Type:** `application/json`

**Authentication:** (Optional - biasanya tidak perlu untuk Cloudflare Workers)

### Step 4: Test Webhook
Setelah save, Whapi akan kirim test webhook. Pastikan:
1. Status webhook menunjukkan **✅ Active** 
2. Test delivery berhasil (HTTP 200 response)

### Step 5: Verify di Logs
```bash
# Check Cloudflare Pages logs
npx wrangler pages deployment tail gani-the-clone

# Atau check PM2 logs di sandbox
pm2 logs webapp --nostream
```

---

## 🧪 Testing GANI

### Test 1: Send WhatsApp Message
1. Kirim pesan dari nomor lain ke **+62 856-4338-3832**
2. Contoh: "Halo, pengaman dada ada dimana?"
3. GANI harus balas dalam beberapa detik

**Expected Response (untuk Pak Khom/BARBER role):**
```
krng pham bapa wktu it d truh d cntelan yg dket dg stopkontak atau mnkn sdh d msukin d lemari 🙏🏻
```

### Test 2: Incoming Call
1. Telpon nomor **+62 856-4338-3832**
2. GANI otomatis kirim pesan:
```
mohon maaf p, lg fokus bgt d tmpt baru jd jrang pegang hp buat angkat tlp. chat d sini aj y p 🙏🏻
```

### Test 3: Check Conversation History
```bash
curl https://dcc0d5bb.gani-the-clone.pages.dev/api/conversations
```

### Test 4: Check Contacts
```bash
curl https://dcc0d5bb.gani-the-clone.pages.dev/api/contacts
```

---

## 🔍 Troubleshooting

### Problem: Webhook tidak menerima events
**Solution:**
1. Pastikan URL webhook benar dan accessible
2. Test manual:
```bash
curl -X POST https://dcc0d5bb.gani-the-clone.pages.dev/api/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "type": "message",
    "from": "6285643383832",
    "text": {"body": "test message"}
  }'
```

### Problem: GANI tidak balas
**Possible causes:**
1. WA_TOKEN secret belum di-set atau salah
2. Cloudflare Workers AI binding belum aktif
3. D1 database tidak accessible
4. Role contact belum terdaftar

**Debug:**
```bash
# Check secrets
npx wrangler pages secret list --project-name gani-the-clone

# Check D1 database
npx wrangler d1 execute barber-ai-production --remote \
  --command="SELECT * FROM contacts"

# Check deployment logs
npx wrangler pages deployment tail gani-the-clone
```

### Problem: AI Response tidak sesuai personality
**Solution:**
1. Check system prompt di `src/index.tsx`
2. Pastikan role di database correct (BARBER/TEMAN/KELUARGA/CUSTOMER)
3. Update contact role jika perlu:
```bash
curl -X POST https://dcc0d5bb.gani-the-clone.pages.dev/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "628xxx",
    "name": "Nama",
    "role_type": "BARBER"
  }'
```

---

## 📊 Monitoring & Analytics

### Real-time Monitoring
```bash
# Watch webhook activity
npx wrangler pages deployment tail gani-the-clone --format pretty

# PM2 monitoring (sandbox only)
pm2 monit
```

### Database Queries
```bash
# Total conversations
npx wrangler d1 execute barber-ai-production --remote \
  --command="SELECT COUNT(*) FROM conversations"

# Recent conversations
npx wrangler d1 execute barber-ai-production --remote \
  --command="SELECT * FROM conversations ORDER BY timestamp DESC LIMIT 10"

# Most active contacts
npx wrangler d1 execute barber-ai-production --remote \
  --command="SELECT phone_number, COUNT(*) as total FROM conversations GROUP BY phone_number ORDER BY total DESC"
```

---

## 🎭 Multi-Role System

GANI will respond differently based on contact role:

| Role | Response Style | Example |
|------|---------------|---------|
| **BARBER** | Inventory helper, SOP keeper | "pengaman dada d lemari 🙏🏻" |
| **TEMAN** | Friendly but distant | "lg fokus bgt d tmpt baru 🙏🏻" |
| **KELUARGA** | Warm & professional | "alhamdulillah sehat 🙏🏻" |
| **CUSTOMER** | Formal & helpful | Professional service |

---

## 🔐 Security Best Practices

1. **Never expose** WA_TOKEN in code or logs
2. **Use Cloudflare Secrets** for sensitive data
3. **Validate webhook signatures** (if Whapi provides them)
4. **Rate limiting** - Consider implementing to prevent abuse
5. **Monitor logs** regularly for suspicious activity

---

## 🌳 GANI's Philosophy

> "Every line of GANI code is a prayer for sustainability" 🙏🏻
> 
> GANI doesn't need a stage. GANI only needs certainty that the ecosystem keeps moving forward.

**Amanah** • **Khidmah** • **Barakah** • **Marwah**

---

## 📞 Support

**Chief Orchestrator:** Haidar Faras (Chief Stark)  
**WhatsApp:** +6285643383832  
**GitHub:** https://github.com/Estes786/clone-my-slf.1  
**Production:** https://dcc0d5bb.gani-the-clone.pages.dev  

---

🍄 **Deep Roots** | 🌳 **Living Intelligence** | 🚀 **High Branches**
