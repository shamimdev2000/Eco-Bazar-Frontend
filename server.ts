import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State
const DB = {
  categories: [
    { id: "fruits-veg", name: "Fruits & Vegetables", icon: "Apple", count: 24 },
    { id: "dairy-eggs", name: "Dairy & Eggs", icon: "Egg", count: 12 },
    { id: "beverages", name: "Beverages", icon: "Coffee", count: 18 },
    { id: "bakery", name: "Bakery & Bread", icon: "Croissant", count: 8 },
    { id: "pantry", name: "Pantry Staples", icon: "Container", count: 32 },
    { id: "nuts-seeds", name: "Nuts & Seeds", icon: "Nut", count: 15 },
  ],
  products: [
    {
      id: "prod-1",
      name: "Organic Honey Crisp Apples",
      category: "fruits-veg",
      price: 4.99,
      oldPrice: 5.99,
      discount: 16,
      rating: 4.8,
      reviewsCount: 32,
      stock: 45,
      unit: "1lb",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80",
      featured: true,
      popular: true,
      bestSeller: true,
      hotDeal: false,
      description: "Crispy, sweet, and bursting with fresh orchard flavor, our organic Honey Crisp apples are hand-selected from certified biodynamic farms in Washington. Grown without synthetic pesticides or chemicals, these apples make a perfect healthy snack, addition to salads, or ingredient in homemade apple pies.",
      sku: "ORG-APP-001",
      brand: "Earth's Best",
      weight: "1.0 lb",
      dimensions: "N/A",
      origin: "Washington, USA",
      benefits: ["100% Certified Organic", "Rich in dietary fiber and Vitamin C", "No wax coating or synthetic sprays"],
      reviews: [
        { id: "r1", user: "Sarah M.", rating: 5, date: "2026-06-15", comment: "The sweetest, crispiest apples I have ever tasted! Excellent quality." },
        { id: "r2", user: "David K.", rating: 4.5, date: "2026-06-10", comment: "Very fresh and crisp. A bit expensive but worth it for organic." }
      ]
    },
    {
      id: "prod-2",
      name: "Fresh Organic Hass Avocados",
      category: "fruits-veg",
      price: 1.99,
      oldPrice: 2.49,
      discount: 20,
      rating: 4.9,
      reviewsCount: 48,
      stock: 60,
      unit: "1 piece",
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=500&q=80",
      featured: true,
      popular: true,
      bestSeller: true,
      hotDeal: true,
      description: "Our certified organic Hass avocados are creamy, buttery, and packed with heart-healthy monounsaturated fats. Perfect for mashing into fresh guacamole, slicing over morning sourdough toast, or throwing into healthy green smoothies.",
      sku: "ORG-AVO-002",
      brand: "Green Valley",
      weight: "0.4 lb each",
      dimensions: "N/A",
      origin: "Michoacán, Mexico",
      benefits: ["High in monounsaturated fats", "Excellent source of potassium and fiber", "Grown in nutrient-dense organic volcanic soil"],
      reviews: [
        { id: "r3", user: "Elena R.", rating: 5, date: "2026-07-02", comment: "Perfectly ripe and so creamy. Will order again!" }
      ]
    },
    {
      id: "prod-3",
      name: "Organic Baby Spinach Clamshell",
      category: "fruits-veg",
      price: 5.49,
      oldPrice: 5.49,
      discount: 0,
      rating: 4.7,
      reviewsCount: 19,
      stock: 25,
      unit: "16oz clamshell",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80",
      featured: true,
      popular: false,
      bestSeller: false,
      hotDeal: false,
      description: "Triple-washed and ready to eat, our baby spinach is tender, mild, and highly versatile. Great for raw salads, sautéing in garlic and olive oil, or boosting your morning green drinks with vitamins and minerals.",
      sku: "ORG-SPN-003",
      brand: "Earthbound Farms",
      weight: "1.0 lb",
      dimensions: "10x6x4 inches",
      origin: "California, USA",
      benefits: ["Pre-washed, ready to eat", "High in Iron, Vitamin A, and Vitamin K", "100% recyclable container"],
      reviews: [
        { id: "r4", user: "Michael B.", rating: 4, date: "2026-06-22", comment: "Fresh, clean, and stays crisp in the fridge for almost a week." }
      ]
    },
    {
      id: "prod-4",
      name: "Organic Strawberries Box",
      category: "fruits-veg",
      price: 3.99,
      oldPrice: 4.99,
      discount: 20,
      rating: 4.6,
      reviewsCount: 29,
      stock: 15,
      unit: "1lb box",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=500&q=80",
      featured: true,
      popular: true,
      bestSeller: false,
      hotDeal: true,
      description: "Sun-ripened and picked at the peak of sweetness, our organic strawberries are juicy, fragrant, and packed with vitamin C. Delightfully sweet, these are perfect for kids' lunchboxes, baking, smoothies, or eating plain with organic cream.",
      sku: "ORG-STR-004",
      brand: "Berry Farms",
      weight: "1.0 lb",
      dimensions: "5x5x3 inches",
      origin: "California, USA",
      benefits: ["Superb natural sweetness", "No synthetic pesticides", "High in antioxidants"],
      reviews: []
    },
    {
      id: "prod-5",
      name: "Raw Organic Meadow Honey",
      category: "pantry",
      price: 11.99,
      oldPrice: 14.99,
      discount: 20,
      rating: 4.95,
      reviewsCount: 52,
      stock: 30,
      unit: "16oz jar",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80",
      featured: true,
      popular: true,
      bestSeller: true,
      hotDeal: false,
      description: "Our raw, unpasteurized, unfiltered organic meadow honey is sourced directly from sustainable apiaries nestled in wild mountain pastures. Retaining all natural pollen, enzymes, and antioxidants, it provides a deep, complex floral sweetness that is perfect for tea, baking, or direct spoonfuls.",
      sku: "ORG-HON-005",
      brand: "Beekeeper's Pride",
      weight: "1.0 lb",
      dimensions: "3x3x5 inches",
      origin: "Montana, USA",
      benefits: ["Raw, unfiltered, and unpasteurized", "Contains active natural enzymes and pollen", "Sourced from wild wildflower meadows"],
      reviews: [
        { id: "r5", user: "Charlotte P.", rating: 5, date: "2026-07-01", comment: "Amazing rich flavor. Best honey I've bought in years." }
      ]
    },
    {
      id: "prod-6",
      name: "Organic Whole Milk Gallon",
      category: "dairy-eggs",
      price: 6.49,
      oldPrice: 6.49,
      discount: 0,
      rating: 4.8,
      reviewsCount: 40,
      stock: 20,
      unit: "1 gallon",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
      featured: false,
      popular: true,
      bestSeller: true,
      hotDeal: false,
      description: "Deliciously rich and creamy milk from grass-fed cows raised on local pasture-centric family dairy farms. This whole milk is pasteurized and homogenized, providing 8g of pure pasture organic protein per serving.",
      sku: "ORG-MLK-006",
      brand: "Organic Valley",
      weight: "8.6 lb",
      dimensions: "6x6x10 inches",
      origin: "Wisconsin, USA",
      benefits: ["Pasture-raised, grass-fed cows", "Excellent source of Calcium and Vitamin D", "No antibiotics or synthetic hormones"],
      reviews: []
    },
    {
      id: "prod-7",
      name: "Organic Large Brown Eggs",
      category: "dairy-eggs",
      price: 4.99,
      oldPrice: 5.49,
      discount: 9,
      rating: 4.9,
      reviewsCount: 61,
      stock: 40,
      unit: "1 Dozen",
      image: "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?auto=format&fit=crop&w=500&q=80",
      featured: true,
      popular: true,
      bestSeller: true,
      hotDeal: false,
      description: "Our brown pasture eggs are laid by happy, free-roaming, organic-fed chickens. They enjoy continuous outdoor pasture access, giving them a rich orange yolk and firm white that elevates baking, scrambling, and frying.",
      sku: "ORG-EGG-007",
      brand: "Happy Hens",
      weight: "1.5 lb",
      dimensions: "12x4x3 inches",
      origin: "Oregon, USA",
      benefits: ["Certified Humane Pasture Raised", "100% Organic, non-GMO feed", "Rich orange yolk with premium flavor"],
      reviews: [
        { id: "r6", user: "Robert S.", rating: 5, date: "2026-06-29", comment: "The rich orange yolk shows how healthy these chickens are. Fantastic taste." }
      ]
    },
    {
      id: "prod-8",
      name: "Organic Sourdough Bread",
      category: "bakery",
      price: 6.99,
      oldPrice: 6.99,
      discount: 0,
      rating: 4.75,
      reviewsCount: 15,
      stock: 12,
      unit: "24oz loaf",
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=500&q=80",
      featured: false,
      popular: false,
      bestSeller: false,
      hotDeal: false,
      description: "Handcrafted loaf made using traditional slow-fermentation methods with certified organic heirloom grains, purified water, and sea salt. It has a beautiful crisp crust and an perfectly tangy, aerated crumb.",
      sku: "ORG-SOU-008",
      brand: "Wild Yeast Bakeries",
      weight: "1.5 lb",
      dimensions: "9x5x4 inches",
      origin: "Local Bakery",
      benefits: ["Naturally fermented (24-hour slow rise)", "Made with organic whole grain flour", "Excellent for gut-friendly digestion"],
      reviews: []
    },
    {
      id: "prod-9",
      name: "Organic Tricolor Quinoa",
      category: "pantry",
      price: 7.49,
      oldPrice: 8.99,
      discount: 16,
      rating: 4.8,
      reviewsCount: 22,
      stock: 50,
      unit: "2lb bag",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80",
      featured: false,
      popular: false,
      bestSeller: false,
      hotDeal: false,
      description: "Our organic tricolor quinoa contains a premium blend of white, red, and black quinoa seeds. This ancient Andean supergrain is a complete plant-based protein containing all nine essential amino acids.",
      sku: "ORG-QUI-009",
      brand: "Andean Harvest",
      weight: "2.0 lb",
      dimensions: "6x2x9 inches",
      origin: "Altiplano, Peru",
      benefits: ["High-protein complete plant source", "Rich in fiber, iron, and magnesium", "Naturally gluten-free and pre-rinsed"],
      reviews: []
    },
    {
      id: "prod-10",
      name: "Organic Sencha Green Tea",
      category: "beverages",
      price: 3.99,
      oldPrice: 3.99,
      discount: 0,
      rating: 4.5,
      reviewsCount: 14,
      stock: 35,
      unit: "20 tea bags",
      image: "https://images.unsplash.com/photo-1531326675209-17cd76a3e578?auto=format&fit=crop&w=500&q=80",
      featured: false,
      popular: false,
      bestSeller: false,
      hotDeal: false,
      description: "Grown in shaded volcanic tea gardens in Shizuoka, Japan, our organic Sencha green tea bags are hand-steeped to deliver a sweet, grassy aroma, bright emerald color, and loaded with natural catechins.",
      sku: "ORG-TEA-010",
      brand: "Zen Herbals",
      weight: "0.15 lb",
      dimensions: "3x3x4 inches",
      origin: "Shizuoka, Japan",
      benefits: ["Rich in EGCG antioxidants", "Mild, natural, jitter-free energy boost", "Eco-friendly, bleach-free tea bags"],
      reviews: []
    },
    {
      id: "prod-11",
      name: "Organic Raw Whole Almonds",
      category: "nuts-seeds",
      price: 8.99,
      oldPrice: 11.99,
      discount: 25,
      rating: 4.9,
      reviewsCount: 38,
      stock: 45,
      unit: "1lb bag",
      image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=500&q=80",
      featured: true,
      popular: true,
      bestSeller: false,
      hotDeal: true,
      description: "Our raw, unpasteurized almonds are sweet, crunchy, and packed with Vitamin E, healthy fats, and minerals. Perfect for snacking, making your own fresh almond milk, or adding crunchy toppings to cereal and salads.",
      sku: "ORG-ALM-011",
      brand: "Natures Treat",
      weight: "1.0 lb",
      dimensions: "5x2x8 inches",
      origin: "California, USA",
      benefits: ["100% Raw, steam-pasteurized", "High in magnesium and vitamin E", "Heart-healthy nutrient density"],
      reviews: [
        { id: "r7", user: "Clara G.", rating: 5, date: "2026-06-18", comment: "So crunchy and fresh! No bitter aftertaste." }
      ]
    },
    {
      id: "prod-12",
      name: "Organic Black Chia Seeds",
      category: "nuts-seeds",
      price: 6.99,
      oldPrice: 6.99,
      discount: 0,
      rating: 4.7,
      reviewsCount: 16,
      stock: 40,
      unit: "12oz bag",
      image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=500&q=80",
      featured: false,
      popular: false,
      bestSeller: false,
      hotDeal: false,
      description: "Certified organic black chia seeds are a powerful antioxidant superfood containing omega-3 fatty acids, plant fiber, calcium, and protein. They swell up beautifully to form an excellent basis for chia puddings, oatmeal thickeners, or egg replacement substitutes.",
      sku: "ORG-CHI-012",
      brand: "Natures Treat",
      weight: "0.75 lb",
      dimensions: "4x2x7 inches",
      origin: "Salta, Argentina",
      benefits: ["Super rich source of Omega-3 ALA", "Loaded with digestible soluble fibers", "Highly versatile plant-thickener"],
      reviews: []
    }
  ],
  blogs: [
    {
      id: "blog-1",
      title: "Why Choosing Certified Organic Veggies Makes a Huge Difference",
      excerpt: "Unpacking the pesticide dilemma, nutritional profiles, and local soil ecology. Learn why clean eating starts at the root.",
      content: "<p>Organic farming isn't just a marketing buzzword; it's a completely different philosophy of agriculture. When you choose organic vegetables, you are supporting farming methods that preserve biodiversity, protect bees, and restore the vital carbon profiles of local soil.</p><h3>The Soil and Nutrient Relationship</h3><p>Unlike conventional farming that relies on chemical fertilizers, organic farmers feed the soil through natural compost and biological diversity. This slow, complex process enables plants to absorb a wider, richer range of secondary metabolites and mineral traces. Studies have indicated organic products can contain significantly higher concentrations of vitamin C, iron, and key protective antioxidants than their non-organic equivalents.</p><h3>Avoiding the 'Dirty Dozen'</h3><p>Conventional crops like strawberries, spinach, and apples consistently rank highest for trace synthetic pesticides, which cannot be easily washed away. Organic certification guarantees the elimination of synthetic glyphosates, genetically modified seeds, and chemical growth triggers, ensuring your family eats only pure, raw nutrients.</p>",
      author: "Dr. Evelyn Vance (Nutritionist)",
      date: "July 12, 2026",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      category: "Nutrition"
    },
    {
      id: "blog-2",
      title: "5 Simple Steps to Prep a Weekly Plant-Based Meal Plan",
      excerpt: "Maximize your organic grocery haul, minimize kitchen waste, and stay highly nourished all week with a structured prep routine.",
      content: "<p>Meal prep can seem intimidating, but with organic produce, the fresh textures and deep natural flavors make it an exciting weekly ritual. Here is a foolproof guide to planning your week.</p><h3>1. Start with Your Ancient Grains</h3><p>Begin by cooking a batch of versatile organic grains like quinoa, brown rice, or farro. These act as high-fiber, high-protein bases that last for up to five days in airtight containers.</p><h3>2. Roast a Rainbow of Root Vegetables</h3><p>Toss organic sweet potatoes, carrots, onions, and broccoli in cold-pressed olive oil, sea salt, and black pepper. Roast them at 400°F for 25 minutes. They retain sweetness and make perfect warm additions to salads.</p><h3>3. Wash and Prep Your Delicate Greens</h3><p>Gently rinse organic baby spinach or kale, dry completely, and pack with a reusable cloth towel inside a clean container to extend their shelf life and absorb excess condensation.</p>",
      author: "Chef Marcus Green",
      date: "July 08, 2026",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
      category: "Cooking"
    },
    {
      id: "blog-3",
      title: "The Superfood Power of Tiny Chia and Flax Seeds",
      excerpt: "Small seeds, colossal advantages. We delve deep into fiber, plant-based Omega-3s, and quick digestive hacks.",
      content: "<p>Don't let their miniature size fool you—chia and flax seeds are absolute nutritional powerhouses. Let's look at how adding just a single tablespoon a day to your breakfast bowl can boost your cardiovascular and gut systems.</p><h3>Omega-3 Fatty Acids</h3><p>These seeds are among the richest plant-based sources of alpha-linolenic acid (ALA), an essential omega-3 fatty acid that combats internal inflammation and supports long-term brain health.</p><h3>Incredible Fiber Expansion</h3><p>Chia seeds can absorb up to 12 times their weight in water, expanding inside your digestive tract to slow glucose absorption and keep you feeling full and satisfied for hours.</p>",
      author: "Anna Croft (Wellness Advocate)",
      date: "June 25, 2026",
      image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
      category: "Superfoods"
    }
  ],
  cart: [] as any[],
  wishlist: [] as string[],
  orders: [
    {
      id: "ORD-9281-A",
      date: "2026-07-10",
      status: "Delivered",
      total: 25.46,
      items: [
        { id: "prod-1", name: "Organic Honey Crisp Apples", quantity: 2, price: 4.99 },
        { id: "prod-5", name: "Raw Organic Meadow Honey", quantity: 1, price: 11.99 },
        { id: "prod-2", name: "Fresh Organic Hass Avocados", quantity: 1, price: 1.99 }
      ],
      shippingAddress: {
        fullName: "John Doe",
        addressLine: "123 Green Pastures Way",
        city: "Portland",
        state: "Oregon",
        zip: "97201",
        country: "USA",
        phone: "+1 555-123-4567"
      },
      paymentMethod: "credit-card",
      shippingFee: 1.50,
      discount: 0
    },
    {
      id: "ORD-4810-X",
      date: "2026-07-13",
      status: "In Transit",
      total: 16.47,
      items: [
        { id: "prod-7", name: "Organic Large Brown Eggs", quantity: 1, price: 4.99 },
        { id: "prod-6", name: "Organic Whole Milk Gallon", quantity: 1, price: 6.49 },
        { id: "prod-3", name: "Organic Baby Spinach Clamshell", quantity: 1, price: 5.49 }
      ],
      shippingAddress: {
        fullName: "John Doe",
        addressLine: "123 Green Pastures Way",
        city: "Portland",
        state: "Oregon",
        zip: "97201",
        country: "USA",
        phone: "+1 555-123-4567"
      },
      paymentMethod: "paypal",
      shippingFee: 0.00,
      discount: 1.00
    }
  ],
  user: {
    fullName: "John Doe",
    email: "mdshamim.en@gmail.com",
    phone: "+1 555-123-4567",
    addresses: [
      {
        id: "addr-1",
        type: "Home",
        fullName: "John Doe",
        addressLine: "123 Green Pastures Way",
        city: "Portland",
        state: "Oregon",
        zip: "97201",
        country: "USA",
        isDefault: true
      },
      {
        id: "addr-2",
        type: "Office",
        fullName: "John Doe",
        addressLine: "456 Silicon Heights Blvd, Suite 200",
        city: "Seattle",
        state: "Washington",
        zip: "98101",
        country: "USA",
        isDefault: false
      }
    ]
  },
  contacts: [] as any[]
};

