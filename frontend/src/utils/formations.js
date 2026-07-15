export const FORMATIONS = {
  "4-3-3": [
    { id: "GK", label: "GK", apiPosition: "GK", x: 50, y: 89 },
    { id: "LB", label: "LB", apiPosition: "LB", x: 17, y: 72 },
    { id: "CB1", label: "CB", apiPosition: "CB1", x: 39, y: 75 },
    { id: "CB2", label: "CB", apiPosition: "CB2", x: 61, y: 75 },
    { id: "RB", label: "RB", apiPosition: "RB", x: 83, y: 72 },
    { id: "CM1", label: "CM", apiPosition: "CM1", x: 29, y: 51 },
    { id: "CM2", label: "CDM", apiPosition: "CM2", x: 50, y: 59 },
    { id: "CM3", label: "CM", apiPosition: "CM3", x: 71, y: 51 },
    { id: "FW1", label: "LW", apiPosition: "FW1", x: 18, y: 27 },
    { id: "ST", label: "ST", apiPosition: "ST", x: 50, y: 19 },
    { id: "FW2", label: "RW", apiPosition: "FW2", x: 82, y: 27 },
  ],
  "4-4-2": [
    { id: "GK", label: "GK", apiPosition: "GK", x: 50, y: 89 },
    { id: "LB", label: "LB", apiPosition: "LB", x: 17, y: 72 }, { id: "CB1", label: "CB", apiPosition: "CB1", x: 39, y: 75 },
    { id: "CB2", label: "CB", apiPosition: "CB2", x: 61, y: 75 }, { id: "RB", label: "RB", apiPosition: "RB", x: 83, y: 72 },
    { id: "FW1", label: "LW", apiPosition: "FW1", x: 15, y: 50 }, { id: "CM1", label: "CM", apiPosition: "CM1", x: 39, y: 54 },
    { id: "CM2", label: "CM", apiPosition: "CM2", x: 61, y: 54 }, { id: "FW2", label: "RW", apiPosition: "FW2", x: 85, y: 50 },
    { id: "ST1", label: "ST", apiPosition: "ST", x: 38, y: 22 }, { id: "ST2", label: "ST", apiPosition: "ST", x: 62, y: 22 },
  ],
  "3-5-2": [
    { id: "GK", label: "GK", apiPosition: "GK", x: 50, y: 89 },
    { id: "CB1", label: "CB", apiPosition: "CB1", x: 27, y: 73 }, { id: "CB2", label: "CB", apiPosition: "CB2", x: 50, y: 77 }, { id: "CB3", label: "CB", apiPosition: "CB3", x: 73, y: 73 },
    { id: "FW1", label: "LW", apiPosition: "FW1", x: 14, y: 51 }, { id: "CM1", label: "CM", apiPosition: "CM1", x: 32, y: 53 }, { id: "CM2", label: "CDM", apiPosition: "CM2", x: 50, y: 60 }, { id: "CM3", label: "CM", apiPosition: "CM3", x: 68, y: 53 }, { id: "FW2", label: "RW", apiPosition: "FW2", x: 86, y: 51 },
    { id: "ST1", label: "ST", apiPosition: "ST", x: 38, y: 22 }, { id: "ST2", label: "ST", apiPosition: "ST", x: 62, y: 22 },
  ],
};

export const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
