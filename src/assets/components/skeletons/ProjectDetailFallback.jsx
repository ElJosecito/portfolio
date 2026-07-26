import React from 'react'

import ProjectDetailSkeleton from './ProjectDetailSkeleton'

/**
 * Fallback del `Suspense` de `/projects/:slug`.
 *
 * Antes acá iba el loader del monograma, y el resultado eran dos estados de
 * carga seguidos: primero el monograma mientras bajaba el chunk, después el
 * skeleton mientras venían los datos. Se leía como que la página cargaba dos
 * veces. Con el mismo skeleton en los dos momentos es un solo estado continuo.
 *
 * La caja exterior repite la de `ProjectDetail` a propósito: es lo que hace que
 * el reemplazo sea invisible. Si allá cambian el fondo o el ancho, acá también.
 */
function ProjectDetailFallback() {
    return (
        <section className="relative flex w-full justify-center bg-noon p-5 pb-20 pt-32 dark:bg-slate-950 sm:pt-36">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute inset-0 bg-fuchsia-300 opacity-20 blur-[100px]" />

            <div className="z-10 w-full max-w-4xl dark:text-moonlit">
                <ProjectDetailSkeleton />
            </div>
        </section>
    )
}

export default ProjectDetailFallback
