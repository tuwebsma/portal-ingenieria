import { EngineeringBranch } from '@/types';

const UBA_FI = 'Facultad de Ingeniería - Universidad de Buenos Aires';
const UBA_FI_URL = 'https://www.fi.uba.ar/';

const career = (
  id: string,
  slug: string,
  name: string,
  knowledgeArea: string,
  icon: string
): EngineeringBranch => ({
  id,
  slug,
  name,
  shortDescription: `Carrera de grado de la Facultad de Ingeniería de la Universidad de Buenos Aires.`,
  fullDescription: `${name} es una carrera de grado ofrecida por la Facultad de Ingeniería de la Universidad de Buenos Aires. Este espacio reunirá información institucional general y materiales oficiales relacionados con la carrera.`,
  knowledgeArea,
  institution: UBA_FI,
  institutionUrl: UBA_FI_URL,
  icon,
  bannerImage: '',
  keyAreas: [],
  flagshipProjects: [],
  careerImpact: '',
  technologies: [],
  relatedKeywords: [],
});

export const ENGINEERING_BRANCHES: EngineeringBranch[] = [
  career('bioingenieria', 'bioingenieria', 'Bioingeniería', 'Biomedicina e ingeniería', 'pulse-outline'),
  career('ingenieria-civil', 'ingenieria-civil', 'Ingeniería Civil', 'Construcción e infraestructura', 'construct-outline'),
  career('ingenieria-mecanica', 'ingenieria-mecanica', 'Ingeniería Mecánica', 'Diseño y sistemas mecánicos', 'settings-outline'),
  career('ingenieria-agrimensura', 'ingenieria-en-agrimensura', 'Ingeniería en Agrimensura', 'Geodesia y catastro', 'map-outline'),
  career('ingenieria-industrial', 'ingenieria-industrial', 'Ingeniería Industrial', 'Procesos y gestión industrial', 'business-outline'),
  career('ingenieria-naval', 'ingenieria-naval', 'Ingeniería Naval', 'Arquitectura naval y sistemas marinos', 'boat-outline'),
  career('ingenieria-energia-electrica', 'ingenieria-en-energia-electrica', 'Ingeniería en Energía Eléctrica', 'Generación y sistemas eléctricos', 'flash-outline'),
  career('ingenieria-quimica', 'ingenieria-quimica', 'Ingeniería Química', 'Procesos químicos y materiales', 'flask-outline'),
  career('ingenieria-electronica', 'ingenieria-electronica', 'Ingeniería Electrónica', 'Electrónica y telecomunicaciones', 'hardware-chip-outline'),
  career('licenciatura-analisis-sistemas', 'licenciatura-en-analisis-de-sistemas', 'Licenciatura en Análisis de Sistemas', 'Sistemas de información y software', 'code-slash-outline'),
  career('ingenieria-informatica', 'ingenieria-informatica', 'Ingeniería en Informática', 'Informática y sistemas computacionales', 'laptop-outline'),
  career('ingenieria-alimentos', 'ingenieria-en-alimentos', 'Ingeniería en Alimentos', 'Procesos alimentarios', 'nutrition-outline'),
  career('ingenieria-petroleo', 'ingenieria-en-petroleo', 'Ingeniería en Petróleo', 'Exploración y producción petrolera', 'water-outline'),
];
