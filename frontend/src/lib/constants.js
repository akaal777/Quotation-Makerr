// Business constants for NewFriends SolarEnergy quotation app

export const VENDOR = {
  name: "NewFriends SolarEnergy",
  officeLine1: "Office: Ramdittewala Kanchiyan",
  officeLine2: "Near 4 Season Hotel, Mansa (Punjab-151505)",
  headOffice: "Head Office — V.P.O. Makha, Mansa, Punjab",
  contact: "98724-07002",
  tagline: "Clean power. Built for Punjab rooftops.",
};

export const SERVICES = [
  { value: "Solar Rooftop", label: "Solar Rooftop" },
];

// 3, 4, 5, ... 10, 12, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300, 400, 500
export const KW_RANGES = [
  "3 KW", "4 KW", "5 KW", "6 KW", "7 KW", "8 KW", "9 KW", "10 KW",
  "12 KW", "15 KW", "20 KW", "25 KW", "30 KW", "40 KW", "50 KW",
  "75 KW", "100 KW", "150 KW", "200 KW", "300 KW", "400 KW", "500 KW",
];

export const AMOUNT_PRESETS = [
  100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000,
  1500000, 2000000, 3000000, 5000000,
];

export const GST_RATE = 8.9; // percent

export const DEFAULT_ITEMS = [
  { sr: "I", label: "Solar PV Modules: Monoperc Bifacial DCR Panels (590Wp / 156 Cell) – 9 Nos." },
  { sr: "II", label: "Solar Inverter: [ ] kW Grid-Tied Inverter (Tata Power Solar Approved)" },
  { sr: "III", label: "Distribution Boxes: ACDB / DCDB" },
  { sr: "IV", label: "Module Mounting Structure: Elevated Structure / Hot-Dip Galvanized GI" },
  { sr: "V", label: "DC Electrical Cabling: Polycab / Birla DC Solar Wire" },
  { sr: "VI", label: "AC Electrical Cabling: Havells AC Wire" },
  { sr: "VII", label: "Earthing & Grounding: Heavy-duty Ground Earthing (250mm)" },
  { sr: "VIII", label: "Lightning Protection: Elite Lightning Arrester (LA)" },
  { sr: "IX", label: "Down-Conductor: Havells 16mm Copper Wire (LA to Earthing Strip Connection)" },
  { sr: "X", label: "Earthing Strip: 25x3 GI Strip" },
  { sr: "XI", label: "Hardware & Fasteners: Stainless Steel (SS) Nuts & Bolts" },
  { sr: "XII", label: "Structure Accessories: End Caps (60x40)" },
];

// Apply KW range to Solar Inverter row (II) — replaces [ ] kW with e.g. 3 KW
export const applyKwToItems = (items, kwRange) => {
  return items.map((it) => {
    if (it.sr === "II") {
      const kwNumber = (kwRange || "").replace(/\s*KW/i, "").trim() || "[ ]";
      return {
        ...it,
        label: `Solar Inverter: ${kwNumber} kW Grid-Tied Inverter (Tata Power Solar Approved)`,
      };
    }
    return it;
  });
};

export const formatINR = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "₹ 0.00";
  return "₹ " + Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const computeBreakdown = (totalAmount, gstRate = GST_RATE) => {
  // GST is calculated as a straight percentage of the entered Total.
  // e.g. Total=100000, rate=8.9% => gst=8900, basic=91100
  const t = Number(totalAmount) || 0;
  const gst = +(t * (gstRate / 100)).toFixed(2);
  const basic = +(t - gst).toFixed(2);
  return { total: +t.toFixed(2), basic, gst, rate: gstRate };
};