// API ROUTES

// AUTH
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  // Simulate successful authentication
  res.json({
    token: "simulated-jwt-token-organic-grocery",
    user: DB.user
  });
});

app.post("/api/auth/register", (req, res) => {
  const { fullName, email, password, phone } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "Full Name, Email, and Password are required" });
  }
  DB.user = {
    fullName,
    email,
    phone: phone || "",
    addresses: []
  };
  res.status(201).json({
    token: "simulated-jwt-token-organic-grocery",
    user: DB.user
  });
});

app.get("/api/auth/profile", (req, res) => {
  res.json(DB.user);
});

app.put("/api/auth/profile", (req, res) => {
  const { fullName, phone, email } = req.body;
  if (fullName) DB.user.fullName = fullName;
  if (phone !== undefined) DB.user.phone = phone;
  if (email) DB.user.email = email;
  res.json(DB.user);
});

// ADDRESSES
app.post("/api/auth/addresses", (req, res) => {
  const { type, fullName, addressLine, city, state, zip, country } = req.body;
  const newAddress = {
    id: `addr-${Date.now()}`,
    type: type || "Home",
    fullName: fullName || DB.user.fullName,
    addressLine,
    city,
    state,
    zip,
    country,
    isDefault: DB.user.addresses.length === 0
  };
  DB.user.addresses.push(newAddress);
  res.status(201).json(DB.user.addresses);
});

