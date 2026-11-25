import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export type ClickCallback = (objectId: string) => void;
export type HoverCallback = (objectId: string | null) => void;
export type LockCallback = (isLocked: boolean) => void;
export type LoadingCallback = (isLoading: boolean) => void;

export class KitchenStage {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private clock: THREE.Clock = new THREE.Clock();

  // Shared GLTF Loader, model cache & async level generation guard
  private gltfLoader: GLTFLoader = new GLTFLoader();
  private modelCache: Map<string, THREE.Group> = new Map();
  private levelGeneration: number = 0;
  private pendingLoads: number = 0;
  private isDestroyed: boolean = false;

  // 3D Objects & Raycasting
  private interactables: Map<string, THREE.Object3D> = new Map();
  private currentLevelItems: THREE.Object3D[] = [];
  public currentLevelNumber: number = 1;
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private onObjectClick: ClickCallback | null = null;
  private onObjectHover: HoverCallback | null = null;
  private onLockChange: LockCallback | null = null;
  private onLoadingChange: LoadingCallback | null = null;
  public hoveredObjectId: string | null = null;

  // Subtle glowing indicator ring under the active target object
  private targetRing: THREE.Mesh;

  // FPS Camera & Movement State
  private fpsYaw: number = 0; // horizontal angle
  private fpsPitch: number = -0.15; // vertical angle (slight look-down towards table)
  private playerPos: THREE.Vector3 = new THREE.Vector3(0, 1.58, 2.3);
  private moveSpeed: number = 2.8;
  private keysPressed: Record<string, boolean> = {};
  private headBobTimer: number = 0;

  // Pointer Lock State
  public isLocked: boolean = false;

  // Mobile virtual joystick input (-1 to 1) & touch look
  public joystickMove = { x: 0, y: 0 };
  private touchLookStart = { x: 0, y: 0 };
  private activeLookTouchId: number | null = null;
  private touchStartTime: number = 0;
  private touchStartPos = { x: 0, y: 0 };
  private lastTouchEndAt: number = 0;

  // Fatima & Bones
  private fatimaModel: THREE.Object3D | null = null;
  private skeleton: THREE.Skeleton | null = null;
  private rightArmIdx: number = -1;
  private rightForearmIdx: number = -1;
  private rightHandIdx: number = -1;
  private leftArmIdx: number = -1;
  private leftForearmIdx: number = -1;
  private headIdx: number = -1;

  // Finger bones for pointing index finger gesture
  private rightIndexBones: number[] = [];
  private rightMiddleBones: number[] = [];
  private rightRingBones: number[] = [];
  private rightPinkyBones: number[] = [];
  private rightThumbBones: number[] = [];

  public isSpeaking: boolean = false;
  private speakTimer: number = 0;
  private speakTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private idleTime: number = 0;

  private wallLetterMesh: THREE.Mesh | null = null;

  public targetObjectId: string = "avion";
  public isListening: boolean = false;
  private listenTimer: number = 0;

  // Fatima walking positions behind table (z = -1.18 to avoid table clipping)
  private fatimaTargetPos: THREE.Vector3 = new THREE.Vector3(-0.62, 0, -1.18);
  private fatimaTargetRotY: number = 0;
  private walkTimer: number = 0;

