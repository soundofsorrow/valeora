const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => {
        entry.target.classList.add("is-visible");
      }, delay);

      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -6% 0px",
  }
);

revealItems.forEach((item) => observer.observe(item));

const generatorForm = document.querySelector("#listing-generator");
const loadDemoButton = document.querySelector("#load-demo");
const copyAllButton = document.querySelector("#copy-all");
const downloadButton = document.querySelector("#download-pack");
const playVoiceButton = document.querySelector("#play-voice");
const copyButtons = document.querySelectorAll("[data-copy-target]");

const outputIds = [
  "listingTitle",
  "listingDescription",
  "reelsScript",
  "whatsappMessage",
  "landingCopy",
  "voiceoverScript",
];

const outputLabels = {
  listingTitle: "İlan Başlığı",
  listingDescription: "İlan Açıklaması",
  reelsScript: "Reels Senaryosu",
  whatsappMessage: "WhatsApp Mesajı",
  landingCopy: "Açılış Metni",
  voiceoverScript: "Seslendirme Metni",
};

const toneMap = {
  Premium: {
    opener: "Seçkin detaylarla fark yaratan",
    adjective: "prestijli",
    urgency: "Nitelikli alıcı profili için güçlü bir alternatif.",
  },
  "Güven Veren": {
    opener: "Aile yaşamına uygun, dengeli ve güven veren",
    adjective: "düzenli planlı",
    urgency: "Yerinde görüldüğünde karar sürecini hızlandırabilecek bir seçenek.",
  },
  "Hızlı Satış": {
    opener: "Piyasada dikkat çekecek, hızlı dönüşüm odaklı",
    adjective: "fırsat niteliğinde",
    urgency: "Doğru alıcı için beklemeden değerlendirilebilecek bir ilan.",
  },
  "Yatırım Odaklı": {
    opener: "Değer koruma ve geri dönüş potansiyeli yüksek",
    adjective: "yatırım mantığına uygun",
    urgency: "Getiri düşünen alıcılar için güçlü bir aday.",
  },
};

const demoData = {
  agentName: "Atakan",
  brandName: "Valeora Prime",
  city: "İstanbul",
  district: "Beşiktaş",
  neighborhood: "Levent",
  propertyType: "Residence",
  rooms: "3+1",
  size: "145",
  price: "12500000",
  listingMode: "Satılık",
  targetBuyer: "Kurumsal hayatı yoğun, premium oturum arayan aileler",
  tone: "Premium",
  highlights: "Kapalı otopark, metroya yürüme mesafesi, geniş salon, ebeveyn banyosu, site içi güvenlik",
  cta: "Detaylı bilgi, plan ve yerinde görüşme için benimle hemen iletişime geçin.",
};

const resultElements = outputIds.reduce((acc, id) => {
  acc[id] = document.getElementById(id);
  return acc;
}, {});

let latestOutputs = null;

const normalizeText = (value) => value.trim().replace(/\s+/g, " ");

const formatPrice = (value) => {
  const numericValue = Number(String(value).replace(/[^\d]/g, ""));

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return value;
  }

  return new Intl.NumberFormat("tr-TR").format(numericValue);
};

const splitHighlights = (highlights) =>
  highlights
    .split(",")
    .map((item) => normalizeText(item))
    .filter(Boolean);

const renderOutputs = (outputs) => {
  outputIds.forEach((id) => {
    const element = resultElements[id];
    element.textContent = outputs[id];
    element.classList.remove("placeholder");
  });
};

const buildPackText = (outputs) =>
  outputIds
    .map((id) => `${outputLabels[id]}\n${outputs[id]}`)
    .join("\n\n--------------------\n\n");

