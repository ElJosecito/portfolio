import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
} from '@dnd-kit/sortable';

import { supabase } from '../../../shared/supabaseClient';
import { uploadImage, deleteImage } from '../../../shared/utils/uploadImage';
import { compressImage } from '../../../shared/utils/compressImage';
import { useProjectImages, saveImageOrder } from '../../../shared/hooks/useProjectImages';

import {
    Button,
    ConfirmDialog,
    Input,
    Panel,
    PanelBody,
    PanelDescription,
    PanelHeader,
    PanelTitle,
} from '../../../shared/ui';

// Sin estrategia de reacomodo: las estrategias que trae dnd-kit calculan el
// desplazamiento de los demás elementos asumiendo una grilla de celdas iguales,
// y en un masonry cada imagen tiene su propio alto. Aplicarlas descoloca todo.
// En su lugar, el elemento que se arrastra viaja en un DragOverlay y el destino
// se marca con un borde.
const NO_SHIFT = () => null;

function SortableImage({ image, onRemove, onCaptionChange, isOver }) {
    const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: image.id });

    return (
        <div
            ref={setNodeRef}
            className={`overflow-hidden rounded-xl border bg-white transition-all dark:bg-plum-900 ${
                isOver
                    ? 'border-volt-500 ring-2 ring-volt-500'
                    : 'border-plum-200 dark:border-plum-700'
            } ${isDragging ? 'opacity-30' : ''}`}
        >
            {/* El asa de arrastre es un botón: dnd-kit le da soporte de teclado
                (espacio para tomar, flechas para mover) sin trabajo extra. */}
            <button
                type="button"
                {...attributes}
                {...listeners}
                aria-label={`Reordenar imagen${image.caption ? `: ${image.caption}` : ''}`}
                className="block w-full cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-500"
            >
                <img
                    src={image.url}
                    alt=""
                    width={image.width}
                    height={image.height}
                    className="w-full"
                />
            </button>

            <div className="space-y-2 p-2">
                <Input
                    value={image.caption || ''}
                    onChange={(event) => onCaptionChange(image, event.target.value)}
                    placeholder="Descripción (opcional)"
                    className="h-8 text-xs"
                />
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-plum-400">
                        {image.width}×{image.height}
                    </span>
                    <Button size="sm" variant="danger" onClick={() => onRemove(image)}>
                        Quitar
                    </Button>
                </div>
            </div>
        </div>
    );
}

/**
 * Galería del proyecto en el panel: subir, describir, reordenar y borrar.
 *
 * El reordenamiento es arrastrando, sobre una grilla que respeta la proporción
 * de cada imagen. No usa `columns` como la galería pública porque con masonry
 * los elementos se reacomodan entre columnas mientras se arrastra y el destino
 * deja de ser predecible.
 */
