export const SITE_NAME = 'Portal de Ingeniería';
export const SITE_TAGLINE = 'Revista Digital y Directorio de Ciencia, Tecnología e Innovación';
export const SITE_DESCRIPTION = 'Plataforma editorial dedicada a la divulgación de las ramas de la ingeniería, avances científicos, proyectos de infraestructura y el ecosistema de I+D en Argentina y el mundo.';

export interface NavigationItem {
  label: string;
  path: string;
  description?: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Ingenierías', path: '/ingenierias' },
  { label: 'Actualidad', path: '/actualidad' },
  { label: 'Instituciones', path: '/instituciones' },
  { label: 'Publicaciones', path: '/publicaciones' },
];

export const SOCIAL_LINKS = [
  { name: 'X / Twitter', url: 'https://twitter.com', icon: 'logo-twitter' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'logo-linkedin' },
  { name: 'GitHub', url: 'https://github.com', icon: 'logo-github' },
  { name: 'YouTube', url: 'https://youtube.com', icon: 'logo-youtube' },
];
