export default function Hero() {
    return (
       <section className="bg-gradient-to-b from-white to-blue-50 pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Save money. <br /> Track expenses.
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Monefy makes managing your personal finances easy and intuitive.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-center md:justify-start gap-4">
            <p className="">Lorem ipsum</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 mb-12 md:mb-0 flex justify-center">
          <img
            src="img/uang.png"
            className="w-[450px] md:w-[500px] drop-shadow-xl"
          />
        </div>
      </div>
    </section>
    );
}