import { createContext, useContext, useRef, useState } from "react";

/**
 * Formulaire avec validation en français, à la place des infobulles natives du navigateur.
 * Les contraintes restent déclarées en HTML (required, type="email", min, max, minLength) ;
 * le formulaire est en noValidate et chaque erreur est affichée sous le champ via <FieldError>.
 */
const ErrorsContext = createContext({});

export function frenchMessage(el) {
  const v = el.validity;
  const value = typeof el.value === "string" ? el.value : "";
  if (v.valueMissing || (el.required && value.trim() === "")) return "Champ requis";
  if (v.badInput) return "Veuillez saisir un nombre valide";
  if (v.typeMismatch && el.type === "email") return "Adresse email invalide";
  if (v.typeMismatch) return "Format invalide";
  if (v.tooShort) return `${el.minLength} caractères minimum`;
  if (v.tooLong) return `${el.maxLength} caractères maximum`;
  if (v.rangeUnderflow) return `La valeur doit être supérieure ou égale à ${el.min}`;
  if (v.rangeOverflow) return `La valeur doit être inférieure ou égale à ${el.max}`;
  if (v.stepMismatch) return "Valeur non autorisée";
  if (v.patternMismatch) return el.title || "Format invalide";
  return null;
}

export function ValidatedForm({ onValidSubmit, children, ...props }) {
  const ref = useRef(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = {};
    for (const el of ref.current.elements) {
      if (!el.name || !el.willValidate) continue;
      const msg = frenchMessage(el);
      el.classList.toggle("is-invalid", Boolean(msg));
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg && !found[el.name]) found[el.name] = msg;
    }
    setErrors(found);
    if (Object.keys(found).length === 0) onValidSubmit(e);
    else ref.current.querySelector(".is-invalid")?.focus();
  };

  // Efface l'erreur d'un champ dès qu'il devient valide.
  const recheck = (e) => {
    const el = e.target;
    if (!el.name || !errors[el.name] || frenchMessage(el)) return;
    el.classList.remove("is-invalid");
    el.setAttribute("aria-invalid", "false");
    setErrors(({ [el.name]: _removed, ...rest }) => rest);
  };

  return (
    <ErrorsContext.Provider value={errors}>
      <form ref={ref} noValidate onSubmit={handleSubmit} onInput={recheck} onChange={recheck} {...props}>
        {children}
      </form>
    </ErrorsContext.Provider>
  );
}

export function FieldError({ name }) {
  const msg = useContext(ErrorsContext)[name];
  return msg ? <div className="invalid-feedback d-block">{msg}</div> : null;
}
