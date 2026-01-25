import { Home, MessageCircle, Wrench, Code2, Heart, type LucideProps } from 'lucide-react';
import { forwardRef } from 'react';

export type RoomIconType = 'home' | 'entryway' | 'workshop' | 'maker' | 'heart';

interface RoomIconProps extends LucideProps {
  icon: RoomIconType;
}

const iconMap: Record<RoomIconType, typeof Home> = {
  home: Home,
  entryway: MessageCircle,
  workshop: Wrench,
  maker: Code2,
  heart: Heart,
};

/**
 * A unified icon component for room navigation.
 * Maps room identifiers to consistent Lucide icons.
 *
 * @example
 * <RoomIcon icon="workshop" className="h-6 w-6" />
 * <RoomIcon icon="home" className="h-5 w-5 text-white" />
 */
export const RoomIcon = forwardRef<SVGSVGElement, RoomIconProps>(
  ({ icon, ...props }, ref) => {
    const IconComponent = iconMap[icon];
    return <IconComponent ref={ref} aria-hidden="true" {...props} />;
  }
);

RoomIcon.displayName = 'RoomIcon';

/**
 * Helper function to get the RoomIconType from a room's icon string.
 * Used for compatibility with the existing Room type.
 */
export function getRoomIconType(iconName: string): RoomIconType {
  switch (iconName) {
    case 'MessageCircle':
      return 'entryway';
    case 'Wrench':
      return 'workshop';
    case 'Code2':
      return 'maker';
    default:
      return 'home';
  }
}
