import { useState, useEffect } from 'react'
import GooeyNav from '../../Components/GooeyNav';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Question', href: '#Question' },
    { label: 'Testimoni', href: '#Testimoni' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-transparent backdrop-blur-md' :  'bg-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <div className="text-[30px] font-bold text-blue-600 md:mr-6 mb-2 md:mb-0">
          SiGocengs
        </div>

        {/* Gooey Navigation */}
        <div className="hidden md:block md:mx-auto relative z-20">
          <div className="relative bg-white rounded-full px-6 py-1 shadow-lg">
            <GooeyNav
              items={items}
              particleCount={12}
              particleDistances={[70, 25]}
              particleR={70}
              initialActiveIndex={0}
              animationTime={500}
              timeVariance={300}
              colors={["#9333ea", "#a855f7", "#c084fc", "#7c3aed"]}
            />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3 z-20">
          <a
            href="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
}
