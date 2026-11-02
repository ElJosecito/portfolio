import React from 'react'

import ProjectDetailSkeleton from './ProjectDetailSkeleton'
import styles from '../pages/ProjectDetail.module.css'

/**
 * Fallback del `Suspense` de `/projects/:slug`.
 *
 * Antes acá iba el loader del monograma, y el resultado eran dos estados de
 * carga seguidos: primero el monograma mientras bajaba el chunk, después el
 * skeleton mientras venían los datos. Se leía como que la página cargaba dos
 * veces. Con el mismo skeleton en los dos momentos es un solo estado continuo.
 *
 * La caja exterior reusa las clases de `ProjectDetail.module.css` a propósito:
 * es lo que hace que el reemplazo sea invisible. Si allá cambian el fondo o
 * el ancho, acá también (mismo módulo, no una copia).
 */
function ProjectDetailFallback() {
    return (
        <section className={styles.page}>
            <div className={styles.inner}>
                <ProjectDetailSkeleton />
            </div>
        </section>
    )
}

export default ProjectDetailFallback
