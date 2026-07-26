import { Scene } from './video-scene-data';

export const bostonMaSceneData: Scene = {
  id: 'boston-ma',
  city: 'Boston',
  state: 'MA',
  videoId: 'qRZhhQ7lNU8',
  scenes: [
    {
      id: 'boston-intro',
      type: 'intro',
      duration_seconds: 5,
      script: "In Boston, Massachusetts, you're not alone on this journey. True Joy Birthing connects you with trusted birth professionals.",
      visual: {
        image: '/images/boston-ma-v3-1200.webp',
        alt: 'Pregnant woman silhouette against Boston city landscape at golden hour'
      }
    },
    {
      id: 'boston-doulas',
      type: 'portrait',
      duration_seconds: 8,
      script: "Meet Tara Campbell, a high-risk birth doula with over 24 years of experience. She brings advanced clinical knowledge and deep emotional support to medically complex pregnancies.",
      visual: {
        image: '/images/provider-boston-ma-tara-campbell.webp',
        alt: 'Tara Campbell, birth doula in Boston'
      }
    },
    {
      id: 'boston-doulas-2',
      type: 'portrait',
      duration_seconds: 8,
      script: "Emily Goodman-Simeone combines birth doula work with lactation counseling. Her holistic approach supports families through the perinatal period.",
      visual: {
        image: '/images/provider-boston-ma-emily-goodman-simeone.webp',
        alt: 'Emily Goodman-Simeone, birth doula and lactation counselor'
      }
    },
    {
      id: 'boston-doulas-3',
      type: 'portrait',
      duration_seconds: 8,
      script: "Lantharra Langlois serves Boston's diverse communities with culturally grounded doula care. She specializes in creating welcoming support for BIPOC and first-time parents.",
      visual: {
        image: '/images/provider-boston-ma-lantharra-langlois.webp',
        alt: 'Lantharra Langlois, birth doula serving Boston's diverse communities'
      }
    },
    {
      id: 'boston-doulas-4',
      type: 'portrait',
      duration_seconds: 8,
      script: "Nina Graham combines her experience as an NICU Registered Nurse with compassionate birth doula support. She brings clinical expertise to high-risk pregnancies.",
      visual: {
        image: '/images/provider-boston-ma-nina-graham.webp',
        alt: 'Nina Graham, NICU nurse and birth doula'
      }
    },
    {
      id: 'boston-hospitals',
      type: 'sequence',
      duration_seconds: 10,
      script: "Boston offers exceptional maternity care at teaching hospitals across the city. Brigham and Women's, Boston Medical Center, Massachusetts General Hospital, and Beth Israel Deaconess Medical Center all provide Level III NICUs and comprehensive maternity services.",
      visual: {
        type: 'sequence',
        images: [
          '/images/boston-ma-hospital-brigham.webp',
          '/images/boston-ma-hospital-bmc.webp',
          '/images/boston-ma-hospital-mgh.webp',
          '/images/boston-ma-hospital-bidmc.webp'
        ],
        alt: 'Boston's leading hospitals with NICUs'
      }
    },
    {
      id: 'boston-birth-centers',
      type: 'feature',
      duration_seconds: 6,
      script: "Birth Sanctuary Cambridge provides a home-like setting for low-risk pregnancies. Experience midwife-led care in a peaceful, supportive environment.",
      visual: {
        image: '/images/boston-ma-birth-sanctuary.webp',
        alt: 'Birth Sanctuary Cambridge birth center'
      }
    },
    {
      id: 'boston-support',
      type: 'support-scene',
      duration_seconds: 6,
      script: "Continuous support makes all the difference. Birth doulas walk with you through labor, providing physical comfort, emotional reassurance, and evidence-based information.",
      visual: {
        image: '/images/boston-ma-birth-support-v2.webp',
        alt: 'Pregnant woman receiving birth doula support in a hospital room'
      }
    },
    {
      id: 'boston-conclusion',
      type: 'outro',
      duration_seconds: 5,
      script: "Connect with True Joy Birthing to find your birth support team in Boston. Your journey deserves to be supported by people who understand.",
      visual: {
        image: '/images/boston-ma-v3-1200.webp',
        alt: 'Boston birth support team'
      }
    }
  ]
};
