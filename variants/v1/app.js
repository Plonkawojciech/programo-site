// Ledger: the row under the pointer (or keyboard focus) drives the preview.
const rows = [...document.querySelectorAll(".row")];
const shot = document.getElementById("shot");
const phone = document.getElementById("phone");
const phoneWrap = document.getElementById("phone-wrap");
function activate(row) {
  if (row.classList.contains("is-active")) return;
  rows.forEach((r) => r.classList.toggle("is-active", r === row));
  shot.style.opacity = "0";
  const next = new Image();
  next.onload = () => { shot.src = next.src; shot.style.opacity = "1"; };
  next.src = row.dataset.shot;
  if (row.dataset.phone) { phone.src = row.dataset.phone; phoneWrap.hidden = false; } else { phoneWrap.hidden = true; }
}
rows.forEach((row) => {
  row.addEventListener("pointerenter", () => activate(row));
  row.addEventListener("focus", () => activate(row));
});

// Preview build: forms validate and confirm, but send nothing.
document.querySelectorAll("[data-preview-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const note = form.querySelector(".form-note");
    const digits = input.value.replace(/\D/g, "");
    if (digits.length < 9) {
      input.setAttribute("aria-invalid", "true");
      note.textContent = "Wpisz numer telefonu, minimum 9 cyfr.";
      input.focus();
      return;
    }
    input.removeAttribute("aria-invalid");
    note.classList.add("is-done");
    note.textContent = "To wersja podglądowa: numer nie został wysłany. Na programo.pl oddzwonilibyśmy w 24 h.";
  });
});
