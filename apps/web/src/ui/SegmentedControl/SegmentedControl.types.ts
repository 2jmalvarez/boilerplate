import type { VariantProps } from "class-variance-authority"; import type { segmentedControlVariants } from "./SegmentedControl.variant";
/** One selectable option in a segmented control. */
export interface SegmentedOption<T extends string> { /** Prevents selection of this option. */ disabled?: boolean; /** Visible option label. */ label: string; /** Controlled value emitted on selection. */ value: T; }
/** Props for a controlled group of mutually exclusive toggle buttons. */
export interface SegmentedControlProps<T extends string> extends VariantProps<typeof segmentedControlVariants> { /** Accessible name for the control group. */ "aria-label": string; /** Receives the newly selected value. */ onChange: (value: T) => void; /** Available choices. */ options: readonly SegmentedOption<T>[]; /** Current selected value. */ value: T; }
