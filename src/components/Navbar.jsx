import { Link } from "react-router-dom";

export default function Navbar(){
  return (
    <nav className="bg-white shadow p-4 mb-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4">
          <img src="/logo.png" alt="拎著數 Icon" className="h-10 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto" />
          <span className="font-bold text-2xl sm:text-2xl md:text-3xl text-gray-800">拎著數</span>
        </Link>
        {/* <div className="flex gap-4">
          <Link to="/" className="text-gray-600 hover:text-black">最新優惠</Link>
          <Link to="/about" className="text-gray-600 hover:text-black">關於本站</Link>
        </div> */}
      </div>
    </nav>
  );
}
