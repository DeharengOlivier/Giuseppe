'use client'

import { useState } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'

interface MultiImageUploadProps {
    images: string[]
    onChange: (images: string[]) => void
    label?: string
}

export function MultiImageUpload({ images = [], onChange, label }: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        const newImages = [...images]

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const formData = new FormData()
                formData.append('file', file)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (response.ok) {
                    const data = await response.json()
                    newImages.push(data.url)
                } else {
                    console.error('Upload failed for file:', file.name)
                }
            }
            onChange(newImages)
        } catch (error) {
            console.error('Error uploading images:', error)
        } finally {
            setUploading(false)
            // Reset input
            e.target.value = ''
        }
    }

    const removeImage = (indexToRemove: number) => {
        onChange(images.filter((_, index) => index !== indexToRemove))
    }

    const moveImage = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= images.length) return
        const newImages = [...images]
        const [movedItem] = newImages.splice(fromIndex, 1)
        newImages.splice(toIndex, 0, movedItem)
        onChange(newImages)
    }

    return (
        <div className="space-y-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700">{label}</label>
            )}

            {/* Grid d'images */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div key={url + index} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                            src={url}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => moveImage(index, index - 1)}
                                    disabled={index === 0}
                                    className="p-1 bg-white rounded-full text-gray-700 hover:text-indigo-600 disabled:opacity-50"
                                    title="Déplacer vers la gauche"
                                >
                                    ←
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-1 bg-white rounded-full text-red-600 hover:text-red-800"
                                    title="Supprimer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveImage(index, index + 1)}
                                    disabled={index === images.length - 1}
                                    className="p-1 bg-white rounded-full text-gray-700 hover:text-indigo-600 disabled:opacity-50"
                                    title="Déplacer vers la droite"
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Bouton d'ajout */}
                <div className="aspect-video relative rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors flex flex-col items-center justify-center bg-gray-50 hover:bg-indigo-50">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                    />
                    {uploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 font-medium">Ajouter des images</span>
                        </>
                    )}
                </div>
            </div>

            {images.length === 0 && (
                <p className="text-xs text-gray-500 italic">Aucune image sélectionnée</p>
            )}
        </div>
    )
}
