const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname)));

const OWNER_EMAIL = process.env.OWNER_EMAIL || "atkn0202@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

function must(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function clean(value) {
  return String(value || "").trim().replace(/^["']|["']$/g, "");
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildPrompt(payload) {
  return `
Sen bir gayrimenkul satis asistanisin.
Asagidaki basvuruya gore kisa ve profesyonel Turkce bir teslim paketi uret.

Basvuru:
- Ad Soyad: ${payload.adSoyad}
- Telefon: ${payload.telefon}
- E-posta: ${payload.eposta}
- Talep Turu: ${payload.talepTuru}
- Mesaj: ${payload.mesaj || "-"}

Su 4 baslikla cevap ver:
1) Ozet
2) Onerilen Surec
3) Musteri Icin Ilk Aksiyonlar
4) Beklenen Cikti Listesi

Kisa, net ve pazarlama odakli yaz.
`;
}

async function generateDeliveryText(payload) {
  const apiKey = clean(process.env.OPENAI_API_KEY);
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY tanımlı değil.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content:
            "Turkce yaz. Gereksiz uzun yazma. Yapilandirilmis ve profesyonel bir teslim metni uret."
        },
        {
          role: "user",
          content: buildPrompt(payload)
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI hatası: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!must(text)) {
    throw new Error("OpenAI cevabı boş geldi.");
  }
  return text.trim();
}

async function sendEmailWithResend(payload, generatedText) {
  const resendKey = clean(process.env.RESEND_API_KEY);
  const fromEmail = clean(FROM_EMAIL);

  if (!resendKey) {
    throw new Error("RESEND_API_KEY tanımlı değil.");
  }

  if (!validEmail(fromEmail)) {
    throw new Error("FROM_EMAIL geçersiz. Örnek: onboarding@resend.dev");
  }

  if (!validEmail(payload.eposta)) {
    throw new Error("Müşteri e-posta adresi geçersiz.");
  }

  const subject = `Atamen Otomatik Teslim | ${payload.talepTuru}`;
  const html = `
    <h2>Atamen Otomatik Teslim</h2>
    <p><strong>Basvuru Sahibi:</strong> ${payload.adSoyad}</p>
    <p><strong>Telefon:</strong> ${payload.telefon}</p>
    <p><strong>E-posta:</strong> ${payload.eposta}</p>
    <p><strong>Talep Turu:</strong> ${payload.talepTuru}</p>
    <p><strong>Mesaj:</strong> ${payload.mesaj || "-"}</p>
    <hr />
    <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${generatedText}</pre>
  `;

  const to = [payload.eposta, OWNER_EMAIL];
  const mailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html
    })
  });

  if (!mailResponse.ok) {
    const err = await mailResponse.text();
    throw new Error(`Resend hatası: ${mailResponse.status} ${err}`);
  }

  return mailResponse.json();
}

app.post("/api/auto-deliver", async (req, res) => {
  try {
    const payload = {
      adSoyad: String(req.body?.adSoyad || "").trim(),
      telefon: String(req.body?.telefon || "").trim(),
      eposta: String(req.body?.eposta || "").trim(),
      talepTuru: String(req.body?.talepTuru || "").trim(),
      mesaj: String(req.body?.mesaj || "").trim()
    };

    if (!must(payload.adSoyad) || !must(payload.telefon) || !must(payload.eposta) || !must(payload.talepTuru)) {
      return res.status(400).json({
        ok: false,
      message: "Zorunlu alanlar eksik."
      });
    }

    const generatedText = await generateDeliveryText(payload);
    await sendEmailWithResend(payload, generatedText);

    return res.json({
      ok: true,
      message: "Başvuru alındı ve otomatik teslim paketi e-posta ile gönderildi."
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || "Bilinmeyen bir hata oluştu."
    });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Atamen otomasyon servisi calisiyor: ${port}`);
});