function GalleryManager({ projectId }) {
    const { images, loading, refetch } = useProjectImages(projectId);
    const [items, setItems] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);

    // `items` es el orden en pantalla mientras se arrastra; si es null, manda
    // lo que vino de la base.
    const gallery = items ?? images;
    const activeImage = gallery.find((image) => image.id === activeId);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleUpload = async (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        setUploading(true);
        let uploaded = 0;

        try {
            for (const [offset, original] of files.entries()) {
                const { file, width, height } = await compressImage(original);
                const { url, path } = await uploadImage(file);

                const { error } = await supabase.from('project_images').insert([
                    {
                        project_id: projectId,
                        url,
                        storage_path: path,
                        width,
                        height,
                        sort_order: gallery.length + offset,
                    },
                ]);

                if (error) throw error;
                uploaded += 1;
            }

            toast.success(`${uploaded} imagen(es) subida(s)`);
            setItems(null);
            await refetch();
        } catch (error) {
            console.error('Error uploading gallery images:', error);
            toast.error(error.message || 'Error al subir imágenes');
            if (uploaded > 0) await refetch();
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    const handleDragEnd = async ({ active, over }) => {
        setActiveId(null);
        setOverId(null);

        if (!over || active.id === over.id) return;

        const oldIndex = gallery.findIndex((image) => image.id === active.id);
        const newIndex = gallery.findIndex((image) => image.id === over.id);
        const reordered = arrayMove(gallery, oldIndex, newIndex);

        // Se pinta el orden nuevo enseguida y después se persiste; si falla, se
        // vuelve a lo que diga la base.
        setItems(reordered);

        try {
            await saveImageOrder(projectId, reordered.map((image) => image.id));
            await refetch();
            setItems(null);
        } catch (error) {
            console.error('Error saving image order:', error);
            toast.error('No se pudo guardar el orden');
            setItems(null);
        }
    };

    const handleCaptionChange = (image, caption) => {
        setItems((current) =>
            (current ?? images).map((item) =>
                item.id === image.id ? { ...item, caption } : item
            )
        );
    };

    // Se compara contra `images`, que es lo último que devolvió la base:
    // `gallery` ya trae el texto editado y consigo mismo siempre sería igual.
    const handleCaptionSave = async (id) => {
        const edited = gallery.find((item) => item.id === id);
        const stored = images.find((item) => item.id === id);
        if (!edited || !stored || (edited.caption || '') === (stored.caption || '')) return;

        const { error } = await supabase
            .from('project_images')
            .update({ caption: edited.caption || null })
            .eq('id', id);

        if (error) {
            toast.error('No se pudo guardar la descripción');
            return;
        }

        await refetch();
    };

    const handleDelete = async () => {
        if (!pendingDelete) return;
        setDeleting(true);

        try {
            if (pendingDelete.storage_path) {
                try {
                    await deleteImage(pendingDelete.storage_path);
                } catch (storageError) {
                    console.error('Error deleting file from storage:', storageError);
                }
            }

            const { error } = await supabase
                .from('project_images')
                .delete()
                .eq('id', pendingDelete.id);

            if (error) throw error;

            toast.success('Imagen eliminada');
            setPendingDelete(null);
            setItems(null);
            await refetch();
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Error al eliminar la imagen');
        } finally {
            setDeleting(false);
        }
    };

    if (!projectId) {
        return (
            <Panel>
                <PanelBody>
                    <p className="text-sm text-plum-500 dark:text-plum-300/70">
                        Guardá el proyecto primero y después cargá su galería.
                    </p>
                </PanelBody>
            </Panel>
        );
    }

    return (
        <>
            <Panel>
                <PanelHeader>
                    <PanelTitle>Galería</PanelTitle>
                    <PanelDescription>
                        Esta es la galería tal como se ve en la página del proyecto.
                        Arrastrá una imagen sobre otra para intercambiar su lugar. Se
                        comprimen a WebP y se achican a 1600px antes de subirse.
                    </PanelDescription>
                </PanelHeader>

                <PanelBody className="space-y-4">
                    <label className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-plum-200 px-6 py-6 text-center hover:border-plum-300 focus-within:ring-2 focus-within:ring-volt-500 dark:border-plum-700">
                        <span className="text-sm font-medium text-plum-700 dark:text-plum-100">
                            {uploading ? 'Subiendo…' : 'Agregar imágenes'}
                        </span>
                        <span className="text-xs text-plum-500 dark:text-plum-300/70">
                            Se pueden elegir varias a la vez
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="sr-only"
                            disabled={uploading}
                            onChange={handleUpload}
                        />
                    </label>

                    {loading ? (
                        <p className="py-8 text-center text-sm text-plum-500">Cargando galería…</p>
                    ) : gallery.length === 0 ? (
                        <p className="py-8 text-center text-sm text-plum-500">
                            Todavía no hay imágenes en este proyecto.
                        </p>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={({ active }) => setActiveId(active.id)}
                            onDragOver={({ over }) => setOverId(over?.id ?? null)}
                            onDragCancel={() => {
                                setActiveId(null);
                                setOverId(null);
                            }}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={gallery.map((image) => image.id)}
                                strategy={NO_SHIFT}
                            >
                                {/* Mismas columnas que la galería pública: lo que
                                    se acomoda acá es literalmente lo que se ve. */}
                                <div className="columns-2 gap-4 md:columns-3">
                                    {gallery.map((image) => (
                                        <div
                                            key={image.id}
                                            onBlur={() => handleCaptionSave(image.id)}
                                            className="mb-4 break-inside-avoid"
                                        >
                                            <SortableImage
                                                image={image}
                                                isOver={overId === image.id && activeId !== image.id}
                                                onRemove={setPendingDelete}
                                                onCaptionChange={handleCaptionChange}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </SortableContext>

                            <DragOverlay>
                                {activeImage && (
                                    <img
                                        src={activeImage.url}
                                        alt=""
                                        className="w-full rounded-xl opacity-90 shadow-2xl"
                                    />
                                )}
                            </DragOverlay>
                        </DndContext>
                    )}
                </PanelBody>
            </Panel>

            <ConfirmDialog
                open={Boolean(pendingDelete)}
                onClose={() => setPendingDelete(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Eliminar imagen"
                description="Se va a borrar de la galería y del almacenamiento. No se puede deshacer."
            />
        </>
    );
}

export default GalleryManager;
