import React, { useState } from "react";
import { Breadcrumb } from "../components/common/Breadcrumb";
import { BookOpen, Search, User, Calendar, ArrowRight, X, Sprout } from "lucide-react";
import { toast } from "react-hot-toast";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readingTime: string;
}

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "10 Direct Benefits of Transitioning to Certified Organic Greens",
    excerpt: "Discover why replacing standard pesticide-sprayed greens with certified organic varieties boosts digestive wellness and increases antioxidant intake.",
    content: "Organic greens are grown without standard synthetic pesticides, chemical fertilizers, or genetically modified seeds. Instead, sustainable agriculture cooperatives utilize composting, crop rotation, and beneficial insect controls to cultivate rich soils. As a result, research proves certified organic kale, spinach, and Swiss chard hold significantly higher levels of Vitamin C, trace minerals, and bioavailable polyphenols. Additionally, bypassing pesticide residues mitigates chemical loads in the human liver, promoting natural detoxification pathways and clean energy.",
    author: "Dr. Evelyn Ross",
    date: "July 12, 2026",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400",
    readingTime: "4 min read"
  },
  {
    id: "post-2",
    title: "Sourdough Masterclass: Navigating Wild Organic Yeast Culturing",
    excerpt: "Learn how to establish, feed, and preserve an organic wild-yeast sourdough starter at home using premium stone-ground unbleached rye flour.",
    content: "Unlike standard rapid-rise dry baker's yeast, authentic sourdough relies on wild, ambient yeasts and lactobacilli. Feeding your starter with unbleached organic rye or whole wheat flour ensures rich enzymatic activation. Sourdough fermentation breaks down standard gluten proteins and phytic acids—which typically block mineral absorption in the colon—into easily digestible amino acids. The result is an artisanal loaf with the signature crusty shell, dynamic airy crumb structure, and a low glycemic impact.",
    author: "Baker Marc Solis",
    date: "July 08, 2026",
    category: "Recipes",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=400",
    readingTime: "6 min read"
  },
  {
    id: "post-3",
    title: "Understanding Biodynamic Agriculture vs Standard Organic Farming",
    excerpt: "A deep dive into Demeter-certified biodynamic protocols: mapping lunar cycles, natural composting preparations, and closed-loop environments.",
    content: "While standard organic certifications focus strictly on what is excluded (such as synthetic chemical sprays), Biodynamic farming represents an immersive, positive philosophy of holistic land stewardship. Developed by Rudolf Steiner, biodynamic practices treat the orchard or vineyard as a self-sustaining, living organism. Farmers grow specialized animal feed on-site, use herbal and mineral composting formulas, and schedule planting according to planetary alignments. Demeter certification ensures unmatched ecological integrity.",
    author: "Clara Vance (Orchardist)",
    date: "June 28, 2026",
    category: "Farming",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400",
    readingTime: "5 min read"
  },
  {
    id: "post-4",
    title: "Summer Gazpacho: Cold-Pressed Organic Vine Tomato Recipe",
    excerpt: "Stay chilled during high-summer heatwaves with this Spanish heirloom soup featuring pressed beefsteak tomatoes, cucumbers, and olive oil.",
    content: "The secret to gazpacho is the chemical structure of vine-ripened organic tomatoes. Standard commercial tomatoes are picked green and gassed with ethylene to turn red, resulting in a mealy texture. Heirloom organic beefsteak tomatoes ripen in natural soil, concentrating sugars and acidic compounds. Puree tomatoes with organic field cucumbers, raw garlic cloves, high-quality extra virgin olive oil, and a dash of red wine vinegar. Serve chilled with dynamic micro-basil leaves on top.",
    author: "Chef Alan Reed",
    date: "June 22, 2026",
    category: "Recipes",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=400",
    readingTime: "3 min read"
  }
];

export const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ["All", "Wellness", "Recipes", "Farming"];

  // Filter posts based on search query & category selection
  const filteredPosts = SAMPLE_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="blog-page" className="bg-gray-50/50 pb-16">
      
      <Breadcrumb items={[{ label: "Organic Journal" }]} />

      <div className="container-custom pt-8">
        
        {/* HERO HEADER TITLE */}
        <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
          <BookOpen className="w-10 h-10 text-brand-650 mx-auto" />
          <h1 className="text-2xl md:text-3xl font-bold font-display text-gray-900">The Organic Journal</h1>
          <p className="text-xs text-gray-400">
            Nutrition essays, sustainable farming updates, and whole-food kitchen guides curated by Demeter-certified soil experts and wellness nutritionists.
          </p>
        </div>

        {/* SEARCH AND FILTER CONTROL ROW */}
        <div className="bg-white border border-gray-150 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 mb-8 shadow-sm">
          {/* Category Tabs */}
          <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs py-1.5 px-3.5 rounded-lg transition-standard shrink-0 font-semibold ${
                  activeCategory === cat 
                    ? "bg-brand-600 text-white shadow-sm" 
                    : "bg-gray-100 hover:bg-gray-250 text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-3 pr-8 text-xs focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5" />
          </div>
        </div>

        {/* POSTS GRID */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-150">
            <p className="text-xs text-gray-400 italic">No articles match your search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Photo */}
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 duration-500 transition-transform"
                  />
                  <span className="absolute top-4 left-4 bg-brand-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">
                    {post.category}
                  </span>
                </div>

                {/* Info and content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Date / Time */}
                    <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-mono font-medium">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>

                    <h3 className="font-bold text-gray-850 text-sm hover:text-brand-600 transition-standard leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Read detail trigger */}
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1 group pt-2 border-t border-gray-50 self-start"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* ARTICLE FULL MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            
            {/* Image top header */}
            <div className="h-56 relative shrink-0">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-standard shadow"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="absolute bottom-4 left-4 bg-brand-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">
                {selectedPost.category}
              </span>
            </div>

            {/* Post content body */}
            <div className="p-6 md:p-8 space-y-5">
              
              <div className="space-y-2">
                {/* Meta details */}
                <div className="flex items-center space-x-4 text-[10px] text-gray-400 font-mono font-medium">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{selectedPost.author}</span>
                  </div>
                  <span>•</span>
                  <span>{selectedPost.date}</span>
                </div>

                <h2 className="text-lg md:text-xl font-bold font-display text-gray-900 leading-tight">
                  {selectedPost.title}
                </h2>
              </div>

              {/* Main text formatted */}
              <div className="text-xs text-gray-500 leading-relaxed space-y-4 pt-3 border-t border-gray-100">
                <p className="font-semibold text-gray-650 italic">"{selectedPost.excerpt}"</p>
                <p>{selectedPost.content}</p>
                
                <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-4 flex items-start space-x-3 mt-4 text-[11px] text-brand-850">
                  <Sprout className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Sustainable Eating Principle</span>
                    <span>All recommendations are organic, pasture-raised, or Demeter biodynamic, promoting healthy physical bodies alongside vital, living topsoil networks.</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2 px-5 rounded-xl"
                >
                  Close Article View
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
