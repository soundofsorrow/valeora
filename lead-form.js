(() => {
  const form = document.getElementById("lead-form");
  const note = document.getElementById("form-note");

  if (!form) {
    return;
  }

  const whatsappNumber = "905469358152";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const adSoyad = String(data.get("ad_soyad") || "").trim();
    const telefon = String(data.get("telefon") || "").trim();
    const eposta = String(data.get("eposta") || "").trim();
    const talepTuru = String(data.get("talep_turu") || "").trim();
    const mesaj = String(data.get("mesaj") || "").trim();

    const metin =
      "Merhaba Atamen, yeni bir başvuru bırakıyorum.%0A%0A" +
      `Ad Soyad: ${encodeURIComponent(adSoyad)}%0A` +
      `Telefon: ${encodeURIComponent(telefon)}%0A` +
      `E-posta: ${encodeURIComponent(eposta)}%0A` +
      `Talep Türü: ${encodeURIComponent(talepTuru)}%0A` +
      `Mesaj: ${encodeURIComponent(mesaj || "-")}`;

    const url = `https://wa.me/${whatsappNumber}?text=${metin}`;
    const win = window.open(url, "_blank", "noopener,noreferrer");

    if (!win) {
      window.location.href = url;
    }

    if (note) {
      note.textContent = "WhatsApp penceresi açıldı. Açılmadıysa açılır pencere engelini kapatın.";
    }
  });
})();
