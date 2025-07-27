import React, { useState } from "react"
import { SparklesIcon } from "lucide-react"

// Badge Component
const Badge = ({ children, variant = "default", className = "" }) => {
    const baseClasses = "inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full"
    const variantClasses = {
        default: "bg-gray-100 text-gray-800",
        outline: "border border-gray-300 bg-white text-gray-700"
    }

    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    )
}

// HoverExpand Component
const HoverExpand = ({
    images,
    initialSelectedIndex = 0,
    thumbnailHeight = 200,
    modalImageSize = 400,
    maxThumbnails = 8
}) => {
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex)
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const displayImages = images.slice(0, maxThumbnails)

    return (
        <div className="w-full px-2 pb-8 overflow-hidden">
            {/* Container with proper overflow handling */}
            <div className="relative w-full max-w-6xl mx-auto">
                <div className="flex justify-center items-center gap-1 md:gap-2 px-4 py-4">
                    {displayImages.map((image, index) => {
                        const isActive = hoveredIndex === index || selectedIndex === index
                        return (
                            <div
                                key={index}
                                className={`relative cursor-pointer transition-all duration-500 ease-out ${isActive
                                        ? 'flex-shrink-0 w-24 md:w-32 lg:w-40 z-10'
                                        : 'flex-shrink-0 w-12 md:w-16 lg:w-20'
                                    }`}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => setSelectedIndex(index)}
                                style={{
                                    height: thumbnailHeight,
                                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                    zIndex: isActive ? 10 : 1
                                }}
                            >
                                <img
                                    src={image}
                                    alt={`Template ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg shadow-lg transition-all duration-500 ease-out"
                                    style={{
                                        boxShadow: isActive
                                            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                                            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                    }}
                                />

                                {/* Overlay effect */}
                                <div
                                    className="absolute inset-0 rounded-lg transition-all duration-500 ease-out"
                                    style={{
                                        background: isActive
                                            ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))'
                                            : 'rgba(0, 0, 0, 0)'
                                    }}
                                />

                                {/* Selected indicator */}
                                {selectedIndex === index && (
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                                )}

                                {/* Hover indicator */}
                                {hoveredIndex === index && selectedIndex !== index && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-md" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Selected image preview */}
            {selectedIndex !== null && displayImages[selectedIndex] && (
                <div className="mt-12 flex justify-center px-4">
                    <div className="relative max-w-md mx-auto">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white p-2">
                            <img
                                src={displayImages[selectedIndex]}
                                alt={`Selected template ${selectedIndex + 1}`}
                                className="w-full h-auto rounded-xl transition-all duration-300"
                                style={{
                                    maxWidth: modalImageSize,
                                    maxHeight: modalImageSize,
                                    objectFit: 'cover'
                                }}
                            />
                        </div>

                        {/* Image counter */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
                            <span className="text-sm font-semibold text-gray-700">
                                {selectedIndex + 1} of {displayImages.length}
                            </span>
                        </div>

                        {/* Navigation arrows */}
                        {displayImages.length > 1 && (
                            <>
                                <button
                                    onClick={() => setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : displayImages.length - 1)}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                >
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setSelectedIndex(selectedIndex < displayImages.length - 1 ? selectedIndex + 1 : 0)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                >
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const images = [
    "https://images.pexels.com/photos/30082445/pexels-photo-30082445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.unsplash.com/photo-1692606743169-e1ae2f0a960f?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://assets.lummi.ai/assets/QmQLSBeCFHUwCv7WBpGr7T3P67UXaAw8B2vvmtKimyinrL?auto=format&w=1500",
    "https://assets.lummi.ai/assets/QmXe6v7jBF5L2R7FCio8KQdXwTX2uqzRycUJapyjoXaTqd?auto=format&w=1500",
    "https://assets.lummi.ai/assets/QmNfwUDpehZyLWzE8to7QzgbJ164S6fQy8JyUWemHtmShj?auto=format&w=1500",
    "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
    "https://assets.lummi.ai/assets/Qmb2P6tF2qUaFXnXpnnp2sk9HdVHNYXUv6MtoiSq7jjVhQ?auto=format&w=1500",
    "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
]

export function MouseTrailDemo() {
    return (
        <section className="mx-auto w-full max-w-4xl rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-t-[44px]">
            <div className="relative mx-auto flex w-full flex-col items-center justify-center  rounded-[24px] border border-black/5 bg-neutral-800/5  shadow-sm  md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] ">
                <article className="relative z-50 mt-20 flex flex-col  items-center justify-center ">
                    <Badge
                        variant="outline"
                        className="mb-3 rounded-[14px] border border-black/10 bg-white text-base md:left-6"
                    >
                        <SparklesIcon className="  fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
                        Hover to Explore Templates
                    </Badge>
                    <h1 className="max-w-2xl text-center text-5xl font-semibold tracking-tight ">
                   

Experience our templates with interactive hover effects
                    </h1>
                </article>
                <HoverExpand
                    images={images}
                    initialSelectedIndex={0}
                    thumbnailHeight={200}
                    modalImageSize={400}
                    maxThumbnails={11}
                />
            </div>
        </section>
    )
}
