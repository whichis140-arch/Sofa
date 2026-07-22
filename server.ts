import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase body payload size for base64 images upload
app.use(express.json({ limit: "25mb" }));

// In-memory or fallback storage for saved sofa generations
interface SavedGeneration {
  id: string;
  createdAt: string;
  primaryImage: string;
  allImages: string[];
  facebookTitle: string;
  price: number;
  priceRange: string;
  location: string;
  seater: string;
  fabric: string;
  color: string;
  condition: string;
  dimensions: {
    widthCm?: number;
    depthCm?: number;
    heightCm?: number;
    approxText: string;
  };
  delivery: string;
  description: string;
  hashtags: string[];
  seoKeywords: string[];
  shopName?: string;
  contactNumber?: string;
}

let savedGenerationsStore: SavedGeneration[] = [
  {
    id: "sample-gen-1",
    createdAt: new Date().toISOString(),
    primaryImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    allImages: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80"],
    facebookTitle: "🛋️ Luxury Plush Velvet 3-Seater Corner Sofa in Charcoal Grey - Free Local Delivery! 🚚",
    price: 395,
    priceRange: "£350 - £450",
    location: "Manchester, UK",
    seater: "3-Seater Corner Sofa",
    fabric: "Plush Velvet",
    color: "Charcoal Grey",
    condition: "Very Good / Display Model",
    dimensions: {
      widthCm: 215,
      depthCm: 160,
      heightCm: 88,
      approxText: "W: 215cm x D: 160cm (Chaise) x H: 88cm"
    },
    delivery: "Free Local Delivery within 15 Miles",
    description: `🛋️ **STUNNING CHARCOAL GREY PLUSH VELVET CORNER SOFA** 🛋️

Elevate your living space with this beautiful, ultra-comfortable 3-seater corner sofa. Finished in premium stain-resistant charcoal grey plush velvet, featuring deep foam seating and supportive fiber-filled back cushions.

✨ **KEY FEATURES & DETAILS:**
• Style: 3-Seater Corner L-Shape Sofa
• Material: Soft Touch Plush Velvet (Stain-Resistant)
• Color: Deep Charcoal Grey
• Condition: Excellent / Showroom Condition (Pet & Smoke Free)
• Dimensions: Width: 215cm | Chaise Depth: 160cm | Height: 88cm

🚚 **DELIVERY & COLLECTION:**
• Free local delivery included within 15 miles of Manchester!
• Same-day or next-day delivery options available.
• Two-person delivery team can assist setup into your room of choice.

💰 **PRICE:** £395 (RRP £899 - Huge Saving!)
💬 **CONTACT:** Message us directly on Facebook or WhatsApp to arrange viewing or order today!`,
    hashtags: ["#SofaForSale", "#FacebookMarketplace", "#UKFurniture", "#CornerSofa", "#ManchesterFurniture", "#VelvetSofa"],
    seoKeywords: ["3 seater corner sofa", "charcoal grey velvet couch", "used sofa manchester", "luxury l shape sofa uk"],
    shopName: "UK Premium Furniture Outlet",
    contactNumber: "07700 900123"
  }
];

// Initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Sofa Post Generator" });
});

// GET saved generations
app.get("/api/sofa/generations", (_req, res) => {
  res.json(savedGenerationsStore);
});

