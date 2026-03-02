const WHATSAPP_NUMBER = "905469358152";
const DEFAULT_MESSAGE =
  "Merhaba, Valeora uzerinden ucretsiz demo talebi birakmak istiyorum.";

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

const whatsappBaseLink = `https://wa.me/${WHATSAPP_NUMBER}`;
const whatsappCtas = document.querySelectorAll("[data-whatsapp-link]");

whatsappCtas.forEach((link) => {
  const message = encodeURIComponent(DEFAULT_MESSAGE);
  link.setAttribute("href", `${whatsappBaseLink}?text=${message}`);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");
});

const ctaForm = document.querySelector(".cta-form");

if (ctaForm) {
  ctaForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = ctaForm.querySelector("button");
    const originalLabel = submitButton.textContent;
    const formData = new FormData(ctaForm);
    const name = (formData.get("name") || "").toString().trim();
    const company = (formData.get("company") || "").toString().trim();
    const contact = (formData.get("contact") || "").toString().trim();
    const selectedPackage = (formData.get("package") || "").toString().trim();

    const message = [
      "Merhaba, Valeora uzerinden talep birakiyorum.",
      name ? `Ad Soyad: ${name}` : "",
      company ? `Ofis/Marka: ${company}` : "",
      contact ? `Iletisim: ${contact}` : "",
      selectedPackage ? `Talep: ${selectedPackage}` : "",
      "Mumkunse bana geri donus saglar misiniz?",
    ]
      .filter(Boolean)
      .join("\n");

    submitButton.textContent = "WhatsApp Aciliyor";
    submitButton.disabled = true;

    window.open(`${whatsappBaseLink}?text=${encodeURIComponent(message)}`, "_blank", "noopener");

    window.setTimeout(() => {
      submitButton.textContent = originalLabel;
      submitButton.disabled = false;
    }, 1800);
  });
}
