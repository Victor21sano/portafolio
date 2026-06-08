/**
 * Contenido de prueba social por nicho (inspirado en Fresha, Booksy, Zocdoc,
 * StyleSeat). Son datos DEMO para el portafolio — no vienen de la BD.
 */

export type Testimonial = { name: string; text: string };
export type Stat = { n: string; l: string };

export type NicheContent = {
  rating: number;
  reviews: number;
  /** Cómo se le llama a quien deja la reseña */
  reviewerWord: string;
  stats: Stat[];
  testimonials: Testimonial[];
  /** Título de la sección de reseñas */
  proofTitle: string;
  /** Imagen showcase (parallax). DEMO — sustituir por fotos reales del negocio. */
  image: string;
  imageCaption: string;
};

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

const CONTENT: Record<string, NicheContent> = {
  barberia: {
    rating: 4.9,
    reviews: 324,
    reviewerWord: "clientes",
    proofTitle: "Lo que dicen los clientes",
    image: U("1503951914875-452162b0f3f1"),
    imageCaption: "Estilo que se nota",
    stats: [
      { n: "320+", l: "cortes al mes" },
      { n: "4.9★", l: "valoración" },
      { n: "8 años", l: "de oficio" }
    ],
    testimonials: [
      { name: "Diego R.", text: "El mejor fade de la zona. Reservé en 30 segundos y entré sin esperar." },
      { name: "Marco T.", text: "Puntuales y limpios. Ya no batallo mandando mensajes para apartar." },
      { name: "Luis H.", text: "Atención de primera y el degradado quedó perfecto. Recomendadísimo." }
    ]
  },
  lashista: {
    rating: 5.0,
    reviews: 212,
    reviewerWord: "clientas",
    proofTitle: "Mis clientas opinan",
    image: U("1583001931096-959e9a1a6223"),
    imageCaption: "Miradas que enamoran",
    stats: [
      { n: "200+", l: "miradas al mes" },
      { n: "5.0★", l: "valoración" },
      { n: "Cert.", l: "técnica certificada" }
    ],
    testimonials: [
      { name: "Valeria G.", text: "Mis pestañas duraron perfectas semanas. Súper detallista y delicada." },
      { name: "Renata M.", text: "El espacio es hermoso y agendar fue facilísimo. Volveré seguro." },
      { name: "Paola S.", text: "Quedé enamorada del resultado. Técnica impecable y muy limpia." }
    ]
  },
  manicurista: {
    rating: 4.9,
    reviews: 487,
    reviewerWord: "clientas",
    proofTitle: "Clientas felices",
    image: U("1610992015732-2449b76344bc"),
    imageCaption: "Diseños que brillan",
    stats: [
      { n: "1,200+", l: "clientas felices" },
      { n: "4.9★", l: "valoración" },
      { n: "50+", l: "diseños" }
    ],
    testimonials: [
      { name: "Andrea L.", text: "Los diseños son increíbles y duran muchísimo. ¡Me encanta venir!" },
      { name: "Sofía P.", text: "Reservar es súper fácil y siempre tienen horario. Trato divino." },
      { name: "Karla V.", text: "Mis uñas siempre quedan de revista. 100% recomendada." }
    ]
  },
  medico: {
    rating: 4.8,
    reviews: 156,
    reviewerWord: "pacientes",
    proofTitle: "Opiniones de pacientes",
    image: U("1576091160550-2173dba999ef"),
    imageCaption: "Atención profesional y cercana",
    stats: [
      { n: "12 años", l: "de experiencia" },
      { n: "4.8★", l: "valoración" },
      { n: "Cédula", l: "profesional verificada" }
    ],
    testimonials: [
      { name: "Jorge M.", text: "Consulta a tiempo y muy clara. Agendé en línea sin llamadas." },
      { name: "Lucía F.", text: "Trato humano y profesional. El recordatorio me llegó puntual." },
      { name: "Ana C.", text: "Excelente atención, explica todo con calma. Muy recomendable." }
    ]
  },
  terapeuta: {
    rating: 5.0,
    reviews: 94,
    reviewerWord: "consultantes",
    proofTitle: "Quienes vienen a terapia",
    image: U("1591343395082-e120087004b4"),
    imageCaption: "Un espacio para ti",
    stats: [
      { n: "100%", l: "confidencial" },
      { n: "5.0★", l: "valoración" },
      { n: "10 años", l: "acompañando" }
    ],
    testimonials: [
      { name: "Mariana D.", text: "Un espacio seguro y cálido. Reservar con discreción se agradece mucho." },
      { name: "Pablo E.", text: "Me sentí escuchado desde la primera sesión. Proceso muy respetuoso." },
      { name: "Tania R.", text: "Profesional y empática. Agendar mi sesión fue simple y privado." }
    ]
  }
};

const FALLBACK = CONTENT.medico;

export function nicheContent(nicho: string): NicheContent {
  return CONTENT[nicho] ?? FALLBACK;
}