// POST save generation
app.post("/api/sofa/generations", (req, res) => {
  try {
    const generationData = req.body;
    if (!generationData || !generationData.facebookTitle) {
      return res.status(400).json({ error: "Invalid generation data" });
    }

    const newGen: SavedGeneration = {
      ...generationData,
      id: generationData.id || `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: generationData.createdAt || new Date().toISOString()
    };

    savedGenerationsStore.unshift(newGen);
    res.json({ success: true, item: newGen });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to save generation" });
  }
});

// DELETE saved generation
app.delete("/api/sofa/generations/:id", (req, res) => {
  const { id } = req.params;
  savedGenerationsStore = savedGenerationsStore.filter(item => item.id !== id);
  res.json({ success: true, message: "Deleted successfully" });
});

// POST AI Generation Endpoint
app.post("/api/sofa/generate", async (req, res) => {
  try {
    const {
      imagesBase64,
      location = "London, United Kingdom",
      shopName = "UK Furniture Marketplace Outlet",
      phone = "",
      whatsapp = ""
    } = req.body;

    if (!imagesBase64 || !Array.isArray(imagesBase64) || imagesBase64.length === 0) {
      return res.status(400).json({ error: "Please upload at least one sofa image." });
    }

    const ai = getGeminiClient();

    const ALL_UK_CITIES = [
      "London, United Kingdom",
      "Manchester, United Kingdom",
      "Birmingham, United Kingdom",
      "Leeds, United Kingdom",
      "Glasgow, United Kingdom",
      "Liverpool, United Kingdom",
      "Bristol, United Kingdom",
      "Sheffield, United Kingdom",
      "Leicester, United Kingdom",
      "Coventry, United Kingdom",
      "Nottingham, United Kingdom",
      "Edinburgh, United Kingdom",
      "Cardiff, United Kingdom",
      "Belfast, United Kingdom",
      "Newcastle, United Kingdom",
      "Southampton, United Kingdom",
      "Preston, United Kingdom",
      "Milton Keynes, United Kingdom",
      "Bradford, United Kingdom",
      "Plymouth, United Kingdom",
      "Wolverhampton, United Kingdom",
      "Derby, United Kingdom",
      "Stoke-on-Trent, United Kingdom",
      "Swansea, United Kingdom",
      "Hull, United Kingdom"
    ];

    // Shuffle cities array for true randomized location distribution
    const shuffledCities = [...ALL_UK_CITIES].sort(() => Math.random() - 0.5);

    // Process all uploaded images concurrently so 10/10 photos generate reliably without timeouts
    const itemsPromises = imagesBase64.map(async (base64Str: string, index: number) => {
      let mimeType = "image/jpeg";
      let cleanBase64 = base64Str;

      if (base64Str.startsWith("data:")) {
        const matches = base64Str.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          cleanBase64 = matches[2];
        }
      }

      const assignedCity = shuffledCities[index % shuffledCities.length];
      const cityShortName = assignedCity.split(',')[0].trim();
      const cityHashtagName = cityShortName.replace(/[^a-zA-Z0-0]/g, '');

      const imagePart = {
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      };

      const promptText = `
You are an expert UK Furniture Marketing Copywriter & Computer Vision Specialist.
Analyze this sofa photo (Photo ${index + 1}) with maximum visual precision:
1. FABRIC DETECT: Look closely at texture (e.g. Plush Velvet, Textured Woven Fabric, Jumbo Cord, Faux Leather, Genuine Leather, Chenille, Linen).
2. COLOR DETECT: Detect exact color shade (e.g. Charcoal Grey, Slate Grey, Midnight Navy, Emerald Green, Cream Beige, Mink, Black & Grey Two-Tone, Chocolate Brown).
3. MODEL / TYPE DETECT: Identify exact arrangement (e.g. 3-Seater Corner Sofa Bed, L-Shape Left-Hand Corner, L-Shape Right-Hand Corner, 3+2 Seater Set, 2-Seater Loveseat, Swivel Recliner).
4. SPECIFIC DETAILS: Note tufted buttoning, deep foam seating cushions, pillow armrests, chrome or wooden feet, contrast stitching.

Assigned Target UK City for this photo listing: ${assignedCity}

Generate a comprehensive, high-converting Facebook Marketplace sofa listing in JSON matching this exact schema:

1. "facebookTitle": Rich, eye-catching title starting with emojis (e.g. "🛋️ BRAND NEW [Exact Color] [Exact Fabric] [Exact Seater/Style] - FREE LOCAL DELIVERY 🚚"). Must highlight "BRAND NEW" and "FREE LOCAL DELIVERY".
2. "price": 0
3. "priceRange": "FREE / £0 Delivery Included"
4. "seater": Accurately auto-detected seating capacity & style from this photo (e.g., "3-Seater Corner Sofa Bed", "2-Seater Velvet Sofa").
5. "fabric": Accurately auto-detected fabric type from this photo (e.g., "Plush Velvet", "Jumbo Cord", "Textured Woven Fabric", "Leather", "Chenille").
6. "color": Accurately auto-detected color shade from this photo.
7. "condition": "Brand new sealed in packaging"
8. "dimensions": Realistic dimension estimates object with widthCm, depthCm, heightCm, and approxText (e.g. "Width: 240cm | Depth: 155cm | Height: 88cm").
9. "delivery": "FREE delivery across ${cityShortName} & UK mainland"
10. "description": Must strictly follow this line-by-line format with rich, comprehensive features tailored to the detected sofa:

🛋️ BRAND NEW [Color] [Fabric] [Seater/Style]

💰 Price: £0 (Free Delivery)
📍 Location: ${assignedCity}
📦 Condition: Brand new sealed in packaging

✨ KEY FEATURES & SPECIFICATIONS:
• [Detailed Feature 1: Exact fabric material & luxurious soft-touch texture]
• [Detailed Feature 2: High-density reflex foam seating cushion comfort]
• [Detailed Feature 3: Sturdy frame construction e.g. Solid kiln-dried timber frame]
• [Detailed Feature 4: Corner orientation or versatile seating arrangement]
• [Detailed Feature 5: Ergonomic backrest support & deep filled cushions]
• [Detailed Feature 6: Tailored stitching, armrest design & leg finish]
• [Detailed Feature 7: Built to UK safety standards - BS5852 Fire Regulation Compliant]
• [Detailed Feature 8: Easy door entrance access & quick tool-free home assembly]

📐 DIMENSIONS:
• Width: [e.g. 240cm]
• Depth: [e.g. 155cm]
• Height: [e.g. 88cm]

🚚 DELIVERY INFO:
• FREE delivery across ${cityShortName} & UK mainland
• Fast response & quick delivery booking

💬 HOW TO ORDER:
Please send a direct message (DM) by tapping the 'Send Message' button on this listing!

#SofaForSale #FreeDelivery #BrandNewSofa #${cityHashtagName}Sofa #FacebookMarketplace

11. "hashtags": ["#SofaForSale", "#FreeDelivery", "#BrandNewSofa", "#${cityHashtagName}Sofa", "#FacebookMarketplace"]
12. "seoKeywords": ["Sofa for sale", "Brand new sofa", "${cityShortName} furniture"]
`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: {
            parts: [imagePart, { text: promptText }]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                facebookTitle: { type: Type.STRING },
                price: { type: Type.INTEGER },
                priceRange: { type: Type.STRING },
                seater: { type: Type.STRING },
                fabric: { type: Type.STRING },
                color: { type: Type.STRING },
                condition: { type: Type.STRING },
                dimensions: {
                  type: Type.OBJECT,
                  properties: {
                    widthCm: { type: Type.INTEGER },
                    depthCm: { type: Type.INTEGER },
                    heightCm: { type: Type.INTEGER },
                    approxText: { type: Type.STRING },
                  },
                  required: ["approxText"]
                },
                delivery: { type: Type.STRING },
                description: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                seoKeywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: [
                "facebookTitle",
                "price",
                "priceRange",
                "seater",
                "fabric",
                "color",
                "condition",
                "dimensions",
                "delivery",
                "description",
                "hashtags",
                "seoKeywords"
              ]
            }
          }
        });

        const jsonText = response.text || "{}";
        const itemResult = JSON.parse(jsonText);
        return {
          imageIndex: index,
          location: assignedCity,
          ...itemResult
        };
      } catch (err: any) {
        console.error(`Error generating listing for image ${index}:`, err);
        // Fallback item so no slot is lost
        return {
          imageIndex: index,
          location: assignedCity,
          facebookTitle: `🛋️ BRAND NEW Luxury Sofa - FREE LOCAL DELIVERY 🚚`,
          price: 0,
          priceRange: "FREE / £0 Delivery Included",
          seater: "3-Seater Sofa",
          fabric: "Plush Velvet / Fabric",
          color: "Grey / Velvet",
          condition: "Brand new sealed in packaging",
          dimensions: { approxText: "Width: 210cm | Depth: 95cm | Height: 88cm" },
          delivery: `FREE delivery across ${cityShortName} & UK mainland`,
          description: `🛋️ BRAND NEW Luxury ${cityShortName} Sofa Bed

💰 Price: £0 (Free Delivery)
📍 Location: ${assignedCity}
📦 Condition: Brand new sealed in packaging

✨ KEY FEATURES & SPECIFICATIONS:
• Crafted in premium soft-touch woven upholstery fabric
• High-density reflex foam seating cushions for superior comfort & bounce-back shape
• Reinforced solid kiln-dried timber internal frame built to last
• Deep-filled fiber back cushions offering ergonomic posture support
• Versatile layout ideal for living rooms, guest suites, and apartments
• Heavy-duty serpentine pocket spring seating foundation
• Fire safety regulation compliant (UK BS5852 certified)
• Easy home assembly with compact packaging for easy doorway access

📐 DIMENSIONS:
• Width: 215cm
• Depth: 155cm
• Height: 88cm

🚚 DELIVERY INFO:
• FREE delivery across ${cityShortName} & UK mainland
• Fast response & quick delivery booking

💬 HOW TO ORDER:
Please send a direct message (DM) by tapping the 'Send Message' button on this listing!

#SofaForSale #FreeDelivery #BrandNewSofa #${cityHashtagName}Sofa #FacebookMarketplace`,
          hashtags: ["#SofaForSale", "#FreeDelivery", "#BrandNewSofa", `#${cityHashtagName}Sofa`, "#FacebookMarketplace"],
          seoKeywords: ["Sofa for sale", "Brand new sofa"]
        };
      }
    });

    const itemsList = await Promise.all(itemsPromises);

    res.json({ items: itemsList });
  } catch (error: any) {
    console.error("Gemini generation error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate sofa listing with AI"
    });
  }
});

// Serve frontend assets using Vite middleware or production build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🛋️ Sofa Post Generator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
