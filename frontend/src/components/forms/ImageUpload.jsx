import { useEffect, useRef } from 'react'

export default function ImageUpload({ onUpload, currentImage, label = "Subir foto" }) {
  const widgetRef = useRef(null)

  useEffect(() => {
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dlslxzu8i',
        uploadPreset: 'baloncesto-cr',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 1,
        language: 'es',
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          onUpload(result.info.secure_url)
        }
      }
    )
  }, [])

  return (
    <div className="flex items-center gap-4">
      {currentImage && (
        <img src={currentImage} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-orange-500" />
      )}
      {!currentImage && (
        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl">📷</div>
      )}
      <button
        type="button"
        onClick={() => widgetRef.current.open()}
        className="border border-gray-700 hover:border-orange-500 px-4 py-2 rounded-lg text-sm transition"
      >
        {currentImage ? 'Cambiar foto' : label}
      </button>
    </div>
  )
}