import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export type ClickCallback = (objectId: string) => void;
export type HoverCallback = (objectId: string | null) => void;
export type ViewMode = "fps" | "orbit";

export class KitchenStage {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;
  private animFrameId: number | null = null;
  private clock: THREE.Clock = new THREE.Clock();

  // Mode: "fps" or "orbit"
  public viewMode: ViewMode = "fps";

  // 3D Objects & Raycasting
  private interactables: Map<string, THREE.Object3D> = new Map();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private onObjectClick: ClickCallback | null = null;
  private onObjectHover: HoverCallback | null = null;
  public hoveredObjectId: string | null = null;

  // FPS Camera & Movement State
  private fpsYaw: number = 0; // horizontal angle
  private fpsPitch: number = -0.15; // vertical angle (slight look-down towards table)
  private playerPos: THREE.Vector3 = new THREE.Vector3(0, 1.58, 2.3);
  private moveSpeed: number = 2.8;
  private keysPressed: Record<string, boolean> = {};
  private headBobTimer: number = 0;

  // Pointer & Drag tracking
  private isPointerDown: boolean = false;
  private pointerDownPos = { x: 0, y: 0 };
  private isPointerLocked: boolean = false;

  // Mobile virtual joystick input (-1 to 1)
  public joystickMove = { x: 0, y: 0 };

  // Fatima & Bones
  private fatimaModel: THREE.Object3D | null = null;
  private skeleton: THREE.Skeleton | null = null;
  private rightArmIdx: number = -1;
  private rightForearmIdx: number = -1;
  private rightHandIdx: number = -1;
  private leftArmIdx: number = -1;
  private leftForearmIdx: number = -1;
  private headIdx: number = -1;

  public isSpeaking: boolean = false;
  private speakTimer: number = 0;
  private idleTime: number = 0;

  // Textures
  private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

  constructor(
    container: HTMLElement,
    onObjectClick?: ClickCallback,
    onObjectHover?: HoverCallback,
    initialMode: ViewMode = "fps"
  ) {
    this.container = container;
    this.onObjectClick = onObjectClick || null;
    this.onObjectHover = onObjectHover || null;
    this.viewMode = initialMode;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // Slate-900 background

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 100);
    this.camera.position.copy(this.playerPos);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls (used in orbit mode)
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.08;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.orbitControls.minDistance = 2.0;
    this.orbitControls.maxDistance = 10.0;
    this.orbitControls.target.set(0, 0.95, 0);
    this.orbitControls.enabled = this.viewMode === "orbit";

    // 5. Lights & Environment
    this.setupLighting();

    // 6. Kitchen Elements
    this.buildRoom();
    this.buildTable();
    this.buildBread();
    this.buildMilk();
    this.loadFatima();

    // 7. Input Events
    this.setupInputEvents();
    window.addEventListener("resize", this.onWindowResize);

    // Set initial camera view
    this.setViewMode(this.viewMode);

