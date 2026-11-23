import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'aeroespacial',
    slug: 'aeroespacial',
    name: 'Aeroespacial & Satélites',
    description: 'Misiones espaciales, satélites de observación, propulsión y tecnología de órbita baja.',
    icon: 'planet-outline',
  },
  {
    id: 'nuclear-energia',
    slug: 'nuclear-energia',
    name: 'Energía & Nuclear',
    description: 'Reactores modulares (SMR), transición energética, fusión nuclear y redes inteligentes.',
    icon: 'flash-outline',
  },
  {
    id: 'computacion-ia',
    slug: 'computacion-ia',
    name: 'IA & Computación',
    description: 'Supercómputo, algoritmos de aprendizaje profundo, ciberseguridad y gemelos digitales.',
    icon: 'hardware-chip-outline',
  },
  {
    id: 'biomedica-salud',
    slug: 'biomedica-salud',
    name: 'Biomédica & Salud',
    description: 'Prótesis de última generación, bioimpresión, equipamiento hospitalario y nanomedicina.',
    icon: 'fitness-outline',
  },
  {
    id: 'infraestructura-civil',
    slug: 'infraestructura-civil',
    name: 'Infraestructura & Civil',
    description: 'Grandes obras hidráulicas, estructuras sismorresistentes, transporte y materiales sostenibles.',
    icon: 'business-outline',
  },
  {
    id: 'robotica-industria',
    slug: 'robotica-industria',
    name: 'Robótica & Automatización',
    description: 'Manufactura avanzada, mecatrónica, vehículos no tripulados y logística autónoma.',
    icon: 'cog-outline',
  },
  {
    id: 'quimica-materiales',
    slug: 'quimica-materiales',
    name: 'Materiales & Litio',
    description: 'Celdas electroquímicas de ion-litio/sodio, nanomateriales y química verde.',
    icon: 'flask-outline',
  },
];
