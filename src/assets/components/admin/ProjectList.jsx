import React, { useState, useEffect } from 'react';
import { supabase } from '../../../shared/supabaseClient';
import { deleteImage } from '../../../shared/utils/uploadImage';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ProjectList({ onEdit }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;

        try {
            // Delete image from storage first
            const projectToDelete = projects.find(p => p.id === id);
            if (projectToDelete?.image_url) {
                try {
                    // Extract filename from URL
                    const imageName = projectToDelete.image_url.split('/').pop();
                    await deleteImage(imageName);
                } catch (imgError) {
                    console.error('Error deleting image from storage:', imgError);
                    // Continue with project deletion even if image deletion fails
                }
            }

            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Proyecto eliminado');
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Error al eliminar proyecto');
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Cargando proyectos...</div>;
    }

    return (
        <div className="rounded-md border bg-white dark:bg-slate-950">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Imagen</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Destacado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                                No hay proyectos creados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell>
                                    <img
                                        src={project.image_url}
                                        alt={project.title}
                                        className="w-12 h-12 rounded object-cover"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{project.title}</TableCell>
                                <TableCell>{project.project_type}</TableCell>
                                <TableCell>{project.is_featured ? 'Sí' : 'No'}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Abrir menú</span>
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onEdit(project)}>
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(project.id)}
                                                className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                            >
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default ProjectList;
