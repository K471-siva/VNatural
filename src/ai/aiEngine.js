// VNatural AI Assistant - Intelligent NLP & Search Engine

const TELUGU_KEYWORDS = {
  rice: ["బియ్యం", "సోనామసూరి", "బీయమ్", "అన్నం"],
  ghee: ["నెయ్యి", "ఆవు నెయ్యి", "నెయి"],
  dal: ["పప్పు", "పెసరపప్పు", "కందిపప్పు", "పప్పులు"],
  flour: ["పిండి", "రాగి పిండి", "గోధుమ పిండి", "ఆటా"],
  spinach: ["పాలకూర", "కూరగాయలు", "కూరలు", "ఆకుకూరలు"],
  eggs: ["గుడ్లు", "గుడ్డు", "కోడి గుడ్లు"],
  turmeric: ["పసుపు", "పసుపు పొడి", "లకాడాంగ్"],
  apples: ["ఆపిల్స్", "ఆపిల్", "పండ్లు", "పండు"],
  oil: ["నూనె", "ఆవ నూనె", "గానుగ నూనె"],
  ragi: ["రాగి", "రాగులు", "రాగి జావ"],
  immunity: ["రోగనిరోధక", "ఇమ్యూనిటీ", "ఆరోగ్యకరమైన", "ఆరోగ్యం"],
  diabetic: ["షుగర్", "డయాబెటిస్", "మధుమేహం", "చక్కెర"],
  protein: ["ప్రోటీన్", "బలం", "శక్తి", "కండరాల"]
};

