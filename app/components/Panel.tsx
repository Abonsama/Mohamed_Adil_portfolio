import React from "react";
import Link from "next/link";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  as?: "div";
}

// Static panel — a flat card, thin 1px border, no glow. Use for stat
// blocks, info cards, anything non-interactive.
export function Panel({ children, className = "" }: PanelProps) {
  return <div className={`panel p-5 ${className}`}>{children}</div>;
}

interface PanelLinkProps {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  className?: string;
}

// Interactive panel — same flat card, but the border lights up to the
// current accent color on hover/focus. This is the ONLY place accent
// color shows up as more than a small dot or line of text.
export function PanelLink({ children, href, external, className = "" }: PanelLinkProps) {
  const classes = `panel panel-interactive p-5 block ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}