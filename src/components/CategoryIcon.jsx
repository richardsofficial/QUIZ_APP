import React from 'react';
import {
  Sparkles,
  Atom,
  Calculator,
  Cpu,
  Code2,
  Landmark,
  Globe2,
  Trophy,
  HelpCircle,
} from 'lucide-react';

const iconMap = {
  Sparkles,
  Atom,
  Calculator,
  Cpu,
  Code2,
  Landmark,
  Globe2,
  Trophy,
};

export default function CategoryIcon({ name, size = 22, color = 'currentColor', className = '' }) {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent size={size} color={color} className={className} />;
}
