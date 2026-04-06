import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen bg-[#F2F0EB] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-[120px] font-black text-black leading-none mb-4">404</div>
        <h2 className="text-2xl font-bold text-black mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-10">
          Looks like this page got lost somewhere in the tech universe. Don't worry — our products are still here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
            Go Home
          </Link>
          <Link to="/shop" className="px-8 py-4 border-2 border-black text-black font-semibold rounded-xl hover:bg-black hover:text-white transition-colors">
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