app.delete("/api/auth/addresses/:id", (req, res) => {
  const { id } = req.params;
  DB.user.addresses = DB.user.addresses.filter(addr => addr.id !== id);
  res.json(DB.user.addresses);
});

// CATEGORIES
app.get("/api/categories", (req, res) => {
  res.json(DB.categories);
});

// PRODUCTS
app.get("/api/products", (req, res) => {
  let list = [...DB.products];
  const { search, category, sort, rating, isFeatured, isBestSeller, isPopular, isHotDeal } = req.query;

  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (category && category !== "all") {
    list = list.filter(p => p.category === category);
  }

  if (rating) {
    const minRating = parseFloat(rating as string);
    list = list.filter(p => p.rating >= minRating);
  }

  if (isFeatured === "true") {
    list = list.filter(p => p.featured);
  }

  if (isBestSeller === "true") {
    list = list.filter(p => p.bestSeller);
  }

  if (isPopular === "true") {
    list = list.filter(p => p.popular);
  }

  if (isHotDeal === "true") {
    list = list.filter(p => p.hotDeal);
  }

  if (sort) {
    if (sort === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === "discount") {
      list.sort((a, b) => b.discount - a.discount);
    }
  }

  res.json(list);
});

app.get("/api/products/:id", (req, res) => {
  const prod = DB.products.find(p => p.id === req.params.id);
  if (!prod) {
    return res.status(404).json({ error: "Product not found" });
  }
  // Append related products
  const related = DB.products.filter(p => p.category === prod.category && p.id !== prod.id).slice(0, 4);
  res.json({
    product: prod,
    related
  });
});

