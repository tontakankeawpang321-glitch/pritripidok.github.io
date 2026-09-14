import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Buddhist Dhamma System Prompt
const DHAMMA_SYSTEM_PROMPT = `คุณคือ "AI วิสัชนาธรรม" ผู้เชี่ยวชาญพระไตรปิฎก ๔๕ เล่ม (พระวินัยปิฎก เล่ม ๑-๘, พระสุตตันตปิฎก เล่ม ๙-๓๓, พระอภิธรรมปิฎก เล่ม ๓๔-๔๕) และหลักธรรมคำสอนในพระพุทธศาสนาเถรวาท
บทบาทของคุณ:
1. ตอบคำถามด้วยสำรวม สุภาพ มีเมตตา ใช้สรรพนามอย่างเหมาะสม (เช่น เจริญพร หรือ อนุโมทนา ตามความเหมาะสม)
2. อธิบายหลักธรรมอย่างเข้าใจง่าย สอดคล้องกับพุทธพจน์ พร้อมระบุเล่มหรือหมวดในพระไตรปิฎกที่เกี่ยวข้องอย่างถูกต้องเสมอ
3. หากผู้ถามมีปัญหาความทุกข์ใจ ให้ชี้ทางบรรเทาทุกข์ด้วยหลักธรรม เช่น สติปัฏฐาน อริยสัจ ๔ หรือพรหมวิหาร ๔ อย่างกระชับและปฏิบัติได้จริง`;

