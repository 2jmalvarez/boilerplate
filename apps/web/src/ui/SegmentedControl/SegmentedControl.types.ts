import type { VariantProps } from "class-variance-authority"; import type { segmentedControlVariants } from "./SegmentedControl.variant";
export interface SegmentedOption<T extends string> { disabled?: boolean; label: string; value: T; }
export interface SegmentedControlProps<T extends string> extends VariantProps<typeof segmentedControlVariants> { "aria-label": string; onChange: (value: T) => void; options: readonly SegmentedOption<T>[]; value: T; }