app.post("/api/products/:id/reviews", (req, res) => {
  const prod = DB.products.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ error: "Product not found" });

  const { user, rating, comment } = req.body;
  if (!user || !rating || !comment) {
    return res.status(400).json({ error: "Name, Rating, and Comment are required" });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    user,
    rating: parseFloat(rating),
    date: new Date().toISOString().split("T")[0],
    comment
  };

  prod.reviews.unshift(newReview);
  prod.reviewsCount = prod.reviews.length;
  // Recalculate average rating
  const total = prod.reviews.reduce((acc, r) => acc + r.rating, 0);
  prod.rating = parseFloat((total / prod.reviews.length).toFixed(2));

  res.status(201).json(prod);
});

// CART
app.get("/api/cart", (req, res) => {
  res.json(DB.cart);
});

app.post("/api/cart", (req, res) => {
  const { productId, quantity } = req.body;
  const prod = DB.products.find(p => p.id === productId);
  if (!prod) return res.status(404).json({ error: "Product not found" });

  const existingIdx = DB.cart.findIndex(item => item.product.id === productId);
  if (existingIdx > -1) {
    DB.cart[existingIdx].quantity += (quantity || 1);
  } else {
    DB.cart.push({
      id: `cart-${Date.now()}`,
      product: prod,
      quantity: quantity || 1
    });
  }
  res.json(DB.cart);
});

