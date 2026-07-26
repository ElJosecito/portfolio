import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useSiteSettings, saveSiteSettings } from '../../../shared/hooks/useSiteSettings';
import { uploadImage, deleteImage } from '../../../shared/utils/uploadImage';
import { compressImage } from '../../../shared/utils/compressImage';

import {
    Button,
    ConfirmDialog,
    ImageDrop,
    Panel,
    PanelBody,
    PanelDescription,
    PanelHeader,
    PanelTitle,
    Skeleton,
} from '../../../shared/ui';

// La misma imagen que usa el Hero cuando no hay ninguna cargada. Se muestra acá
// para que se vea qué se está reemplazando, en vez de un recuadro vacío que no
// dice si hay foto o no.
import fallbackPhoto from '../../images/Josecito.png';

/**
 * Foto de la card principal del Hero.
 *
 * Sube al bucket `project-images`, el mismo de los proyectos y la galería. Crear
 * un bucket aparte obligaría a definir sus políticas de storage sin que eso
 * cambie nada de cómo funciona.
 */
function SiteSettingsForm() {
    const { settings, loading, refetch } = useSiteSettings();
    const [saving, setSaving] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);

    const current = settings?.hero_image_url || fallbackPhoto;
    const isCustom = Boolean(settings?.hero_image_url);

    const handleFile = async (file) => {
        if (!file) return;

        setSaving(true);
        // Se guarda antes de escribir el registro: si la subida sale bien pero el
        // update falla, este archivo queda huérfano en el bucket y hay que poder
        // limpiarlo. Y si todo sale bien, es el que hay que borrar.
        const previousPath = settings?.hero_image_path || null;

        try {
            const { file: compressed } = await compressImage(file);
            const { url, path } = await uploadImage(compressed);

            await saveSiteSettings({ hero_image_url: url, hero_image_path: path });

            // El archivo viejo se borra recién cuando el registro ya apunta al
            // nuevo. Al revés, un fallo al guardar dejaría al sitio apuntando a
            // un archivo que ya no existe.
            if (previousPath) {
                await deleteImage(previousPath).catch((error) =>
                    console.error('No se pudo borrar la foto anterior:', error)
                );
            }

            toast.success('Foto actualizada');
            await refetch();
        } catch (error) {
            console.error('Error updating hero photo:', error);
            toast.error(error.message || 'Error al subir la foto');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        setSaving(true);
        const previousPath = settings?.hero_image_path || null;

        try {
            await saveSiteSettings({ hero_image_url: null, hero_image_path: null });

            if (previousPath) {
                await deleteImage(previousPath).catch((error) =>
                    console.error('No se pudo borrar la foto anterior:', error)
                );
            }

            toast.success('Volvió a la foto por defecto');
            await refetch();
        } catch (error) {
            console.error('Error resetting hero photo:', error);
            toast.error(error.message || 'Error al restaurar la foto');
        } finally {
            setSaving(false);
            setConfirmReset(false);
        }
    };

    return (
        <>
            <Panel className="mx-auto max-w-3xl">
                <PanelHeader>
                    <PanelTitle>Foto principal</PanelTitle>
                    <PanelDescription>
                        La foto grande de la portada, la de la card con tu nombre. Se recorta
                        para llenar la card, así que conviene una vertical con la cara en la
                        mitad de arriba.
                    </PanelDescription>
                </PanelHeader>

                <PanelBody className="space-y-6">
                    <div className="flex flex-col gap-6 sm:flex-row">
                        <div className="shrink-0">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-plum-500 dark:text-plum-300/80">
                                Ahora se ve así
                            </p>

                            {/* Mismo recorte que la card del Hero, para que lo que se ve acá
                                sea lo que se va a ver en la portada y no una versión entera
                                que después aparece cortada. */}
                            {loading ? (
                                <Skeleton className="h-56 w-40 rounded-2xl" />
                            ) : (
                                <img
                                    src={current}
                                    alt="Foto actual de la portada"
                                    className="h-56 w-40 rounded-2xl object-cover shadow-md"
                                />
                            )}

                            <p className="mt-2 text-xs text-plum-500 dark:text-plum-300/70">
                                {loading ? '—' : isCustom ? 'Foto cargada' : 'Foto por defecto'}
                            </p>
                        </div>

                        <div className="flex-1 space-y-4">
                            <ImageDrop
                                onChange={handleFile}
                                hint="JPG, PNG o WebP. Se comprime antes de subirla."
                            />

                            {isCustom && (
                                <Button
                                    variant="ghost"
                                    disabled={saving}
                                    onClick={() => setConfirmReset(true)}
                                >
                                    Volver a la foto por defecto
                                </Button>
                            )}
                        </div>
                    </div>
                </PanelBody>
            </Panel>

            <ConfirmDialog
                open={confirmReset}
                title="Volver a la foto por defecto"
                description="Se borra la foto que subiste y la portada vuelve a la que viene con el código. No se puede deshacer."
                confirmLabel="Volver a la de por defecto"
                loading={saving}
                onConfirm={handleReset}
                onClose={() => setConfirmReset(false)}
            />
        </>
    );
}

export default SiteSettingsForm;