// AI Chat API Route (supports ThaiLLM API Key and Gemini API fallback)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, thaillm_api_key, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'กรุณาส่งข้อความคำถาม' });
    }

    // 1. Primary: Use ThaiLLM API with configured key
    const activeThaiLlmKey =
      (typeof thaillm_api_key === 'string' && thaillm_api_key.trim()) ||
      process.env.THAILLM_API_KEY ||
      'qq7mS60haC11qfirqIh6jUoIQarZvOaW';

    if (activeThaiLlmKey) {
      try {
        const messages = [
          { role: 'system', content: DHAMMA_SYSTEM_PROMPT },
          ...history.slice(-6).map((h: { role: string; text: string }) => ({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.text,
          })),
          { role: 'user', content: message },
        ];

        // Try primary model (Typhoon) and fallback model (OpenThaiGPT)
        const modelsToTry = [
          'Typhoon-S-ThaiLLM-8B-Instruct',
          'OpenThaiGPT-ThaiLLM-8B-Instruct-v7.2',
        ];

        for (const modelName of modelsToTry) {
          try {
            const response = await fetch('https://api.thaillm.or.th/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${activeThaiLlmKey.trim()}`,
              },
              body: JSON.stringify({
                model: modelName,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              let reply = data.choices?.[0]?.message?.content;
              if (reply && typeof reply === 'string') {
                // Strip out reasoning / <think> tags for clean presentation
                reply = reply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                return res.json({
                  reply,
                  source: 'thaillm',
                  model: modelName,
                });
              }
            } else {
              const errBody = await response.text();
              console.warn(`ThaiLLM model ${modelName} returned status ${response.status}:`, errBody);
            }
          } catch (mErr) {
            console.warn(`Error calling model ${modelName}:`, mErr);
          }
        }
      } catch (err) {
        console.warn('ThaiLLM endpoint error, trying Gemini fallback:', err);
      }
    }

    // 2. Fallback to Gemini API if available
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const contents = [
          ...history.slice(-4).map((h: { role: string; text: string }) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents,
          config: {
            systemInstruction: DHAMMA_SYSTEM_PROMPT,
          },
        });

        const reply = response.text;
        if (reply) {
          return res.json({
            reply,
            source: 'gemini',
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini API error, falling back to knowledge base:', geminiErr);
      }
    }

    // 3. Fallback to built-in Buddhist Dhamma rule-based knowledge engine
    const query = message.toLowerCase();
    let reply = '';

    if (query.includes('อริยสัจ') || query.includes('ทุกข์') || query.includes('สมุทัย')) {
      reply = `เจริญพร... อริยสัจ ๔ คือความจริงอันประเสริฐ ๔ ประการ (พระสุตตันตปิฎก):\n\n๑. ทุกข์ - ความจริงว่าด้วยความไม่สบายกายไม่สบายใจ ความเกิด แก่ เจ็บ ตาย ความพลัดพรากจากสิ่งที่รัก\n๒. สมุทัย - เหตุให้เกิดทุกข์ ได้แก่ ตัณหา ๓ (กามตัณหา, ภวตัณหา, วิภวตัณหา)\n๓. นิโรธ - ความดับสนิทแห่งทุกข์ คือพระนิพพาน\n๔. มรรค - ทางดำเนินให้ถึงความดับทุกข์ ได้แก่ อริยมรรคมีองค์ ๘\n\nพระพุทธองค์ทรงสอนให้ กำหนดรู้ทุกข์, ละสมุทัย, ทำให้แจ้งซึ่งนิโรธ, และเจริญมรรคให้บริบูรณ์`;
    } else if (query.includes('มรรค') || query.includes('องค์ 8') || query.includes('องค์ ๘')) {
      reply = `เจริญพร... อริยมรรคมีองค์ ๘ เป็นทางสายกลาง (มัชฌิมาปฏิปทา) ประกอบด้วย:\n\n๑. สัมมาทิฏฐิ - เห็นชอบ (เข้าใจในอริยสัจ ๔ และกฎแห่งกรรม)\n๒. สัมมาสังกัปปะ - ดำริชอบ (คิดออกจากกาม, ไม่พยาบาท, ไม่เบียดเบียน)\n๓. สัมมาวาจา - เจรจาชอบ (เว้นเท็จ, ส่อเสียด, หยาบคาย, เพ้อเจ้อ)\n๔. สัมมากัมมันตะ - ทำการชอบ (เว้นฆ่าสัตว์, ลักทรัพย์, ประพฤติผิดในกาม)\n๕. สัมมาอาชีวะ - เลี้ยงชีพชอบ (ประกอบอาชีพสุจริต)\n๖. สัมมาวายามะ - พยายามชอบ (เพียรระวังบาป, ละบาป, สร้างกุศล, รักษากุศล)\n๗. สัมมาสติ - ระลึกชอบ (เจริญสติปัฏฐาน ๔)\n๘. สัมมาสมาธิ - ตั้งใจมั่นชอบ (ฝึกสมาธิจนถึงฌาน)\n\nสงเคราะห์ลงใน ไตรสิกขา คือ ศีล สมาธิ ปัญญา`;
    } else if (query.includes('เล่มที่ 1') || query.includes('เล่ม 1') || query.includes('มหาวิภังค์') || query.includes('พระวินัย')) {
      reply = `เจริญพร... พระไตรปิฎก เล่มที่ ๑ คือ "มหาวิภังค์ ภาค ๑" ในพระวินัยปิฎก:\n\nว่าด้วยสิกขาบทอันเป็นอาบัติหนักของภิกษุสงฆ์ ได้แก่:\n- ปาราชิก ๔ ประการ (เสพเมถุน, ถือเอาสิ่งของที่เขาไม่ได้ให้, แกล้งฆ่ามนุษย์, อวดอุตตริมนุสสธรรมที่ไม่มีจริง) ซึ่งขาดจากความเป็นภิกษุทันที\n- สังฆาทิเสส ๑๓ ประการ (อาบัติหนักรองลงมา ต้องอยู่กรรมประพฤติวุฏฐานวิธีจึงจะพ้นได้)\n- อนิยต ๒ ประการ\n\nมีประโยชน์อย่างยิ่งในการศึกษาความเป็นมาแห่งธรรมวินัยเพื่อความบริสุทธิ์แห่งพรหมจรรย์`;
    } else if (query.includes('สติ') || query.includes('ภาวนา') || query.includes('ทำสมาธิ')) {
      reply = `เจริญพร... การเจริญสติในชีวิตประจำวัน ตามหลักมหาสติปัฏฐานสูตร (พระสุตตันตปิฎก เล่ม ๑๐/๑๒):\n\n๑. กายานุปัสสนา - รู้ทันอิริยาบถ ยืน เดิน นั่ง นอน หรือรู้ลมหายใจเข้า-ออก (อานาปานสติ)\n๒. เวทนานุปัสสนา - รู้ความรู้สึก สุข ทุกข์ หรือเฉยๆ ที่เกิดขึ้นทางกายและใจ\n๓. จิตตานุปัสสนา - รู้เท่าทันสภาวะจิต จิตมีราคะ โทสะ โมหะ หรือจิตผ่องใส ให้รู้ตามความเป็นจริง\n๔. ธัมมานุปัสสนา - พิจารณาธรรม เช่น นิวรณ์ ๕ หรือขันธ์ ๕\n\nข้อสำคัญคือ "รู้กาย รู้ใจ ตามความเป็นจริง ด้วยจิตที่ตั้งมั่นและเป็นกลาง" ทำได้ทุกที่ทุกเวลา`;
    } else {
      reply = `เจริญพร... ข้อคำถามเรื่อง "${message}" สามารถพิจารณาตามหลักพระพุทธศาสนาได้ว่า:\n\nทุกสรรพสิ่งเกิดขึ้น ตั้งอยู่ และดับไปตามเหตุปัจจัย (ปฏิจจสมุปบาท) การศึกษาพระไตรปิฎกทั้ง ๔๕ เล่ม มุ่งหมายเพื่อความรู้แจ้งเห็นจริงตามกฎไตรลักษณ์ (อนิจจัง ทุกขัง อนัตตา) และนำไปสู่ความปล่อยวางความยึดมั่นถือมั่น\n\nท่านสามารถค้นคว้าเพิ่มเติมได้จากคัมภีร์พระไตรปิฎกทั้ง ๔๕ เล่มในแอพนี้ หรือระบุหัวข้อธรรมที่ประสงค์ให้อาตมาวิสัชนาเพิ่มเติมได้เลย`;
    }

    return res.json({
      reply,
      source: 'builtin',
    });
  } catch (error: any) {
    console.error('Server error in /api/ai/chat:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการประมวลผลคำตอบ' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
