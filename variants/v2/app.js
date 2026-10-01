// Offer picker: one situation at a time. All three panes are in the HTML.
const tabs = [...document.querySelectorAll('.picker [role="tab"]')];
function select(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => select(tab));
  tab.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    select(next); next.focus();
  });
});

// Section nav: mark where the reader is.
const links = [...document.querySelectorAll(".tabs a")];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-30% 0px -60% 0px" });
links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });

// Phones: the bottom bar appears once the form has scrolled out of view.
const bar = document.querySelector(".bar");
const form = document.querySelector(".callback");
new IntersectionObserver(([entry]) => bar.classList.toggle("is-on", !entry.isIntersecting)).observe(form);

// Preview build: the form validates and confirms, but sends nothing.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  const note = form.querySelector(".form-note");
  if (input.value.replace(/\D/g, "").length < 9) {
    input.setAttribute("aria-invalid", "true");
    note.textContent = "Wpisz numer telefonu, minimum 9 cyfr.";
    input.focus();
    return;
  }
  input.removeAttribute("aria-invalid");
  note.textContent = "To wersja podglądowa: numer nie został wysłany. Na programo.pl oddzwonilibyśmy w 24 h.";
});
