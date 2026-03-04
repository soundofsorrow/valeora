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
- `FROM_EMAIL` (Resend içinde doğrulanmış gönderen adres)

Opsiyonel:

- `OPENAI_MODEL` (varsayılan: `gpt-4o-mini`)
- `OWNER_EMAIL` (varsayılan: `atkn0202@gmail.com`)

## Önemli not

`FROM_EMAIL` mutlaka Resend üzerinde doğrulanmış bir domain/adres olmalıdır.
Aksi halde otomatik e-posta teslimi çalışmaz.

## Endpoint

- `POST /api/auto-deliver`
- `GET /health`
