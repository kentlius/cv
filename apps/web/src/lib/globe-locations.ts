export interface GlobePin {
  id: "shizuoka" | "tangerang" | "bandung";
  place: string;
  coords: [number, number];
  size: number;
  color: [number, number, number];
  current: boolean;
  labelSide: "above" | "below";
  staticX: number;
  staticY: number;
}

export const GLOBE_PINS: GlobePin[] = [
  {
    id: "shizuoka",
    place: "Shizuoka",
    coords: [34.9756, 138.3828],
    size: 0.025,
    color: [0.09, 0.09, 0.09],
    current: true,
    labelSide: "above",
    staticX: 69.8,
    staticY: 12.4,
  },
  {
    id: "tangerang",
    place: "Tangerang",
    coords: [-6.1783, 106.6319],
    size: 0.04,
    color: [0.145, 0.145, 0.145],
    current: false,
    labelSide: "above",
    staticX: 48.1,
    staticY: 39.7,
  },
  {
    id: "bandung",
    place: "Bandung",
    coords: [-6.9175, 107.6191],
    size: 0.04,
    color: [0.145, 0.145, 0.145],
    current: false,
    labelSide: "below",
    staticX: 49,
    staticY: 40.3,
  },
];

export function pinForLocation(label?: string) {
  if (!label) return undefined;
  const normalized = label.toLowerCase();
  return GLOBE_PINS.find((pin) =>
    normalized.includes(pin.place.toLowerCase()),
  );
}

export const GLOBE_HREF = "#globe";
