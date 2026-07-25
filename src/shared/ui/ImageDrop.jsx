import React from "react";
import { cn } from "./cn";

/**
 * Selector de imagen con arrastrar-y-soltar y vista previa.
 *
 * Es un `<input type="file">` de verdad debajo del área punteada, no un div que
 * simula serlo: así sigue funcionando con teclado y lo anuncia el lector de
 * pantalla sin trabajo extra.
 */
export function ImageDrop({ value, onChange, accept = "image/*", hint, className = "" }) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef(null);
  const id = React.useId();

  const handleFile = (file) => {
    if (file) onChange?.(file);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl",
          "border-2 border-dashed px-6 py-8 text-center transition-colors",
          "focus-within:ring-2 focus-within:ring-volt-500",
          dragging
            ? "border-volt-500 bg-volt-500/5"
            : "border-plum-200 hover:border-plum-300 dark:border-plum-700 dark:hover:border-plum-600"
        )}
      >
        <span className="text-sm font-medium text-plum-700 dark:text-plum-100">
          Arrastrá una imagen o hacé click
        </span>
        {hint && <span className="text-xs text-plum-500 dark:text-plum-300/70">{hint}</span>}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </label>

      {value && (
        <div className="relative overflow-hidden rounded-2xl border border-plum-200 dark:border-plum-700">
          <img src={value} alt="Vista previa" className="h-64 w-full object-cover" />
        </div>
      )}
    </div>
  );
}

export default ImageDrop;
