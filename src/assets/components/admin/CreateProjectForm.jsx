import React, { useState, useEffect } from 'react';
import { supabase } from '../../../shared/supabaseClient';
import { uploadImage } from '../../../shared/utils/uploadImage';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function CreateProjectForm({ initialData = null, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [technologies, setTechnologies] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData?.image_url || null);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        title_en: initialData?.title_en || '',
        description: initialData?.description || '',
        description_en: initialData?.description_en || '',
        project_type: initialData?.project_type || 'web',
        is_featured: initialData?.is_featured || false,
        featured_size: initialData?.featured_size || null,
        featured_order: initialData?.featured_order || null,
        live_url: initialData?.urls?.find(u => u.name === 'Live Demo')?.url || '',
        github_url: initialData?.urls?.find(u => u.name === 'GitHub')?.url || '',
        selected_technologies: [] // We'll populate this in useEffect
    });

    // Fetch technologies and setup initial data
    useEffect(() => {
        const init = async () => {
            await fetchTechnologies();
            if (initialData) {
                await fetchProjectTechnologies();
            }
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
            setFormData(prev => ({
                ...prev,
                selected_technologies: data.map(pt => pt.technology_id)
            }));
        } catch (error) {
            console.error('Error fetching project technologies:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTechnologyToggle = (techId) => {
        setFormData(prev => ({
            ...prev,
            selected_technologies: prev.selected_technologies.includes(techId)
                ? prev.selected_technologies.filter(id => id !== techId)
                : [...prev.selected_technologies, techId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validation
            if (!formData.title.trim()) {
                throw new Error('El título es requerido');
            }
            if (!formData.description.trim()) {
                throw new Error('La descripción es requerida');
            }
            if (!imageFile && !initialData) { // Image required only on create or if changed
                throw new Error('La imagen es requerida');
            }

            // Upload image if new file selected
            let imageUrl = initialData?.image_url;
            if (imageFile) {
                const { url } = await uploadImage(imageFile);
                imageUrl = url;
            }

            // Prepare URLs array
            const urls = [];
            if (formData.github_url) {
                urls.push({ name: 'GitHub', url: formData.github_url });
            }
            if (formData.live_url) {
                urls.push({ name: 'Live Demo', url: formData.live_url });
            }

            let projectId;

            if (initialData) {
                // Update existing project
                const { error: updateError } = await supabase
                    .from('projects')
                    .update({
                        title: formData.title,
                        title_en: formData.title_en,
                        description: formData.description,
                        description_en: formData.description_en,
                        image_url: imageUrl,
                        project_type: formData.project_type,
                        is_featured: formData.is_featured,
                        featured_size: formData.is_featured ? formData.featured_size : null,
                        featured_order: formData.is_featured ? parseInt(formData.featured_order) || null : null,
                        urls: urls
                    })
                    .eq('id', initialData.id);

                if (updateError) throw updateError;
                projectId = initialData.id;
                toast.success('Proyecto actualizado exitosamente!');
            } else {
                // Create new project
                const { data: project, error: insertError } = await supabase
                    .from('projects')
                    .insert([{
                        title: formData.title,
                        title_en: formData.title_en,
                        description: formData.description,
                        description_en: formData.description_en,
                        image_url: imageUrl,
                        project_type: formData.project_type,
                        is_featured: formData.is_featured,
                        featured_size: formData.is_featured ? formData.featured_size : null,
                        featured_order: formData.is_featured ? parseInt(formData.featured_order) || null : null,
                        urls: urls
                    }])
                    .select()
                    .single();

                if (insertError) throw insertError;
                projectId = project.id;
                toast.success('Proyecto creado exitosamente!');
            }

            // Update technologies
            // First delete existing links
            if (initialData) {
                const { error: deleteTechError } = await supabase
                    .from('project_technologies')
                    .delete()
                    .eq('project_id', projectId);
                if (deleteTechError) throw deleteTechError;
            }

            // Insert new links
            if (formData.selected_technologies.length > 0) {
                const techLinks = formData.selected_technologies.map(techId => ({
                    project_id: projectId,
                    technology_id: techId
                }));

                const { error: techError } = await supabase
                    .from('project_technologies')
                    .insert(techLinks);

                if (techError) throw techError;
            }

            if (onSuccess) onSuccess();

            // Only reset if creating
            if (!initialData) {
                setFormData({
                    title: '',
                    title_en: '',
                    description: '',
                    description_en: '',
                    project_type: 'web',
                    is_featured: false,
                    featured_size: null,
                    featured_order: null,
                    live_url: '',
                    github_url: '',
                    selected_technologies: []
                });
                setImageFile(null);
                setImagePreview(null);
            }

        } catch (error) {
            console.error('Error saving project:', error);
            toast.error(error.message || 'Error al guardar proyecto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{initialData ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</CardTitle>
                <CardDescription>
                    {initialData
                        ? 'Modifica los detalles del proyecto existente'
                        : 'Completa el formulario para agregar un nuevo proyecto a tu portafolio'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="image">Imagen del Proyecto *</Label>
                        <div className="flex flex-col gap-4">
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="cursor-pointer"
                            />
                            {imagePreview && (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Nombre del proyecto"
                            required
                        />
                    </div>

                    {/* Description */}


                    {/* Title (English) */}
                    <div className="space-y-2">
                        <Label htmlFor="title_en">Título (Inglés)</Label>
                        <Input
                            id="title_en"
                            name="title_en"
                            value={formData.title_en}
                            onChange={handleInputChange}
                            placeholder="Project Name"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción (Español) *</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe tu proyecto..."
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* Description (English) */}
                    <div className="space-y-2">
                        <Label htmlFor="description_en">Descripción (Inglés)</Label>
                        <textarea
                            id="description_en"
                            name="description_en"
                            value={formData.description_en}
                            onChange={handleInputChange}
                            placeholder="Describe your project..."
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Project Type */}
                    <div className="space-y-2">
                        <Label htmlFor="project_type">Tipo de Proyecto *</Label>
                        <select
                            id="project_type"
                            name="project_type"
                            value={formData.project_type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="web">Web</option>
                            <option value="mobile">Mobile</option>
                        </select>
                    </div>

                    {/* URLs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="github_url">URL de GitHub</Label>
                            <Input
                                id="github_url"
                                name="github_url"
                                type="url"
                                value={formData.github_url}
                                onChange={handleInputChange}
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="live_url">URL Live Demo</Label>
                            <Input
                                id="live_url"
                                name="live_url"
                                type="url"
                                value={formData.live_url}
                                onChange={handleInputChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Featured Toggle */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                            />
                            <Label htmlFor="is_featured" className="cursor-pointer">Proyecto Destacado</Label>
                        </div>

                        {formData.is_featured && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <div className="space-y-2">
                                    <Label htmlFor="featured_size">Tamaño Destacado</Label>
                                    <select
                                        id="featured_size"
                                        name="featured_size"
                                        value={formData.featured_size || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="large">Grande</option>
                                        <option value="small">Pequeño</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="featured_order">Orden</Label>
                                    <Input
                                        id="featured_order"
                                        name="featured_order"
                                        type="number"
                                        min="0"
                                        value={formData.featured_order || ''}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Technologies */}
                    <div className="space-y-2">
                        <Label>Tecnologías</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border border-slate-300 dark:border-slate-700 rounded-md max-h-64 overflow-y-auto">
                            {technologies.map(tech => (
                                <div key={tech.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`tech-${tech.id}`}
                                        checked={formData.selected_technologies.includes(tech.id)}
                                        onChange={() => handleTechnologyToggle(tech.id)}
                                        className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                                    />
                                    <label
                                        htmlFor={`tech-${tech.id}`}
                                        className="text-sm cursor-pointer flex items-center gap-2"
                                    >
                                        {tech.icon_url && (
                                            <img src={tech.icon_url} alt={tech.name} className="w-5 h-5" />
                                        )}
                                        {tech.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formData.selected_technologies.length} tecnología(s) seleccionada(s)
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (onSuccess) onSuccess();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                            {loading ? 'Guardando...' : (initialData ? 'Actualizar Proyecto' : 'Crear Proyecto')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card >
    );
}

export default CreateProjectForm;
