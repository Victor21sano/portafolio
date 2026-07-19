export const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

export const BARBER_IMAGES = {
  hero: unsplash("1503951914875-452162b0f3f1", 1800),
  about: unsplash("1647140655214-e4a2d914971f", 1200),
  cta: unsplash("1512690459411-b9245aed614b", 1800),
  gallery: [
    unsplash("1647140655214-e4a2d914971f", 900),
    unsplash("1599351431202-1e0f0137899a", 900),
    unsplash("1503951914875-452162b0f3f1", 900),
    unsplash("1512690459411-b9245aed614b", 900),
    unsplash("1588771930296-88c2cb03f386", 900),
    unsplash("1621605815971-fbc98d665033", 900)
  ],
  // Retratos del equipo para el selector de barbero (Carlos, Miguel, Andrés).
  team: [
    unsplash("1506794778202-cad84cf45f1d", 600),
    unsplash("1567894340315-735d7c361db0", 600),
    unsplash("1618077360395-f3068be8e001", 600)
  ]
};

export const NAIL_IMAGES = {
  hero: [
    unsplash("1610992015732-2449b76344bc", 1000),
    unsplash("1604654894610-df63bc536371", 1000),
    unsplash("1519014816548-bf5fe059798b", 1000)
  ],
  appointment: [
    unsplash("1610992015732-2449b76344bc", 900),
    unsplash("1604654894610-df63bc536371", 900)
  ],
  portfolio: [
    unsplash("1610992015732-2449b76344bc", 1000),
    unsplash("1604654894610-df63bc536371", 1000),
    unsplash("1519014816548-bf5fe059798b", 1000),
    unsplash("1522337660859-02fbefca4702", 1000),
    unsplash("1600948836101-f9ffda59d250", 1000),
    unsplash("1599948128020-9a44505b0d1b", 1000)
  ]
};

export const LASH_IMAGES = {
  hero: unsplash("1772235616130-b80e12f0ab7a", 1200),
  cta: unsplash("1583001931096-959e9a1a6223", 1200),
  gallery: [
    unsplash("1772235616130-b80e12f0ab7a", 900),
    unsplash("1583001931096-959e9a1a6223", 900),
    unsplash("1522337360788-8b13dee7a37e", 900),
    unsplash("1512496015851-a90fb38ba796", 900),
    unsplash("1508214751196-bcfd4ca60f91", 900),
    unsplash("1522335789203-aabd1fc54bc9", 900)
  ]
};

export const MEDICAL_IMAGES = {
  hero: unsplash("1576091160550-2173dba999ef", 1400),
  reception: unsplash("1764727291644-5dcb0b1a0375", 1400),
  doctors: [
    unsplash("1678695972687-033fa0bdbac9", 900),
    unsplash("1612349317150-e413f6a5b16d", 900),
    unsplash("1559839734-2b71ea197ec2", 900),
    unsplash("1582750433449-648ed127bb54", 900)
  ],
  facilities: [
    unsplash("1764727291644-5dcb0b1a0375", 700),
    unsplash("1586773860418-d37222d8fce3", 700),
    unsplash("1576091160550-2173dba999ef", 700),
    unsplash("1579684385127-1ef15d508118", 700)
  ]
};

export const THERAPY_IMAGES = {
  hero: unsplash("1746021513193-a314945d15c4", 1200)
};

export const TRAVEL_IMAGES = {
  hero: unsplash("1507525428034-b723cf961d3e", 1800),
  cta: unsplash("1500530855697-b586d89ba3ee", 1800),
  destinations: {
    Ixtapa: unsplash("1507525428034-b723cf961d3e", 1200),
    "Ciudad de Guanajuato": unsplash("1518105779142-d975f22f1b0a", 1200),
    "Grutas de Tolantongo": unsplash("1506744038136-46273834b3fb", 1200),
    "Peña de Bernal": unsplash("1464822759023-fed622ff2c3b", 1200),
    "Huasteca Potosina": unsplash("1500534314209-a25ddb2bd429", 1200),
    "San Miguel de Allende": unsplash("1518105779142-d975f22f1b0a", 1200),
    Taxco: unsplash("1512813195386-6cf811ad3542", 1200),
    "Valle de Bravo": unsplash("1500530855697-b586d89ba3ee", 1200)
  }
};
