import * as LucideIcons from "lucide-react";

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function DynamicIcon({ name, size = 24, className = "" }: DynamicIconProps) {
  // @ts-ignore
  const Icon = LucideIcons[name];

  if (!Icon) {
    console.warn(`Icon ${name} not found in lucide-react`);
    return null;
  }

  return <Icon size={size} className={className} />;
}
