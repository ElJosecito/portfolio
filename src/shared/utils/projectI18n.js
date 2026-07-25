/**
 * Los proyectos guardan el contenido en español (title, description) y su
 * traducción opcional en inglés (title_en, description_en). Si la traducción
 * está vacía se cae al español para no dejar la card en blanco.
 */
export function localizeProject(project, languaje) {
  const english = languaje?.languaje === "English";

  return {
    name: (english && project.title_en) || project.title,
    description: (english && project.description_en) || project.description,
  };
}
