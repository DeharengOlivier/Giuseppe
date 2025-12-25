'use client'

import { useState, useEffect } from 'react'

interface SlideshowBackgroundProps {
    images: string[]
    overlayOpacity: number
}

export function SlideshowBackground({ images, overlayOpacity }: SlideshowBackgroundProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (images.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, 5000) // Change every 5 seconds

        return () => clearInterval(interval)
    }, [images.length])

    if (!images || images.length === 0) return null

    return (
        <>
            {images.map((img, index) => (
                <div
                    key={img}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
                    style={{
                        backgroundImage: `url(${img})`,
                        opacity: index === currentIndex ? 1 : 0,
                        zIndex: 0
                    }}
                />
            ))}
            <div
                className="absolute inset-0 bg-black transition-opacity duration-300"
                style={{ opacity: overlayOpacity, zIndex: 1 }}
            />
        </>
    )
}
