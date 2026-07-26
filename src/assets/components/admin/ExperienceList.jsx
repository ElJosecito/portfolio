import React, { useState } from 'react';
import { supabase } from '../../../shared/supabaseClient';
import toast from 'react-hot-toast';

import { useExperiences, swapExperienceOrder } from '../../../shared/hooks/useExperiences';
import { formatDateRange } from '../../../shared/utils/i18n';

import {
    Badge,
    Button,
    ConfirmDialog,
    Panel,
    Table,
    THead,
    TBody,
    TR,
    TH,
    TD,
    TEmpty,
} from '../../../shared/ui';

// El panel es en español; formatDateRange espera el objeto de idioma.
const ADMIN_LOCALE = { languaje: 'Español' };

function ArrowIcon({ up }) {
    return (
        <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={up ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
            />
        </svg>
    );
}

function ExperienceList({ onEdit }) {
    const { experiences, loading, refetch } = useExperiences();
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [reordering, setReordering] = useState(false);

    const move = async (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= experiences.length) return;

        setReordering(true);
        try {
            await swapExperienceOrder(experiences[index], experiences[target]);
            await refetch();
        } catch (error) {
            console.error('Error reordering experiences:', error);
            toast.error('No se pudo reordenar');
        } finally {
            setReordering(false);
        }
    };

    const handleDelete = async () => {
        if (!pendingDelete) return;
        setDeleting(true);

        try {
            const { error } = await supabase
                .from('experiences')
                .delete()
                .eq('id', pendingDelete.id);

            if (error) throw error;

            toast.success('Experiencia eliminada');
            setPendingDelete(null);
            await refetch();
        } catch (error) {
            console.error('Error deleting experience:', error);
            toast.error('Error al eliminar la experiencia');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Panel className="overflow-hidden">
                <Table>
                    <THead>
                        <TR>
                            <TH className="w-24">Orden</TH>
                            <TH>Puesto</TH>
                            <TH>Empresa</TH>
                            <TH>Período</TH>
                            <TH className="text-right">Acciones</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {loading ? (
                            <TEmpty colSpan={5}>Cargando experiencia…</TEmpty>
                        ) : experiences.length === 0 ? (
                            <TEmpty colSpan={5}>Todavía no hay experiencia cargada.</TEmpty>
                        ) : (
                            experiences.map((experience, index) => (
                                <TR key={experience.id}>
                                    <TD>
                                        <div className="flex gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                aria-label={`Subir ${experience.title}`}
                                                disabled={index === 0 || reordering}
                                                onClick={() => move(index, -1)}
                                            >
                                                <ArrowIcon up />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                aria-label={`Bajar ${experience.title}`}
                                                disabled={index === experiences.length - 1 || reordering}
                                                onClick={() => move(index, 1)}
                                            >
                                                <ArrowIcon />
                                            </Button>
                                        </div>
                                    </TD>
                                    <TD className="font-medium">{experience.title}</TD>
                                    <TD>{experience.company}</TD>
                                    <TD>
                                        <Badge tone={experience.end_date ? 'muted' : 'volt'}>
                                            {formatDateRange(
                                                experience.start_date,
                                                experience.end_date,
                                                ADMIN_LOCALE
                                            )}
                                        </Badge>
                                    </TD>
                                    <TD className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => onEdit(experience)}>
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => setPendingDelete(experience)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </TD>
                                </TR>
                            ))
                        )}
                    </TBody>
                </Table>
            </Panel>

            <ConfirmDialog
                open={Boolean(pendingDelete)}
                onClose={() => setPendingDelete(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Eliminar experiencia"
                description={
                    pendingDelete
                        ? `Se va a eliminar "${pendingDelete.title}" en ${pendingDelete.company}. No se puede deshacer.`
                        : undefined
                }
            />
        </>
    );
}

export default ExperienceList;
