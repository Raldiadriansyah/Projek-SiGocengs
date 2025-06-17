import React from "react";
import { FaBullseye, FaRocket, FaAward } from "react-icons/fa";
import TiltedCard from "../../Components/TiltedCard";
import { motion } from "framer-motion";

export default function About() {
    return (
        <section id="about" className="w-full py-20 bg-gradient-to-br from-blue-100 to-purple-200 text-gray-800 overflow-hidden">
            {/* Header */}
            <div className="max-w-6xl mx-auto px-4 text-center mb-12">
                <p className="text-sm uppercase tracking-wide text-gray-500">Home / Our Team</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                    Siapa? <span className="text-blue-600">Kita</span>
                </h1>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                {/* Image Section with animation */}
                <motion.div
                    className="grid grid-cols-2 gap-4 relative"
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="flex flex-col gap-4 translate-y-[-40px]">
                        <img
                            src="/img/About1.jpeg"
                            alt="Fabian"
                            className="rounded-lg shadow-md object-cover w-full h-[430px]"
                        />
                    </div>
                    <div className="flex flex-col gap-4 translate-y-[40px]">
                        <img
                            src="/img/About2.jpeg"
                            alt="John"
                            className="rounded-lg shadow-md object-cover w-full h-[430px]"
                        />
                    </div>
                </motion.div>

                {/* Text Section with animation */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold mb-4">Creative Directors</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        <strong>SiGocengs</strong> adalah platform manajemen keuangan pribadi dan keluarga
                        yang berdiri sejak 2024. Aplikasi ini bertujuan membantu masyarakat Indonesia dalam
                        mengatur pengeluaran, mencatat transaksi, dan mencapai tujuan finansial mereka
                        secara cerdas dan praktis.
                    </p>

                    <div className="mb-4">
                        <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                            <FaBullseye /> Visi
                        </h4>
                        <p className="text-sm text-gray-700 mt-1">
                            Menjadi solusi keuangan digital terpercaya untuk keluarga Indonesia.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                            <FaRocket /> Misi
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                            <li>Meningkatkan kesadaran finansial melalui teknologi.</li>
                            <li>Menyediakan alat pencatatan dan perencanaan keuangan harian yang mudah.</li>
                            <li>Memberikan edukasi keuangan bagi seluruh lapisan masyarakat.</li>
                        </ul>
                    </div>

                    <div className="text-sm text-gray-500">
                        <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                            <FaAward /> Penghargaan
                        </h4>
                        <ul className="mt-1 list-disc list-inside">
                            <li>Top 10 Fintech Startups Indonesia 2024</li>
                            <li>Inovasi Keuangan Digital Terbaik – Kompas Tech Award</li>
                        </ul>
                    </div>
                </motion.div>
            </div>

            {/* Tilted Cards Section */}
            <motion.div
                className="relative mt-24 px-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-blue-800 font-semibold text-lg px-6 py-2 rounded-full shadow-md z-10">
                    Cerita Dibalik SiGocengs
                </div>

                <div className="bg-blue-400 rounded-2xl py-16 px-6 max-w-7xl mx-auto shadow-lg">
                    <div className="grid md:grid-cols-3 gap-6 justify-items-center">
                        <TiltedCard
                            imageSrc="/img/People3.jpeg"
                            altText="Cerita 1"
                            captionText="Designer"
                            containerHeight="300px"
                            containerWidth="100%"
                            imageHeight="300px"
                            imageWidth="300px"
                            rotateAmplitude={10}
                            scaleOnHover={1.1}
                            overlayContent={
                                <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-lg">
                                    Daffa Rinaldi
                                </p>
                            }
                            displayOverlayContent={true}
                        />
                        <TiltedCard
                            imageSrc="/img/People2.jpeg"
                            altText="Cerita 2"
                            captionText="Designer"
                            containerHeight="300px"
                            containerWidth="100%"
                            imageHeight="300px"
                            imageWidth="300px"
                            rotateAmplitude={10}
                            scaleOnHover={1.1}
                            overlayContent={
                                <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-lg">
                                    Raja Aldi Ardiansyah
                                </p>
                            }
                            displayOverlayContent={true}
                        />
                        <TiltedCard
                            imageSrc="/img/People1.jpeg"
                            altText="Cerita 3"
                            captionText="Designer"
                            containerHeight="300px"
                            containerWidth="100%"
                            imageHeight="300px"
                            imageWidth="300px"
                            rotateAmplitude={10}
                            scaleOnHover={1.1}
                            overlayContent={
                                <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-lg">
                                    Danda Pramana A
                                </p>
                            }
                            displayOverlayContent={true}
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
