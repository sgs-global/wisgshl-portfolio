export const inquiryEmail = "info@globalsgs.com";
export const officeAddress = "No. 27, Tongyu Rich Industry Zone, Ganqing, Longgang District, Shenzhen City, Guangdong Province, China";
export const officeMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`;
export const productRequirements: Record<string, { name: string; label: string; placeholder: string }[]> = {
  "LED Floodlights": [
    { name: "power", label: "Required power / wattage", placeholder: "Preferred wattage or range" },
    { name: "installation", label: "Installation / application", placeholder: "Warehouse exterior, sports area, etc." },
  ],
  "Portable Power Stations": [
    { name: "capacity", label: "Required capacity / output", placeholder: "Target Wh and output power, if known" },
    { name: "equipment", label: "Equipment to power", placeholder: "Devices, load and operating time" },
  ],
  "Solar Street Lights": [
    { name: "mounting", label: "Pole height / installation", placeholder: "Height and location, if known" },
    { name: "operation", label: "Lighting requirements", placeholder: "Hours per night and project conditions" },
  ],
  "LED Street Lights": [
    { name: "power", label: "Required power / voltage", placeholder: "Preferred wattage and supply voltage" },
    { name: "mounting", label: "Pole height / application", placeholder: "Road, car park or project requirements" },
  ],
  "LED Strip Lights": [
    { name: "length", label: "Required length / voltage", placeholder: "Total metres and preferred voltage" },
    { name: "light", label: "Light colour / installation", placeholder: "Colour, indoor/outdoor use and any IP requirement" },
  ],
};
export const inquiryCategories = [...Object.keys(productRequirements), "Other / OEM & ODM"];
