import { Room } from '@/types';

export const rooms: Room[] = [
  {
    id: 'entryway',
    name: 'Entryway',
    description: 'Meet your AI guide who knows everything about the Design Hub. Ask questions, get recommendations, and explore the house with personalized assistance.',
    icon: 'MessageCircle',
    route: '/entryway',
    color: '#6A2CFF', // electric-violet
  },
  {
    id: 'workshop',
    name: 'Workshop',
    description: 'Discover hands-on tool demos and tutorials. Learn about design systems, components, and development patterns through guided examples.',
    icon: 'Wrench',
    route: '/workshop',
    color: '#FF9A3D', // orange
  },
  {
    id: 'maker',
    name: 'Maker Studio',
    description: 'Get your hands dirty with interactive coding playgrounds. Write, edit, and run code in real-time to practice what you\'ve learned.',
    icon: 'Code2',
    route: '/maker',
    color: '#39E6FF', // cyan
  },
];

export function getRoomById(id: string): Room | undefined {
  return rooms.find((room) => room.id === id);
}

export function getRoomByRoute(route: string): Room | undefined {
  return rooms.find((room) => room.route === route || route.startsWith(room.route));
}
