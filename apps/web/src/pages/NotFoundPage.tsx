import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="not-found">
      <span>404 / Hoja extraviada</span>
      <h1>Esta página no está en el archivo.</h1>
      <Link className="button button-primary" to="/">
        <ArrowLeft aria-hidden="true" size={18} /> Volver al inicio
      </Link>
    </main>
  );
}
