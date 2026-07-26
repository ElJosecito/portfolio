import React, { useState, useEffect } from 'react';
import { supabase } from '../../../shared/supabaseClient';
import { uploadImage } from '../../../shared/utils/uploadImage';
import { slugify } from '../../../shared/utils/slugify';
import toast from 'react-hot-toast';

import {
    Button,
    Checkbox,
    Field,
    ImageDrop,
    Input,
    Markdown,
    Panel,
    PanelBody,
    PanelDescription,
    PanelFooter,
    PanelHeader,
    PanelTitle,
    Select,
    Textarea,
} from '../../../shared/ui';

const PLATFORMS = [
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Mobile' },
];

const EMPTY_FORM = {
    title: '',
    title_en: '',
    slug: '',
    description: '',
    description_en: '',
    content: '',
    content_en: '',
    platforms: ['web'],
    is_featured: false,
    featured_size: '',
    featured_order: '',
    live_url: '',
    github_url: '',
    selected_technologies: [],
};

function CreateProjectForm({ initialData = null, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [technologies, setTechnologies] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [slugTouched, setSlugTouched] = useState(Boolean(initialData));
    const [previewLang, setPreviewLang] = useState('es');

    const [formData, setFormData] = useState({
        ...EMPTY_FORM,
        title: initialData?.title || '',
        title_en: initialData?.title_en || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        description_en: initialData?.description_en || '',
        content: initialData?.content || '',
        content_en: initialData?.content_en || '',
        platforms: initialData?.platforms?.length ? initialData.platforms : ['web'],
        is_featured: initialData?.is_featured || false,
        featured_size: initialData?.featured_size || '',
        featured_order: initialData?.featured_order || '',
        live_url: initialData?.urls?.find((u) => u.name === 'Live Demo')?.url || '',
        github_url: initialData?.urls?.find((u) => u.name === 'GitHub')?.url || '',
    });

    // La preview sale de un object URL mientras haya archivo nuevo, y de la
    // imagen ya guardada si no. El URL se revoca al cambiar para no filtrar.
    const [preview, setPreview] = useState(initialData?.image_url || null);

    useEffect(() => {
        if (!imageFile) return;
        const url = URL.createObjectURL(imageFile);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    useEffect(() => {
        const init = async () => {
            await fetchTechnologies();
            if (initialData) await fetchProjectTechnologies();
        };
        init();
    }, [initialData]);

    const fetchTechnologies = async () => {
        try {
            const { data, error } = await supabase
                .from('technologies')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setTechnologies(data || []);
        } catch (error) {
            console.error('Error fetching technologies:', error);
            toast.error('Error al cargar tecnologías');
        }
    };

    const fetchProjectTechnologies = async () => {
        try {
            const { data, error } = await supabase
                .from('project_technologies')
                .select('technology_id')
                .eq('project_id', initialData.id);

            if (error) throw error;
            setFormData((prev) => ({
                ...prev,
                selected_technologies: data.map((pt) => pt.technology_id),
            }));
        } catch (error) {
            console.error('Error fetching project technologies:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((prev) => {
            const next = { ...prev, [name]: type === 'checkbox' ? checked : value };

            // Al crear, el slug sigue al título hasta que se lo toque a mano.
            // Al editar no se toca: cambiarlo rompería el enlace ya compartido.
            if (name === 'title' && !initialData && !slugTouched) {
                next.slug = slugify(value);
            }

            return next;
        });

        if (name === 'slug') setSlugTouched(true);
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleTechnologyToggle = (techId) => {
        setFormData((prev) => ({
            ...prev,
            selected_technologies: prev.selected_technologies.includes(techId)
                ? prev.selected_technologies.filter((id) => id !== techId)
                : [...prev.selected_technologies, techId],
        }));
    };

    const handlePlatformToggle = (platform) => {
        setFormData((prev) => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter((p) => p !== platform)
                : [...prev.platforms, platform],
        }));
        setErrors((prev) => ({ ...prev, platforms: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!formData.title.trim()) next.title = 'El título es requerido';
        if (!formData.description.trim()) next.description = 'La descripción es requerida';
        if (!imageFile && !initialData) next.image = 'La imagen es requerida';
        if (!formData.slug.trim()) next.slug = 'El slug es requerido';
        else if (formData.slug !== slugify(formData.slug)) {
            next.slug = 'Solo minúsculas, números y guiones';
        }
        // La base tiene un CHECK que exige al menos una plataforma; si no se
        // valida acá, el error llega como un fallo de constraint sin contexto.
        if (formData.platforms.length === 0) next.platforms = 'Elegí al menos una plataforma';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            let imageUrl = initialData?.image_url;
            if (imageFile) {
                const { url } = await uploadImage(imageFile);
                imageUrl = url;
            }

            const urls = [];
            if (formData.github_url) urls.push({ name: 'GitHub', url: formData.github_url });
            if (formData.live_url) urls.push({ name: 'Live Demo', url: formData.live_url });

            const payload = {
                title: formData.title,
                title_en: formData.title_en,
                slug: formData.slug,
                description: formData.description,
                description_en: formData.description_en,
                content: formData.content || null,
                content_en: formData.content_en || null,
                image_url: imageUrl,
                platforms: formData.platforms,
                is_featured: formData.is_featured,
                featured_size: formData.is_featured ? formData.featured_size || null : null,
                featured_order: formData.is_featured
                    ? parseInt(formData.featured_order, 10) || null
                    : null,
                urls,
            };

            let projectId;

            if (initialData) {
                const { error } = await supabase
                    .from('projects')
                    .update(payload)
                    .eq('id', initialData.id);
                if (error) throw error;
                projectId = initialData.id;
                toast.success('Proyecto actualizado');
            } else {
                const { data, error } = await supabase
                    .from('projects')
                    .insert([payload])
                    .select()
                    .single();
                if (error) throw error;
                projectId = data.id;
                toast.success('Proyecto creado');
            }

            if (initialData) {
                const { error } = await supabase
                    .from('project_technologies')
                    .delete()
                    .eq('project_id', projectId);
                if (error) throw error;
            }

            if (formData.selected_technologies.length > 0) {
                const { error } = await supabase.from('project_technologies').insert(
                    formData.selected_technologies.map((techId) => ({
                        project_id: projectId,
                        technology_id: techId,
                    }))
                );
                if (error) throw error;
            }

            onSuccess?.();

            if (!initialData) {
                setFormData(EMPTY_FORM);
                setImageFile(null);
                setPreview(null);
            }
        } catch (error) {
            console.error('Error saving project:', error);

            // 23505 es violación de unicidad; el único índice único es el slug.
            if (error.code === '23505') {
                setErrors((prev) => ({ ...prev, slug: 'Ya hay un proyecto con ese slug' }));
                toast.error('Ese slug ya está en uso');
                return;
            }

            toast.error(error.message || 'Error al guardar proyecto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Panel className="mx-auto max-w-4xl">
            <PanelHeader>
                <PanelTitle>{initialData ? 'Editar proyecto' : 'Crear nuevo proyecto'}</PanelTitle>
                <PanelDescription>
                    {initialData
                        ? 'Modificá los detalles del proyecto existente'
                        : 'Completá el formulario para agregar un proyecto al portafolio'}
                </PanelDescription>
            </PanelHeader>

            <form onSubmit={handleSubmit} noValidate>
                <PanelBody className="space-y-6">
                    {/* Sin Field: ImageDrop ya trae su propio label, y Field le
                        pasaría atributos de control a un contenedor. */}
                    <div className="space-y-1.5">
                        <p className="text-sm font-medium text-plum-800 dark:text-plum-100">
                            Imagen del proyecto
                            {!initialData && <span className="ml-0.5 text-red-500">*</span>}
                        </p>
                        <ImageDrop
                            value={preview}
                            onChange={setImageFile}
                            hint="JPG, PNG, WebP o GIF · máximo 5MB"
                        />
                        {errors.image && (
                            <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                {errors.image}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Título (español)" error={errors.title} required>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Nombre del proyecto"
                            />
                        </Field>

                        <Field label="Título (inglés)" hint="Si queda vacío se muestra el español">
                            <Input
                                name="title_en"
                                value={formData.title_en}
                                onChange={handleInputChange}
                                placeholder="Project name"
                            />
                        </Field>
                    </div>

                    <Field
                        label="Slug"
                        error={errors.slug}
                        hint={`La URL del proyecto: /projects/${formData.slug || '…'}`}
                        required
                    >
                        <Input
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            placeholder="mi-proyecto"
                        />
                    </Field>

                    <Field label="Descripción (español)" error={errors.description} required>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describí tu proyecto…"
                        />
                    </Field>

                    <Field label="Descripción (inglés)" hint="Si queda vacía se muestra la española">
                        <Textarea
                            name="description_en"
                            value={formData.description_en}
                            onChange={handleInputChange}
                            placeholder="Describe your project…"
                        />
                    </Field>

                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium text-plum-800 dark:text-plum-100">
                                Texto largo (markdown)
                            </p>
                            <div className="flex gap-1">
                                {[
                                    { key: 'es', label: 'Español' },
                                    { key: 'en', label: 'Inglés' },
                                ].map((option) => (
                                    <Button
                                        key={option.key}
                                        size="sm"
                                        variant={previewLang === option.key ? 'secondary' : 'ghost'}
                                        onClick={() => setPreviewLang(option.key)}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <Textarea
                                name={previewLang === 'es' ? 'content' : 'content_en'}
                                value={previewLang === 'es' ? formData.content : formData.content_en}
                                onChange={handleInputChange}
                                rows={16}
                                className="font-mono text-xs"
                                placeholder={'## El problema\n\nQué había antes y por qué no alcanzaba.\n\n- Un punto\n- Otro punto'}
                            />
                            <div className="max-h-[26rem] overflow-y-auto rounded-xl border border-plum-200 p-4 text-sm dark:border-plum-700">
                                {(previewLang === 'es' ? formData.content : formData.content_en) ? (
                                    <Markdown className="text-plum-800 dark:text-plum-100">
                                        {previewLang === 'es' ? formData.content : formData.content_en}
                                    </Markdown>
                                ) : (
                                    <p className="text-xs text-plum-400">
                                        La vista previa aparece acá mientras escribís.
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-plum-500 dark:text-plum-300/70">
                            Opcional. Si el inglés queda vacío, se muestra el español.
                        </p>
                    </div>

                    <fieldset>
                        <legend className="mb-2 text-sm font-medium text-plum-800 dark:text-plum-100">
                            Plataformas<span className="ml-0.5 text-red-500">*</span>
                        </legend>
                        <div className="flex gap-6">
                            {PLATFORMS.map((platform) => (
                                <Checkbox
                                    key={platform.value}
                                    checked={formData.platforms.includes(platform.value)}
                                    onChange={() => handlePlatformToggle(platform.value)}
                                    label={platform.label}
                                />
                            ))}
                        </div>
                        {errors.platforms && (
                            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                                {errors.platforms}
                            </p>
                        )}
                    </fieldset>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="URL de GitHub">
                            <Input
                                name="github_url"
                                type="url"
                                value={formData.github_url}
                                onChange={handleInputChange}
                                placeholder="https://github.com/…"
                            />
                        </Field>
                        <Field label="URL del demo">
                            <Input
                                name="live_url"
                                type="url"
                                value={formData.live_url}
                                onChange={handleInputChange}
                                placeholder="https://…"
                            />
                        </Field>
                    </div>

                    <div className="space-y-4 rounded-2xl bg-plum-50/60 p-4 dark:bg-plum-800/30">
                        <Checkbox
                            name="is_featured"
                            checked={formData.is_featured}
                            onChange={handleInputChange}
                            label="Proyecto destacado (aparece en la portada)"
                        />

                        {formData.is_featured && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Tamaño en portada">
                                    <Select
                                        name="featured_size"
                                        value={formData.featured_size}
                                        onChange={handleInputChange}
                                        placeholder="Seleccionar…"
                                        options={[
                                            { value: 'large', label: 'Grande' },
                                            { value: 'small', label: 'Pequeño' },
                                        ]}
                                    />
                                </Field>
                                <Field label="Orden" hint="1 es el primero">
                                    <Input
                                        name="featured_order"
                                        type="number"
                                        min="1"
                                        value={formData.featured_order}
                                        onChange={handleInputChange}
                                        placeholder="1"
                                    />
                                </Field>
                            </div>
                        )}
                    </div>

                    <fieldset className="space-y-2">
                        <legend className="mb-2 text-sm font-medium text-plum-800 dark:text-plum-100">
                            Tecnologías
                        </legend>
                        <div className="grid max-h-64 grid-cols-2 gap-3 overflow-y-auto rounded-2xl border border-plum-200 p-4 dark:border-plum-700 md:grid-cols-3 lg:grid-cols-4">
                            {technologies.map((tech) => (
                                <Checkbox
                                    key={tech.id}
                                    checked={formData.selected_technologies.includes(tech.id)}
                                    onChange={() => handleTechnologyToggle(tech.id)}
                                    label={
                                        <span className="flex items-center gap-2">
                                            {tech.icon_url && (
                                                <img src={tech.icon_url} alt="" className="h-5 w-5" />
                                            )}
                                            {tech.name}
                                        </span>
                                    }
                                />
                            ))}
                        </div>
                        <p className="text-xs text-plum-500 dark:text-plum-300/70">
                            {formData.selected_technologies.length} seleccionada(s)
                        </p>
                    </fieldset>
                </PanelBody>

                <PanelFooter>
                    <Button variant="ghost" onClick={() => onSuccess?.()}>
                        Cancelar
                    </Button>
                    <Button type="submit" loading={loading}>
                        {initialData ? 'Actualizar proyecto' : 'Crear proyecto'}
                    </Button>
                </PanelFooter>
            </form>
        </Panel>
    );
}

export default CreateProjectForm;