export const parseAiMessage = async (query, products = [], recipes = [], geminiApiKey = null) => {
  const q = query.toLowerCase().trim();

  // If a Gemini API key is provided, we can fetch from the official Gemini API
  if (geminiApiKey) {
    return await fetchGeminiResponse(q, products, recipes, geminiApiKey);
  }

  // Fallback: Extremely smart local context-aware NLP parser
  let responseText = "";
  let teluguText = "";
  let suggestedProducts = [];
  let suggestedRecipes = [];

  // Determine if the query is in Telugu
  const isTelugu = /[\u0c00-\u0c7f]/i.test(q) || 
                  Object.values(TELUGU_KEYWORDS).some(arr => arr.some(kw => q.includes(kw))) ||
                  q.includes("telugu") || q.includes("తెలుగు");

  // 1. Check for DIABETIC queries
  const isDiabeticQuery = q.includes("diabetic") || q.includes("sugar") || q.includes("diabetes") ||
                         TELUGU_KEYWORDS.diabetic.some(kw => q.includes(kw));

  // 2. Check for HIGH PROTEIN queries
  const isProteinQuery = q.includes("protein") || q.includes("muscle") || q.includes("strength") ||
                        TELUGU_KEYWORDS.protein.some(kw => q.includes(kw));

  // 3. Check for IMMUNITY queries
  const isImmunityQuery = q.includes("immunity") || q.includes("sick") || q.includes("covid") || q.includes("health") ||
                        TELUGU_KEYWORDS.immunity.some(kw => q.includes(kw));

  // 4. Specific product search matches
  let matchedCategory = null;
  if (q.includes("rice") || TELUGU_KEYWORDS.rice.some(kw => q.includes(kw))) matchedCategory = "rice";
  if (q.includes("ghee") || TELUGU_KEYWORDS.ghee.some(kw => q.includes(kw))) matchedCategory = "oils-ghee";
  if (q.includes("dal") || q.includes("pulse") || TELUGU_KEYWORDS.dal.some(kw => q.includes(kw))) matchedCategory = "dals";
  if (q.includes("vegetable") || q.includes("spinach") || TELUGU_KEYWORDS.spinach.some(kw => q.includes(kw))) matchedCategory = "vegetables";
  if (q.includes("egg") || TELUGU_KEYWORDS.eggs.some(kw => q.includes(kw))) matchedCategory = "daily-essentials";
  if (q.includes("fruit") || q.includes("apple") || TELUGU_KEYWORDS.apples.some(kw => q.includes(kw))) matchedCategory = "fruits";
  if (q.includes("ragi") || q.includes("flour") || q.includes("wheat") || q.includes("atta") || 
      TELUGU_KEYWORDS.flour.some(kw => q.includes(kw)) || TELUGU_KEYWORDS.ragi.some(kw => q.includes(kw))) {
    matchedCategory = "ancient-grains";
  }

  // Sifting products
  if (isDiabeticQuery) {
    suggestedProducts = products.filter(p => p.diabeticSafe);
    responseText = "Here are our organic products that are highly recommended and safe for diabetic individuals. They have a low glycemic index and help manage blood sugar levels:";
    teluguText = "డయాబెటిస్ (మధుమేహం) ఉన్నవారికి ఉపయోగపడే మా సేంద్రీయ ఉత్పత్తులు ఇక్కడ ఉన్నాయి. ఇవి రక్తంలో చక్కెర స్థాయిలను అదుపులో ఉంచడానికి సహాయపడతాయి:";
    
    // Suggest Ragi Porridge Recipe
    const ragiRecipe = recipes.find(r => r.id === "r2");
    if (ragiRecipe) suggestedRecipes.push(ragiRecipe);
  } 
  else if (isProteinQuery) {
    suggestedProducts = products.filter(p => p.highProtein);
    responseText = "To build strength and increase muscle recovery, here are VNatural's high-protein organic staples, millet flours, and farm-fresh country eggs:";
    teluguText = "శరీర బలానికి మరియు కండరాల పుష్టి కోసం, అధిక ప్రోటీన్ కలిగిన మా సేంద్రీయ పప్పుధాన్యాలు, రాగి పిండి మరియు నాటు కోడి గుడ్లు ఇక్కడ ఉన్నాయి:";
    
    // Suggest Khichdi Recipe
    const khichdi = recipes.find(r => r.id === "r1");
    if (khichdi) suggestedRecipes.push(khichdi);
  }
  else if (isImmunityQuery) {
    suggestedProducts = products.filter(p => p.category === "herbal-wellness" || p.id === "p2" || p.id === "p7");
    responseText = "Boost your family's immune defenses with these premium, antioxidant-rich wellness products, high-curcumin Lakadong turmeric, and pure A2 ghee:";
    teluguText = "మీ కుటుంబ రక్షణ మరియు రోగనిరోధక శక్తిని పెంచడానికి, యాంటీఆక్సిడెంట్స్ అధికంగా ఉండే లకాడాంగ్ పసుపు మరియు స్వచ్ఛమైన A2 ఆవు నెయ్యిని సిఫార్సు చేస్తున్నాము:";
  }
  else if (matchedCategory) {
    suggestedProducts = products.filter(p => p.category === matchedCategory);
    responseText = `Here are the fresh organic products we found in the ${matchedCategory.replace("-", " ")} category:`;
    teluguText = `మేము వెతికిన సేంద్రీయ ఉత్పత్తులు ఇక్కడ ఉన్నాయి:`;
    
    // Find recipes that relate to these products
    recipes.forEach(r => {
      const match = r.relatedProductIds.some(pid => suggestedProducts.some(sp => sp.id === pid));
      if (match) suggestedRecipes.push(r);
    });
  }
  else if (q.includes("recipe") || q.includes("cook") || q.includes("breakfast") || q.includes("వంట") || q.includes("రెసిపీ")) {
    suggestedRecipes = recipes;
    responseText = "Here are some of our delicious and healthy organic recipes. You can click on them to view the complete ingredients list and instructions:";
    teluguText = "మా రుచికరమైన మరియు ఆరోగ్యకరమైన సేంద్రీయ వంటకాల వివరాలు ఇక్కడ ఉన్నాయి. కావలసిన వస్తువుల వివరాలు తెలుసుకోవడానికి క్లిక్ చేయండి:";
  }
  else if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("నమస్కారం") || q.includes("హలో")) {
    responseText = "Namaste! Welcome to VNatural AI Support. I can help you find diabetic-safe products, high-protein options, recommend recipes, explain nutritional facts, or fetch sourcing details of our products. What can I help you with today?";
    teluguText = "నమస్కారం! వి.నేచురల్ AI సహాయ కేంద్రానికి స్వాగతం. డయాబెటిక్ ప్రొడక్ట్స్, పౌష్టిక వంటకాలు, లేదా నిత్యావసర వస్తువులను వెతకడంలో నేను మీకు సహాయం చేయగలను. మీకు ఏమి కావాలో అడగండి?";
  }
  else {
    // Default search matching title keywords
    suggestedProducts = products.filter(p => q.split(" ").some(word => p.name.toLowerCase().includes(word) || p.teluguName.includes(word)));
    if (suggestedProducts.length > 0) {
      responseText = "Based on your search, here are some matching organic items in our catalog:";
      teluguText = "మీరు అడిగిన దానికి సంబంధించిన కొన్ని సేంద్రీయ ఉత్పత్తులు ఇక్కడ ఉన్నాయి:";
    } else {
      responseText = "I couldn't find a direct match for your query. Try asking about: 'diabetic products', 'protein sources', 'A2 Ghee properties', 'Ragi porridge recipe', or search for staples like 'rice' and 'dal'.";
      teluguText = "మీరు అడిగిన దానికి తగిన సమాచారం లభించలేదు. 'డయాబెటిస్ ఆహారం', 'ప్రోటీన్ పప్పులు', 'ఆవు నెయ్యి లాభాలు', లేదా 'రాగి జావ తయారీ' గురించి అడగండి.";
    }
  }

  return {
    text: isTelugu ? teluguText : responseText,
    products: suggestedProducts,
    recipes: suggestedRecipes
  };
};

// Async call to Gemini API for advanced search when API Key is loaded
const fetchGeminiResponse = async (query, products, recipes, apiKey) => {
  try {
    const productsContext = products.map(p => ({
      id: p.id,
      name: p.name,
      teluguName: p.teluguName,
      price: p.price,
      stock: p.stock,
      nutrition: p.nutrition,
      diabeticSafe: p.diabeticSafe,
      highProtein: p.highProtein,
      origin: p.origin
    }));

    const prompt = `You are the VNatural Organic Food Platform assistant. 
    Here is our catalog data: ${JSON.stringify(productsContext)}. 
    Here are our recipes: ${JSON.stringify(recipes)}. 
    The user is asking: "${query}".
    Respond naturally, providing nutritional guidance and recommending products from the catalog. 
    If the user asks in Telugu, respond in Telugu.
    Format your response in JSON format like this:
    {
      "text": "Your textual response here",
      "suggestedProductIds": ["p1", "p2"], // array of product IDs if relevant
      "suggestedRecipeIds": ["r1"] // array of recipe IDs if relevant
    }`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Clean code fences if returned
    const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    return {
      text: parsed.text,
      products: products.filter(p => parsed.suggestedProductIds?.includes(p.id)),
      recipes: recipes.filter(r => parsed.suggestedRecipeIds?.includes(r.id))
    };
  } catch (error) {
    console.error("Gemini API call failed, falling back to local NLP", error);
    return parseAiMessage(query, products, recipes, null); // Fallback to local
  }
};
