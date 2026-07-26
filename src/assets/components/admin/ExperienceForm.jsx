import React, { useState } from 'react';
import { supabase } from '../../../shared/supabaseClient';
import toast from 'react-hot-toast';

import {
    Button,
    Checkbox,
    Field,
    Input,
    Panel,
    PanelBody,
    PanelDescription,
    PanelFooter,
    PanelHeader,
    PanelTitle,
    Textarea,
} from '../../../shared/ui';

const EMPTY_FORM = {
    title: '',
    title_en: '',
    company: '',
    description: '',
    description_en: '',
    link: '',
    start_date: '',
    end_date: '',
};

function ExperienceForm({ initialData = null, nextSortOrder = 0, onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        ...EMPTY_FORM,
        title: initialData?.title || '',
        title_en: initialData?.title_en || '',
        company: initialData?.company || '',
        description: initialData?.description || '',
        description_en: initialData?.description_en || '',
        link: initialData?.link || '',
        start_date: initialData?.start_date || '',
        end_date: initialData?.end_date || '',
    });

    // `end_date` en NULL es lo que significa "sigue en curso". El checkbox es
    // solo la forma de expresarlo en el formulario, no una columna aparte que
    // pueda contradecir a la fecha.
    const [isCurrent, setIsCurrent] = useState(
        initialData ? !initialData.end_date : true
    );

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!formData.title.trim()) next.title = 'El puesto es requerido';
        if (!formData.company.trim()) next.company = 'La empresa es requerida';
        if (!formData.description.trim()) next.description = 'La descripción es requerida';
        if (
            !isCurrent &&
            formData.start_date &&
            formData.end_date &&
            formData.end_date < formData.start_date
        ) {
            next.end_date = 'La fecha de fin no puede ser anterior a la de inicio';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                title_en: formData.title_en || null,
                company: formData.company,
                description: formData.description,
                description_en: formData.description_en || null,
                link: formData.link || null,
                start_date: formData.start_date || null,
                end_date: isCurrent ? null : formData.end_date || null,
            };

            if (initialData) {
                const { error } = await supabase
                    .from('experiences')
                    .update(payload)
                    .eq('id', initialData.id);
                if (error) throw error;
                toast.success('Experiencia actualizada');
            } else {
                const { error } = await supabase
                    .from('experiences')
                    .insert([{ ...payload, sort_order: nextSortOrder }]);
                if (error) throw error;
                toast.success('Experiencia creada');
            }

            onSuccess?.();
        } catch (error) {
            console.error('Error saving experience:', error);
            toast.error(error.message || 'Error al guardar la experiencia');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Panel className="mx-auto max-w-3xl">
            <PanelHeader>
                <PanelTitle>{initialData ? 'Editar experiencia' : 'Nueva experiencia'}</PanelTitle>
                <PanelDescription>
                    Los campos en inglés son opcionales: si quedan vacíos se muestra el español.
                </PanelDescription>
            </PanelHeader>

            <form onSubmit={handleSubmit} noValidate>
                <PanelBody className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Puesto (español)" error={errors.title} required>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Fullstack Developer"
                            />
                        </Field>
                        <Field label="Puesto (inglés)">
                            <Input
                                name="title_en"
                                value={formData.title_en}
                                onChange={handleInputChange}
                                placeholder="Fullstack Developer"
                            />
                        </Field>
                    </div>

                    <Field label="Empresa" error={errors.company} required>
                        <Input
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="JGI Solutions and Marketing"
                        />
                    </Field>

                    <Field label="Descripción (español)" error={errors.description} required>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={5}
                            placeholder="Qué hacías en el puesto…"
                        />
                    </Field>

                    <Field label="Descripción (inglés)">
                        <Textarea
                            name="description_en"
                            value={formData.description_en}
                            onChange={handleInputChange}
                            rows={5}
                            placeholder="What you did in the role…"
                        />
                    </Field>

                    <div className="space-y-4 rounded-2xl bg-plum-50/60 p-4 dark:bg-plum-800/30">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Desde" hint="Si se deja vacío no se muestra fecha de inicio">
                                <Input
                                    name="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                />
                            </Field>
                            {!isCurrent && (
                                <Field label="Hasta" error={errors.end_date}>
                                    <Input
                                        name="end_date"
                                        type="date"
                                        value={formData.end_date}
                                        onChange={handleInputChange}
                                    />
                                </Field>
                            )}
                        </div>
                        <Checkbox
                            checked={isCurrent}
                            onChange={(event) => setIsCurrent(event.target.checked)}
                            label="Sigo en este puesto"
                        />
                    </div>

                    <Field label="Enlace" hint="LinkedIn, la web de la empresa, lo que sirva">
                        <Input
                            name="link"
                            type="url"
                            value={formData.link}
                            onChange={handleInputChange}
                            placeholder="https://…"
                        />
                    </Field>
                </PanelBody>

                <PanelFooter>
                    <Button variant="ghost" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" loading={loading}>
                        {initialData ? 'Actualizar' : 'Crear'}
                    </Button>
                </PanelFooter>
            </form>
        </Panel>
    );
}

export default ExperienceForm;
