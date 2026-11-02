export type GalleryImage = { src: string; alt: string };

export type GalleryCategory = "team" | "manufacturing" | "quality" | "supply";
export type GalleryImages = Record<GalleryCategory, GalleryImage[]>;

// Descriptions of the actual supplied photographs; unknown future files get a neutral category label.
export const insideSgsAlt: Record<string, string> = {
  "team_1.jpg": "Eight WISGSHL team members standing together in a lighting product showroom",
  "manufacturing_1.png": "Lighting assembly equipment with bulb housings on a conveyor",
  "manufacturing_2.png": "Equipment handling linear lighting components",
  "quality_1.png": "Illuminated lighting products arranged on an inspection bench",
  "quality_2.jpg": "People reviewing equipment and lighting components",
  
  "supply_1.png": "WISGSHL product cartons being loaded into a shipping container",
  "supply_2.png": "A representative beside packaged products and a shipping container",
  "supply_3.png": "WISGSHL representative in a room with stacked product cartons",
};

// Permanent editorial presentation; only image placement alternates.
export const insideSgsCategories: {
  id: "manufacturing" | "quality" | "supply";
  label: string;
  title: string;
  description: string;
  imageSide: "left" | "right";
}[] = [
  { id: "manufacturing", label: "MANUFACTURING", title: "Product Manufacturing", description: "Explore our lighting manufacturing and assembly processes, supporting the production of LED lighting solutions for commercial, industrial and outdoor applications.", imageSide: "right" },
  { id: "quality", label: "QUALITY PROCESS", title: "Quality Inspection", description: "Discover the inspection and quality processes supporting our product requirements.", imageSide: "left" },
  { id: "supply", label: "GLOBAL SUPPLY", title: "Packaging & Global Supply", description: "Discover how products are prepared and coordinated for international supply.", imageSide: "right" },
];
