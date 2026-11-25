<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    letter: "M" | "P" | "O" | "T";
    word: string;
    icon: string;
    onComplete?: () => void;
    onPlaySound?: () => void;
  }

  let { letter, word, icon, onComplete, onPlaySound }: Props = $props();

  type LetterCase = "upper" | "lower";
  let letterCase = $state<LetterCase>("upper");
  let canvasEl = $state<HTMLCanvasElement | null>(null);
  let isDrawing = $state(false);
  let progressPct = $state(0);
  let isCompleted = $state(false);
  let demoPlaying = $state(false);

  // Normalized (0..1) stroke definitions for M, P, O, T (uppercase & lowercase)
  type Point = [number, number];
  const STROKES: Record<string, Point[][]> = {
    M: [
      [[0.20, 0.80], [0.20, 0.22]],
      [[0.20, 0.22], [0.50, 0.62], [0.80, 0.22]],
      [[0.80, 0.22], [0.80, 0.80]],
    ],
    m: [
      [[0.18, 0.42], [0.18, 0.80]],
      [[0.18, 0.48], [0.26, 0.38], [0.40, 0.38], [0.49, 0.48], [0.49, 0.80]],
      [[0.49, 0.48], [0.58, 0.38], [0.72, 0.38], [0.81, 0.48], [0.81, 0.80]],
    ],
    P: [
      [[0.28, 0.80], [0.28, 0.22]],
      [[0.28, 0.22], [0.58, 0.22], [0.72, 0.30], [0.72, 0.44], [0.58, 0.52], [0.28, 0.52]],
    ],
    p: [
      [[0.30, 0.36], [0.30, 0.88]],
      [[0.30, 0.42], [0.52, 0.34], [0.68, 0.44], [0.68, 0.60], [0.52, 0.70], [0.30, 0.62]],
    ],
    O: [
      [
        [0.50, 0.20], [0.30, 0.27], [0.21, 0.50], [0.30, 0.73],
        [0.50, 0.80], [0.70, 0.73], [0.79, 0.50], [0.70, 0.27], [0.50, 0.20],
      ],
    ],
    o: [
      [
        [0.50, 0.36], [0.34, 0.42], [0.28, 0.58], [0.34, 0.74],
        [0.50, 0.80], [0.66, 0.74], [0.72, 0.58], [0.66, 0.42], [0.50, 0.36],
      ],
    ],
    T: [
      [[0.22, 0.24], [0.78, 0.24]],
      [[0.50, 0.24], [0.50, 0.80]],
    ],
    t: [
      [[0.46, 0.20], [0.46, 0.72], [0.54, 0.80], [0.66, 0.78]],
      [[0.32, 0.42], [0.64, 0.42]],
    ],
  };

  let activeGlyph = $derived(letterCase === "upper" ? letter : letter.toLowerCase());
  let checkpoints: { x: number; y: number; hit: boolean }[] = [];
  let userPaths: Point[][] = [];
  let currentPath: Point[] = [];
  let demoFrameId: number | null = null;

  function buildCheckpoints(glyph: string) {
    const strokes = STROKES[glyph] || STROKES.O;
    const pts: { x: number; y: number; hit: boolean }[] = [];
    for (const stroke of strokes) {
      for (let i = 0; i < stroke.length - 1; i++) {
        const [x1, y1] = stroke[i];
        const [x2, y2] = stroke[i + 1];
        const dist = Math.hypot(x2 - x1, y2 - y1);
        const steps = Math.max(4, Math.ceil(dist / 0.055));
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          pts.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t, hit: false });
        }
      }
    }
    return pts;
  }

  function resetSlate() {
    if (demoFrameId !== null) {
      cancelAnimationFrame(demoFrameId);
      demoFrameId = null;
    }
    demoPlaying = false;
    userPaths = [];
    currentPath = [];
    checkpoints = buildCheckpoints(activeGlyph);
    progressPct = 0;
    isCompleted = false;
    renderCanvas();
  }

  $effect(() => {
    // Re-initialize whenever letter or case changes
    const _glyph = activeGlyph;
    if (_glyph) {
      resetSlate();
    }
  });

  function renderCanvas(demoPoint?: Point | null) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = canvasEl.clientWidth || 260;
    if (canvasEl.width !== Math.round(size * dpr) || canvasEl.height !== Math.round(size * dpr)) {
      canvasEl.width = Math.round(size * dpr);
      canvasEl.height = Math.round(size * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    // Subtle school-notebook baseline guides (J'apprends writing slate style)
    ctx.strokeStyle = "rgba(16, 185, 129, 0.18)";
    ctx.lineWidth = 1.5;
    for (const yRatio of [0.22, 0.50, 0.80]) {
      ctx.beginPath();
      ctx.setLineDash(yRatio === 0.5 ? [6, 6] : []);
      ctx.moveTo(16, size * yRatio);
      ctx.lineTo(size - 16, size * yRatio);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const strokes = STROKES[activeGlyph] || STROKES.O;

    // 1. Thick soft guide silhouette
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
    ctx.lineWidth = Math.max(24, size * 0.1);
    for (const stroke of strokes) {
      ctx.beginPath();
      stroke.forEach(([x, y], idx) => {
        if (idx === 0) ctx.moveTo(x * size, y * size);
        else ctx.lineTo(x * size, y * size);
      });
      ctx.stroke();
    }

    // 2. Dashed center guide line
    ctx.strokeStyle = "rgba(16, 185, 129, 0.55)";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    for (const stroke of strokes) {
      ctx.beginPath();
      stroke.forEach(([x, y], idx) => {
        if (idx === 0) ctx.moveTo(x * size, y * size);
        else ctx.lineTo(x * size, y * size);
      });
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 3. Numbered stroke starting dots
    strokes.forEach((stroke, idx) => {
      const [sx, sy] = stroke[0];
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(sx * size, sy * size, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#022c22";
      ctx.font = "800 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(idx + 1), sx * size, sy * size + 0.5);
    });

    // 4. User drawn strokes
    ctx.strokeStyle = isCompleted ? "#10b981" : "#fbbf24";
    ctx.lineWidth = Math.max(16, size * 0.068);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const path of [...userPaths, currentPath]) {
      if (path.length < 2) continue;
      ctx.beginPath();
      path.forEach(([x, y], idx) => {
        if (idx === 0) ctx.moveTo(x * size, y * size);
        else ctx.lineTo(x * size, y * size);
      });
      ctx.stroke();
    }

    // 5. Animated demo finger indicator
    if (demoPoint) {
      const [dx, dy] = demoPoint;
      ctx.fillStyle = "rgba(52, 211, 153, 0.35)";
      ctx.beginPath();
      ctx.arc(dx * size, dy * size, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(dx * size, dy * size, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function playStrokeDemo() {
    if (demoFrameId !== null) cancelAnimationFrame(demoFrameId);
    const pts = buildCheckpoints(activeGlyph);
    if (pts.length === 0) return;
    demoPlaying = true;
    const start = performance.now();
    const duration = Math.max(1400, pts.length * 42);

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const idx = Math.min(pts.length - 1, Math.floor(t * pts.length));
      renderCanvas([pts[idx].x, pts[idx].y]);
      if (t < 1) {
        demoFrameId = requestAnimationFrame(tick);
      } else {
        demoPlaying = false;
        demoFrameId = null;
        renderCanvas(null);
      }
    };
    demoFrameId = requestAnimationFrame(tick);
  }

  function getNormalizedPos(e: PointerEvent): Point | null {
    if (!canvasEl) return null;
    const rect = canvasEl.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    return [
      Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    ];
  }

  function markCheckpointsNear(pt: Point) {
    const threshold = 0.095;
    let hits = 0;
    for (const cp of checkpoints) {
      if (!cp.hit && Math.hypot(cp.x - pt[0], cp.y - pt[1]) <= threshold) {
        cp.hit = true;
      }
      if (cp.hit) hits++;
    }
    const pct = checkpoints.length > 0 ? Math.round((hits / checkpoints.length) * 100) : 0;
    progressPct = pct;
    if (pct >= 72 && !isCompleted) {
      isCompleted = true;
      renderCanvas();
      onComplete?.();
    }
  }

  function handlePointerDown(e: PointerEvent) {
    e.preventDefault();
    const pt = getNormalizedPos(e);
    if (!pt) return;
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
    isDrawing = true;
    currentPath = [pt];
    markCheckpointsNear(pt);
    renderCanvas();
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    const pt = getNormalizedPos(e);
    if (!pt) return;
    currentPath.push(pt);
    markCheckpointsNear(pt);
    renderCanvas();
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    isDrawing = false;
    if (currentPath.length > 0) {
      userPaths.push(currentPath);
      currentPath = [];
    }
    renderCanvas();
  }

  onMount(() => {
    resetSlate();
    const onResize = () => renderCanvas();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (demoFrameId !== null) cancelAnimationFrame(demoFrameId);
    };
  });
</script>

<div class="flex flex-col items-center gap-3 w-full">
  <!-- Header: Word + Audio Replay + Upper/Lower Switch -->
  <div class="w-full flex items-center justify-between gap-2">
    <button
      onclick={() => onPlaySound?.()}
      class="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-200 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95"
    >
      <span class="text-lg">{icon}</span>
      <span><strong class="text-amber-300 underline decoration-2">{word.slice(0, 1).toUpperCase()}</strong>{word.slice(1)}</span>
      <span class="opacity-70">🔈</span>
    </button>

    <div class="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-white/10 text-[11px] font-black">
      <button
        onclick={() => (letterCase = "upper")}
        class="px-2.5 py-1 rounded-lg transition-all cursor-pointer {letterCase === 'upper' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}"
      >
        {letter}
      </button>
      <button
        onclick={() => (letterCase = "lower")}
        class="px-2.5 py-1 rounded-lg transition-all cursor-pointer {letterCase === 'lower' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}"
      >
        {letter.toLowerCase()}
      </button>
    </div>
  </div>

  <!-- Tactile Magic Slate Canvas -->
  <div class="relative w-full max-w-[270px] aspect-square rounded-3xl bg-slate-950/90 border-2 {isCompleted ? 'border-emerald-400 shadow-emerald-500/30' : 'border-white/15'} shadow-2xl overflow-hidden touch-none select-none">
    <canvas
      bind:this={canvasEl}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerUp}
      class="w-full h-full block touch-none cursor-crosshair"
    ></canvas>

    {#if isCompleted}
      <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs shadow-lg animate-in zoom-in-90 duration-150">
        ✓ Bravo !
      </div>
    {/if}
  </div>

  <!-- Progress & Controls -->
  <div class="w-full max-w-[270px] flex items-center justify-between gap-2">
    <button
      onclick={playStrokeDemo}
      disabled={demoPlaying}
      class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
    >
      👀 Voir le tracé
    </button>

    <div class="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden mx-1">
      <div
        class="h-full rounded-full transition-all duration-150 {isCompleted ? 'bg-emerald-400' : 'bg-amber-400'}"
        style="width: {Math.min(100, Math.round((progressPct / 72) * 100))}%"
      ></div>
    </div>

    <button
      onclick={resetSlate}
      class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs cursor-pointer transition-all"
    >
      ↺ Effacer
    </button>
  </div>
</div>
