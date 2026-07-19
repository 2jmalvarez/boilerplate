import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "../ui/Button/ButtonLink";

export function NotFoundPage() {
  return (
    <main className="not-found">
      <span>404 / Hoja extraviada</span>
      <h1>Esta página no está en el archivo.</h1>
      <ButtonLink to="/" variant="primary">
        <ArrowLeft aria-hidden="true" size={18} /> Volver al inicio
      </ButtonLink>
    </main>
  );
}
