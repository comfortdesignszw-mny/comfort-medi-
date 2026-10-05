import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    appName: 'Comfort Medi+',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Server-side Gemini AI Health Assistant endpoint
app.post('/api/ai/health-assistant', async (req, res) => {
  try {
    const { prompt, language = 'en', context = '' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable (API key not configured). Using local offline medical knowledge.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are "Comfort Medi+ Health Assistant", a dedicated, compassionate, and culturally aware clinical health information companion designed for African and Zimbabwean healthcare contexts.

CRITICAL SAFETY & MEDICAL BOUNDARIES:
1. NEVER diagnose illnesses or conditions definitively. State potential general health topics instead.
2. NEVER prescribe medications or change prescribed dosages.
3. NEVER replace a licensed medical doctor, nurse, or clinical officer.
4. Detect ANY red flag or emergency symptoms immediately (e.g., severe acute chest pain, sudden numbness/face drooping/weakness, severe shortness of breath, heavy bleeding, suspected poisoning, severe cholera dehydration with sunken eyes/lethargy, infant convulsions or rigid neck). If detected, clearly prioritize an EMERGENCY ALERT box instructing immediate casualty/emergency hospital visit or calling Zimbabwean emergency numbers (999, 112, MARS, ACE, or St John Ambulance).
5. Always emphasize professional consultation at local clinics, polyclinics, or district/central hospitals (e.g., Parirenyatwa, Sally Mugabe, Mpilo, UBH, provincial hospitals).
6. Be highly cognizant of common regional health concerns: Malaria prevention & rapid testing, Cholera & clean water/ORS (Sugar-Salt Solution: 6 level teaspoons sugar + 1/2 level teaspoon salt in 1 liter boiled clean water), Hypertension ("BP"), Diabetes, Asthma, Tuberculosis (TB), HIV & Antiretroviral Therapy (ART) adherence, Maternal & Child Health.
7. Support language requests. If the user asks in Shona or requests Shona, reply with respectful Shona medical guidance. If Ndebele, reply in isiNdebele. If English, reply in English.
8. ALWAYS end with this standardized medical disclaimer in the user's language:
"Disclaimer: Comfort Medi+ AI provides educational health information only and is not a substitute for professional clinical medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional."`;

    const userPrompt = `${context ? `[User Health Context & Current Medications: ${context}]\n` : ''}User Question: ${prompt}\nPreferred Language: ${language}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const reply = response.text || 'No response generated.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini Health Assistant error:', error);
    return res.status(500).json({
      error: 'Failed to communicate with AI health service.',
      details: error?.message || 'Unknown error'
    });
  }
});

// WhatsApp Messaging & Deep Link Notification Gateway (Zimbabwe Econet, NetOne, Telecel)
app.post('/api/whatsapp/send-notification', (req, res) => {
  const { phoneNumber, message, type = 'MEDICATION' } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'Phone number and message are required' });
  }

  // Format Zimbabwe international number
  let cleaned = phoneNumber.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('07') && cleaned.length === 10) cleaned = '263' + cleaned.substring(1);
  else if (cleaned.length === 9 && cleaned.startsWith('7')) cleaned = '263' + cleaned;
  
  const deepLinkUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  const dispatchId = 'WA-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000);
  
  console.log(`[WHATSAPP GATEWAY DISPATCH] To: ${cleaned} | ID: ${dispatchId}`);
  console.log(`[WHATSAPP BODY]: "${message}"`);
  console.log(`[WHATSAPP DEEP LINK]: ${deepLinkUrl}`);

  return res.json({
    success: true,
    dispatchId,
    recipient: phoneNumber,
    deepLinkUrl,
    status: 'DISPATCHED_VIA_WHATSAPP',
    timestamp: new Date().toISOString()
  });
});

// Backward compatibility fallback for reminder endpoint
app.post('/api/sms/send-reminder', (req, res) => {
  const { phoneNumber, message } = req.body;
  const cleaned = (phoneNumber || '').replace(/[^0-9]/g, '');
  const deepLinkUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(message || '')}`;
  return res.json({
    success: true,
    dispatchId: 'WA-COMPAT-' + Date.now().toString(36).toUpperCase(),
    recipient: phoneNumber,
    deepLinkUrl,
    status: 'DISPATCHED_VIA_WHATSAPP',
    timestamp: new Date().toISOString()
  });
});

// Offline Sync Queue ingestion endpoint
app.post('/api/sync', (req, res) => {
  const { items = [], clientId, lastSyncedAt } = req.body;
  console.log(`[SYNC INGEST] Received ${items.length} queued events from client ${clientId}`);

  return res.json({
    success: true,
    processed: items.length,
    syncedAt: new Date().toISOString(),
    conflicts: [],
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Comfort Medi+ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
