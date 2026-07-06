export const seedProducts = [
  {
    id: "p1",
    name: "Organic Sonamasuri Rice (Unpolished)",
    teluguName: "ఆర్గానిక్ సోనామసూరి బియ్యం (దంపుడు బియ్యం)",
    category: "rice",
    price: 85,
    compareAtPrice: 105,
    unit: "1 kg",
    stock: 250,
    rating: 4.8,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
    isSubscriptionEligible: true,
    certifications: ["USDA Organic", "India Organic"],
    origin: "Miryalaguda, Telangana",
    farmerName: "Keshav Reddy",
    farmerId: "u_farmer_1",
    harvestDate: "2026-05-10",
    shelfLifeDays: 365,
    diabeticSafe: false,
    highProtein: false,
    nutrition: {
      protein: "7.5g",
      carbs: "78g",
      fats: "0.6g",
      calories: "348 kcal"
    },
    description: "Traditional Sonamasuri Rice, unpolished to retain essential fibers, vitamins, and minerals. Rich in taste and easy to digest.",
    teluguDescription: "సాంప్రదాయ సోనామసూరి బియ్యం, పాలిష్ చేయనివి కాబట్టి పీచు పదార్థాలు, విటమిన్లు, మరియు ఖనిజాలు పుష్కలంగా ఉంటాయి. సులభంగా జీర్ణమవుతుంది."
  },
  {
    id: "p2",
    name: "Premium Cow Ghee (A2)",
    teluguName: "స్వచ్ఛమైన ఆవు నెయ్యి (A2)",
    category: "oils-ghee",
    price: 420,
    compareAtPrice: 480,
    unit: "500 ml",
    stock: 90,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1627915558017-68c0780d6599?q=80&w=600&auto=format&fit=crop",
    isSubscriptionEligible: true,
    certifications: ["Jaivik Bharat", "FSSAI Organic"],
    origin: "Sangareddy, Telangana",
    farmerName: "Keshav Reddy",
    farmerId: "u_farmer_1",
    harvestDate: "2026-06-01",
    shelfLifeDays: 270,
    diabeticSafe: true,
    highProtein: false,
    nutrition: {
      protein: "0g",
      carbs: "0g",
      fats: "99.8g",
      calories: "898 kcal"
    },
    description: "Prepared from pure A2 milk using the traditional Bilona method. Improves immunity, aids digestion, and adds premium flavor to food.",
    teluguDescription: "సాంప్రదాయ బిలోనా పద్ధతిలో స్వచ్ఛమైన A2 పాలు నుండి తయారు చేయబడింది. వ్యాధి నిరోధక శక్తిని పెంచుతుంది మరియు జీర్ణక్రియను మెరుగుపరుస్తుంది."
  },
  {
    id: "p3",
    name: "Organic Unpolished Moong Dal",
    teluguName: "ఆర్గానిక్ పెసరపప్పు (పాలిష్ లేనిది)",
    category: "dals",
    price: 155,
    compareAtPrice: 180,
    unit: "1 kg",
    stock: 120,
    rating: 4.7,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1547058886-af77992d478c?q=80&w=600&auto=format&fit=crop",
    isSubscriptionEligible: true,
    certifications: ["USDA Organic", "Jaivik Bharat"],
    origin: "Guntur, Andhra Pradesh",
    farmerName: "Anjaya Rao",
    farmerId: "u_farmer_2",
    harvestDate: "2026-05-20",
    shelfLifeDays: 180,
    diabeticSafe: true,
    highProtein: true,
    nutrition: {
      protein: "24g",
      carbs: "56g",
      fats: "1.2g",
      calories: "348 kcal"
    },
    description: "High-protein, easily digestible unpolished yellow moong dal. Sourced from organic farms with zero chemical additives.",
    teluguDescription: "అధిక ప్రోటీన్ కలిగిన, సులభంగా అరిగే పసుపు రంగు పెసరపప్పు. రసాయనాలు లేని పద్ధతుల్లో పండించిన పొలాల నుండి సేకరించబడింది."
  },
  {
    id: "p4",
    name: "Ancient Spelt Wheat Flour (Atta)",
    teluguName: "ఆర్గానిక్ స్పెల్ట్ గోధుమ పిండి (ఆటా)",
    category: "ancient-grains",
    price: 190,
    compareAtPrice: 220,
    unit: "2 kg",
    stock: 80,
    rating: 4.6,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
    isSubscriptionEligible: true,
    certifications: ["India Organic"],
    origin: "Mahabubnagar, Telangana",
    farmerName: "Anjaya Rao",
    farmerId: "u_farmer_2",
    harvestDate: "2026-04-28",
    shelfLifeDays: 120,
    diabeticSafe: true,
    highProtein: true,
    nutrition: {
      protein: "14g",
      carbs: "70g",
      fats: "2.4g",
      calories: "338 kcal"
    },
    description: "Sourced from ancient spelt grain varieties. Contains gentle gluten, high mineral content, and is suitable for healthy organic baking and rotis.",
    teluguDescription: "పురాతన స్పెల్ట్ గోధుమల నుండి సేకరించబడింది. సులభంగా జీర్ణమయ్యే గ్లూటెన్ మరియు అధిక ఖనిజాలను కలిగి ఉంటుంది."
  },
  {
    id: "p5",
    name: "Fresh Farm Organic Spinach",
    teluguName: "తాజా తోట పాలకూర",
    category: "vegetables",
    price: 35,
    compareAtPrice: 45,
    unit: "1 Bunch",
    stock: 45,
    rating: 4.8,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop",
    isSubscriptionEligible: false,
    certifications: ["India Organic"],
    origin: "Chevella, Telangana",
    farmerName: "Keshav Reddy",
    farmerId: "u_farmer_1",
    harvestDate: "2026-07-04",
    shelfLifeDays: 3,
    diabeticSafe: true,
    highProtein: false,
    nutrition: {
      protein: "2.9g",
      carbs: "3.6g",
      fats: "0.4g",
      calories: "23 kcal"
    },
    description: "Iron-rich fresh green spinach, harvested daily in the morning and delivered within 12 hours of harvest for maximum nutrition.",
    teluguDescription: "తాజా ఐరన్ అధికంగా ఉన్న పాలకూర, ఉదయం కోసి 12 గంటల వ్యవధిలో పంపిణీ చేయబడుతుంది."
  },
  {
    id: "p6",
    name: "Farm-Fresh Organic Country Eggs",
    teluguName: "తాజా ఆర్గానిక్ నాటు కోడి గుడ్లు",
    category: "daily-essentials",
    price: 110,
    compareAtPrice: 130,
    unit: "6 pcs",
    stock: 60,
    rating: 4.9,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop",
    isSubscriptionEligible: true,
    certifications: ["India Organic"],
    origin: "Nalgonda, Telangana",
    farmerName: "Keshav Reddy",
    farmerId: "u_farmer_1",
    harvestDate: "2026-07-03",
    shelfLifeDays: 14,
    diabeticSafe: true,
    highProtein: true,
    nutrition: {
      protein: "13g",
      carbs: "1.1g",
      fats: "11g",
      calories: "155 kcal"
    },
    description: "Sourced from free-range country chickens fed strictly on organic grains and greens. Rich in omega-3 and proteins.",
    teluguDescription: "స్వేచ్ఛగా తిరిగే నాటుకోళ్ల నుండి సేకరించిన గుడ్లు. వీటికి కేవలం సేంద్రీయ ఆహారం మాత్రమే తినిపిస్తారు."
  },
  {
    id: "p7",
    name: "Organic Turmeric Powder (Lakadong)",
    teluguName: "లకాడాంగ్ పసుపు పొడి",
    category: "herbal-wellness",
    price: 130,
    compareAtPrice: 160,
    unit: "250 g",
    stock: 150,
    rating: 4.9,
    reviewsCount: 73,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop",
    isSubscriptionEligible: true,
    certifications: ["USDA Organic", "Jaivik Bharat"],
    origin: "Meghalaya, India (Packaged locally)",
    farmerName: "Anjaya Rao",
    farmerId: "u_farmer_2",
    harvestDate: "2026-02-15",
    shelfLifeDays: 365,
    diabeticSafe: true,
    highProtein: false,
    nutrition: {
      protein: "8g",
      carbs: "65g",
      fats: "3g",
      calories: "354 kcal"
    },
    description: "Lakadong turmeric is known for its high curcumin content (above 7%). Powerhouse of antioxidants, supports immunity and joint health.",
    teluguDescription: "లకాడాంగ్ పసుపులో కర్కుమిన్ శాతం (7% కంటే ఎక్కువ) చాల ఎక్కువ. రోగనిరోధక శక్తిని పెంచడానికి అద్భుతమైనది."
  },
  {
    id: "p8",
    name: "Seasonal Royal Gala Apples",
    teluguName: "తాజా రాయల్ గాలా ఆపిల్స్",
    category: "fruits",
    price: 240,
    compareAtPrice: 280,
    unit: "1 kg",
    stock: 40,
    rating: 4.7,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600&auto=format&fit=crop",
    isSubscriptionEligible: false,
    certifications: ["India Organic"],
    origin: "Shimla, Himachal Pradesh",
    farmerName: "Anjaya Rao",
    farmerId: "u_farmer_2",
    harvestDate: "2026-06-25",
    shelfLifeDays: 15,
    diabeticSafe: true,
    highProtein: false,
    nutrition: {
      protein: "0.3g",
      carbs: "14g",
      fats: "0.2g",
      calories: "52 kcal"
    },
    description: "Sweet, crispy, and hand-picked organic apples from Shimla orchards. No wax coatings, completely natural and washed in saline water.",
    teluguDescription: "షిమ్లా తోటల నుండి తీపిగా ఉండే తాజా ఆపిల్స్. ఎలాంటి వ్యాక్స్ కోటింగ్స్ ఉండవు, పూర్తిగా సహజమైనవి."
  },
  {
    id: "p9",
    name: "Cold-Pressed Mustard Oil",
    teluguName: "గానుగ ఆవ నూనె",
    category: "oils-ghee",
    price: 210,
    compareAtPrice: 250,
    unit: "1 L",
    stock: 110,
    rating: 4.6,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop",
    isSubscriptionEligible: true,
    certifications: ["India Organic", "Jaivik Bharat"],
    origin: "Guntur, Andhra Pradesh",
    farmerName: "Anjaya Rao",
    farmerId: "u_farmer_2",
    harvestDate: "2026-05-18",
    shelfLifeDays: 240,
    diabeticSafe: true,
    highProtein: false,
    nutrition: {
      protein: "0g",
      carbs: "0g",
      fats: "100g",
      calories: "884 kcal"
    },
    description: "Traditionally cold-pressed (Kachi Ghani) organic mustard oil. Rich in monounsaturated fats and essential fatty acids.",
    teluguDescription: "సాంప్రదాయ పద్ధతిలో గానుగ ఆడించిన స్వచ్ఛమైన ఆవ నూనె. వంటకాల్లో మంచి రుచి మరియు ఆరోగ్యాన్ని ఇస్తుంది."
  },
  {
    id: "p10",
    name: "Organic Ragi Flour (Finger Millet)",
    teluguName: "ఆర్గానిక్ రాగి పిండి",
    category: "ancient-grains",
    price: 75,
    compareAtPrice: 90,
    unit: "1 kg",
    stock: 150,
    rating: 4.8,
    reviewsCount: 51,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
    isSubscriptionEligible: true,
    certifications: ["India Organic"],
    origin: "Mahabubnagar, Telangana",
    farmerName: "Keshav Reddy",
    farmerId: "u_farmer_1",
    harvestDate: "2026-06-05",
    shelfLifeDays: 180,
    diabeticSafe: true,
    highProtein: true,
    nutrition: {
      protein: "7.3g",
      carbs: "72g",
      fats: "1.3g",
      calories: "328 kcal"
    },
    description: "Gluten-free, calcium-rich finger millet flour. Highly recommended for diabetic diets, baby food, and nutritious summer ragi malt.",
    teluguDescription: "గ్లూటెన్ లేని కాల్షియం సమృద్ధిగా ఉండే రాగి పిండి. డయాబెటిక్ రోగులకు, చిన్న పిల్లలకు చాలా మంచిది."
  }
];

