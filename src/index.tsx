import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  AI: any
  DB: D1Database
  WA_TOKEN: string
  CLOUDFLARE_API_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================
// 🧬 GANI: THE SILENT CLONE
// Filosofi HYPHA - Invisible but Essential
// ============================================

// System Instruction untuk GANI - Haidar's Digital Clone
const getSystemPrompt = (role: string) => {
  const basePrompt = `Kamu adalah Haidar. Jawab chat dengan gaya bahasa santai, banyak singkatan (w, dh, mnkn, y, p), dan HANYA gunakan emoji 🙏🏻.
  
ATURAN PENTING:
- JANGAN PERNAH menyebut dirimu sebagai AI, bot, atau asisten
- Jawab seolah-olah kamu yang sedang mengetik langsung
- Gunakan bahasa yang natural seperti Haidar berbicara
- Singkat, sopan, dan to the point`

  if (role === 'BARBER') {
    return `${basePrompt}
    
DATA KHUSUS (PAK KHOM - BARBER):
- Pengaman Dada/Lawak Cukur: Di gantungan dekat stopkontak atau di dalam lemari 🙏🏻
- Alat Cukur: Di laci meja masing-masing atau di tempat steril 🙏🏻
- Jika ditanya barang lain: Arahkan untuk cek laci meja atau inventaris dulu 🙏🏻

Contoh jawaban: "krng pham bapa wktu it d truh d cntelan yg dket dg stopkontak atau mnkn sdh d msukin d lemari 🙏🏻"`
  } else if (role === 'TEMAN') {
    return `${basePrompt}
    
DATA KHUSUS (TEMAN):
- Jika tanya kabar: "alhamdulillah sehat p, lg fokus bgt d tmpt baru jd jrang pegang hp 🙏🏻"
- Jika ajak main/nongkrong: "nnti w kbrin y klo dh ad wktu lngg p, skrng lg full bgt jdwlnya 🙏🏻"
- Tetap ramah tapi maintain distance - lo lagi fokus karir`
  } else if (role === 'KELUARGA') {
    return `${basePrompt}
    
DATA KHUSUS (KELUARGA/SODARA):
- Lebih hangat tapi tetap profesional
- Sampaikan salam dan doa baik
- Jika ada pesan penting, catat dan sampaikan akan direspon segera 🙏🏻`
  } else {
    // CUSTOMER atau UNKNOWN
    return `${basePrompt}
    
DATA KHUSUS (CUSTOMER/UMUM):
- Jawab formal tapi tetap friendly
- Berikan informasi yang jelas dan membantu
- Maintain profesionalitas 🙏🏻`
  }
}

