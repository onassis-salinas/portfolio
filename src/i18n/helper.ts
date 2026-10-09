const ui = {
  code: {
    es: "Código",
    en: "Code",
  },
  description: {
    es: "Desarrollo software de calidad para diversas organizaciones.",
    en: "I develop quality software for various organizations.",
  },

  projects: {
    es: "Productos",
    en: "Products",
  },
  contact: {
    es: "Contacto",
    en: "Contact",
  },
  email: {
    es: "Correo:",
    en: "Email:",
  },
  location: {
    es: "Ubicación:",
    en: "Location:",
  },
  locationText: {
    es: "Tijuana / San Diego",
    en: "Tijuana / San Diego",
  },
  github: {
    es: "GitHub:",
    en: "GitHub:",
  },
  visit: {
    es: "Visitar",
    en: "Visit",
  },
  nav_home: {
    es: "Inicio",
    en: "Home",
  },
  nav_contact: {
    es: "Contacto",
    en: "Contact",
  },
  other_projects: {
    es: "Otros proyectos",
    en: "Other projects",
  },
  description_capupet: {
    es: "SaaS todo en uno para negocios de grooming de mascotas. Permite gestionar clientes, mascotas, citas y más. Facilita la administración entre varios usuarios desde una sola plataforma.",
    en: "An all-in-one SaaS for pet grooming businesses. It manages clients, pets, appointments and more. Supports collaborative administration in a unified platform.",
  },
  description_capucare: {
    es: "Herramienta de administracion completa para centros de cuidado de animales, completamente gratuita. Los centros pueden administrar y publicar mascotas, registrar prospectos, tareas y mucho más.",
    en: "A full featured tool for animal care centers, completely free. Centers can manage and publish pets, register prospects, tasks and more.",
  },
  description_geometrybullets: {
    es: "Shooter 2D hecho en vanilla JavaScript, pesa solo ~14kb (4.5kb gzipped), hecho desde 0 con geometría y trigonometría.",
    en: "2D shooting game made in vanilla JavaScript, weighs only ~14kb (4.5kb gzipped), made from scratch with geometry and trigonometry.",
  },
  headTitle: {
    es: "Onassis Salinas",
    en: "Onassis Salinas",
  },
};

export type Locale = keyof (typeof ui)[keyof typeof ui];

export const t = (locale: Locale, text: keyof typeof ui) => {
  return ui[text][locale];
};
