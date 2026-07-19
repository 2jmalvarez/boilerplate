import { badgeVariants } from "./Badge.variant"; import type { BadgeProps } from "./Badge.types"; import "./Badge.css";
export function Badge({ children, tone }: Readonly<BadgeProps>) { return <span className={badgeVariants({ tone })}>{children}</span>; }