// ============================================
// 📱 WEBHOOK HANDLER - WhatsApp Integration
// ============================================
app.post('/api/webhook/whatsapp', async (c) => {
  try {
    const body = await c.req.json()
    
    // Log incoming webhook (untuk debugging)
    console.log('Webhook received:', JSON.stringify(body, null, 2))
    
    // ✅ FIX: Pastikan environment bindings tersedia
    if (!c.env?.DB) {
      console.error('DB binding not available')
      return c.json({ error: 'Database not configured' }, 500)
    }

    if (!c.env?.AI) {
      console.error('AI binding not available')
      return c.json({ error: 'AI not configured' }, 500)
    }

    if (!c.env?.WA_TOKEN) {
      console.error('WA_TOKEN not configured')
      return c.json({ error: 'WhatsApp token not configured' }, 500)
    }
    
    // Handle incoming call - Auto Reply
    if (body.type === 'incoming_call' || body.event === 'call') {
      const fromNumber = body.from || body.phone_number
      const callMessage = "mohon maaf p, lg fokus bgt d tmpt baru jd jrang pegang hp buat angkat tlp. chat d sini aj y p 🙏🏻"
      
      // Send auto-reply via Whapi
      await fetch('https://gate.whapi.cloud/messages/text', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.WA_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: fromNumber,
          body: callMessage
        })
      })
      
      return c.json({ success: true, message: 'Call handled 🙏🏻' })
    }
    
    // Handle incoming message
    if (body.type === 'message' || body.messages) {
      const message = body.messages?.[0] || body
      const fromNumber = message.from || message.phone_number
      const messageText = message.text?.body || message.body || message.text
      
      // Skip if no text content
      if (!messageText) {
        return c.json({ success: true, message: 'No text content' })
      }
      
      // ✅ FIX: Check role from database dengan proper error handling
      let role = 'CUSTOMER'
      try {
        const contact = await c.env.DB.prepare(
          'SELECT role_type FROM contacts WHERE phone_number = ?'
        ).bind(fromNumber).first()
        
        role = contact?.role_type || 'CUSTOMER'
      } catch (dbError: any) {
        console.error('Database error:', dbError)
        // Lanjutkan dengan default role jika DB error
      }
      
      // Get system prompt based on role
      const systemPrompt = getSystemPrompt(role)
      
      // Call Cloudflare Workers AI - Llama 3
      const aiResponse = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: messageText }
        ]
      })
      
      const replyText = aiResponse.response || 'mohon maaf p, ada kendala teknis. coba lg bntr lg y 🙏🏻'
      
      // Send reply via Whapi
      await fetch('https://gate.whapi.cloud/messages/text', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.WA_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: fromNumber,
          body: replyText
        })
      })
      
      // ✅ FIX: Log conversation dengan error handling
      try {
        await c.env.DB.prepare(
          'INSERT INTO conversations (phone_number, role_type, message_in, message_out, timestamp) VALUES (?, ?, ?, ?, ?)'
        ).bind(fromNumber, role, messageText, replyText, new Date().toISOString()).run()
      } catch (dbError: any) {
        console.error('Failed to log conversation:', dbError)
        // Tidak throw error, biarkan response tetap sukses
      }
      
      return c.json({ success: true, message: 'Message processed 🙏🏻' })
    }
    
    return c.json({ success: true, message: 'Webhook received' })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// ============================================