app.put("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const item = DB.cart.find(c => c.id === id);
  if (item && quantity > 0) {
    item.quantity = quantity;
  }
  res.json(DB.cart);
});

app.delete("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  DB.cart = DB.cart.filter(c => c.id !== id);
  res.json(DB.cart);
});

app.delete("/api/cart", (req, res) => {
  DB.cart = [];
  res.json(DB.cart);
});

// WISHLIST
app.get("/api/wishlist", (req, res) => {
  // Returns product objects in the wishlist
  const products = DB.products.filter(p => DB.wishlist.includes(p.id));
  res.json(products);
});

app.post("/api/wishlist/toggle", (req, res) => {
  const { productId } = req.body;
  const idx = DB.wishlist.indexOf(productId);
  let added = false;
  if (idx > -1) {
    DB.wishlist.splice(idx, 1);
  } else {
    DB.wishlist.push(productId);
    added = true;
  }
  const products = DB.products.filter(p => DB.wishlist.includes(p.id));
  res.json({ added, wishlist: products });
});

// ORDERS
app.get("/api/orders", (req, res) => {
  res.json(DB.orders);
});

app.get("/api/orders/:id", (req, res) => {
  const order = DB.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

app.post("/api/orders", (req, res) => {
  const { shippingAddress, paymentMethod, items, subtotal, shippingFee, discount, total } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    date: new Date().toISOString().split("T")[0],
    status: "Placed",
    total: total || (subtotal + shippingFee - discount),
    items,
    shippingAddress,
    paymentMethod,
    shippingFee: shippingFee || 0,
    discount: discount || 0
  };

  DB.orders.unshift(newOrder);
  // Clear cart
  DB.cart = [];

  res.status(201).json(newOrder);
});

// BLOGS
app.get("/api/blogs", (req, res) => {
  res.json(DB.blogs);
});

app.get("/api/blogs/:id", (req, res) => {
  const post = DB.blogs.find(b => b.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Blog post not found" });
  res.json(post);
});

// CONTACT
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required" });
  }
  const submission = {
    id: `contact-${Date.now()}`,
    name,
    email,
    subject: subject || "No Subject",
    message,
    date: new Date().toISOString()
  };
  DB.contacts.push(submission);
  res.status(201).json({ message: "Thank you! Your message was submitted successfully." });
});

// VITE MIDDLEWARE CONFIGURATION FOR DEV & PROD
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
