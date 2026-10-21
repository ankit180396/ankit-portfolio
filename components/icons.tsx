import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export function Github(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 3 5.1 5.1 0 0 0 19.2 1S18 1 15 2.5a13.4 13.4 0 0 0-7 0C5 1 3.8 1 3.8 1a5.1 5.1 0 0 0-.1 2A5.5 5.5 0 0 0 2.2 7.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4" />
      <path d="M8 19c-3 .9-3-1.5-4.2-2" />
    </svg>
  );
}

export function Linkedin(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <path d="M2 9h4v12H2z" />
      <path d="M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.6 5.5a2.5 2.5 0 0 1-2.8 0L2 7" />
    </svg>
  );
}

export function Sparkles(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m12 3-1.2 3.2a2 2 0 0 1-1.2 1.2L6.4 8.6l3.2 1.2a2 2 0 0 1 1.2 1.2l1.2 3.2 1.2-3.2a2 2 0 0 1 1.2-1.2l3.2-1.2-3.2-1.2a2 2 0 0 1-1.2-1.2L12 3Z" />
      <path d="m5 15-.7 1.8a1 1 0 0 1-.6.6L2 18l1.7.6a1 1 0 0 1 .6.6L5 21l.7-1.8a1 1 0 0 1 .6-.6L8 18l-1.7-.6a1 1 0 0 1-.6-.6L5 15Z" />
      <path d="m19 15-.5 1.2a1 1 0 0 1-.6.6l-1.2.5 1.2.5a1 1 0 0 1 .6.6l.5 1.2.5-1.2a1 1 0 0 1 .6-.6l1.2-.5-1.2-.5a1 1 0 0 1-.6-.6L19 15Z" />
    </svg>
  );
}

export function Code(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m8 9-4 3 4 3" />
      <path d="m16 9 4 3-4 3" />
      <path d="m14 5-4 14" />
    </svg>
  );
}

export function Database(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  );
}

export function Brain(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M9.5 4.5A3 3 0 0 0 4 6a3 3 0 0 0 .5 5.5A3 3 0 0 0 6 17a3 3 0 0 0 5.5 1.5V5A2.5 2.5 0 0 0 9.5 4.5Z" />
      <path d="M14.5 4.5A3 3 0 0 1 20 6a3 3 0 0 1-.5 5.5A3 3 0 0 1 18 17a3 3 0 0 1-5.5 1.5V5a2.5 2.5 0 0 1 2-0.5Z" />
      <path d="M6 10h3" />
      <path d="M15 10h3" />
      <path d="M8 14h3.5" />
      <path d="M12.5 14H16" />
    </svg>
  );
}

export function Send(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
