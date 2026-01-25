import {
  Brain,
  BarChart2,
  MessageCircle,
  Palette,
  Globe,
  FlaskConical,
  Dna,
  Network,
  BookOpen,
  Hammer,
  Target,
  Scale,
  Zap,
  Atom,
  type LucideProps,
  type LucideIcon,
} from 'lucide-react';
import { forwardRef } from 'react';

/**
 * Semantic icon keys for modules, collections, and tracks.
 * These map to consistent Lucide icons throughout the app.
 */
export type ModuleIconKey =
  | 'brain'           // AI Fundamentals
  | 'bar-chart'       // ML Foundations
  | 'message-circle'  // LLM Essentials
  | 'palette'         // UI Development
  | 'globe'           // Responsible AI / CSO
  | 'flask'           // AI Algorithms
  | 'dna'             // Deep Learning
  | 'network'         // AI Applications
  | 'book-open'       // Learner Track
  | 'hammer'          // Builder Track
  | 'target'          // Leader Track
  | 'scale'           // Ethics & Safety
  | 'zap'             // Quick Reads
  | 'atom';           // React Fundamentals

interface ModuleIconProps extends LucideProps {
  iconKey: ModuleIconKey;
}

const iconMap: Record<ModuleIconKey, LucideIcon> = {
  'brain': Brain,
  'bar-chart': BarChart2,
  'message-circle': MessageCircle,
  'palette': Palette,
  'globe': Globe,
  'flask': FlaskConical,
  'dna': Dna,
  'network': Network,
  'book-open': BookOpen,
  'hammer': Hammer,
  'target': Target,
  'scale': Scale,
  'zap': Zap,
  'atom': Atom,
};

/**
 * A unified icon component for modules, collections, and tracks.
 * Maps semantic icon keys to consistent Lucide icons.
 *
 * @example
 * <ModuleIcon iconKey="brain" className="w-6 h-6" />
 * <ModuleIcon iconKey="flask" className="w-5 h-5 text-pink-400" />
 */
export const ModuleIcon = forwardRef<SVGSVGElement, ModuleIconProps>(
  ({ iconKey, ...props }, ref) => {
    const IconComponent = iconMap[iconKey];
    if (!IconComponent) {
      // Fallback to Brain if unknown key
      return <Brain ref={ref} aria-hidden="true" {...props} />;
    }
    return <IconComponent ref={ref} aria-hidden="true" {...props} />;
  }
);

ModuleIcon.displayName = 'ModuleIcon';

/**
 * Get all available module icon keys.
 * Useful for validation or iteration.
 */
export function getModuleIconKeys(): ModuleIconKey[] {
  return Object.keys(iconMap) as ModuleIconKey[];
}
