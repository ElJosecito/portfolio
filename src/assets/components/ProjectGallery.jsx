import React from 'react'

import { isEnglish } from '../../shared/utils/i18n'
import Lightbox from '../../shared/ui/Lightbox'

/**
 * Galería estilo Pinterest.
 *
 * Usa `columns` de CSS en vez de una librería de masonry: sin JavaScript, sin
 * dependencias, y es lo que mejor tolera la mezcla de capturas verticales de
 * mobile con horizontales de web, que es justo el caso de este portfolio.
 *
 * Cada imagen lleva su `width` y `height` reales, guardados al subirla. Es lo
 * que le permite al navegador reservar el hueco antes de que la imagen cargue;
 * sin eso la galería se reacomoda a saltos.
 */
function ProjectGallery({ images, languaje }) {
    const [openIndex, setOpenIndex] = React.useState(null)

    if (!images?.length) return null

    const english = isEnglish(languaje)
    const captionOf = (image) =>
        (english && image.caption_en) || image.caption || ''

    return (
        <section className="mt-12">
            <h2 className="font-display mb-6 text-3xl font-bold">
                {english ? 'Gallery' : 'Galería'}
            </h2>

            <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
                {images.map((image, index) => (
                    <button
                        key={image.id}
                        type="button"
                        onClick={() => setOpenIndex(index)}
                        className="block w-full break-inside-avoid overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#549eff]"
                    >
                        <img
                            src={image.url}
                            alt={captionOf(image)}
                            width={image.width}
                            height={image.height}
                            loading="lazy"
                            className="w-full"
                        />
                        {captionOf(image) && (
                            <span className="block bg-[#EFE0F4] px-3 py-2 text-left text-xs opacity-70 dark:bg-[#372D48]">
                                {captionOf(image)}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <Lightbox
                images={images}
                index={openIndex}
                caption={openIndex !== null ? captionOf(images[openIndex]) : ''}
                onClose={() => setOpenIndex(null)}
                onNavigate={setOpenIndex}
            />
        </section>
    )
}

export default ProjectGallery