// 🛠️ ADMIN API - Contact Management
// ============================================
app.get('/api/contacts', async (c) => {
  try {
    const contacts = await c.env.DB.prepare(
      'SELECT * FROM contacts ORDER BY name'
    ).all()
    return c.json(contacts.results)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.post('/api/contacts', async (c) => {
  try {
    const { phone_number, name, role_type } = await c.req.json()
    
    await c.env.DB.prepare(
      'INSERT INTO contacts (phone_number, name, role_type) VALUES (?, ?, ?)'
    ).bind(phone_number, name, role_type).run()
    
    return c.json({ success: true, message: 'Contact added 🙏🏻' })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// ============================================
// 📊 DASHBOARD - Conversation History
// ============================================
app.get('/api/conversations', async (c) => {
  try {
    const limit = c.req.query('limit') || '50'
    const conversations = await c.env.DB.prepare(
      'SELECT * FROM conversations ORDER BY timestamp DESC LIMIT ?'
    ).bind(limit).all()
    return c.json(conversations.results)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// ============================================
// 🏠 HOME PAGE - GANI Dashboard
// ============================================
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GANI: The Silent Clone 🍄</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-900 text-gray-100">
        <div class="container mx-auto px-4 py-8">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold mb-4">
                    🍄 GANI: HYPHA ENGINE
                </h1>
                <p class="text-xl text-gray-400">The Silent Clone - Invisible but Essential</p>
                <p class="text-sm text-gray-500 mt-2">Filosofi: Akar Dalam 🌳 | Cabang Tinggi 🚀</p>
            </div>

            <!-- Status Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div class="bg-gray-800 p-6 rounded-lg border border-green-500">
                    <div class="flex items-center justify-between mb-4">
                        <i class="fas fa-robot text-3xl text-green-500"></i>
                        <span class="text-green-500 font-bold">ACTIVE</span>
                    </div>
                    <h3 class="text-lg font-bold mb-2">AI Status</h3>
                    <p class="text-gray-400 text-sm">Cloudflare Workers AI (Llama 3)</p>
                </div>

                <div class="bg-gray-800 p-6 rounded-lg border border-blue-500">
                    <div class="flex items-center justify-between mb-4">
                        <i class="fab fa-whatsapp text-3xl text-blue-500"></i>
                        <span class="text-blue-500 font-bold">READY</span>
                    </div>
                    <h3 class="text-lg font-bold mb-2">WhatsApp Bridge</h3>
                    <p class="text-gray-400 text-sm">Whapi.cloud Connected</p>
                </div>

                <div class="bg-gray-800 p-6 rounded-lg border border-purple-500">
                    <div class="flex items-center justify-between mb-4">
                        <i class="fas fa-database text-3xl text-purple-500"></i>
                        <span class="text-purple-500 font-bold">SYNCED</span>
                    </div>
                    <h3 class="text-lg font-bold mb-2">Memory (D1)</h3>
                    <p class="text-gray-400 text-sm">Contacts & Conversations</p>
                </div>
            </div>

            <!-- Philosophy Section -->
            <div class="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-12">
                <h2 class="text-2xl font-bold mb-6 text-center">🧬 GANI's Philosophy</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-lg font-bold mb-3 text-green-400">🌳 Akar Dalam (Deep Roots)</h3>
                        <ul class="space-y-2 text-gray-400">
                            <li>✓ Amanah - Teknologi yang dapat dipercaya</li>
                            <li>✓ Khidmah - Melayani dengan tulus</li>
                            <li>✓ Barakah - Membawa berkah</li>
                            <li>✓ Marwah - Menjaga kehormatan</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-3 text-blue-400">🚀 Cabang Tinggi (High Branches)</h3>
                        <ul class="space-y-2 text-gray-400">
                            <li>✓ Innovation - Agentic AI Ecology</li>
                            <li>✓ Scalability - Global Impact</li>
                            <li>✓ Legacy - Outlive the Creator</li>
                            <li>✓ Impact - Touch Millions of Lives</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Multi-Role System -->
            <div class="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-12">
                <h2 class="text-2xl font-bold mb-6 text-center">🎭 Multi-Personality Agent</h2>
                <div class="space-y-4">
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <h3 class="font-bold text-yellow-400 mb-2">👨‍💼 PAK KHOM (Barber)</h3>
                        <p class="text-sm text-gray-400">Inventory manager, SOP keeper - "pengaman dada ada di lemari 🙏🏻"</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <h3 class="font-bold text-blue-400 mb-2">👥 TEMAN (Friends)</h3>
                        <p class="text-sm text-gray-400">Social filter - "lg fokus bgt d tmpt baru 🙏🏻"</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <h3 class="font-bold text-green-400 mb-2">👨‍👩‍👧‍👦 KELUARGA (Family)</h3>
                        <p class="text-sm text-gray-400">Warm & professional - "alhamdulillah sehat 🙏🏻"</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <h3 class="font-bold text-purple-400 mb-2">🧑‍💼 CUSTOMER</h3>
                        <p class="text-sm text-gray-400">Formal & helpful - Professional service 🙏🏻</p>
                    </div>
                </div>
            </div>

            <!-- API Endpoints -->
            <div class="bg-gray-800 p-8 rounded-lg border border-gray-700">
                <h2 class="text-2xl font-bold mb-6">📡 API Endpoints</h2>
                <div class="space-y-3 font-mono text-sm">
                    <div class="flex items-center space-x-4">
                        <span class="bg-green-600 px-3 py-1 rounded text-white">POST</span>
                        <span class="text-gray-400">/api/webhook/whatsapp</span>
                        <span class="text-gray-500">- Webhook dari Whapi</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="bg-blue-600 px-3 py-1 rounded text-white">GET</span>
                        <span class="text-gray-400">/api/contacts</span>
                        <span class="text-gray-500">- Daftar kontak & roles</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="bg-green-600 px-3 py-1 rounded text-white">POST</span>
                        <span class="text-gray-400">/api/contacts</span>
                        <span class="text-gray-500">- Tambah kontak baru</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="bg-blue-600 px-3 py-1 rounded text-white">GET</span>
                        <span class="text-gray-400">/api/conversations</span>
                        <span class="text-gray-500">- History percakapan</span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="text-center mt-12 text-gray-500">
                <p class="mb-2">"Every line of GANI code is a prayer for sustainability"</p>
                <p class="text-sm">— Haidar Faras (Chief Stark), The Orchestrator 🙏🏻</p>
                <p class="text-xs mt-4">🌳 Deep Roots | 🍄 Living Intelligence | 🌿 High Branches</p>
            </div>
        </div>
    </body>
    </html>
  `)
})

export default app
