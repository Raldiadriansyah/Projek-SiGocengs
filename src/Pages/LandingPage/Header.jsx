import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/30 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4 text-xl">
        <div className="text-[30px] font-bold text-blue-600 mr-60">
          SiGocengs
        </div>

        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="#section-how" className="hover:text-blue-600">Home</a>
          <a href="#section-screenshots" className="hover:text-blue-600">About</a>
          <a href="#section-reviews" className="hover:text-blue-600">Review</a>
          <a href="#section-support" className="hover:text-blue-600">Contact</a>
        </nav>

        <div className="w-1/3 flex justify-end items-center space-x-4 ">
          <div className="flex items-center space-x-6">
              <a
                href="#"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-10px"
              >
                Sign In
              </a>
              <a
                href="#"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Sign Up
              </a>
          </div>
        </div>
      </div>
    </header>
  );
}
