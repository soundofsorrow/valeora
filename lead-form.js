(() => {
  const form = document.getElementById("lead-form");
  const note = document.getElementById("form-note");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    if (note) {
      note.textContent = "Gönderiliyor... Lütfen bekleyin.";
    }

    fetch("/api/auto-deliver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        adSoyad: String(data.get("ad_soyad") || "").trim(),
        telefon: String(data.get("telefon") || "").trim(),
        eposta: String(data.get("eposta") || "").trim(),
        talepTuru: String(data.get("talep_turu") || "").trim(),
        mesaj: String(data.get("mesaj") || "").trim()
      })
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result?.ok) {
          throw new Error(result?.message || "Gönderim başarısız.");
        }

        if (note) {
          note.textContent = "Başvuru tamamlandı. Otomatik teslim e-posta ile gönderildi.";
        }
        form.reset();
      })
      .catch((error) => {
        if (note) {
          note.textContent = `Hata: ${error.message}`;
        }
      });
  });
})();
