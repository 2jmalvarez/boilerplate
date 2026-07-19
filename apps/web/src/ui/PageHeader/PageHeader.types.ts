import type { ReactNode } from "react";
/** Props for a page-level title block with optional context and actions. */
export interface PageHeaderProps {
  /** Action placed beside the heading. */ action?: ReactNode;
  /** Supporting page description. */ description?: string;
  /** Editorial context above the title. */ eyebrow?: string;
  /** Main page heading. */ title: string;
}
