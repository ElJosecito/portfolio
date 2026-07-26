/**
 * El contenido se guarda en español y con traducción opcional al inglés en las
 * columnas `_en`. Si la traducción está vacía se cae al español para no dejar
 * la card en blanco.
 */
export function isEnglish(languaje) {
  return languaje?.languaje === "English";
}

export function localizeProject(project, languaje) {
  const english = isEnglish(languaje);

  return {
    name: (english && project.title_en) || project.title,
    description: (english && project.description_en) || project.description,
  };
}

export function localizeExperience(experience, languaje) {
  const english = isEnglish(languaje);

  return {
    title: (english && experience.title_en) || experience.title,
    description:
      (english && experience.description_en) || experience.description,
  };
}

/**
 * Formatea el período de un puesto.
 *
 * Las fechas se guardan como DATE y se formatean acá, en vez de guardar el
 * texto ya armado: así no hay que mantener un `date_label` y un `date_label_en`
 * a mano cada vez que se agrega una experiencia.
 *
 * `end` en NULL significa que el puesto sigue en curso. `start` puede ser NULL
 * cuando no se sabe desde cuándo, y entonces solo se muestra el estado.
 */
export function formatDateRange(start, end, languaje) {
  const locale = isEnglish(languaje) ? "en-US" : "es-ES";
  const current = isEnglish(languaje) ? "Present" : "Actualmente";

  const format = (value) => {
    if (!value) return null;
    // Las fechas vienen como 'YYYY-MM-DD'. Partirlas a mano evita que se
    // interpreten como UTC y retrocedan un día según la zona horaria.
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });
  };

  const from = format(start);
  const to = format(end);

  if (from && to) return `${from} — ${to}`;
  if (from) return `${from} — ${current}`;
  if (to) return to;
  return current;
}
