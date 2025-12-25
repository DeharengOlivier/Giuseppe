'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon, Video, Loader2, Check } from 'lucide-react'

interface FileUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  accept?: 'image' | 'video' | 'both'
  help?: string
}

export function FileUpload({ label, value, onChange, accept = 'both', help }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const acceptTypes = {
    image: 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
    video: 'video/mp4,video/webm',
    both: 'image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm'
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload')
      }

      onChange(data.url)
      setUploadSuccess(true)
      
      // Reset success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleRemove = () => {
    onChange('')
    setUploadSuccess(false)
  }

  const isImage = value && (value.match(/\.(jpg|jpeg|png|webp|gif)$/i) || value.includes('image'))
  const isVideo = value && (value.match(/\.(mp4|webm)$/i) || value.includes('video'))

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {help && (
        <p className="text-xs text-gray-500">{help}</p>
      )}

      {value ? (
        <div className="space-y-3">
          {/* Prévisualisation */}
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
            {isImage && (
              <img 
                src={value} 
                alt="Preview" 
                className="w-full h-48 object-cover"
              />
            )}
            {isVideo && (
              <video 
                src={value} 
                className="w-full h-48 object-cover"
                muted
                loop
                autoPlay
              />
            )}
            {!isImage && !isVideo && (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Fichier uploadé</p>
                </div>
              </div>
            )}

            {/* Badge de succès */}
            {uploadSuccess && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                  <Check className="w-4 h-4" />
                  Uploadé !
                </div>
              </div>
            )}
          </div>

          {/* URL et bouton supprimer */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 font-mono"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bouton remplacer */}
          <div className="relative">
            <input
              type="file"
              accept={acceptTypes[accept]}
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled={uploading}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Upload en cours...
                </span>
              ) : (
                'Remplacer le fichier'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={acceptTypes[accept]}
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="text-center">
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 mx-auto mb-3 text-indigo-600 animate-spin" />
                <p className="text-sm font-medium text-gray-700">Upload en cours...</p>
                <p className="text-xs text-gray-500 mt-1">Veuillez patienter</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {accept === 'image' && <ImageIcon className="w-12 h-12 text-gray-400" />}
                  {accept === 'video' && <Video className="w-12 h-12 text-gray-400" />}
                  {accept === 'both' && (
                    <>
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                      <Video className="w-10 h-10 text-gray-400" />
                    </>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Cliquez ou glissez-déposez un fichier
                </p>
                <p className="text-xs text-gray-500">
                  {accept === 'image' && 'JPG, PNG, WebP, GIF (max 500MB)'}
                  {accept === 'video' && 'MP4, WebM (max 500MB)'}
                  {accept === 'both' && 'Image ou vidéo (max 500MB)'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
