import React, { useState, useEffect } from 'react';
import { supabase } from '../../../shared/supabaseClient';
import { deleteImage } from '../../../shared/utils/uploadImage';
import toast from 'react-hot-toast';

import {
  Badge,
  ConfirmDialog,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  Panel,
  SkeletonRows,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  TEmpty,
} from '../../../shared/ui';

function DotsIcon() {
    return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="5" r="1.75" />
            <circle cx="12" cy="12" r="1.75" />
            <circle cx="12" cy="19" r="1.75" />
        </svg>
    );
}

function ProjectList({ onEdit }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Error al cargar proyectos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!pendingDelete) return;
        setDeleting(true);

        try {
            // La imagen se borra primero, pero su fallo no aborta nada: dejar el
            // proyecto vivo por un archivo huérfano es peor que el archivo.
            if (pendingDelete.image_url) {
                try {
                    const imageName = pendingDelete.image_url.split('/').pop();
                    await deleteImage(imageName);
                } catch (imgError) {
                    console.error('Error deleting image from storage:', imgError);
                }
            }

            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', pendingDelete.id);

            if (error) throw error;

            toast.success('Proyecto eliminado');
            setProjects((prev) => prev.filter((p) => p.id !== pendingDelete.id));
            setPendingDelete(null);
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Error al eliminar proyecto');
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
                            <TH className="w-20">Imagen</TH>
                            <TH>Título</TH>
                            <TH>Plataformas</TH>
                            <TH>Destacado</TH>
                            <TH className="text-right">Acciones</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {loading ? (
                            <SkeletonRows rows={4} columns={5} />
                        ) : projects.length === 0 ? (
                            <TEmpty colSpan={5}>Todavía no hay proyectos creados.</TEmpty>
                        ) : (
                            projects.map((project) => (
                                <TR key={project.id}>
                                    <TD>
                                        <img
                                            src={project.image_url}
                                            alt=""
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    </TD>
                                    <TD className="font-medium">{project.title}</TD>
                                    <TD>
                                        <span className="flex flex-wrap gap-1">
                                            {project.platforms?.map((platform) => (
                                                <Badge key={platform} tone="muted">
                                                    {platform}
                                                </Badge>
                                            ))}
                                        </span>
                                    </TD>
                                    <TD>
                                        {project.is_featured ? (
                                            <Badge tone="volt">
                                                {project.featured_size === 'large' ? 'Grande' : 'Pequeño'}
                                                {project.featured_order ? ` · ${project.featured_order}` : ''}
                                            </Badge>
                                        ) : (
                                            <span className="text-plum-400">—</span>
                                        )}
                                    </TD>
                                    <TD className="text-right">
                                        <Menu>
                                            <MenuTrigger label={`Acciones de ${project.title}`}>
                                                <DotsIcon />
                                            </MenuTrigger>
                                            <MenuList>
                                                <MenuLabel>Acciones</MenuLabel>
                                                <MenuItem onSelect={() => onEdit(project)}>Editar</MenuItem>
                                                <MenuSeparator />
                                                <MenuItem danger onSelect={() => setPendingDelete(project)}>
                                                    Eliminar
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
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
                title="Eliminar proyecto"
                description={
                    pendingDelete
                        ? `Se va a eliminar "${pendingDelete.title}" y su imagen. No se puede deshacer.`
                        : undefined
                }
            />
        </>
    );
}

export default ProjectList;
