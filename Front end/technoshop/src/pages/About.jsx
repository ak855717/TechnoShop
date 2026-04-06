import { Link } from "react-router-dom";

const team = [
  { name: "Alex Chen", role: "Founder & CEO", emoji: "👨‍💼" },
  { name: "Sarah Kim", role: "Head of Curation", emoji: "👩‍💻" },
  { name: "Marcus Lee", role: "Tech Evangelist", emoji: "🧑‍🔬" },
  { name: "Priya Sharma", role: "Customer Success", emoji: "👩‍🎨" },
];

export default function About() {

  return (
    <div className="pt-16 min-h-screen bg-white">

 

      {/* Hero */}
      <section className="bg-black text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Our Story</p>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Built by Tech Lovers,<br />
            <span className="text-gray-400">for Tech Lovers</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            TechnoShop was born from a simple frustration — why do you have to wade through furniture, clothing, and kitchen appliances just to find the latest iPhone? We built the store we always wanted.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="text-3xl font-bold text-black mb-6">One Store. Every Tech Product You Need.</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe technology is the most exciting thing happening in the world today. Every year, Apple, Samsung, Sony, and DJI ship products that feel like science fiction — and we want you to experience all of it in one place.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                TechnoShop is exclusively tech. No distractions. No irrelevant categories. Just the best phones, laptops, cameras, drones, headphones, and gadgets — curated, verified, and shipped fast.
              </p>
              <Link to="/shop" className="inline-block px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                Start Shopping
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F2F0EB] rounded-2xl p-6 flex flex-col">
                <span className="text-3xl font-bold text-black">500+</span>
                <span className="text-sm text-gray-500 mt-1">Tech Products</span>
              </div>
              <div className="bg-black rounded-2xl p-6 flex flex-col">
                <span className="text-3xl font-bold text-white">4</span>
                <span className="text-sm text-gray-400 mt-1">Premium Brands</span>
              </div>
              <div className="bg-black rounded-2xl p-6 flex flex-col">
                <span className="text-3xl font-bold text-white">10K+</span>
                <span className="text-sm text-gray-400 mt-1">Happy Customers</span>
              </div>
              <div className="bg-[#F2F0EB] rounded-2xl p-6 flex flex-col">
                <span className="text-3xl font-bold text-black">4.9★</span>
                <span className="text-sm text-gray-500 mt-1">Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#F2F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">What Drives Us</p>
            <h2 className="text-3xl font-bold text-black">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "Exclusivity", desc: "We only sell tech. Every product on TechnoShop is carefully curated from brands that define the industry." },
              { icon: "✅", title: "Authenticity", desc: "All products are sourced through official channels. No grey market, no counterfeits — ever." },
              { icon: "💡", title: "Passion", desc: "Our team consists of genuine tech enthusiasts who use and love the products we sell." },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-8">
                <span className="text-4xl block mb-4">{v.icon}</span>
                <h3 className="font-bold text-xl text-black mb-3">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">The People</p>
            <h2 className="text-3xl font-bold text-black">Meet the Team</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-black transition-colors group">
                <div className="w-16 h-16 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl group-hover:bg-black transition-colors">
                  {member.emoji}
                </div>
                <h3 className="font-bold text-black text-sm">{member.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Upgrade Your Setup?</h2>
          <p className="text-gray-400 mb-8">Browse our full collection of premium tech products.</p>
          <Link to="/shop" className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors">
            Shop Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
