import { useEffect, useState } from "react";
const testimonials = [
    {
        quote: `"Don't know where your money is going? With this app, you can get your family budget in order."`,
        name: "– Gorchakov, App Store",
    },
    {
        quote: `"A simple yet powerful tool for managing finances. Highly recommend!"`,
        name: "– Amanda, Google Play",
    },
    {
        quote: `"I now feel in control of my spending. This app changed how I view money."`,
        name: "– Yusuf, App Store",
    },
];
export default function Hero() {
    const [current, setCurrent] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Start fade out
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % testimonials.length);
                setFade(true); // Fade in next slide
            }, 200); // Small delay for smooth fade
        }, 3000); // Change every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="bg-gradient-to-b from-white to-blue-50 pt-24 md:pt-32 pb-16">
            {/* Header / Hero Text + Gambar */}
            <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between mb-16">
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                        Save money. <br /> Track expenses.
                    </h1>
                    <p className="text-gray-600 mt-4 text-lg">
                        Monefy makes managing your personal finances easy and intuitive.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row sm:justify-center md:justify-start gap-4">
                        <p className="text-gray-700 font-medium">Lorem ipsum</p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 mb-12 md:mb-0 flex justify-center">
                    <img
                        src="img/uang.png"
                        className="w-[450px] md:w-[500px] drop-shadow-xl"
                        alt="Hero"
                    />
                </div>
            </div>

            {/* Card Grid Layout */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[250px] md:auto-rows-[300px] lg:auto-rows-[320px]">

                {/* Card 1 - Savings */}
                <div className="bg-white rounded-2xl p-6 shadow-md col-span-2 row-span-2 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Savings 💰</h3>
                        <p className="text-green-600 text-2xl font-bold">$22,463.75</p>
                        <ul className="text-gray-600 mt-3 text-sm space-y-1">
                            <li>• Income</li>
                            <li>• Expenses</li>
                            <li>• Investments</li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-600">
                            Smart savings plan available
                        </div>
                    </div>
                </div>

                {/* Card 2 - Feature Icons */}
                <div className="bg-white rounded-2xl p-6 shadow-md col-span-2 flex items-center justify-around text-2xl">

                </div>


                {/* Card 3 - Phone Mockup */}
                <div className="bg-[#2927b6] rounded-2xl p-4 shadow-md col-span-2 row-span-2 flex items-center justify-center">
                    <img
                        src="img/mobile-finance-ui.png"
                        className="h-full object-contain"
                    />
                </div>
                {/* Card 4 - Image/Person */}
                <div className="bg-white rounded-2xl overflow-hidden col-span-2">
                    <img
                        src="img/orang.jpg"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Card 5 - Testimonial */}
                {/* Testimonial Slider Card with Fade Animation */}
                <div className="bg-blue-700 text-white rounded-2xl p-6 shadow-md col-span-3 relative overflow-hidden">
                    <div
                        key={current}
                        className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <p className="italic text-lg">{testimonials[current].quote}</p>
                        <p className="mt-4 text-sm font-semibold">{testimonials[current].name}</p>
                    </div>

                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {testimonials.map((_, index) => (
                            <span
                                key={index}
                                className={`h-2 w-2 rounded-full ${index === current ? "bg-white" : "bg-white/50"
                                    }`}
                            ></span>
                        ))}
                    </div>
                </div>

                {/* Card 6 - Guides & Tools */}
                <div className="bg-white rounded-2xl p-6 shadow-md col-span-3 flex flex-col justify-between">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Guides & Tools</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        <li>Learning how to budget</li>
                        <li>Getting debt free</li>
                        <li>Building your wealth</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