    // 8. Start Loop
    this.animate();
  }

  public setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    if (mode === "orbit") {
      this.orbitControls.enabled = true;
      this.camera.position.set(3.8, 3.5, 4.5);
      this.orbitControls.target.set(0, 0.95, 0);
      this.orbitControls.update();
    } else {
      this.orbitControls.enabled = false;
      this.playerPos.set(0, 1.58, 2.3);
      this.fpsYaw = 0;
      this.fpsPitch = -0.15;
      this.camera.position.copy(this.playerPos);
      this.updateFpsCameraRotation();
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

    // Warm pendant table light
    const tableLight = new THREE.PointLight(0xffe2b8, 1.1, 4.5);
    tableLight.position.set(0, 2.4, 0);
    this.scene.add(tableLight);
  }

  private buildRoom(): void {
    // Parquet Floor
    const floorGeo = new THREE.BoxGeometry(6.4, 0.2, 6.4);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xb58257, roughness: 0.5 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.1, 0);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Back Wall
    const wallBackGeo = new THREE.BoxGeometry(6.4, 4, 0.2);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1ede6, roughness: 0.85 });
    const wallBack = new THREE.Mesh(wallBackGeo, wallMat);
    wallBack.position.set(0, 1.9, -3.1);
    wallBack.receiveShadow = true;
    this.scene.add(wallBack);

    // Front Wall (with opening)
    const wallFrontGeo = new THREE.BoxGeometry(6.4, 4, 0.2);
    const wallFront = new THREE.Mesh(wallFrontGeo, wallMat);
    wallFront.position.set(0, 1.9, 3.1);
    wallFront.receiveShadow = true;
    this.scene.add(wallFront);

    // Sage Green Kitchen Backsplash
    const splashGeo = new THREE.BoxGeometry(6.3, 1.2, 0.05);
    const splashMat = new THREE.MeshStandardMaterial({ color: 0x3d665f, roughness: 0.35 });
    const splash = new THREE.Mesh(splashGeo, splashMat);
    splash.position.set(0, 1.3, -2.98);
    splash.receiveShadow = true;
    this.scene.add(splash);

    // Left Wall
    const wallLeftGeo = new THREE.BoxGeometry(0.2, 4, 6.4);
    const wallLeft = new THREE.Mesh(wallLeftGeo, wallMat);
    wallLeft.position.set(-3.1, 1.9, 0);
    wallLeft.receiveShadow = true;
    this.scene.add(wallLeft);

    // Right Wall
    const wallRightGeo = new THREE.BoxGeometry(0.2, 4, 6.4);
    const wallRight = new THREE.Mesh(wallRightGeo, wallMat);
    wallRight.position.set(3.1, 1.9, 0);
    wallRight.receiveShadow = true;
    this.scene.add(wallRight);
  }

  private buildTable(): void {
    const tableGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x563016, roughness: 0.35 });

    // Tabletop
    const topGeo = new THREE.BoxGeometry(2.6, 0.08, 1.6);
    const top = new THREE.Mesh(topGeo, woodMat);
    top.position.set(0, 0.94, 0);
    top.castShadow = true;
    top.receiveShadow = true;
    tableGroup.add(top);

    // Runner
    const runnerGeo = new THREE.BoxGeometry(0.85, 0.005, 1.62);
    const runnerMat = new THREE.MeshStandardMaterial({ color: 0xeae5d8, roughness: 0.85 });
    const runner = new THREE.Mesh(runnerGeo, runnerMat);
    runner.position.set(0, 0.985, 0);
    runner.receiveShadow = true;
    tableGroup.add(runner);

    // 4 Turned Legs
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

  private buildBread(): void {
    const breadGroup = new THREE.Group();
    breadGroup.name = "pain";
    breadGroup.position.set(-0.55, 0.98, 0.1);

    // Cutting Board
    const boardGeo = new THREE.BoxGeometry(0.95, 0.03, 0.55);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0xba8c5a, roughness: 0.6 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 0.015, 0);
    board.castShadow = true;
    board.receiveShadow = true;
    breadGroup.add(board);

    // Pain de Campagne Loaf
    const crustTex = this.textureLoader.load("/models/bread_crust.png");
    const crumbTex = this.textureLoader.load("/models/bread_crumb.png");

    const loafGeo = new THREE.CapsuleGeometry(0.14, 0.42, 16, 24);
    const loafMat = new THREE.MeshStandardMaterial({
      map: crustTex,
      color: 0xc47e30,
      roughness: 0.7,
    });
    const loaf = new THREE.Mesh(loafGeo, loafMat);
    loaf.rotation.x = Math.PI / 2;
    loaf.position.set(-0.06, 0.13, -0.04);
    loaf.scale.set(1.15, 0.88, 1);
    loaf.castShadow = true;
    breadGroup.add(loaf);

    // Baker's expansion slit
    const scoreGeo = new THREE.BoxGeometry(0.04, 0.36, 0.03);
    const scoreMat = new THREE.MeshStandardMaterial({
      map: crumbTex,
      color: 0xf5eedc,
      roughness: 0.9,
    });
    const score = new THREE.Mesh(scoreGeo, scoreMat);
    score.position.set(-0.06, 0.26, -0.04);
    score.castShadow = true;
    breadGroup.add(score);

    // 2 Fresh Slices
    const sliceGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.035, 20);
    const sliceMat = new THREE.MeshStandardMaterial({
      map: crumbTex,
      color: 0xf0e6d2,
      roughness: 0.85,
    });

    const slice1 = new THREE.Mesh(sliceGeo, sliceMat);
    slice1.rotation.z = Math.PI / 2 - 0.25;
    slice1.position.set(0.22, 0.11, 0.08);
    slice1.castShadow = true;
    breadGroup.add(slice1);

    const slice2 = new THREE.Mesh(sliceGeo, sliceMat);
    slice2.rotation.z = Math.PI / 2 - 0.35;
    slice2.position.set(0.28, 0.1, 0.06);
    slice2.castShadow = true;
    breadGroup.add(slice2);

    // Bread Knife
    const bladeGeo = new THREE.BoxGeometry(0.35, 0.01, 0.035);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xdde2e6, metalness: 0.9, roughness: 0.2 });
    const knife = new THREE.Mesh(bladeGeo, bladeMat);
    knife.rotation.y = Math.PI / 4;
    knife.position.set(0.34, 0.035, 0.16);
    knife.castShadow = true;
    breadGroup.add(knife);

    this.scene.add(breadGroup);
    this.interactables.set("pain", breadGroup);
  }

  private buildMilk(): void {
    const milkGroup = new THREE.Group();
    milkGroup.name = "lait";
    milkGroup.position.set(0.55, 0.98, -0.1);

    // Glass Bottle
    const glassGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.45, 24);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      transmission: 0.7,
      thickness: 0.5,
    });
    const bottleGlass = new THREE.Mesh(glassGeo, glassMat);
    bottleGlass.position.set(-0.08, 0.225, 0);
    milkGroup.add(bottleGlass);

    // Milk inside bottle
    const fluidGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.36, 24);
    const milkMat = new THREE.MeshStandardMaterial({ color: 0xfaf8f4, roughness: 0.25 });
    const bottleMilk = new THREE.Mesh(fluidGeo, milkMat);
    bottleMilk.position.set(-0.08, 0.18, 0);
    bottleMilk.castShadow = true;
    milkGroup.add(bottleMilk);

    // Blue Bottle Cap
    const capGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.06, 24);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x2266cc, roughness: 0.3 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(-0.08, 0.46, 0);
    milkGroup.add(cap);

    // Tumbler Glass
    const tumblerGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.18, 20);
    const tumbler = new THREE.Mesh(tumblerGeo, glassMat);
    tumbler.position.set(0.16, 0.09, 0.08);
    milkGroup.add(tumbler);

    // Poured Milk in glass
    const glassMilkGeo = new THREE.CylinderGeometry(0.058, 0.05, 0.14, 20);
    const glassMilk = new THREE.Mesh(glassMilkGeo, milkMat);
    glassMilk.position.set(0.16, 0.07, 0.08);
    milkGroup.add(glassMilk);

    this.scene.add(milkGroup);
    this.interactables.set("lait", milkGroup);
  }

  private loadFatima(): void {
    const loader = new GLTFLoader();
    loader.load(
      "/models/fatima.glb",
      (gltf) => {
        const model = gltf.scene;
        this.fatimaModel = model;
        model.name = "fatima";
        model.position.set(-1.45, 0, -0.75);
        model.rotation.y = THREE.MathUtils.degToRad(50);

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
          // Case-insensitive flexible bone index matching
          this.rightArmIdx = names.findIndex((n) => /rightarm$/i.test(n.replace(/_/g, "")));
          this.rightForearmIdx = names.findIndex((n) => /rightforearm$/i.test(n.replace(/_/g, "")));
          this.rightHandIdx = names.findIndex((n) => /righthand$/i.test(n.replace(/_/g, "")));
          this.leftArmIdx = names.findIndex((n) => /leftarm$/i.test(n.replace(/_/g, "")));
          this.leftForearmIdx = names.findIndex((n) => /leftforearm$/i.test(n.replace(/_/g, "")));
          this.headIdx = names.findIndex((n) => /head$/i.test(n.replace(/_/g, "")));

          console.log("[Three.js Fatima] Bones connected:", {
            rightArm: this.rightArmIdx,
            rightForearm: this.rightForearmIdx,
            rightHand: this.rightHandIdx,
            leftArm: this.leftArmIdx,
            head: this.headIdx,
          });

          this.applyPointingPose(0, 0, 0);
        }

        this.scene.add(model);
        this.interactables.set("fatima", model);
      },
      undefined,
      (err) => console.error("Error loading Fatima GLB:", err)
    );
  }

  private applyPointingPose(waveArm: number, nod: number, waveHand: number): void {
    if (!this.skeleton) return;
    const bones = this.skeleton.bones;

    // Left arm down relaxed
    if (this.leftArmIdx !== -1) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(8), THREE.MathUtils.degToRad(5), THREE.MathUtils.degToRad(70))
      );
      bones[this.leftArmIdx].quaternion.copy(q);
    }
    if (this.leftForearmIdx !== -1) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(12), THREE.MathUtils.degToRad(-15), 0)
      );
      bones[this.leftForearmIdx].quaternion.copy(q);
    }

    // Right arm raised, actively pointing toward the table
    if (this.rightArmIdx !== -1) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(-22 + waveArm * 18),
          THREE.MathUtils.degToRad(38 + waveArm * 20),
          THREE.MathUtils.degToRad(-48 + waveArm * 14)
        )
      );
      bones[this.rightArmIdx].quaternion.copy(q);
    }
    if (this.rightForearmIdx !== -1) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(-12 + waveHand * 18),
          THREE.MathUtils.degToRad(26 + waveHand * 16),
          THREE.MathUtils.degToRad(8)
        )
      );
      bones[this.rightForearmIdx].quaternion.copy(q);
    }
    if (this.rightHandIdx !== -1) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(16 + waveHand * 28),
          THREE.MathUtils.degToRad(22 + waveHand * 22),
          THREE.MathUtils.degToRad(12)
        )
      );
      bones[this.rightHandIdx].quaternion.copy(q);
    }

    // Head nodding & looking warmly towards the player and table
    if (this.headIdx !== -1) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(-6 + nod * 12),
          THREE.MathUtils.degToRad(-12 + nod * 6),
          0
        )
      );
      bones[this.headIdx].quaternion.copy(q);
    }
  }

  public speakGesture(durationSec: number = 3.5): void {
    this.isSpeaking = true;
    this.speakTimer = 0;
    setTimeout(() => {
      this.isSpeaking = false;
    }, durationSec * 1000);
  }

  public animateObjectBounce(objectId: string): void {
    const obj = this.interactables.get(objectId);
    if (!obj) return;

    const baseScale = obj.scale.clone();
    const startTime = performance.now();
    const duration = 300;

    const animateBounce = (time: number) => {
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

  // --- Input & FPS Controls ---
  private setupInputEvents(): void {
    const dom = this.renderer.domElement;

    // Keyboard events for WASD walking & Space interact
    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      this.keysPressed[k] = true;
      if (k === "e" || k === " ") {
        this.triggerCenterInteraction();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keysPressed[e.key.toLowerCase()] = false;
    });

    // Mouse / Touch Look & Click
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      this.isPointerDown = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      this.pointerDownPos = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!this.isPointerDown) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - this.pointerDownPos.x;
      const dy = clientY - this.pointerDownPos.y;

      if (this.viewMode === "fps") {
        const lookSens = 0.0035;
        this.fpsYaw -= dx * lookSens;
        this.fpsPitch -= dy * lookSens;
        // Clamp pitch so player cannot flip upside down
        this.fpsPitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.fpsPitch));
        this.updateFpsCameraRotation();
        this.pointerDownPos = { x: clientX, y: clientY };
      }
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;
      const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
      const dist = Math.hypot(clientX - this.pointerDownPos.x, clientY - this.pointerDownPos.y);

      // Tap / Click interaction
      if (dist < 12) {
        if (this.viewMode === "fps") {
          this.triggerCenterInteraction();
        } else {
          this.handleOrbitClick(clientX, clientY);
        }
      }
    };

    dom.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    dom.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
  }

  private updateFpsCameraRotation(): void {
    const euler = new THREE.Euler(0, 0, 0, "YXZ");
    euler.x = this.fpsPitch;
    euler.y = this.fpsYaw;
    this.camera.quaternion.setFromEuler(euler);
  }

  // Crosshair Raycast forward from camera center
  private updateCenterRaycast(): void {
    if (this.viewMode !== "fps") return;

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
    }
  }

  private handleOrbitClick(clientX: number, clientY: number): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ptr = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(ptr, this.camera);
    const candidates: THREE.Object3D[] = [];
    this.interactables.forEach((val) => candidates.push(val));
    const intersects = this.raycaster.intersectObjects(candidates, true);

    if (intersects.length > 0) {
      let topObj: THREE.Object3D | null = intersects[0].object;
      let matchedId: string | null = null;
      while (topObj && topObj !== this.scene) {
        if (this.interactables.has(topObj.name)) {
          matchedId = topObj.name;
          break;
        }
        topObj = topObj.parent;
      }

      if (matchedId) {
        this.animateObjectBounce(matchedId);
        if (this.onObjectClick) {
          this.onObjectClick(matchedId);
        }
      }
    }
  }

  private onWindowResize = (): void => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    // FPS Movement
    if (this.viewMode === "fps") {
      let moveZ = 0;
      let moveX = 0;

      if (this.keysPressed["w"] || this.keysPressed["arrowup"]) moveZ -= 1;
      if (this.keysPressed["s"] || this.keysPressed["arrowdown"]) moveZ += 1;
      if (this.keysPressed["a"] || this.keysPressed["arrowleft"]) moveX -= 1;
      if (this.keysPressed["d"] || this.keysPressed["arrowright"]) moveX += 1;

      // Virtual joystick contribution
      if (Math.abs(this.joystickMove.y) > 0.1) moveZ += this.joystickMove.y;
      if (Math.abs(this.joystickMove.x) > 0.1) moveX += this.joystickMove.x;

      const isWalking = Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05;

      if (isWalking) {
        // Forward vector (projected on XZ ground plane)
        const forward = new THREE.Vector3(-Math.sin(this.fpsYaw), 0, -Math.cos(this.fpsYaw)).normalize();
        const right = new THREE.Vector3(Math.cos(this.fpsYaw), 0, -Math.sin(this.fpsYaw)).normalize();

        const moveDir = forward.multiplyScalar(-moveZ).add(right.multiplyScalar(moveX)).normalize();
        const nextPos = this.playerPos.clone().add(moveDir.multiplyScalar(this.moveSpeed * delta));

        // Kitchen Room Bounds Collision (keep player inside room)
        nextPos.x = Math.max(-2.6, Math.min(2.6, nextPos.x));
        nextPos.z = Math.max(-2.5, Math.min(2.7, nextPos.z));

        // Table collision (table is at 0, 0, size ~ 2.6 x 1.6)
        const inTableX = Math.abs(nextPos.x) < 1.45;
        const inTableZ = Math.abs(nextPos.z) < 0.95;
        if (!inTableX || !inTableZ) {
          this.playerPos.copy(nextPos);
        }

        // Head Bobbing
        this.headBobTimer += delta * 10;
        this.camera.position.y = 1.58 + Math.sin(this.headBobTimer) * 0.025;
      } else {
        this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 1.58, delta * 8);
      }

      this.camera.position.x = this.playerPos.x;
      this.camera.position.z = this.playerPos.z;

      this.updateCenterRaycast();
    } else {
      this.orbitControls.update();
    }

    // Fatima Arm & Head Gestures Animation
    if (this.skeleton) {
      if (this.isSpeaking) {
        this.speakTimer += delta * 4.8;
        const waveArm = Math.sin(this.speakTimer) * 0.24;
        const waveHand = Math.sin(this.speakTimer * 1.4) * 0.28;
        const nod = Math.sin(this.speakTimer * 1.6) * 0.12;
        this.applyPointingPose(waveArm, nod, waveHand);
      } else {
        this.idleTime += delta * 1.8;
        const breath = Math.sin(this.idleTime) * 0.04;
        this.applyPointingPose(breath, 0, 0);
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener("resize", this.onWindowResize);
    this.orbitControls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
