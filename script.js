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
  listingTitle: "Ilan Basligi",
  listingDescription: "Ilan Aciklamasi",
  reelsScript: "Reels Senaryosu",
  whatsappMessage: "WhatsApp Mesaji",
  landingCopy: "Landing Metni",
  voiceoverScript: "Seslendirme Scripti",
};

const toneMap = {
  Premium: {
    opener: "Seckin detaylarla fark yaratan",
    adjective: "prestijli",
    urgency: "Nitelikli alici profili icin guclu bir alternatif.",
  },
  "Guven Veren": {
    opener: "Aile yasamina uygun, dengeli ve guven veren",
    adjective: "duzgun planli",
    urgency: "Yerinde goruldugunde karar surecini hizlandirabilecek bir secenek.",
  },
  "Hizli Satis": {
    opener: "Piyasada dikkat cekecek hizli donusum odakli",
    adjective: "firsat niteliginde",
    urgency: "Dogru alici icin beklemeden degerlendirilebilecek bir ilan.",
  },
  "Yatirim Odakli": {
    opener: "Deger koruma ve geri donus potansiyeli yuksek",
    adjective: "yatirim mantigina uygun",
    urgency: "Getiri dusunen alicilar icin guclu bir aday.",
  },
};

const demoData = {
  agentName: "Atakan",
  brandName: "Valeora Prime",
  city: "Istanbul",
  district: "Besiktas",
  neighborhood: "Levent",
  propertyType: "Residence",
  rooms: "3+1",
  size: "145",
  price: "12500000",
  listingMode: "Satilik",
  targetBuyer: "Kurumsal hayati yogun, premium oturum arayan aileler",
  tone: "Premium",
  highlights: "Kapali otopark, metroya yurume mesafesi, genis salon, ebeveyn banyosu, site ici guvenlik",
  cta: "Detayli bilgi, plan ve yerinde gorusme icin benimle hemen iletisime gecin.",
};

const resultElements = outputIds.reduce((acc, id) => {
  acc[id] = document.getElementById(id);
  return acc;
}, {});

let latestOutputs = null;

const escapeValue = (value) => value.trim().replace(/\s+/g, " ");

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
    .map((item) => escapeValue(item))
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
    `${data.neighborhood} lokasyonunda konumlanir. ${data.rooms} planli ve ${data.size} m2 ` +
    `kullanim alanina sahip bu portfoy; ${highlightLine} gibi karar hizlandiran avantajlar sunar.\n\n` +
    `Hedef profil: ${data.targetBuyer || "Lokasyon ve duzgun yasam kalitesi arayan alicilar"}.\n` +
    `Fiyat: ${formattedPrice} TL.\n\n${tone.urgency} ${data.cta}`;

  const reelsScript =
    `1. Acilis: "${data.district} ${data.neighborhood}'da dikkat ceken bir ${data.propertyType.toLowerCase()}."\n` +
    `2. Plan: "${data.rooms} plani ve ${data.size} m2 kullanim alaniyla rahat bir yasam akisi sunuyor."\n` +
    `3. Avantaj: "${firstThreeHighlights || highlightLine} ile gunluk konforu yukari tasiyor."\n` +
    `4. Fiyat: "${formattedPrice} TL bandinda ${data.listingMode.toLowerCase()}."\n` +
    `5. Kapanis: "${data.agentName} ile hemen iletisime gecin ve yerinde gorun."`;

  const whatsappMessage =
    `Merhaba, ${data.brandName} adina paylastigimiz ${data.district} ${data.neighborhood} ` +
    `${data.propertyType.toLowerCase()} ilanina gosterdiginiz ilgi icin tesekkurler.\n\n` +
    `${data.rooms} planli, ${data.size} m2 ve ${highlightLine} avantajlarina sahip.\n` +
    `Guncel fiyat: ${formattedPrice} TL.\n\n` +
    `${data.cta}\n${data.agentName}`;

  const landingCopy =
    `${data.district} ${data.neighborhood}'da dogru lokasyonda, ${tone.adjective} bir ${data.propertyType.toLowerCase()} arayanlar icin ` +
    `${data.rooms} planli bu portfoy, ${highlightLine} avantajlariyla one cikiyor. ` +
    `${data.brandName} ile bu ilani hizli degerlendirmek icin simdi talep birakin.`;

  const voiceoverScript =
    `Istanbul ${data.district} ${data.neighborhood} lokasyonunda, ${data.rooms} planli ve ${data.size} metrekare ` +
    `kullanim alanina sahip ${data.listingMode.toLowerCase()} bir ${data.propertyType.toLowerCase()} sunuyoruz. ` +
    `${firstThreeHighlights || highlightLine} ozellikleriyle dikkat ceken bu portfoy, ` +
    `${formattedPrice} TL fiyatla listelenmistir. ${data.cta}`;

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
      Array.from(formData.entries()).map(([key, value]) => [key, escapeValue(String(value))])
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
    button.textContent = "Kopyalandi";

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
    copyAllButton.textContent = "Tum Paket Kopyalandi";

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
    anchor.download = "valeora-icerik-paketi.txt";
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
