export interface Venue {
  id: string; // Changed from number to string for UUID
  name: string;
  image: string;
  price: string;
  baseMembers: number;
  extraPersonCharge: string;
  decorationFee: string;
  screenSize: string;
  refundPolicy: string;
  slots: string[];
  features: string[];
}

export const venuesData: Venue[] = [
  {
    id: "eaec6d1f-37d6-4d75-b56d-3c87c5c7b1c4", // Changed to UUID
    name: 'Luna',
    image:
      'https://i.pinimg.com/736x/78/ff/cc/78ffccdd2071737b2cfc15bc1ab5bae4.jpg',
    price: '₹1999/-',
    baseMembers: 6,
    extraPersonCharge: '₹249/-',
    decorationFee: '₹499/-',
    screenSize: '120" screen with Dolby sound',
    refundPolicy: 'Refund if canceled 72 hours in advance',
    slots: [
      '9:30am - 12:30pm',
      '1:00pm - 4:00pm',
      '4:30pm - 7:30pm',
      '8:00pm - 9:30pm',
      '10:00pm - 1:00am',
    ],
    features: [
      'Premium sound system',
      'Comfortable seating',
      'Climate control',
      'Ambient lighting',
      'Refreshment service',
    ],
  },
  {
    id: "f7c1d8a3-2e5b-4c9f-a1d6-8b4e7f3c2a5b", // Changed to UUID
    name: 'Rosa',
    image:
      'https://i.pinimg.com/736x/7e/65/e3/7e65e33ee26c2f125fbf50f68f80a957.jpg',
    price: '₹999/-',
    baseMembers: 2,
    extraPersonCharge: '₹249/-',
    decorationFee: '₹499/-',
    screenSize: '120" screen with Dolby sound',
    refundPolicy: 'Refund if canceled 72 hours in advance',
    slots: [
      '9:00am - 12:00pm',
      '12:30pm - 3:30pm',
      '4:00pm - 5:30pm',
      '6:00pm - 9:00pm',
      '9:30pm - 12:30am',
    ],
    features: [
      'Intimate setting',
      'Premium acoustics',
      'Mood lighting',
      'Private atmosphere',
      'Refreshment service',
    ],
  },
  {
    id: "b9e2a4c6-1f8d-4a7e-9c3b-5d2e8f1a4b7c", // Changed to UUID
    name: 'Aura',
    image:
      'https://i.pinimg.com/736x/97/d4/31/97d431eb8c5fdeba1df8a5c0804a1c3c.jpg',
    price: '₹1499/-',
    baseMembers: 4,
    extraPersonCharge: '₹249/-',
    decorationFee: '₹499/-',
    screenSize: '133" screen with Dolby sound',
    refundPolicy: 'Refund if canceled 72 hours in advance',
    slots: [
      '9:30am - 12:30pm',
      '1:00pm - 4:00pm',
      '4:30pm - 6:00pm',
      '6:30pm - 9:30pm',
      '10:00pm - 1:00am',
    ],
    features: [
      'Spacious layout',
      'Premium sound',
      'Ambient lighting',
      'Lounge area',
      'Refreshment service',
    ],
  },
  {
    id: "d5a7b2e9-3c4f-4d8e-b6a1-9f2c8e3d7a4b", // Changed to UUID
    name: 'Mini Max',
    image:
      'https://i.pinimg.com/736x/24/a6/40/24a6405a8663c52707a5c9951a8c4a4b.jpg',
    price: '₹2499/-',
    baseMembers: 8,
    extraPersonCharge: '₹249/-',
    decorationFee: '₹499/-',
    screenSize: '165" screen with Dolby sound',
    refundPolicy: 'Refund if canceled 72 hours in advance',
    slots: [
      '10:00am - 1:00pm',
      '1:30pm - 4:30pm',
      '5:00pm - 6:30pm',
      '7:00pm - 10:00pm',
      '10:30pm - 1:00am',
    ],
    features: [
      'Largest screen size',
      'Premium sound system',
      'Party lighting',
      'Extended seating',
      'Full service options',
    ],
  },
];