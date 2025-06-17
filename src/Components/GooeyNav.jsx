import { useRef, useEffect, useState } from "react";

const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 12,
  particleDistances = [70, 20],
  particleR = 80,
  timeVariance = 300,
  colors = ["#9333ea", "#a855f7", "#c084fc", "#7c3aed"],
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `${p.color}`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);
        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => element.classList.add("active"));
        setTimeout(() => element.removeChild(particle), t);
      }, 30);
    }
  };

  const updateEffectPosition = (element) => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index) => {
    const liEl = e.currentTarget;
    if (activeIndex === index) return;
    setActiveIndex(index);
    updateEffectPosition(liEl);
    filterRef.current.querySelectorAll(".particle").forEach((p) => filterRef.current.removeChild(p));
    textRef.current.classList.remove("active");
    void textRef.current.offsetWidth;
    textRef.current.classList.add("active");
    makeParticles(filterRef.current);
  };

  useEffect(() => {
    const activeLi = navRef.current.querySelectorAll("li")[activeIndex];
    updateEffectPosition(activeLi);
    textRef.current?.classList.add("active");
    const resizeObserver = new ResizeObserver(() => updateEffectPosition(navRef.current.querySelectorAll("li")[activeIndex]));
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style>{`
        .effect {
          position: absolute;
          pointer-events: none;
          display: grid;
          place-items: center;
          z-index: 1;
        }
        .effect.text {
          color: black;
          transition: color 0.3s ease;
        }
        .effect.filter::before {
          content: "";
          position: absolute;
          inset: -75px;
          background: transparent;
        }
        .effect.filter::after {
          content: "";
          position: absolute;
          inset: 0;
          background: white;
          transform: scale(0);
          opacity: 0;
          border-radius: 9999px;
        }
        .effect.active::after {
          animation: pill 0.3s ease both;
        }
        @keyframes pill {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .particle, .point {
          display: block;
          opacity: 0;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          transform-origin: center;
        }
        .particle {
          position: absolute;
          top: calc(50% - 8px);
          left: calc(50% - 8px);
          animation: particle var(--time) ease 1 -350ms;
        }
        .point {
          background: var(--color);
          opacity: 1;
          animation: point var(--time) ease 1 -350ms;
        }
        @keyframes particle {
          0% { transform: rotate(0deg) translate(var(--start-x), var(--start-y)); opacity: 1; }
          70% { transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2)); opacity: 1; }
          100% { transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5)); opacity: 0; }
        }
        @keyframes point {
          0% { transform: scale(0); opacity: 0; }
          65% { transform: scale(var(--scale)); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}</style>
      <div className="relative" ref={containerRef}>
        <nav className="flex relative">
          <ul ref={navRef} className="flex gap-6 list-none relative z-[3]">
            {items.map((item, index) => (
              <li
                key={index}
                className={`py-2 px-4 cursor-pointer relative font-medium ${activeIndex === index ? "text-black" : "text-gray-600"}`}
                onClick={(e) => handleClick(e, index)}
              >
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />
      </div>
    </>
  );
};

export default GooeyNav;
