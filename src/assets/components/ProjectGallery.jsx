import React from 'react'
import { useMediaQuery } from '@uidotdev/usehooks'

import { isEnglish } from '../../shared/utils/i18n'
import Lightbox from '../../shared/ui/Lightbox'
import styles from './ProjectGallery.module.css'

/**
 * Cuántas columnas de masonry según el ancho de pantalla. Mismos breakpoints
 * que el resto del rediseño (ver tokens.css: 640/1024, equivalentes a los
 * sm/md/lg de Tailwind que tenía esta página antes).
 */
function useColumnCount() {
    const isDesktop = useMediaQuery('(min-width: 1024px)')
    const isTablet = useMediaQuery('(min-width: 640px)')

    if (isDesktop) return 3
    if (isTablet) return 2
    return 1
}

/**
 * Reparte las imágenes en `columnCount` columnas por "la columna más corta se
 * la lleva" (greedy, estilo Pinterest), balanceando por ALTURA ESTIMADA
 * (height/width de cada imagen — todas las columnas tienen el mismo ancho,
 * así que esa razón ya es la altura relativa que va a ocupar) en vez de por
 * cantidad de imágenes. Con cantidad nomás, cuatro capturas de celular
 * (retrato, altas) apiladas en una columna la dejarían mucho más larga que
 * una columna con cuatro capturas de PC (paisaje, bajas) — que es exactamente
 * el caso de este portfolio (mezcla de mockups de mobile y de web).
 *
 * Determinístico y sin medir el DOM: no hace falta un ResizeObserver ni
 * esperar a que las imágenes carguen, porque `width`/`height` ya vienen
 * guardados por imagen (ver supabase/schema.sql, columnas `width`/`height`).
 */
function distributeMasonry(images, columnCount) {
    const columns = Array.from({ length: columnCount }, () => [])
    const heights = new Array(columnCount).fill(0)

    images.forEach((image) => {
        const ratio = image.height && image.width ? image.height / image.width : 1

        let shortest = 0
        for (let i = 1; i < columnCount; i += 1) {
            if (heights[i] < heights[shortest]) shortest = i
        }

        columns[shortest].push(image)
        heights[shortest] += ratio
    })

    return columns
}

/**
 * Galería estilo Pinterest con lightbox.
 *
 * Mezcla mockups de celular (retrato) y de PC (paisaje) sin que la cuadrícula
 * se vea despareja: cada imagen reserva su hueco exacto por `aspect-ratio`
 * (nada de `object-cover` recortando el mockup) y la distribución por
 * columnas (ver `distributeMasonry`) balancea la altura total de cada una.
 */
function ProjectGallery({ images, languaje }) {
    const [openIndex, setOpenIndex] = React.useState(null)
    const columnCount = useColumnCount()

    if (!images?.length) return null

    const english = isEnglish(languaje)
    const captionOf = (image) => (english && image.caption_en) || image.caption || ''

    const columns = distributeMasonry(images, columnCount)
    // El lightbox navega sobre el orden original (`images`), no sobre el de
    // cada columna — así "siguiente"/"anterior" sigue el orden que el panel
    // guardó (`sort_order`), no el de la distribución visual.
    const indexOf = (image) => images.indexOf(image)

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>{english ? 'Gallery' : 'Galería'}</h2>

            <div className={styles.columns}>
                {columns.map((column, columnIndex) => (
                    <div key={columnIndex} className={styles.column}>
                        {column.map((image) => (
                            <button
                                key={image.id}
                                type="button"
                                onClick={() => setOpenIndex(indexOf(image))}
                                className={styles.item}
                                aria-label={
                                    captionOf(image) ||
                                    (english ? 'Open image' : 'Abrir imagen')
                                }
                            >
                                <div
                                    className={styles.frame}
                                    style={{ aspectRatio: `${image.width} / ${image.height}` }}
                                >
                                    <img
                                        src={image.url}
                                        alt={captionOf(image)}
                                        width={image.width}
                                        height={image.height}
                                        loading="lazy"
                                        decoding="async"
                                        className={styles.image}
                                    />
                                </div>
                                {captionOf(image) && (
                                    <span className={styles.caption}>{captionOf(image)}</span>
                                )}
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            <Lightbox
                images={images}
                index={openIndex}
                caption={openIndex !== null ? captionOf(images[openIndex]) : ''}
                onClose={() => setOpenIndex(null)}
                onNavigate={setOpenIndex}
                languaje={languaje}
            />
        </section>
    )
}

export default ProjectGallery
