(function () {
  window.VSTAR_PART_MODELS = [
    { model: "Toyota Corolla 2026 1.8L Hybrid Premium", segment: "sedan" },
    { model: "Toyota Corolla 2026 1.8L Hybrid Elite", segment: "sedan" },
    { model: "Toyota Corolla 2026 1.8L Hybrid Pioneer", segment: "sedan" },
    { model: "Kia K3 2024 1.5L IVT Comfort", segment: "sedan" },
    { model: "Changan Hunter Warrior Edition 1031km EREV", segment: "pickup" },
    { model: "BYD Destroyer 05 2024 DM-i 55km Luxury", segment: "sedan" },
    { model: "Toyota Corolla Cross 2026 2.0L Hybrid Elite", segment: "suv" },
    { model: "Hyundai Elantra 2023 1.5L CVT TOP Premium", segment: "sedan" },
    { model: "Geely Bin Yue L 2025 1.5TD DCT", segment: "suv" },
    { model: "Changan Mazda EZ-60 Pure Electric 600 Max", segment: "ev-suv" },
  ];

  window.VSTAR_COMMON_PARTS = [
    {
      name: "Front bumper cover",
      category: "Body exterior",
      stock: { sedan: 18, suv: 12, pickup: 8, "ev-suv": 7 },
      price: { sedan: 96, suv: 128, pickup: 148, "ev-suv": 168 },
      note: "Paint not included; color code confirmation required.",
    },
    {
      name: "Headlamp assembly",
      category: "Lighting",
      stock: { sedan: 14, suv: 10, pickup: 7, "ev-suv": 6 },
      price: { sedan: 118, suv: 152, pickup: 166, "ev-suv": 218 },
      note: "Left/right side and market version must be checked.",
    },
    {
      name: "Rear tail lamp",
      category: "Lighting",
      stock: { sedan: 16, suv: 10, pickup: 8, "ev-suv": 7 },
      price: { sedan: 64, suv: 82, pickup: 92, "ev-suv": 108 },
      note: "Confirm trunk or body-side lamp before quotation.",
    },
    {
      name: "Side mirror assembly",
      category: "Body exterior",
      stock: { sedan: 20, suv: 12, pickup: 9, "ev-suv": 8 },
      price: { sedan: 56, suv: 72, pickup: 78, "ev-suv": 88 },
      note: "Camera, heating, folding, and signal options vary by trim.",
    },
    {
      name: "Windshield glass",
      category: "Glass",
      stock: { sedan: 9, suv: 7, pickup: 5, "ev-suv": 5 },
      price: { sedan: 136, suv: 172, pickup: 192, "ev-suv": 228 },
      note: "ADAS camera bracket and sensor area must be verified.",
    },
    {
      name: "Brake pad set",
      category: "Brake",
      stock: { sedan: 26, suv: 18, pickup: 14, "ev-suv": 12 },
      price: { sedan: 38, suv: 52, pickup: 64, "ev-suv": 58 },
      note: "Front/rear axle and brake system version required.",
    },
    {
      name: "Wiper blade set",
      category: "Consumable",
      stock: { sedan: 40, suv: 32, pickup: 22, "ev-suv": 24 },
      price: { sedan: 10, suv: 12, pickup: 14, "ev-suv": 15 },
      note: "Common fast-moving replacement item.",
    },
    {
      name: "Alloy wheel rim",
      category: "Wheel",
      stock: { sedan: 10, suv: 8, pickup: 6, "ev-suv": 5 },
      price: { sedan: 78, suv: 116, pickup: 132, "ev-suv": 148 },
      note: "Size, PCD, offset, and design should match vehicle batch.",
    },
  ];
})();
