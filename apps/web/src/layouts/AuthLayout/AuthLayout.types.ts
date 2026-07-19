import type { ReactNode } from "react";
/** Props for the split-screen authentication page layout. */
export interface AuthLayoutProps {
  /** Product identity content. */ brand: ReactNode;
  /** Form or authentication process content. */ children: ReactNode;
  /** Editorial content for the branded panel. */ intro: ReactNode;
  /** Optional release or issue marker. */ issueNumber?: string;
}
