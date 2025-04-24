'use client'

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer = ({ name, className }: IconRendererProps) => {
  // You can implement your icon rendering logic here
  // For now, we'll just return the name as a fallback
  return <span className={className}>{name}</span>;
};