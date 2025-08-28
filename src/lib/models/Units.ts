export type Unit =
  | "piece"
  | "slice"
  | "pinch"
  | "dash"
  | "handful"
  | "clove"
  | "bunch"
  | "sprig"
  | "stick"
  | "can"
  | "jar"
  | "packet"
  | "tsp"
  | "tbsp"
  | "cup"
  | "ml"
  | "l"
  | "fl oz"
  | "pt"
  | "qt"
  | "gal"
  | "g"
  | "kg"
  | "oz"
  | "lb";

export const UNITS: { label: string; value: Unit }[] = [
  { label: "Piece", value: "piece" },
  { label: "Slice", value: "slice" },
  { label: "Pinch", value: "pinch" },
  { label: "Dash", value: "dash" },
  { label: "Handful", value: "handful" },
  { label: "Clove", value: "clove" },
  { label: "Bunch", value: "bunch" },
  { label: "Sprig", value: "sprig" },
  { label: "Stick", value: "stick" },
  { label: "Can", value: "can" },
  { label: "Jar", value: "jar" },
  { label: "Packet", value: "packet" },
  { label: "Teaspoon (tsp)", value: "tsp" },
  { label: "Tablespoon (tbsp)", value: "tbsp" },
  { label: "Cup", value: "cup" },
  { label: "Milliliter (ml)", value: "ml" },
  { label: "Liter (l)", value: "l" },
  { label: "Fluid Ounce (fl oz)", value: "fl oz" },
  { label: "Pint (pt)", value: "pt" },
  { label: "Quart (qt)", value: "qt" },
  { label: "Gallon (gal)", value: "gal" },
  { label: "Gram (g)", value: "g" },
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Ounce (oz)", value: "oz" },
  { label: "Pound (lb)", value: "lb" }
];