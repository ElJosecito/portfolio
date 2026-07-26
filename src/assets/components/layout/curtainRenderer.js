import { GLYPH_STROKES } from "../../../shared/ui/Loader";

/**
 * Tiempos del telón, compartidos entre el renderer y el fallback sin WebGL.
 *
 * La apertura es más lenta que el resto a propósito: el fruncido —los pliegues
 * juntándose contra el costado— es lo que hace que se lea como tela, y a menos
 * de un segundo no se llega a ver.
 */
export const TIMELINE = {
  DRAW_MS: 1100,
  STAGGER_MS: 180,
  HOLD_MS: 350,
  OPEN_MS: 1400,
};

// El corte cae en el centro del viewBox. Con el viewBox ajustado del loader ese
// centro da x=42, justo donde arranca el trazo de la M, y el telón parecería
// estar afeitando la letra. El hueco real va de 34 (fin de la J) a 42, así que
// el corte tiene que caer en 38. Se ensancha el viewBox en vez de correrlo
// —correrlo recortaba la pata derecha de la M—: -2 + 80/2 = 38.
const VIEW_BOX = { x: -2, y: 10, width: 80, height: 44 };

const VERTEX_SHADER = `
attribute vec2 aPos;
varying vec2 vUv;

void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2  uResolution;
uniform float uOpen;
uniform float uTime;
uniform float uDark;
uniform sampler2D uGlyph;

varying vec2 vUv;

// Campo de altura del pliegue.
//
// Las tres frecuencias no son múltiplos entre sí para que el patrón no se lea
// como una repetición: con una sola onda queda un acordeón de juguete. El
// \`drift\` corre los pliegues despacio a lo largo del alto, porque una tela
// colgada no cae en rayas perfectamente rectas, se va de a poco.
float foldHeight(float u, float y, float t) {
  float drift = 0.030 * sin(y * 2.3 + 0.8 + t * 0.25)
              + 0.018 * sin(y * 4.7 - 2.1 - t * 0.17);

  float p = u + drift;

  float h = sin(p * 38.0);
  h += 0.42 * sin(p * 67.0 + 1.7);
  h += 0.20 * sin(p * 17.0 - 0.6);

  return h / 1.62;
}

void main() {
  float x = vUv.x;
  float y = 1.0 - vUv.y;              // 0 arriba, 1 abajo

  // El borde de abajo llega tarde: la tela pesa y el movimiento la arrastra.
  float lag = 0.14;
  float t = clamp(uOpen * (1.0 + lag * y) - lag * y, 0.0, 1.0);

  // Ancho visible de cada mitad. El paño NO se traslada: se comprime contra su
  // costado, que es lo que hace una cortina de verdad cuando se corre. Como el
  // mismo rango de \`u\` tiene que entrar en cada vez menos píxeles, los pliegues
  // se juntan solos. Ese es todo el truco del fruncido.
  float halfWidth = 0.5 * (1.0 - t);

  bool  isLeft = x < 0.5;
  float dist   = isLeft ? x : 1.0 - x;   // distancia al borde exterior

  // Antialias del borde de fuga, medido en píxeles.
  float px = 1.5 / uResolution.x;
  float alpha = 1.0 - smoothstep(halfWidth - px, halfWidth + px, dist);

  // Sobre el final el paño queda más angosto que el propio suavizado del borde,
  // y entonces el smoothstep de arriba nunca llega a cero: deja una tira de un
  // píxel medio opaca pegada a cada canto de la pantalla. Se queda ahí hasta que
  // el telón se desmonta, y ahí desaparece de golpe. Ese es el parpadeo del
  // final. Esto la apaga sola antes de que el paño llegue a ancho cero.
  alpha *= smoothstep(0.0, 0.0025, halfWidth);

  if (alpha <= 0.002) discard;

  float u = dist / max(halfWidth, 1e-4);  // 0 en el borde exterior, 1 en el de fuga

  // Cuánto está comprimido el paño respecto a su estado cerrado.
  float gather = 0.5 / max(halfWidth, 0.02);

  float e  = 0.0012;
  float h  = foldHeight(u, y, uTime);
  float h2 = foldHeight(u + e, y, uTime);

  // El paño cerrado está tenso: es liso, sin relieve. Los pliegues no están ahí
  // de antes, aparecen porque la tela se amontona al correrse, y por eso nacen
  // con la apertura. Como \`t\` ya trae el retraso del borde de abajo, los
  // pliegues brotan arriba primero y van bajando con el movimiento.
  float emerge = smoothstep(0.0, 0.30, t);

  // El paño va pinchado en el riel y se abre hacia abajo, y se ahonda a medida
  // que se frunce.
  float amp = mix(0.62, 1.0, y) * mix(1.0, 1.7, clamp(gather - 1.0, 0.0, 1.0)) * emerge;

  // Sobre el final el paño queda tan angosto que un pliegue mide menos de dos
  // píxeles, y ahí el patrón deja de resolverse y empieza a titilar. Se baja el
  // relieve en ese tramo: es preferible una franja oscura y limpia a un moiré.
  // Arranca en gather 6, cuando la mitad ya bajó de un 8% del ancho.
  float detail = mix(1.0, 0.3, smoothstep(6.0, 13.0, gather));

  float slope = (h2 - h) / e * amp * detail;

  vec3 N = normalize(vec3(-slope * 0.013, 0.0, 1.0));
  vec3 L = normalize(vec3(-0.42, 0.34, 0.84));
  vec3 V = vec3(0.0, 0.0, 1.0);

  float diff  = max(dot(N, L), 0.0);
  float spec  = pow(max(dot(N, normalize(L + V)), 0.0), 26.0);
  // El terciopelo, además del brillo especular, dispersa en el canto del
  // pliegue: es lo que le da ese halo que no tiene una tela mate.
  float sheen = pow(1.0 - max(dot(N, V), 0.0), 2.6);

  // Oclusión: al fondo del pliegue no le llega luz. Va contra \`emerge\` también,
  // porque sin pliegue no hay fondo de pliegue que ensombrecer: si no, el paño
  // liso arrancaba oscurecido sin motivo.
  float ao = mix(1.0, mix(0.42, 1.0, smoothstep(-1.1, 0.7, h * amp)), emerge);

  // Ciruela 700/500/300 en claro, 950/800/500 en oscuro. En claro se probó una
  // rampa más alta y el terciopelo se iba a satén: las crestas llegaban casi a
  // blanco y la tela perdía el peso. El valle tiene que quedar oscuro en los dos
  // temas o no hay pliegue, hay raya.
  vec3 deep = mix(vec3(0.278, 0.173, 0.322), vec3(0.062, 0.043, 0.086), uDark);
  vec3 mid  = mix(vec3(0.416, 0.259, 0.475), vec3(0.216, 0.137, 0.259), uDark);
  vec3 lit  = mix(vec3(0.694, 0.514, 0.776), vec3(0.478, 0.310, 0.549), uDark);

  vec3 color = mix(deep, mid, diff);
  color += lit * spec * 0.55;
  color += lit * sheen * 0.12;
  color *= ao;

  // Sombra del riel arriba, peso abajo.
  color *= mix(0.72, 1.0, smoothstep(0.0, 0.16, y));
  color *= mix(1.0, 0.86, smoothstep(0.82, 1.0, y));

  // Filo de luz en el borde de fuga: es el canto de la tela pegando contra el
  // aire. Sin esto el corte se ve cortado con tijera.
  //
  // El segundo factor lo apaga sobre el final. El filo vive en el 1.5% interior
  // del paño, así que cuando el paño se hace más angosto que eso el filo pasa a
  // ser todo el paño: en vez de un canto iluminado queda una raya brillante
  // pegada al borde de la pantalla.
  color += lit * smoothstep(0.985, 1.0, u) * smoothstep(0.0, 0.02, halfWidth) * 0.35;

  // El monograma va impreso en la tela. Se muestrea en coordenadas del paño y
  // no de pantalla, así se comprime y se sombrea junto con los pliegues en vez
  // de flotar por encima.
  vec2 glyphUv = isLeft ? vec2(u * 0.5, vUv.y) : vec2(1.0 - u * 0.5, vUv.y);
  float ink = texture2D(uGlyph, glyphUv).a;

  vec3 inkColor = mix(vec3(0.35, 0.20, 0.42), vec3(0.902, 0.831, 0.941), uDark);
  vec3 inkLit = inkColor * (0.55 + 0.75 * diff) * ao + lit * spec * 0.3;
  color = mix(color, inkLit, ink);

  // Premultiplicado: es como el navegador espera componer el canvas.
  gl_FragColor = vec4(color * alpha, alpha);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[curtain] shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Mide el largo real de un trazo.
 *
 * Path2D no sabe decirlo, así que se arma un <path> de SVG suelto y se le
 * pregunta. Hace falta para el dasharray del dibujado: sin el largo exacto la
 * letra terminaría de dibujarse antes o después de lo que dura la animación.
 */
function measurePathLength(d) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("d", d);
  svg.appendChild(path);
  svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
  document.body.appendChild(svg);

  const length = path.getTotalLength();
  svg.remove();

  return length;
}

/**
 * Telón de terciopelo en WebGL.
 *
 * Es un solo cuadrilátero a pantalla completa con un fragment shader: para un
 * paño frontal no hace falta escena, ni cámara, ni geometría. Todo —pliegues,
 * sombra, brillo, fruncido— sale de una función de la posición del píxel, que es
 * literalmente para lo que sirve un shader. Traer una librería 3D acá sería
 * pagar 150KB por dibujar un rectángulo con ondas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {{ dark: boolean, onOpened: () => void }} options
 * @returns {{ destroy: () => void } | null} null si no hay WebGL, y ahí el
 * llamador se queda con el telón de CSS.
 */
export function createCurtainRenderer(canvas, { dark = false, onOpened } = {}) {
  const gl =
    canvas.getContext("webgl", { antialias: false, alpha: true }) ||
    canvas.getContext("experimental-webgl", { antialias: false, alpha: true });

  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[curtain] link:", gl.getProgramInfoLog(program));
    return null;
  }

  gl.useProgram(program);

  // Un triángulo que tapa la pantalla, no dos que forman un cuadrado: se
  // rasteriza de una y no hay costura en la diagonal.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    resolution: gl.getUniformLocation(program, "uResolution"),
    open: gl.getUniformLocation(program, "uOpen"),
    time: gl.getUniformLocation(program, "uTime"),
    dark: gl.getUniformLocation(program, "uDark"),
    glyph: gl.getUniformLocation(program, "uGlyph"),
  };

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
  gl.uniform1f(uniforms.dark, dark ? 1 : 0);
  gl.uniform1i(uniforms.glyph, 0);

  // --- textura del monograma -------------------------------------------------

  const strokes = GLYPH_STROKES.map(({ d }) => ({
    path: new Path2D(d),
    length: measurePathLength(d),
  }));

  const glyphCanvas = document.createElement("canvas");
  const glyphCtx = glyphCanvas.getContext("2d");

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  // La primera fila del canvas 2D es la de arriba; en WebGL v=0 es abajo.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  function drawGlyph(progress) {
    const { width, height } = glyphCanvas;
    glyphCtx.clearRect(0, 0, width, height);

    // El monograma ocupa una fracción del alto, acotado para que no se vuelva
    // gigante en un monitor grande ni ilegible en un teléfono.
    const target = Math.max(84, Math.min(height * 0.17, 190));
    const scale = target / VIEW_BOX.height;

    glyphCtx.save();
    glyphCtx.translate(width / 2, height / 2);
    glyphCtx.scale(scale, scale);
    glyphCtx.translate(
      -(VIEW_BOX.x + VIEW_BOX.width / 2),
      -(VIEW_BOX.y + VIEW_BOX.height / 2)
    );

    // Blanco puro: al shader solo le importa el alfa, el color de la tinta lo
    // decide él según el tema.
    glyphCtx.strokeStyle = "#fff";
    glyphCtx.lineWidth = 4;
    glyphCtx.lineCap = "round";
    glyphCtx.lineJoin = "round";

    strokes.forEach(({ path, length }, index) => {
      const delay = (index * TIMELINE.STAGGER_MS) / TIMELINE.DRAW_MS;
      const own = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      if (own <= 0) return;

      glyphCtx.setLineDash([length, length]);
      glyphCtx.lineDashOffset = length * (1 - own);
      glyphCtx.stroke(path);
    });

    glyphCtx.restore();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glyphCanvas);
  }

  // --- tamaño ----------------------------------------------------------------

  let width = 0;
  let height = 0;

  function resize() {
    // El shader es barato pero el canvas es pantalla completa; a 3x en un
    // teléfono se paga de más sin que se note.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextWidth = Math.floor(window.innerWidth * dpr);
    const nextHeight = Math.floor(window.innerHeight * dpr);

    if (nextWidth === width && nextHeight === height) return;

    width = nextWidth;
    height = nextHeight;

    canvas.width = width;
    canvas.height = height;
    glyphCanvas.width = width;
    glyphCanvas.height = height;

    gl.viewport(0, 0, width, height);
    gl.uniform2f(uniforms.resolution, width, height);
  }

  resize();
  window.addEventListener("resize", resize);

  // --- línea de tiempo -------------------------------------------------------

  const DRAW_END = TIMELINE.DRAW_MS + TIMELINE.STAGGER_MS;
  const OPEN_START = DRAW_END + TIMELINE.HOLD_MS;
  const TOTAL = OPEN_START + TIMELINE.OPEN_MS;

  // Un par de cuadros ya vacíos antes de avisar que terminó. Le dan tiempo al
  // compositor a asentarse con el canvas transparente en vez de tener que
  // sacarle de encima una capa que recién se estaba dibujando.
  const TAIL_MS = 80;

  // Arranca despacio, agarra velocidad y se asienta. Un lineal delata que hay
  // una interpolación atrás.
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  let frame = 0;
  let start = 0;
  let lastDrawProgress = -1;

  function renderAt(elapsed) {
    resize();

    const drawProgress = Math.max(0, Math.min(1, elapsed / DRAW_END));
    // La textura se vuelve a subir solo mientras la letra se está dibujando.
    // Una vez completa no cambia más y no hay por qué tocarla en cada cuadro.
    if (lastDrawProgress < 1 && drawProgress !== lastDrawProgress) {
      drawGlyph(drawProgress);
      lastDrawProgress = drawProgress;
    }

    const openRaw = Math.max(0, Math.min(1, (elapsed - OPEN_START) / TIMELINE.OPEN_MS));

    gl.uniform1f(uniforms.open, easeInOutCubic(openRaw));
    gl.uniform1f(uniforms.time, elapsed / 1000);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // El primer cuadro se pinta acá y no en el primer requestAnimationFrame: entre
  // que el canvas se mete en el DOM y que llega ese rAF pasa al menos un cuadro,
  // y en ese hueco el canvas está vacío y se ve el hero antes de que la tela lo
  // tape. Llamado desde un layout effect, esto entra antes del primer pintado.
  renderAt(0);

  function tick(now) {
    if (!start) start = now;
    const elapsed = now - start;

    renderAt(elapsed);

    if (elapsed >= TOTAL + TAIL_MS) {
      onOpened?.();
      return;
    }

    frame = requestAnimationFrame(tick);
  }

  frame = requestAnimationFrame(tick);

  return {
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);

      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);

      // Sin esto el contexto queda vivo hasta que pase el recolector, y los
      // navegadores permiten pocos contextos WebGL a la vez. Va diferido porque
      // perder el contexto repinta el canvas, y si eso ocurre mientras el nodo
      // todavía está en el documento se ve el repintado.
      setTimeout(() => gl.getExtension("WEBGL_lose_context")?.loseContext(), 0);
    },
  };
}
