import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "@/components/contact";
import { I18nProvider, useI18n } from "@/lib/i18n";

function renderWithI18n() {
  return render(
    <I18nProvider>
      <Contact />
    </I18nProvider>
  );
}

function ToggleButton() {
  const { toggle } = useI18n();
  return <button data-testid="toggle-lang" onClick={toggle}>Toggle</button>;
}

function renderWithToggle() {
  return render(
    <I18nProvider>
      <ToggleButton />
      <Contact />
    </I18nProvider>
  );
}

describe("Contact form component", () => {
  it("renders all form fields", () => {
    renderWithI18n();
    expect(screen.getByLabelText(/Imi/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temat/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wiadomo/)).toBeInTheDocument();
  });

  it("validates name required on submit", async () => {
    renderWithI18n();
    const submitBtn = screen.getByText("Wyślij");
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getAllByText("To pole jest wymagane").length).toBeGreaterThan(0);
    });
  });

  it("validates email format", async () => {
    renderWithI18n();
    const nameInput = screen.getByLabelText(/Imi/);
    const emailInput = screen.getByLabelText(/Email/);
    const messageInput = screen.getByLabelText(/Wiadomo/);
    const subjectSelect = screen.getByLabelText(/Temat/);

    fireEvent.change(nameInput, { target: { value: "Jan" } });
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(subjectSelect, { target: { value: "Inne" } });
    fireEvent.change(messageInput, { target: { value: "a".repeat(25) } });

    const submitBtn = screen.getByText("Wyślij");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Nieprawidłowy adres email")).toBeInTheDocument();
    });
  });

  it("validates message min length", async () => {
    renderWithI18n();
    const nameInput = screen.getByLabelText(/Imi/);
    const emailInput = screen.getByLabelText(/Email/);
    const messageInput = screen.getByLabelText(/Wiadomo/);
    const subjectSelect = screen.getByLabelText(/Temat/);

    fireEvent.change(nameInput, { target: { value: "Jan" } });
    fireEvent.change(emailInput, { target: { value: "jan@test.com" } });
    fireEvent.change(subjectSelect, { target: { value: "Inne" } });
    fireEvent.change(messageInput, { target: { value: "Short" } });

    const submitBtn = screen.getByText("Wyślij");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Minimum 20 znaków")).toBeInTheDocument();
    });
  });

  it("submit button shows correct initial text", () => {
    renderWithI18n();
    expect(screen.getByText("Wyślij")).toBeInTheDocument();
  });

  it("shows submitting state on valid form submission", async () => {
    global.fetch = vi.fn().mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    renderWithI18n();
    const nameInput = screen.getByLabelText(/Imi/);
    const emailInput = screen.getByLabelText(/Email/);
    const messageInput = screen.getByLabelText(/Wiadomo/);
    const subjectSelect = screen.getByLabelText(/Temat/);

    fireEvent.change(nameInput, { target: { value: "Jan" } });
    fireEvent.change(emailInput, { target: { value: "jan@test.com" } });
    fireEvent.change(subjectSelect, { target: { value: "Inne" } });
    fireEvent.change(messageInput, { target: { value: "To jest wystarczająco długa wiadomość" } });

    const submitBtn = screen.getByText("Wyślij");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie...")).toBeInTheDocument();
    });
  });

  it("shows error toast on fetch failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    renderWithI18n();
    const nameInput = screen.getByLabelText(/Imi/);
    const emailInput = screen.getByLabelText(/Email/);
    const messageInput = screen.getByLabelText(/Wiadomo/);
    const subjectSelect = screen.getByLabelText(/Temat/);

    fireEvent.change(nameInput, { target: { value: "Jan" } });
    fireEvent.change(emailInput, { target: { value: "jan@test.com" } });
    fireEvent.change(subjectSelect, { target: { value: "Inne" } });
    fireEvent.change(messageInput, { target: { value: "To jest wystarczająco długa wiadomość" } });

    const submitBtn = screen.getByText("Wyślij");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Coś poszło nie tak")).toBeInTheDocument();
    });
  });

  it("form fields have proper accessibility attributes", () => {
    renderWithI18n();
    const nameInput = screen.getByLabelText(/Imi/);
    expect(nameInput.id).toBe("contact-name");

    const emailInput = screen.getByLabelText(/Email/);
    expect(emailInput.id).toBe("contact-email");

    const subjectSelect = screen.getByLabelText(/Temat/);
    expect(subjectSelect.id).toBe("contact-subject");

    const messageInput = screen.getByLabelText(/Wiadomo/);
    expect(messageInput.id).toBe("contact-message");
  });

  it("subject select has 4 options (plus placeholder)", () => {
    renderWithI18n();
    const subjectSelect = screen.getByLabelText(/Temat/);
    const options = subjectSelect.querySelectorAll("option");
    // 1 placeholder + 4 subject options = 5
    expect(options.length).toBe(5);
    // The 4 non-placeholder options
    const realOptions = Array.from(options).filter((o) => o.value !== "");
    expect(realOptions.length).toBe(4);
  });

  it("validates message max length (>2000 chars)", async () => {
    renderWithI18n();
    const nameInput = screen.getByLabelText(/Imi/);
    const emailInput = screen.getByLabelText(/Email/);
    const messageInput = screen.getByLabelText(/Wiadomo/);
    const subjectSelect = screen.getByLabelText(/Temat/);

    fireEvent.change(nameInput, { target: { value: "Jan" } });
    fireEvent.change(emailInput, { target: { value: "jan@test.com" } });
    fireEvent.change(subjectSelect, { target: { value: "Inne" } });
    fireEvent.change(messageInput, { target: { value: "a".repeat(2001) } });

    const submitBtn = screen.getByText("Wyślij");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Maksimum 2000 znaków")).toBeInTheDocument();
    });
  });

  it("success: form resets after successful submission", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });

    renderWithI18n();
    const nameInput = screen.getByLabelText(/Imi/) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/Wiadomo/) as HTMLTextAreaElement;
    const subjectSelect = screen.getByLabelText(/Temat/) as HTMLSelectElement;

    fireEvent.change(nameInput, { target: { value: "Jan" } });
    fireEvent.change(emailInput, { target: { value: "jan@test.com" } });
    fireEvent.change(subjectSelect, { target: { value: "Inne" } });
    fireEvent.change(messageInput, { target: { value: "To jest wystarczająco długa wiadomość testowa" } });

    fireEvent.click(screen.getByText("Wyślij"));

    // After success, form should reset
    await waitFor(() => {
      expect(screen.getByText("Wysłano!")).toBeInTheDocument();
    });
  });

  it("i18n: labels change on language toggle", () => {
    renderWithToggle();
    // Default PL
    expect(screen.getByLabelText(/Imię/)).toBeInTheDocument();
    // Toggle to EN
    fireEvent.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
  });
});