  constructor(
    container: HTMLElement,
    onObjectClick?: ClickCallback,
    onObjectHover?: HoverCallback,
    onLockChange?: LockCallback,
    onLoadingChange?: LoadingCallback,
  ) {
    this.container = container;
    this.onObjectClick = onObjectClick || null;
    this.onObjectHover = onObjectHover || null;
    this.onLockChange = onLockChange || null;
    this.onLoadingChange = onLoadingChange || null;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // Slate-900

    // 2. Camera (Fixed at eye level in FPS)
    const w = Math.max(container.clientWidth, 1);
    const h = Math.max(container.clientHeight, 1);
    const aspect = w / h;
    this.camera = new THREE.PerspectiveCamera(aspect < 0.75 ? 72 : 65, aspect, 0.1, 100);
    this.camera.position.copy(this.playerPos);
    this.updateFpsCameraRotation();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // Target highlight ring resting just above table surface
    const ringGeo = new THREE.RingGeometry(0.25, 0.295, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.targetRing = new THREE.Mesh(ringGeo, ringMat);
    this.targetRing.rotation.x = -Math.PI / 2;
    this.targetRing.position.set(-0.62, 0.992, 0.08);
    this.scene.add(this.targetRing);

    // 4. Lights & Environment
    this.setupLighting();

    // 5. Kitchen Elements & Fatima
    this.buildRoom();
    this.buildTable();
    this.loadFatima();
    this.loadLevel(1);

    // 6. Input Events (Pointer Lock & WASD)
    this.setupInputEvents();
    window.addEventListener("resize", this.onWindowResize);

    // 7. Start Loop
    this.animate();
  }

  private beginLoad(): void {
    this.pendingLoads += 1;
    if (this.pendingLoads === 1 && this.onLoadingChange) {
      this.onLoadingChange(true);
    }
  }

  private endLoad(): void {
    this.pendingLoads = Math.max(0, this.pendingLoads - 1);
    if (this.pendingLoads === 0 && this.onLoadingChange) {
      this.onLoadingChange(false);
    }
  }

  /**
   * Safe Pointer Lock request that never crashes on iOS Safari or WebKit browsers
   * where requestPointerLock is absent or returns void instead of a Promise.
   */
  public requestLock(): void {
    const dom = this.renderer.domElement;
    if (!dom || typeof dom.requestPointerLock !== "function") return;
    // Skip pointer lock on touch-only devices
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    try {
      const result = dom.requestPointerLock() as unknown as Promise<void> | undefined;
      if (result && typeof result.catch === "function") {
        result.catch(() => {});
      }
    } catch {
      // Ignore pointer lock rejection
    }
  }

  public exitLock(): void {
    try {
      if (typeof document !== "undefined" && document.pointerLockElement && typeof document.exitPointerLock === "function") {
        document.exitPointerLock();
      }
    } catch {
      // Ignore exitPointerLock errors
    }
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0xfff5e6, 0.95);
    this.scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xeef6ff, 0x443322, 0.65);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffeedd, 1.4);
    sun.position.set(4, 7, 3.5);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 20;
    const d = 4.0;
    sun.shadow.camera.left = -d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = -d;
    sun.shadow.bias = -0.0004;
    this.scene.add(sun);

    const tableLight = new THREE.PointLight(0xffe2b8, 1.1, 4.5);
    tableLight.position.set(0, 2.4, 0);
    this.scene.add(tableLight);
  }

  private buildRoom(): void {
    // Parquet Floor
    const floorGeo = new THREE.BoxGeometry(6.4, 0.2, 6.4);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xb58257,
      roughness: 0.5,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.1, 0);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf1ede6,
      roughness: 0.85,
    });

    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(6.4, 4, 0.2), wallMat);
    wallBack.position.set(0, 1.9, -3.1);
    wallBack.receiveShadow = true;
    this.scene.add(wallBack);

    const wallFront = new THREE.Mesh(new THREE.BoxGeometry(6.4, 4, 0.2), wallMat);
    wallFront.position.set(0, 1.9, 3.1);
    wallFront.receiveShadow = true;
    this.scene.add(wallFront);

    // Sage Green Kitchen Backsplash
    const splashMat = new THREE.MeshStandardMaterial({
      color: 0x3d665f,
      roughness: 0.35,
    });
    const splash = new THREE.Mesh(new THREE.BoxGeometry(6.3, 1.2, 0.05), splashMat);
    splash.position.set(0, 1.3, -2.98);
    splash.receiveShadow = true;
    this.scene.add(splash);

    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 6.4), wallMat);
    wallLeft.position.set(-3.1, 1.9, 0);
    wallLeft.receiveShadow = true;
    this.scene.add(wallLeft);

    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 6.4), wallMat);
    wallRight.position.set(3.1, 1.9, 0);
    wallRight.receiveShadow = true;
    this.scene.add(wallRight);

    // Big Capital Letter on Wall behind Fatima
    this.setWallLetter("A");
  }

  public setWallLetter(letter: string = "A"): void {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 1024, 1024);

    ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 10;

    let fontSize = 1000;
    ctx.font = `900 ${fontSize}px 'Inter', system-ui, -apple-system, sans-serif`;
    const metrics = ctx.measureText(letter.toUpperCase());
    const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.72;
    const descent = metrics.actualBoundingBoxDescent || fontSize * 0.05;
    const actualHeight = ascent + descent;
    const targetGlyphPx = 800;
    if (actualHeight > 0) {
      fontSize = Math.floor(fontSize * (targetGlyphPx / actualHeight));
      ctx.font = `900 ${fontSize}px 'Inter', system-ui, -apple-system, sans-serif`;
    }

    const finalMetrics = ctx.measureText(letter.toUpperCase());
    const finalAscent = finalMetrics.actualBoundingBoxAscent || fontSize * 0.72;
    const finalDescent = finalMetrics.actualBoundingBoxDescent || fontSize * 0.05;
    const baselineY = 512 + (finalAscent - finalDescent) / 2;

    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(letter.toUpperCase(), 512, baselineY);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;

    if (!this.wallLetterMesh) {
      const geo = new THREE.PlaneGeometry(2.0, 2.0);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 2.8, -2.97);
      this.scene.add(mesh);
      this.wallLetterMesh = mesh;
    } else {
      const mat = this.wallLetterMesh.material as THREE.MeshBasicMaterial;
      if (mat.map) {
        mat.map.dispose();
      }
      this.wallLetterMesh.position.set(0, 2.8, -2.97);
      mat.map = texture;
      mat.needsUpdate = true;
    }
  }

  private buildTable(): void {
    const tableGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x563016,
      roughness: 0.35,
    });

    // Tabletop (top face at Y = 0.98)
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.6), woodMat);
    top.position.set(0, 0.94, 0);
    top.castShadow = true;
    top.receiveShadow = true;
    tableGroup.add(top);

    // Runner
    const runner = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.005, 1.62),
      new THREE.MeshStandardMaterial({ color: 0xeae5d8, roughness: 0.85 }),
    );
    runner.position.set(0, 0.9825, 0);
    runner.receiveShadow = true;
    tableGroup.add(runner);

    // 4 Legs
    const legGeo = new THREE.CylinderGeometry(0.055, 0.045, 0.92, 16);
    const legPositions = [
      [-1.15, 0.46, -0.65],
      [1.15, 0.46, -0.65],
      [-1.15, 0.46, 0.65],
      [1.15, 0.46, 0.65],
    ];
    for (const pos of legPositions) {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      leg.receiveShadow = true;
      tableGroup.add(leg);
    }

    this.scene.add(tableGroup);
  }

  /**
   * Places a loaded/cloned GLTF scene into a container with rotation applied BEFORE
   * bounding-box normalization so off-center pivots and tilts still sit cleanly
   * centered horizontally and grounded exactly at baseOffsetY.
   */
  private fitAndMountModel(
    source: THREE.Group,
    containerGroup: THREE.Group,
    targetSize: number,
    baseOffsetY: number,
    rotationY: number,
    rotationX: number,
  ): void {
    const model = source.clone(true);
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const wrapper = new THREE.Group();
    model.rotation.set(rotationX, rotationY, 0);
    wrapper.add(model);
    wrapper.updateMatrixWorld(true);

    const rawBox = new THREE.Box3().setFromObject(wrapper);
    const rawSize = rawBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z) || 1;
    const scale = targetSize / maxDim;

    wrapper.scale.setScalar(scale);
    wrapper.updateMatrixWorld(true);

    const finalBox = new THREE.Box3().setFromObject(wrapper);
    const finalCenter = finalBox.getCenter(new THREE.Vector3());
    wrapper.position.set(
      -finalCenter.x,
      -finalBox.min.y + baseOffsetY,
      -finalCenter.z,
    );

    containerGroup.add(wrapper);
  }

  private loadGltfObject(
    url: string,
    targetSize: number,
    baseOffsetY: number,
    rotationY: number = 0,
    rotationX: number = 0,
  ): THREE.Group {
    const containerGroup = new THREE.Group();
    const generation = this.levelGeneration;

    const cached = this.modelCache.get(url);
    if (cached) {
      this.fitAndMountModel(
        cached,
        containerGroup,
        targetSize,
        baseOffsetY,
        rotationY,
        rotationX,
      );
      return containerGroup;
    }

    this.beginLoad();
    this.gltfLoader.load(
      url,
      (gltf) => {
        this.endLoad();
        if (this.isDestroyed) return;
        this.modelCache.set(url, gltf.scene);
        // Guard against stale async completion after switching levels
        if (generation !== this.levelGeneration) return;
        this.fitAndMountModel(
          gltf.scene,
          containerGroup,
          targetSize,
          baseOffsetY,
          rotationY,
          rotationX,
        );
      },
      undefined,
      (err) => {
        this.endLoad();
        console.error(`Error loading model ${url}:`, err);
      },
    );
    return containerGroup;
  }

  // ==========================================
  // LEVEL 1: Lettre A (Avion, Arbre, Ananas)
  // ==========================================

  private buildAvion(): void {
    const group = new THREE.Group();
    group.name = "avion";
    group.position.set(-0.62, 0.98, 0.08);

    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.22, 0.02, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.15 }),
    );
    plinth.position.set(0, 0.01, 0);
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    group.add(plinth);

    group.add(this.loadGltfObject("/models/avion.glb", 0.38, 0.02, 0.4));

    this.scene.add(group);
    this.interactables.set("avion", group);
    this.currentLevelItems.push(group);
  }

  private buildArbre(): void {
    const group = new THREE.Group();
    group.name = "arbre";
    group.position.set(0.0, 0.98, -0.15);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.2, 0.02, 32),
      new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.75 }),
    );
    base.position.set(0, 0.01, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    group.add(this.loadGltfObject("/models/arbre.glb", 0.4, 0.02));

    this.scene.add(group);
    this.interactables.set("arbre", group);
    this.currentLevelItems.push(group);
  }

  private buildAnanas(): void {
    const group = new THREE.Group();
    group.name = "ananas";
    group.position.set(0.62, 0.98, 0.08);

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.025, 0.46),
      new THREE.MeshStandardMaterial({ color: 0xc2955f, roughness: 0.65 }),
    );
    board.position.set(0, 0.0125, 0);
    board.castShadow = true;
    board.receiveShadow = true;
    group.add(board);

    group.add(this.loadGltfObject("/models/pineapple.glb", 0.36, 0.025));

    this.scene.add(group);
    this.interactables.set("ananas", group);
    this.currentLevelItems.push(group);
  }

  // ==========================================
  // LEVEL 2: Lettre B (Bateau, Banane, Ballon)
  // ==========================================

  private buildBateau(): void {
    const group = new THREE.Group();
    group.name = "bateau";
    group.position.set(-0.62, 0.98, 0.08);

    const tray = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.22, 0.02, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.25, metalness: 0.15 }),
    );
    tray.position.set(0, 0.01, 0);
    tray.castShadow = true;
    tray.receiveShadow = true;
    group.add(tray);

    group.add(this.loadGltfObject("/models/bateau.glb", 0.38, 0.02, Math.PI / 4));

    this.scene.add(group);
    this.interactables.set("bateau", group);
    this.currentLevelItems.push(group);
  }

  private buildBanane(): void {
    const group = new THREE.Group();
    group.name = "banane";
    group.position.set(0.0, 0.98, -0.15);

    const saucer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.19, 0.018, 32),
      new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.55 }),
    );
    saucer.position.set(0, 0.009, 0);
    saucer.castShadow = true;
    saucer.receiveShadow = true;
    group.add(saucer);

    group.add(this.loadGltfObject("/models/banane.glb", 0.28, 0.018, 0.35, -0.18));

    this.scene.add(group);
    this.interactables.set("banane", group);
    this.currentLevelItems.push(group);
  }

  private buildBallon(): void {
    const group = new THREE.Group();
    group.name = "ballon";
    group.position.set(0.62, 0.98, 0.08);

    const turf = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.2, 0.018, 32),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 }),
    );
    turf.position.set(0, 0.009, 0);
    turf.castShadow = true;
    turf.receiveShadow = true;
    group.add(turf);

    group.add(this.loadGltfObject("/models/ballon.glb", 0.26, 0.018));

    this.scene.add(group);
    this.interactables.set("ballon", group);
    this.currentLevelItems.push(group);
  }

  // ==========================================
  // LEVEL 3: Lettre C (Cerise, Citron, Carotte)
  // ==========================================

  private buildCerise(): void {
    const group = new THREE.Group();
    group.name = "cerise";
    group.position.set(-0.62, 0.98, 0.08);

    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.18, 0.018, 32),
      new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.15, metalness: 0.05 }),
    );
    plate.position.set(0, 0.009, 0);
    plate.castShadow = true;
    plate.receiveShadow = true;
    group.add(plate);

    group.add(this.loadGltfObject("/models/cerise.glb", 0.26, 0.018));

    this.scene.add(group);
    this.interactables.set("cerise", group);
    this.currentLevelItems.push(group);
  }

  private buildCitron(): void {
    const group = new THREE.Group();
    group.name = "citron";
    group.position.set(0.0, 0.98, -0.15);

    const slate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.18, 0.018, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }),
    );
    slate.position.set(0, 0.009, 0);
    slate.castShadow = true;
    slate.receiveShadow = true;
    group.add(slate);

    group.add(this.loadGltfObject("/models/citron.glb", 0.22, 0.018, 0.3));

    this.scene.add(group);
    this.interactables.set("citron", group);
    this.currentLevelItems.push(group);
  }

  private buildCarotte(): void {
    const group = new THREE.Group();
    group.name = "carotte";
    group.position.set(0.62, 0.98, 0.08);

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.025, 0.46),
      new THREE.MeshStandardMaterial({ color: 0xc2955f, roughness: 0.65 }),
    );
    board.position.set(0, 0.0125, 0);
    board.castShadow = true;
    board.receiveShadow = true;
    group.add(board);

    group.add(this.loadGltfObject("/models/carotte.glb", 0.32, 0.025, 0.4, -Math.PI / 2));

    this.scene.add(group);
    this.interactables.set("carotte", group);
    this.currentLevelItems.push(group);
  }

  // --- Dynamic Level Loading ---
  public clearCurrentLevelItems(): void {
    this.levelGeneration += 1;
    for (const item of this.currentLevelItems) {
      this.scene.remove(item);
      this.interactables.delete(item.name);
      // Dispose only non-cached direct pedestal mesh (child 0); cached GLTF prototypes remain reusable
      const plinth = item.children[0] as THREE.Mesh | undefined;
      if (plinth && plinth.isMesh) {
        plinth.geometry?.dispose();
        if (Array.isArray(plinth.material)) {
          plinth.material.forEach((m) => m.dispose());
        } else {
          plinth.material?.dispose();
        }
      }
    }
    this.currentLevelItems = [];
    this.hoveredObjectId = null;
  }

  public loadLevel(levelNumber: number): void {
    this.currentLevelNumber = levelNumber;
    this.clearCurrentLevelItems();

    if (levelNumber === 1) {
      this.setWallLetter("A");
      this.buildAvion();
      this.buildArbre();
      this.buildAnanas();
    } else if (levelNumber === 2) {
      this.setWallLetter("B");
      this.buildBateau();
      this.buildBanane();
      this.buildBallon();
    } else if (levelNumber === 3) {
      this.setWallLetter("C");
      this.buildCerise();
      this.buildCitron();
      this.buildCarotte();
    }
  }

  private loadFatima(): void {
    this.beginLoad();
    this.gltfLoader.load(
      "/models/fatima.glb",
      (gltf) => {
        this.endLoad();
        if (this.isDestroyed) return;
        const model = gltf.scene;
        this.fatimaModel = model;
        model.name = "fatima";
        model.position.set(this.fatimaTargetPos.x, 0, -1.18);
        model.rotation.y = 0;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
          if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
            this.skeleton = (child as THREE.SkinnedMesh).skeleton;
          }
        });

        if (this.skeleton) {
          const names = this.skeleton.bones.map((b) => b.name);
          this.rightArmIdx = names.findIndex((n) => /rightarm$/i.test(n.replace(/_/g, "")));
          this.rightForearmIdx = names.findIndex((n) => /rightforearm$/i.test(n.replace(/_/g, "")));
          this.rightHandIdx = names.findIndex((n) => /righthand$/i.test(n.replace(/_/g, "")));
          this.leftArmIdx = names.findIndex((n) => /leftarm$/i.test(n.replace(/_/g, "")));
          this.leftForearmIdx = names.findIndex((n) => /leftforearm$/i.test(n.replace(/_/g, "")));
          this.headIdx = names.findIndex((n) => /head$/i.test(n.replace(/_/g, "")));

          this.rightIndexBones = [];
          this.rightMiddleBones = [];
          this.rightRingBones = [];
          this.rightPinkyBones = [];
          this.rightThumbBones = [];

          for (let i = 1; i <= 3; i++) {
            const idxI = names.findIndex((n) =>
              new RegExp(`righthandindex${i}$`, "i").test(n.replace(/[:_]/g, "")),
            );
            if (idxI !== -1) this.rightIndexBones.push(idxI);

            const idxM = names.findIndex((n) =>
              new RegExp(`righthandmiddle${i}$`, "i").test(n.replace(/[:_]/g, "")),
            );
            if (idxM !== -1) this.rightMiddleBones.push(idxM);

            const idxR = names.findIndex((n) =>
              new RegExp(`righthandring${i}$`, "i").test(n.replace(/[:_]/g, "")),
            );
            if (idxR !== -1) this.rightRingBones.push(idxR);

            const idxP = names.findIndex((n) =>
              new RegExp(`righthandpinky${i}$`, "i").test(n.replace(/[:_]/g, "")),
            );
            if (idxP !== -1) this.rightPinkyBones.push(idxP);

            const idxT = names.findIndex((n) =>
              new RegExp(`righthandthumb${i}$`, "i").test(n.replace(/[:_]/g, "")),
            );
            if (idxT !== -1) this.rightThumbBones.push(idxT);
          }

          this.applyPointingPose(0, 0);
        }

        this.scene.add(model);
        this.interactables.set("fatima", model);
      },
      undefined,
      (err) => {
        this.endLoad();
        console.error("Error loading Fatima GLB:", err);
      },
    );
  }

  public pointAtObject(objectId: string): void {
    this.targetObjectId = objectId;
    this.isListening = false;

    const targetObj = this.interactables.get(objectId);
    if (targetObj) {
      this.fatimaTargetPos.set(targetObj.position.x, 0, -1.18);
      this.fatimaTargetRotY = 0;
      this.targetRing.position.set(targetObj.position.x, 0.992, targetObj.position.z);
      this.targetRing.visible = true;
    }

    this.applyPointingPose(0, 0);
  }

  public setListening(listening: boolean): void {
    this.isListening = listening;
    if (listening) {
      this.isSpeaking = false;
      this.applyListeningPose(0);
    } else {
      this.applyPointingPose(0, 0);
    }
  }

  private applyPointingPose(waveArm: number, nod: number): void {
    if (!this.skeleton) return;
    const bones = this.skeleton.bones;

    if (this.leftArmIdx !== -1) {
      bones[this.leftArmIdx].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(58), 0, 0),
      );
    }
    if (this.leftForearmIdx !== -1) {
      bones[this.leftForearmIdx].quaternion.identity();
    }

    if (this.rightArmIdx !== -1) {
      bones[this.rightArmIdx].quaternion.setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(26 + waveArm * 6),
          THREE.MathUtils.degToRad(-10 + waveArm * 4),
          THREE.MathUtils.degToRad(-82 + waveArm * 5),
        ),
      );
    }

    if (this.rightForearmIdx !== -1) {
      bones[this.rightForearmIdx].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(8 + waveArm * 4), 0, 0),
      );
    }

    if (this.rightHandIdx !== -1) {
      bones[this.rightHandIdx].quaternion.setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(waveArm * 8),
          0,
          THREE.MathUtils.degToRad(waveArm * 4),
        ),
      );
    }

    if (this.headIdx !== -1) {
      bones[this.headIdx].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(-10 + nod * 6), 0, 0),
      );
    }

    for (const idx of this.rightIndexBones) {
      bones[idx].quaternion.identity();
    }

    const curlQ = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(THREE.MathUtils.degToRad(82), 0, 0),
    );
    for (const idx of this.rightMiddleBones) bones[idx].quaternion.copy(curlQ);
    for (const idx of this.rightRingBones) bones[idx].quaternion.copy(curlQ);
    for (const idx of this.rightPinkyBones) bones[idx].quaternion.copy(curlQ);

    if (this.rightThumbBones.length >= 1) {
      bones[this.rightThumbBones[0]].quaternion.setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(25),
          THREE.MathUtils.degToRad(-20),
          THREE.MathUtils.degToRad(-45),
        ),
      );
    }
    for (let i = 1; i < this.rightThumbBones.length; i++) {
      bones[this.rightThumbBones[i]].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(35), 0, 0),
      );
    }
  }

  private applyListeningPose(bob: number): void {
    if (!this.skeleton) return;
    const bones = this.skeleton.bones;

    for (const idx of this.rightIndexBones) {
      bones[idx].quaternion.identity();
    }

    const curlQ = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(THREE.MathUtils.degToRad(82), 0, 0),
    );
    for (const idx of this.rightMiddleBones) bones[idx].quaternion.copy(curlQ);
    for (const idx of this.rightRingBones) bones[idx].quaternion.copy(curlQ);
    for (const idx of this.rightPinkyBones) bones[idx].quaternion.copy(curlQ);

    if (this.rightThumbBones.length >= 1) {
      bones[this.rightThumbBones[0]].quaternion.setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(25),
          THREE.MathUtils.degToRad(-20),
          THREE.MathUtils.degToRad(-45),
        ),
      );
    }
    for (let i = 1; i < this.rightThumbBones.length; i++) {
      bones[this.rightThumbBones[i]].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(35), 0, 0),
      );
    }

    if (this.leftArmIdx !== -1) {
      bones[this.leftArmIdx].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(58), 0, 0),
      );
    }
    if (this.leftForearmIdx !== -1) {
      bones[this.leftForearmIdx].quaternion.identity();
    }

    if (this.rightArmIdx !== -1) {
      bones[this.rightArmIdx].quaternion.setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(12.8),
          0,
          THREE.MathUtils.degToRad(-40 + bob * 2),
        ),
      );
    }

    if (this.rightForearmIdx !== -1) {
      bones[this.rightForearmIdx].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(-131), 0, 0),
      );
    }

    if (this.rightHandIdx !== -1) {
      bones[this.rightHandIdx].quaternion.setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(-15),
          THREE.MathUtils.degToRad(45),
          THREE.MathUtils.degToRad(-30),
        ),
      );
    }

    if (this.headIdx !== -1) {
      bones[this.headIdx].quaternion.setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(-2 + bob * 2),
          THREE.MathUtils.degToRad(6),
          THREE.MathUtils.degToRad(6),
        ),
      );
    }
  }

  public speakGesture(durationSec: number = 3.5): void {
    this.isSpeaking = true;
    this.speakTimer = 0;
    if (this.speakTimeoutId) clearTimeout(this.speakTimeoutId);
    this.speakTimeoutId = setTimeout(() => {
      this.isSpeaking = false;
    }, durationSec * 1000);
  }

  public animateObjectBounce(objectId: string): void {
    if (objectId === "fatima") return;
    const obj = this.interactables.get(objectId);
    if (!obj) return;

    const baseScale = obj.scale.clone();
    const startTime = performance.now();
    const duration = 300;

    const animateBounce = (time: number) => {
      if (this.isDestroyed) return;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const factor = 1 + Math.sin(progress * Math.PI) * 0.22;
      obj.scale.copy(baseScale).multiplyScalar(factor);

      if (progress < 1) {
        requestAnimationFrame(animateBounce);
      } else {
        obj.scale.copy(baseScale);
      }
    };
    requestAnimationFrame(animateBounce);
  }

  // --- Bound Event Listeners (for clean teardown in destroy()) ---
  private onPointerLockChange = (): void => {
    this.isLocked = document.pointerLockElement === this.renderer.domElement;
    if (!this.isLocked) {
      this.keysPressed = {};
    }
    if (this.onLockChange) {
      this.onLockChange(this.isLocked);
    }
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.isLocked) return;
    const sens = 0.0022;
    this.fpsYaw -= e.movementX * sens;
    this.fpsPitch -= e.movementY * sens;
    this.fpsPitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.fpsPitch));
    this.updateFpsCameraRotation();
  };

  private onCanvasClick = (): void => {
    // Avoid synthetic click right after touch interaction on mobile
    if (Date.now() - this.lastTouchEndAt < 400) return;
    if (!this.isLocked) {
      this.requestLock();
    } else {
      this.triggerCenterInteraction();
    }
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    const activeTag = document.activeElement?.tagName;
    if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;
    const k = e.key.toLowerCase();
    this.keysPressed[k] = true;
    if (k === "e" || k === " ") {
      if (this.isLocked) {
        this.triggerCenterInteraction();
      }
    }
    if (k === "escape") {
      this.exitLock();
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    const activeTag = document.activeElement?.tagName;
    if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;
    this.keysPressed[e.key.toLowerCase()] = false;
  };

  private onTouchStart = (e: TouchEvent): void => {
    if (this.activeLookTouchId === null && e.changedTouches.length > 0) {
      const t = e.changedTouches[0];
      this.activeLookTouchId = t.identifier;
      this.touchLookStart = { x: t.clientX, y: t.clientY };
      this.touchStartPos = { x: t.clientX, y: t.clientY };
      this.touchStartTime = Date.now();
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    if (this.activeLookTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === this.activeLookTouchId) {
        const dx = t.clientX - this.touchLookStart.x;
        const dy = t.clientY - this.touchLookStart.y;
        this.touchLookStart = { x: t.clientX, y: t.clientY };

        const touchSens = 0.0035;
        this.fpsYaw -= dx * touchSens;
        this.fpsPitch -= dy * touchSens;
        this.fpsPitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.fpsPitch));
        this.updateFpsCameraRotation();
        if (e.cancelable) {
          e.preventDefault();
        }
        break;
      }
    }
  };

  private onTouchEnd = (e: TouchEvent): void => {
    this.lastTouchEndAt = Date.now();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === this.activeLookTouchId) {
        const elapsed = Date.now() - this.touchStartTime;
        const dist = Math.hypot(
          t.clientX - this.touchStartPos.x,
          t.clientY - this.touchStartPos.y,
        );
        if (elapsed < 300 && dist < 12) {
          this.triggerCenterInteraction();
        }
        this.activeLookTouchId = null;
        break;
      }
    }
  };

  private setupInputEvents(): void {
    const dom = this.renderer.domElement;
    dom.style.touchAction = "none";

    document.addEventListener("pointerlockchange", this.onPointerLockChange);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    dom.addEventListener("click", this.onCanvasClick);
    dom.addEventListener("touchstart", this.onTouchStart, { passive: false });
    dom.addEventListener("touchmove", this.onTouchMove, { passive: false });
    dom.addEventListener("touchend", this.onTouchEnd);
    dom.addEventListener("touchcancel", this.onTouchEnd);
  }

  private updateFpsCameraRotation(): void {
    const euler = new THREE.Euler(0, 0, 0, "YXZ");
    euler.x = this.fpsPitch;
    euler.y = this.fpsYaw;
    this.camera.quaternion.setFromEuler(euler);
  }

  private updateCenterRaycast(): void {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const candidates: THREE.Object3D[] = [];
    this.interactables.forEach((val) => candidates.push(val));

    const intersects = this.raycaster.intersectObjects(candidates, true);
    let matchedId: string | null = null;

    if (intersects.length > 0 && intersects[0].distance < 4.5) {
      let topObj: THREE.Object3D | null = intersects[0].object;
      while (topObj && topObj !== this.scene) {
        if (this.interactables.has(topObj.name)) {
          matchedId = topObj.name;
          break;
        }
        topObj = topObj.parent;
      }
    }

    if (this.hoveredObjectId !== matchedId) {
      this.hoveredObjectId = matchedId;
      if (this.onObjectHover) {
        this.onObjectHover(matchedId);
      }
    }
  }

  public triggerCenterInteraction(): void {
    if (this.hoveredObjectId) {
      this.animateObjectBounce(this.hoveredObjectId);
      if (this.onObjectClick) {
        this.onObjectClick(this.hoveredObjectId);
      }
    } else if (this.onObjectClick) {
      this.onObjectClick("");
    }
  }

  private onWindowResize = (): void => {
    if (!this.container) return;
    const w = Math.max(this.container.clientWidth, 1);
    const h = Math.max(this.container.clientHeight, 1);
    const aspect = w / h;
    this.camera.fov = aspect < 0.75 ? 72 : 65;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    // Subtle pulse on target indicator ring
    const pulse = 1 + Math.sin(performance.now() * 0.004) * 0.06;
    this.targetRing.scale.setScalar(pulse);

    // FPS Movement
    let moveZ = 0;
    let moveX = 0;

    if (this.keysPressed["w"] || this.keysPressed["arrowup"] || this.keysPressed["z"]) moveZ -= 1;
    if (this.keysPressed["s"] || this.keysPressed["arrowdown"]) moveZ += 1;
    if (this.keysPressed["a"] || this.keysPressed["arrowleft"] || this.keysPressed["q"]) moveX -= 1;
    if (this.keysPressed["d"] || this.keysPressed["arrowright"]) moveX += 1;

    if (Math.abs(this.joystickMove.y) > 0.1) moveZ += this.joystickMove.y;
    if (Math.abs(this.joystickMove.x) > 0.1) moveX += this.joystickMove.x;

    const isWalking = Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05;

    if (isWalking) {
      const forward = new THREE.Vector3(-Math.sin(this.fpsYaw), 0, -Math.cos(this.fpsYaw)).normalize();
      const right = new THREE.Vector3(Math.cos(this.fpsYaw), 0, -Math.sin(this.fpsYaw)).normalize();

      const moveDir = forward.multiplyScalar(-moveZ).add(right.multiplyScalar(moveX)).normalize();
      const nextPos = this.playerPos.clone().add(moveDir.multiplyScalar(this.moveSpeed * delta));

      nextPos.x = Math.max(-2.6, Math.min(2.6, nextPos.x));
      nextPos.z = Math.max(-2.5, Math.min(2.7, nextPos.z));

      const inTableX = Math.abs(nextPos.x) < 1.45;
      const inTableZ = Math.abs(nextPos.z) < 0.95;
      if (!inTableX || !inTableZ) {
        this.playerPos.copy(nextPos);
      }

      this.headBobTimer += delta * 10;
      this.camera.position.y = 1.58 + Math.sin(this.headBobTimer) * 0.025;
    } else {
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 1.58, delta * 8);
    }

    this.camera.position.x = this.playerPos.x;
    this.camera.position.z = this.playerPos.z;

    this.updateCenterRaycast();

    // Fatima Walking & Movement Animation
    if (this.fatimaModel) {
      const dist = this.fatimaModel.position.distanceTo(this.fatimaTargetPos);
      if (dist > 0.02) {
        this.walkTimer += delta * 8;
        this.fatimaModel.position.lerp(this.fatimaTargetPos, delta * 3.5);
        this.fatimaModel.position.y = Math.abs(Math.sin(this.walkTimer)) * 0.035;
      } else {
        this.fatimaModel.position.copy(this.fatimaTargetPos);
        this.fatimaModel.position.y = 0;
      }
      this.fatimaModel.rotation.y = THREE.MathUtils.lerp(
        this.fatimaModel.rotation.y,
        this.fatimaTargetRotY,
        delta * 5.0,
      );
    }

    // Fatima Arm & Head Gestures Animation
    if (this.skeleton) {
      if (this.isListening) {
        this.listenTimer += delta * 2.5;
        this.applyListeningPose(Math.sin(this.listenTimer) * 0.05);
      } else if (this.isSpeaking) {
        this.speakTimer += delta * 4.5;
        const waveArm = Math.sin(this.speakTimer * 3.5) * 0.45;
        const nod = Math.sin(this.speakTimer * 1.8) * 0.14;
        this.applyPointingPose(waveArm, nod);
      } else {
        this.idleTime += delta * 1.8;
        this.applyPointingPose(Math.sin(this.idleTime) * 0.02, 0);
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy(): void {
    this.isDestroyed = true;
    this.exitLock();
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.speakTimeoutId) {
      clearTimeout(this.speakTimeoutId);
      this.speakTimeoutId = null;
    }

    // Remove all document, window, and canvas event listeners
    document.removeEventListener("pointerlockchange", this.onPointerLockChange);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("resize", this.onWindowResize);

    const dom = this.renderer.domElement;
    dom.removeEventListener("click", this.onCanvasClick);
    dom.removeEventListener("touchstart", this.onTouchStart);
    dom.removeEventListener("touchmove", this.onTouchMove);
    dom.removeEventListener("touchend", this.onTouchEnd);
    dom.removeEventListener("touchcancel", this.onTouchEnd);

    // Dispose wall texture and ring resources
    if (this.wallLetterMesh) {
      const mat = this.wallLetterMesh.material as THREE.MeshBasicMaterial;
      mat.map?.dispose();
      mat.dispose();
      this.wallLetterMesh.geometry.dispose();
    }
    this.targetRing.geometry.dispose();
    (this.targetRing.material as THREE.Material).dispose();
    this.clearCurrentLevelItems();
    this.modelCache.clear();

    this.renderer.dispose();
    if (dom.parentElement) {
      dom.parentElement.removeChild(dom);
    }
  }
}
