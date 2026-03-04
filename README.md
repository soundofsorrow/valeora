# Atamen Tam Otomatik Sistem

Bu sürüm, statik vitrinden çıkarılıp **tam otomatik başvuru ve teslim** akışına çevrildi.

## Sistem ne yapar?

1. Müşteri formu doldurur.
2. Sistem OpenAI ile otomatik içerik paketi üretir.
3. Üretilen paket müşteriye otomatik e-posta olarak gönderilir.
4. Aynı teslim kopyası size de e-posta olarak düşer.

Bu akışta müşteri sizinle manuel konuşmadan süreç tamamlanır.

## Render ayarı

Bu repo artık `static` değil, `node` web service olarak çalışır.

- `render.yaml` bunu otomatik tanımlar.
- Build: `npm install`
- Start: `npm start`

## Zorunlu ortam değişkenleri

Render > Environment bölümünde şu anahtarları girin:

- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `FROM_EMAIL` (ilk test için `onboarding@resend.dev`)

Opsiyonel:

- `OPENAI_MODEL` (varsayılan: `gpt-4o-mini`)
- `OWNER_EMAIL` (varsayılan: `atkn0202@gmail.com`)

## Önemli not

İlk testte `FROM_EMAIL=onboarding@resend.dev` kullanabilirsiniz.
Kendi domaininizle üretime geçerken doğrulanmış gönderen adres şarttır.

## Endpoint

- `POST /api/auto-deliver`
- `GET /health`