const generateOutputs = (data) => {
  const tone = toneMap[data.tone] || toneMap.Premium;
  const highlights = splitHighlights(data.highlights);
  const highlightLine = highlights.join(", ");
  const firstThreeHighlights = highlights.slice(0, 3).join(", ");
  const formattedPrice = formatPrice(data.price);

  const listingTitle =
    `${data.district} ${data.neighborhood}'da ${data.listingMode.toLowerCase()} ` +
    `${data.rooms} ${data.propertyType.toLowerCase()} | ${data.size} m2 | ${tone.adjective}`;

  const listingDescription =
    `${tone.opener} bu ${data.propertyType.toLowerCase()}, ${data.city} ${data.district} ` +
    `${data.neighborhood} lokasyonunda konumlanır. ${data.rooms} planlı ve ${data.size} m2 ` +
    `kullanım alanına sahip bu portföy; ${highlightLine} gibi karar hızlandıran avantajlar sunar.\n\n` +
    `Hedef profil: ${data.targetBuyer || "Lokasyon ve düzenli yaşam kalitesi arayan alıcılar"}.\n` +
    `Fiyat: ${formattedPrice} TL.\n\n${tone.urgency} ${data.cta}`;

  const reelsScript =
    `1. Açılış: "${data.district} ${data.neighborhood}'da dikkat çeken bir ${data.propertyType.toLowerCase()}."\n` +
    `2. Plan: "${data.rooms} planı ve ${data.size} m2 kullanım alanıyla rahat bir yaşam akışı sunuyor."\n` +
    `3. Avantaj: "${firstThreeHighlights || highlightLine} ile günlük konforu yukarı taşıyor."\n` +
    `4. Fiyat: "${formattedPrice} TL bandında ${data.listingMode.toLowerCase()}."\n` +
    `5. Kapanış: "${data.agentName} ile hemen iletişime geçin ve yerinde görün."`;

  const whatsappMessage =
    `Merhaba, ${data.brandName} adına paylaştığımız ${data.district} ${data.neighborhood} ` +
    `${data.propertyType.toLowerCase()} ilanına gösterdiğiniz ilgi için teşekkürler.\n\n` +
    `${data.rooms} planlı, ${data.size} m2 ve ${highlightLine} avantajlarına sahip.\n` +
    `Güncel fiyat: ${formattedPrice} TL.\n\n` +
    `${data.cta}\nSevgiler,\n${data.agentName}`;

  const landingCopy =
    `${data.district} ${data.neighborhood}'da doğru lokasyonda, ${tone.adjective} bir ${data.propertyType.toLowerCase()} arayanlar için ` +
    `${data.rooms} planlı bu portföy, ${highlightLine} avantajlarıyla öne çıkıyor. ` +
    `${data.brandName} ile bu ilanı sıcak bir ilk temasla hızlıca değerlendirmek için şimdi talep bırakın.`;

  const voiceoverScript =
    `İstanbul ${data.district} ${data.neighborhood} lokasyonunda, ${data.rooms} planlı ve ${data.size} metrekare ` +
    `kullanım alanına sahip ${data.listingMode.toLowerCase()} bir ${data.propertyType.toLowerCase()} sunuyoruz. ` +
    `${firstThreeHighlights || highlightLine} özellikleriyle dikkat çeken bu portföy, ` +
    `${formattedPrice} TL fiyatla listelenmiştir. ${data.cta}`;

  return {
    listingTitle,
    listingDescription,
    reelsScript,
    whatsappMessage,
    landingCopy,
    voiceoverScript,
  };
};

const persistFormData = (data) => {
  window.localStorage.setItem("valeora-generator", JSON.stringify(data));
};

const loadPersistedFormData = () => {
  const raw = window.localStorage.getItem("valeora-generator");

  if (!raw || !generatorForm) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    Object.entries(parsed).forEach(([key, value]) => {
      const field = generatorForm.elements.namedItem(key);
      if (field) {
        field.value = value;
      }
    });
  } catch {
    window.localStorage.removeItem("valeora-generator");
  }
};

const setFormValues = (values) => {
  Object.entries(values).forEach(([key, value]) => {
    const field = generatorForm.elements.namedItem(key);
    if (field) {
      field.value = value;
    }
  });
};

if (generatorForm) {
  loadPersistedFormData();

  generatorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(generatorForm);
    const normalized = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, normalizeText(String(value))])
    );

    const outputs = generateOutputs(normalized);
    latestOutputs = outputs;
    persistFormData(normalized);
    renderOutputs(outputs);
  });
}

if (loadDemoButton && generatorForm) {
  loadDemoButton.addEventListener("click", () => {
    setFormValues(demoData);
    const outputs = generateOutputs(demoData);
    latestOutputs = outputs;
    persistFormData(demoData);
    renderOutputs(outputs);
  });
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const targetId = button.dataset.copyTarget;
    const target = resultElements[targetId];

    if (!target) {
      return;
    }

    await navigator.clipboard.writeText(target.textContent);
    const originalText = button.textContent;
    button.textContent = "Kopyalandı";

    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1200);
  });
});

if (copyAllButton) {
  copyAllButton.addEventListener("click", async () => {
    if (!latestOutputs) {
      return;
    }

    await navigator.clipboard.writeText(buildPackText(latestOutputs));
    const originalText = copyAllButton.textContent;
    copyAllButton.textContent = "Tüm Paket Kopyalandı";

    window.setTimeout(() => {
      copyAllButton.textContent = originalText;
    }, 1400);
  });
}

if (downloadButton) {
  downloadButton.addEventListener("click", () => {
    if (!latestOutputs) {
      return;
    }

    const blob = new Blob([buildPackText(latestOutputs)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "valeora-içerik-paketi.txt";
    anchor.click();

    URL.revokeObjectURL(url);
  });
}

if (playVoiceButton) {
  playVoiceButton.addEventListener("click", () => {
    if (!latestOutputs || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(latestOutputs.voiceoverScript);
    utterance.lang = "tr-TR";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  });
}