export const seedUsers = [
  {
    id: "u_admin_1",
    email: "admin@vnatural.com",
    password: "admin123",
    role: "admin",
    name: "Srinivas Raju (Admin)",
    phone: "9900112233",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "u_farmer_1",
    email: "farmer.keshav@gmail.com",
    password: "farmer123",
    role: "farmer",
    name: "Keshav Reddy",
    phone: "9848022334",
    farmName: "Nalgonda Eco-Organic Farms",
    location: "Miryalaguda, Nalgonda, Telangana",
    certifications: ["India Organic Cert", "PGS-India Green"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "u_farmer_2",
    email: "farmer.anjaya@gmail.com",
    password: "farmer123",
    role: "farmer",
    name: "Anjaya Rao",
    phone: "9866112233",
    farmName: "Krishna River Valley Farms",
    location: "Amaravati Rural, Guntur, AP",
    certifications: ["USDA Organic Certificate"],
    avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "u_warehouse_1",
    email: "warehouse.rama@vnatural.com",
    password: "warehouse123",
    role: "warehouse",
    name: "Rama Rao (Lead Picker)",
    phone: "9440112233",
    facility: "Central Warehouse Hub - Hyderabad",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "u_delivery_1",
    email: "delivery.kalyan@gmail.com",
    password: "delivery123",
    role: "delivery",
    name: "Kalyan Kumar",
    phone: "9000112233",
    vehicleNo: "TS 09 EQ 4210 (Electric Bike)",
    zone: "Secunderabad & Begumpet",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "u_customer_1",
    email: "customer@gmail.com",
    password: "customer123",
    role: "customer",
    name: "Vijay Kumar",
    phone: "9876543210",
    addresses: [
      {
        id: 1,
        type: "Home",
        street: "Flat 402, Green Meadows, Road No 4",
        area: "Madhapur",
        city: "Hyderabad",
        pincode: "500081"
      },
      {
        id: 2,
        type: "Office",
        street: "Bio-Diversity Park Tech Center, Block B",
        area: "Gachibowli",
        city: "Hyderabad",
        pincode: "500032"
      }
    ],
    loyaltyPoints: 350,
    dietPreferences: {
      diabeticAware: true,
      highProtein: false,
      vegan: false,
      glutenFree: false
    },
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150&auto=format&fit=crop"
  }
];

export const seedOrders = [
  {
    id: "ORD-9481",
    customerId: "u_customer_1",
    customerName: "Vijay Kumar",
    customerPhone: "9876543210",
    items: [
      { productId: "p1", name: "Organic Sonamasuri Rice (Unpolished)", quantity: 2, price: 85 },
      { productId: "p2", name: "Premium Cow Ghee (A2)", quantity: 1, price: 420 },
      { productId: "p5", name: "Fresh Farm Organic Spinach", quantity: 3, price: 35 }
    ],
    total: 695,
    paymentMethod: "PhonePe",
    paymentStatus: "Paid",
    status: "delivered",
    date: "2026-07-01T10:30:00Z",
    address: "Flat 402, Green Meadows, Road No 4, Madhapur, Hyderabad - 500081",
    deliverySlot: "Morning (6 AM - 9 AM)",
    assignedDeliveryPartnerId: "u_delivery_1",
    otp: "5921"
  },
  {
    id: "ORD-1092",
    customerId: "u_customer_1",
    customerName: "Vijay Kumar",
    customerPhone: "9876543210",
    items: [
      { productId: "p3", name: "Organic Unpolished Moong Dal", quantity: 1, price: 155 },
      { productId: "p10", name: "Organic Ragi Flour (Finger Millet)", quantity: 2, price: 75 },
      { productId: "p7", name: "Organic Turmeric Powder (Lakadong)", quantity: 1, price: 130 }
    ],
    total: 435,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "pending",
    date: "2026-07-05T08:15:00Z",
    address: "Flat 402, Green Meadows, Road No 4, Madhapur, Hyderabad - 500081",
    deliverySlot: "Evening (5 PM - 8 PM)",
    assignedDeliveryPartnerId: "u_delivery_1",
    otp: "3490"
  },
  {
    id: "ORD-8931",
    customerId: "u_customer_1",
    customerName: "Vijay Kumar",
    customerPhone: "9876543210",
    items: [
      { productId: "p8", name: "Seasonal Royal Gala Apples", quantity: 2, price: 240 },
      { productId: "p6", name: "Farm-Fresh Organic Country Eggs", quantity: 2, price: 110 }
    ],
    total: 700,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    status: "packed",
    date: "2026-07-04T16:40:00Z",
    address: "Bio-Diversity Park Tech Center, Block B, Gachibowli, Hyderabad - 500032",
    deliverySlot: "Morning (6 AM - 9 AM)",
    assignedDeliveryPartnerId: null,
    otp: "8821"
  }
];

export const seedSubscriptions = [
  {
    id: "SUB-881",
    customerId: "u_customer_1",
    productId: "p6",
    productName: "Farm-Fresh Organic Country Eggs",
    quantity: 2,
    price: 110,
    frequency: "weekly",
    nextDelivery: "2026-07-10",
    status: "active"
  },
  {
    id: "SUB-882",
    customerId: "u_customer_1",
    productId: "p1",
    productName: "Organic Sonamasuri Rice (Unpolished)",
    quantity: 1,
    price: 85,
    frequency: "monthly",
    nextDelivery: "2026-08-01",
    status: "active"
  }
];

export const seedProcurements = [
  {
    id: "proc_1",
    farmerId: "u_farmer_1",
    farmerName: "Keshav Reddy",
    productName: "Organic Basmati Rice (Premium)",
    category: "rice",
    quantity: 300,
    pricePerKg: 110,
    unit: "1 kg",
    nutrition: { protein: "8.1g", carbs: "77g", fats: "0.5g", calories: "349 kcal" },
    description: "Aromatic long grain organic Basmati rice harvested using compost fertilizers.",
    teluguName: "ఆర్గానిక్ బాస్మతి బియ్యం",
    teluguDescription: "కంపెనీ ఎరువులు లేకుండా పండించిన పొడవైన సువాసన గల బాస్మతి బియ్యం.",
    status: "approved",
    date: "2026-07-02"
  },
  {
    id: "proc_2",
    farmerId: "u_farmer_2",
    farmerName: "Anjaya Rao",
    productName: "Fresh Organic Papaya",
    category: "fruits",
    quantity: 150,
    pricePerKg: 40,
    unit: "1 kg",
    nutrition: { protein: "0.5g", carbs: "11g", fats: "0.3g", calories: "43 kcal" },
    description: "Sweet, tree-ripe yellow papayas, free from artificial carbide ripening.",
    teluguName: "తాజా బొప్పాయి పండ్లు",
    teluguDescription: "కార్బైడ్ లేకుండా పండించిన తియ్యటి బొప్పాయి పండ్లు.",
    status: "pending",
    date: "2026-07-05"
  }
];

export const seedRecipes = [
  {
    id: "r1",
    name: "Organic Moong Dal Khichdi",
    teluguName: "పౌష్టికరమైన పెసరపప్పు కిచిడి",
    prepTime: "10 mins",
    cookTime: "20 mins",
    servings: 2,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop",
    ingredients: [
      "1/2 cup Organic Sonamasuri Rice (Unpolished)",
      "1/2 cup Organic Unpolished Moong Dal",
      "2 tbsp Premium Cow Ghee (A2)",
      "1/4 tsp Organic Turmeric Powder",
      "1/2 tsp Cumin seeds",
      "A pinch of Asafoetida (Hing)",
      "3.5 cups water",
      "Salt to taste"
    ],
    teluguIngredients: [
      "1/2 కప్పు ఆర్గానిక్ సోనామసూరి బియ్యం",
      "1/2 కప్పు ఆర్గానిక్ పెసరపప్పు",
      "2 టేబుల్ స్పూన్లు ఆవు నెయ్యి",
      "1/4 టీస్పూన్ పసుపు పొడి",
      "1/2 టీస్పూన్ జీలకర్ర",
      "చిటికెడు ఇంగువ",
      "3.5 కప్పుల నీరు",
      "తగినంత ఉప్పు"
    ],
    instructions: [
      "Wash rice and moong dal together and soak in water for 15 minutes.",
      "Heat Cow Ghee in a pressure cooker. Add cumin seeds and asafoetida.",
      "Add turmeric powder, drained rice, and moong dal. Stir gently for a minute.",
      "Add water and salt. Mix well.",
      "Close the cooker lid and cook for 3-4 whistles on medium flame until soft.",
      "Drizzle extra ghee on top and serve hot with pickle or curd."
    ],
    teluguInstructions: [
      "బియ్యం మరియు పెసరపప్పును కడిగి 15 నిమిషాల పాటు నానబెట్టండి.",
      "ప్రెజర్ కుక్కర్‌లో ఆవు నెయ్యి వేడి చేసి, జీలకర్ర మరియు ఇంగువ వేయండి.",
      "పసుపు పొడి, నీరు వంచిన బియ్యం మరియు పెసరపప్పు వేసి ఒక నిమిషం పాటు వేయించండి.",
      "నీరు మరియు ఉప్పు వేసి బాగా కలపండి.",
      "కుక్కర్ మూత పెట్టి, మధ్యస్థ మంట మీద 3-4 విజిల్స్ వచ్చే వరకు ఉడికించాలి.",
      "పైన కొద్దిగా నెయ్యి వేసి, వేడివేడిగా ఆవకాయ లేదా పెరుగుతో వడ్డించండి."
    ],
    relatedProductIds: ["p1", "p2", "p3", "p7"]
  },
  {
    id: "r2",
    name: "Nutritious Ragi Malt / Porridge",
    teluguName: "ఆరోగ్యకరమైన రాగి జావ",
    prepTime: "5 mins",
    cookTime: "10 mins",
    servings: 1,
    difficulty: "Very Easy",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
    ingredients: [
      "3 tbsp Organic Ragi Flour",
      "1.5 cups water or butter milk",
      "A pinch of salt (if savory) or 1 tbsp Organic Jaggery (if sweet)",
      "1/4 cup warm milk (optional)"
    ],
    teluguIngredients: [
      "3 టేబుల్ స్పూన్లు ఆర్గానిక్ రాగి పిండి",
      "1.5 కప్పుల నీరు లేదా మజ్జిగ",
      "చిటికెడు ఉప్పు (ఉప్పు జావ ఐతే) లేదా 1 టేబుల్ స్పూన్ ఆర్గానిక్ బెల్లం (తీపి జావ ఐతే)",
      "1/4 కప్పు వేడి పాలు (ఆప్షనల్)"
    ],
    instructions: [
      "Dissolve Ragi Flour in 1/2 cup of room temperature water completely without lumps.",
      "Boil remaining 1 cup water in a pan. Add the ragi slurry slowly while stirring constantly.",
      "Cook on low flame for 5-7 minutes until the mixture thickens and turns glossy.",
      "Add salt and butter milk for savory version, OR Jaggery and milk for sweet version.",
      "Serve warm or cold. Excellent summer coolant."
    ],
    teluguInstructions: [
      "రాగి పిండిని అర కప్పు నీటిలో ఉండలు లేకుండా బాగా కలపండి.",
      "మిగిలిన నీటిని మరగబెట్టి, కలిపిన రాగి మిశ్రమాన్ని కలుపుతూ నెమ్మదిగా అందులో పోయండి.",
      "చిక్కబడి మెరిసే వరకు 5-7 నిమిషాలు చిన్న మంట మీద ఉడికించాలి.",
      "బెల్లం మరియు పాలు (తీపి కొరకు) లేదా ఉప్పు మరియు మజ్జిగ (ఉప్పు కొరకు) కలపండి.",
      "వేడిగా లేదా చల్లగా సర్వ్ చేయండి. ఎండాకాలంలో శరీరానికి చాలా చలువ చేస్తుంది."
    ],
    relatedProductIds: ["p10"]
  }
];
