import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export type PharmacySelectCallback = (objectId: string) => void;
export type PharmacyHoverCallback = (objectId: string | null) => void;
export type PharmacyLoadingCallback = (isLoading: boolean) => void;

export type ItemVisualState = "idle" | "active" | "done";

interface CounterItemSpec {
  id: string;
  url: string;
  x: number;
  z: number;
  targetSize: number;
  euler: THREE.Euler;
}

const COUNTER_TOP_Y = 0.96;

const COUNTER_ITEMS: CounterItemSpec[] = [
  {
    id: "medicament",
    url: "/models/medicament.glb",
    x: -0.84,
    z: 0.14,
    targetSize: 0.27,
    euler: new THREE.Euler(0, 0.35, 0, "XYZ"),
  },
  {
    id: "pansement",
    url: "/models/pansement.glb",
    x: -0.28,
    z: 0.18,
    targetSize: 0.30,
    euler: new THREE.Euler(-0.52, 0.55, 0, "XYZ"),
  },
  {
    id: "ordonnance",
    url: "/models/ordonnance.glb",
    x: 0.28,
    z: 0.18,
    targetSize: 0.31,
    // +X is the white prescription paper side; -PI/2 around Y turns +X to +Z, then -0.35 around X tilts it toward the viewer
    euler: new THREE.Euler(-0.36, -Math.PI / 2, 0, "XYZ"),
  },
  {
    id: "trousse",
    url: "/models/trousse.glb",
    x: 0.84,
    z: 0.14,
    targetSize: 0.34,
    // Red cross already faces +Z
    euler: new THREE.Euler(0, -0.25, 0, "XYZ"),
  },
];

/**
 * Non-FPS Direct-Touch 3D Diorama Stage for Room 2 ("À la Pharmacie").
 * Inspired by "J'apprends": zero FPS crosshair, zero pointer lock, zero joystick.
 * Users tap directly on 3D pharmacy objects on the counter or on Fatima to interact.
 */
export class PharmacyStage {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private clock: THREE.Clock = new THREE.Clock();
  private gltfLoader: GLTFLoader = new GLTFLoader();
  private isDestroyed: boolean = false;
  private pendingLoads: number = 0;

  // Callbacks
  private onSelect: PharmacySelectCallback | null = null;
  private onHover: PharmacyHoverCallback | null = null;
  private onLoadingChange: PharmacyLoadingCallback | null = null;

  // Interactable objects & glowing counter mats
  private interactables: Map<string, THREE.Object3D> = new Map();
  private itemRings: Map<string, THREE.Mesh> = new Map();
  private itemVisualStates: Map<string, ItemVisualState> = new Map();
  private itemBaseY: Map<string, number> = new Map();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private pointerNdc: THREE.Vector2 = new THREE.Vector2(99, 99);
  public hoveredId: string | null = null;

  // Smooth non-FPS cinematic camera framing + gentle horizontal parallax
  private camTargetPos: THREE.Vector3 = new THREE.Vector3(0, 1.56, 2.28);
  private camLookTarget: THREE.Vector3 = new THREE.Vector3(0, 1.14, -0.1);
  private camCurrentLook: THREE.Vector3 = new THREE.Vector3(0, 1.14, -0.1);
  private panOffset: number = 0;
  private targetPanOffset: number = 0;
  private focusedObjectId: string | null = null;

  // Pointer drag vs tap detection
  private isDragging: boolean = false;
  private dragPointerId: number | null = null;
  private dragStartPos = { x: 0, y: 0 };
  private dragLastX: number = 0;
  private dragMovedPx: number = 0;

  // Fatima & Bones
  private fatimaModel: THREE.Object3D | null = null;
  private skeleton: THREE.Skeleton | null = null;
  private rightArmIdx: number = -1;
  private rightForearmIdx: number = -1;
  private rightHandIdx: number = -1;
  private leftArmIdx: number = -1;
  private leftForearmIdx: number = -1;
  private headIdx: number = -1;
  private rightIndexBones: number[] = [];
  private rightMiddleBones: number[] = [];
  private rightRingBones: number[] = [];
  private rightPinkyBones: number[] = [];
  private rightThumbBones: number[] = [];

  private fatimaTargetPos: THREE.Vector3 = new THREE.Vector3(0, 0, -0.92);
  private walkTimer: number = 0;
  public isSpeaking: boolean = false;
  public isListening: boolean = false;
  private speakTimer: number = 0;
  private speakTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private listenTimer: number = 0;
  private idleTime: number = 0;

  // Animated green pharmacy cross glow
  private crossLight: THREE.PointLight | null = null;

  constructor(
    container: HTMLElement,
    onSelect?: PharmacySelectCallback,
    onHover?: PharmacyHoverCallback,
    onLoadingChange?: PharmacyLoadingCallback,
  ) {
    this.container = container;
    this.onSelect = onSelect || null;
    this.onHover = onHover || null;
    this.onLoadingChange = onLoadingChange || null;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdbece5);

    const w = Math.max(container.clientWidth, 1);
    const h = Math.max(container.clientHeight, 1);
    const aspect = w / h;
    this.camera = new THREE.PerspectiveCamera(this.computeFov(aspect), aspect, 0.1, 60);
    this.updateDefaultCameraFraming(aspect);
    this.camera.position.copy(this.camTargetPos);
    this.camera.lookAt(this.camCurrentLook);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    this.setupLighting();
    this.buildPharmacyRoom();
    this.buildCounter();
    this.loadCounterItems();
    this.loadFatima();
    this.setupPointerEvents();
    window.addEventListener("resize", this.onWindowResize);

    this.animate();
  }

  private computeFov(aspect: number): number {
    if (aspect < 0.65) return 66;
    if (aspect < 0.9) return 58;
    return 46;
  }

  private updateDefaultCameraFraming(aspect: number): void {
    if (this.focusedObjectId) return;
    if (aspect < 0.72) {
      // Portrait phone: step slightly back so all 4 counter objects + Fatima fit comfortably
      this.camTargetPos.set(0, 1.62, 2.58);
      this.camLookTarget.set(0, 1.08, -0.05);
    } else {
      this.camTargetPos.set(0, 1.54, 2.25);
      this.camLookTarget.set(0, 1.14, -0.12);
    }
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

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0xf6fffb, 1.05);
    this.scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xc7e2d7, 0.75);
    this.scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.35);
    keyLight.position.set(3.2, 6.2, 3.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 18;
    const d = 3.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0004;
    this.scene.add(keyLight);

    const counterSpot = new THREE.PointLight(0xffffff, 0.9, 5.5);
    counterSpot.position.set(0, 2.45, 0.55);
    this.scene.add(counterSpot);

    this.crossLight = new THREE.PointLight(0x10b981, 0.85, 3.6);
    this.crossLight.position.set(0, 2.45, -2.0);
    this.scene.add(this.crossLight);
  }

  private buildPharmacyRoom(): void {
    // Clean pale terrazzo pharmacy floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(7.0, 0.2, 7.0),
      new THREE.MeshStandardMaterial({ color: 0xe6efe9, roughness: 0.4 }),
    );
    floor.position.set(0, -0.1, 0);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Bright clinical-warm white walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8faf9, roughness: 0.85 });

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.0, 4.2, 0.2), wallMat);
    backWall.position.set(0, 2.0, -2.6);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 7.0), wallMat);
    leftWall.position.set(-3.4, 2.0, 0);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 7.0), wallMat);
    rightWall.position.set(3.4, 2.0, 0);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // Soft mint-emerald architectural wall stripe behind Fatima
    const mintBand = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 1.25, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.45 }),
    );
    mintBand.position.set(0, 1.32, -2.48);
    mintBand.receiveShadow = true;
    this.scene.add(mintBand);

    // Architectural shelving ledges on left & right of back wall (clean pharmacy interior framing)
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0xd9b99b, roughness: 0.55 });
    for (const sideX of [-1.75, 1.75]) {
      for (const shelfY of [1.55, 2.1]) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.22), shelfMat);
        shelf.position.set(sideX, shelfY, -2.38);
        shelf.castShadow = true;
        shelf.receiveShadow = true;
        this.scene.add(shelf);
      }
    }

    // Iconic French Pharmacy Sign + Glowing Green Cross on the Back Wall
    this.buildPharmacySign();
  }

  private buildPharmacySign(): void {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 1024, 512);

    // Rounded sign pill
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(15, 118, 110, 0.22)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.roundRect(64, 96, 896, 320, 64);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Emerald border
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 14;
    ctx.stroke();

    // Glowing French Green Cross on left of sign
    const cx = 210;
    const cy = 256;
    ctx.fillStyle = "#059669";
    ctx.beginPath();
    ctx.roundRect(cx - 28, cy - 82, 56, 164, 14);
    ctx.roundRect(cx - 82, cy - 28, 164, 56, 14);
    ctx.fill();

    // Inner bright highlight cross
    ctx.fillStyle = "#34d399";
    ctx.beginPath();
    ctx.roundRect(cx - 14, cy - 64, 28, 128, 8);
    ctx.roundRect(cx - 64, cy - 14, 128, 28, 8);
    ctx.fill();

    // "PHARMACIE" typography
    ctx.fillStyle = "#064e3b";
    ctx.font = "900 104px 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("PHARMACIE", 328, 260);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;

    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 1.15),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
    );
    signMesh.position.set(0, 2.52, -2.47);
    this.scene.add(signMesh);
  }

  private buildCounter(): void {
    const counterGroup = new THREE.Group();

    // Main white pharmacy counter body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.92, 0.95),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 }),
    );
    body.position.set(0, 0.46, 0.05);
    body.castShadow = true;
    body.receiveShadow = true;
    counterGroup.add(body);

    // Emerald front accent panel
    const accent = new THREE.Mesh(
      new THREE.BoxGeometry(2.35, 0.56, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 }),
    );
    accent.position.set(0, 0.46, 0.53);
    counterGroup.add(accent);

    // Warm light-oak countertop (top face at Y = 0.96)
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(2.74, 0.06, 1.1),
      new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.45 }),
    );
    top.position.set(0, 0.93, 0.05);
    top.castShadow = true;
    top.receiveShadow = true;
    counterGroup.add(top);

    this.scene.add(counterGroup);
  }

  private loadCounterItems(): void {
    for (const spec of COUNTER_ITEMS) {
      const group = new THREE.Group();
      group.name = spec.id;
      group.position.set(spec.x, COUNTER_TOP_Y, spec.z);
      this.itemBaseY.set(spec.id, COUNTER_TOP_Y);
      this.itemVisualStates.set(spec.id, "idle");

      // Subtle ceramic presentation mat
      const matDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.21, 0.2, 0.016, 36),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.05 }),
      );
      matDisc.position.set(0, 0.008, 0);
      matDisc.castShadow = true;
      matDisc.receiveShadow = true;
      group.add(matDisc);

      // Luminous status ring around the mat (idle: mint, active: amber, done: emerald)
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.215, 0.245, 42),
        new THREE.MeshBasicMaterial({
          color: 0x99f6e4,
          transparent: true,
          opacity: 0.65,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, 0.018, 0);
      group.add(ring);
      this.itemRings.set(spec.id, ring);

      // Generous invisible touch hitbox so small items are effortless to tap on phones
      const hitbox = new THREE.Mesh(
        new THREE.CylinderGeometry(0.23, 0.23, 0.42, 16),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      hitbox.position.set(0, 0.21, 0);
      group.add(hitbox);

      // Load genuine ready-made GLB model
      this.beginLoad();
      this.gltfLoader.load(
        spec.url,
        (gltf) => {
          this.endLoad();
          if (this.isDestroyed) return;
          const model = gltf.scene;
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // Apply orientation BEFORE bounding-box normalization
          const wrapper = new THREE.Group();
          model.rotation.copy(spec.euler);
          wrapper.add(model);
          wrapper.updateMatrixWorld(true);

          const rawBox = new THREE.Box3().setFromObject(wrapper);
          const rawSize = rawBox.getSize(new THREE.Vector3());
          const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z) || 1;
          const scale = spec.targetSize / maxDim;

          wrapper.scale.setScalar(scale);
          wrapper.updateMatrixWorld(true);

          const finalBox = new THREE.Box3().setFromObject(wrapper);
          const finalCenter = finalBox.getCenter(new THREE.Vector3());
          wrapper.position.set(
            -finalCenter.x,
            -finalBox.min.y + 0.018,
            -finalCenter.z,
          );
          group.add(wrapper);
        },
        undefined,
        (err) => {
          this.endLoad();
          console.error(`Error loading pharmacy model ${spec.url}:`, err);
        },
      );

      this.scene.add(group);
      this.interactables.set(spec.id, group);
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
        model.position.copy(this.fatimaTargetPos);
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

          this.applyWelcomePose(0, 0);
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

  // --- Public Controls for the J'apprends Lesson Flow ---

  public setItemState(objectId: string, state: ItemVisualState): void {
    this.itemVisualStates.set(objectId, state);
    const ring = this.itemRings.get(objectId);
    if (!ring) return;
    const mat = ring.material as THREE.MeshBasicMaterial;
    if (state === "active") {
      mat.color.setHex(0xfbbf24); // Amber spotlight
      mat.opacity = 0.92;
    } else if (state === "done") {
      mat.color.setHex(0x10b981); // Emerald completed
      mat.opacity = 0.85;
    } else {
      mat.color.setHex(0x99f6e4); // Soft mint
      mat.opacity = 0.55;
    }
  }

  public focusObject(objectId: string | null): void {
    this.focusedObjectId = objectId;
    if (!objectId) {
      this.fatimaTargetPos.set(0, 0, -0.92);
      const aspect = this.camera.aspect || 1;
      this.updateDefaultCameraFraming(aspect);
      return;
    }

    const obj = this.interactables.get(objectId);
    if (!obj) return;
    const tx = obj.position.x;
    const tz = obj.position.z;

    // Fatima slides smoothly behind the focused item
    this.fatimaTargetPos.set(THREE.MathUtils.clamp(tx * 0.72, -0.75, 0.75), 0, -0.92);

    // Camera eases gently toward the item while keeping Fatima visible behind it
    const isPortrait = this.camera.aspect < 0.75;
    this.camTargetPos.set(tx * 0.55, isPortrait ? 1.54 : 1.46, isPortrait ? 2.05 : 1.78);
    this.camLookTarget.set(tx * 0.72, 1.12, tz - 0.12);
  }

  public speakGesture(durationSec: number = 2.6): void {
    this.isSpeaking = true;
    this.speakTimer = 0;
    if (this.speakTimeoutId) clearTimeout(this.speakTimeoutId);
    this.speakTimeoutId = setTimeout(() => {
      this.isSpeaking = false;
    }, durationSec * 1000);
  }

  public setListening(listening: boolean): void {
    this.isListening = listening;
    if (listening) {
      this.isSpeaking = false;
      this.applyListeningPose(0);
    } else {
      this.applyWelcomePose(0, 0);
    }
  }

  public animateBounce(objectId: string): void {
    if (objectId === "fatima") return;
    const obj = this.interactables.get(objectId);
    if (!obj) return;
    const baseScale = new THREE.Vector3(1, 1, 1);
    const startTime = performance.now();
    const duration = 320;

    const tick = (now: number) => {
      if (this.isDestroyed) return;
      const p = Math.min((now - startTime) / duration, 1);
      const factor = 1 + Math.sin(p * Math.PI) * 0.24;
      obj.scale.copy(baseScale).multiplyScalar(factor);
      if (p < 1) requestAnimationFrame(tick);
      else obj.scale.copy(baseScale);
    };
    requestAnimationFrame(tick);
  }

  public animateShake(objectId: string): void {
    const obj = this.interactables.get(objectId);
    const spec = COUNTER_ITEMS.find((c) => c.id === objectId);
    if (!obj || !spec) return;
    const startTime = performance.now();
    const duration = 360;

    const tick = (now: number) => {
      if (this.isDestroyed) return;
      const p = Math.min((now - startTime) / duration, 1);
      obj.position.x = spec.x + Math.sin(p * Math.PI * 5) * 0.04 * (1 - p);
      if (p < 1) requestAnimationFrame(tick);
      else obj.position.x = spec.x;
    };
    requestAnimationFrame(tick);
  }

  // --- Fatima Poses ---

  private applyWelcomePose(waveArm: number, nod: number): void {
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
        new THREE.Euler(THREE.MathUtils.degToRad(waveArm * 8), 0, THREE.MathUtils.degToRad(waveArm * 4)),
      );
    }
    if (this.headIdx !== -1) {
      bones[this.headIdx].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(-8 + nod * 7), 0, 0),
      );
    }

    for (const idx of this.rightIndexBones) bones[idx].quaternion.identity();
    const curlQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(82), 0, 0));
    for (const idx of this.rightMiddleBones) bones[idx].quaternion.copy(curlQ);
    for (const idx of this.rightRingBones) bones[idx].quaternion.copy(curlQ);
    for (const idx of this.rightPinkyBones) bones[idx].quaternion.copy(curlQ);

    if (this.rightThumbBones.length >= 1) {
      bones[this.rightThumbBones[0]].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(25), THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(-45)),
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

    for (const idx of this.rightIndexBones) bones[idx].quaternion.identity();
    const curlQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(82), 0, 0));
    for (const idx of this.rightMiddleBones) bones[idx].quaternion.copy(curlQ);
    for (const idx of this.rightRingBones) bones[idx].quaternion.copy(curlQ);
    for (const idx of this.rightPinkyBones) bones[idx].quaternion.copy(curlQ);

    if (this.leftArmIdx !== -1) {
      bones[this.leftArmIdx].quaternion.setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(58), 0, 0));
    }
    if (this.leftForearmIdx !== -1) bones[this.leftForearmIdx].quaternion.identity();
    if (this.rightArmIdx !== -1) {
      bones[this.rightArmIdx].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(12.8), 0, THREE.MathUtils.degToRad(-40 + bob * 2)),
      );
    }
    if (this.rightForearmIdx !== -1) {
      bones[this.rightForearmIdx].quaternion.setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(-131), 0, 0));
    }
    if (this.rightHandIdx !== -1) {
      bones[this.rightHandIdx].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(-15), THREE.MathUtils.degToRad(45), THREE.MathUtils.degToRad(-30)),
      );
    }
    if (this.headIdx !== -1) {
      bones[this.headIdx].quaternion.setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(-2 + bob * 2), THREE.MathUtils.degToRad(6), THREE.MathUtils.degToRad(6)),
      );
    }
  }

  // --- Direct Tap / Click Raycasting & Subtle Parallax ---

  private pickObjectAtClient(clientX: number, clientY: number): string | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    this.pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    const candidates: THREE.Object3D[] = [];
    this.interactables.forEach((v) => candidates.push(v));
    const hits = this.raycaster.intersectObjects(candidates, true);

    for (const hit of hits) {
      let node: THREE.Object3D | null = hit.object;
      while (node && node !== this.scene) {
        if (this.interactables.has(node.name)) {
          return node.name;
        }
        node = node.parent;
      }
    }
    return null;
  }

  private onPointerDown = (e: PointerEvent): void => {
    this.isDragging = true;
    this.dragPointerId = e.pointerId;
    this.dragStartPos = { x: e.clientX, y: e.clientY };
    this.dragLastX = e.clientX;
    this.dragMovedPx = 0;
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (this.isDragging && e.pointerId === this.dragPointerId) {
      const dx = e.clientX - this.dragLastX;
      this.dragLastX = e.clientX;
      this.dragMovedPx = Math.hypot(
        e.clientX - this.dragStartPos.x,
        e.clientY - this.dragStartPos.y,
      );
      // Gentle horizontal parallax pan (±0.42m)
      this.targetPanOffset = THREE.MathUtils.clamp(this.targetPanOffset - dx * 0.0022, -0.42, 0.42);
      return;
    }

    if (e.pointerType === "mouse") {
      const hit = this.pickObjectAtClient(e.clientX, e.clientY);
      if (hit !== this.hoveredId) {
        this.hoveredId = hit;
        this.renderer.domElement.style.cursor = hit ? "pointer" : "grab";
        this.onHover?.(hit);
      }
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.dragPointerId) return;
    const moved = this.dragMovedPx;
    this.isDragging = false;
    this.dragPointerId = null;

    if (moved < 14) {
      const hit = this.pickObjectAtClient(e.clientX, e.clientY);
      if (hit) {
        this.animateBounce(hit);
        this.onSelect?.(hit);
      }
    }
  };

  private onPointerCancel = (): void => {
    this.isDragging = false;
    this.dragPointerId = null;
  };

  private setupPointerEvents(): void {
    const dom = this.renderer.domElement;
    dom.style.touchAction = "none";
    dom.style.cursor = "grab";
    dom.addEventListener("pointerdown", this.onPointerDown);
    dom.addEventListener("pointermove", this.onPointerMove);
    dom.addEventListener("pointerup", this.onPointerUp);
    dom.addEventListener("pointercancel", this.onPointerCancel);
  }

  private onWindowResize = (): void => {
    if (!this.container) return;
    const w = Math.max(this.container.clientWidth, 1);
    const h = Math.max(this.container.clientHeight, 1);
    const aspect = w / h;
    this.camera.fov = this.computeFov(aspect);
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.updateDefaultCameraFraming(aspect);
    this.renderer.setSize(w, h);
  };

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const now = performance.now() * 0.001;

    // Gentle spring return of parallax offset when not dragging
    if (!this.isDragging) {
      this.targetPanOffset = THREE.MathUtils.lerp(this.targetPanOffset, 0, delta * 1.4);
    }
    this.panOffset = THREE.MathUtils.lerp(this.panOffset, this.targetPanOffset, delta * 6);

    // Smooth cinematic camera easing
    const desiredCamPos = this.camTargetPos.clone();
    desiredCamPos.x += this.panOffset;
    this.camera.position.lerp(desiredCamPos, delta * 4.5);
    this.camCurrentLook.lerp(this.camLookTarget, delta * 5.0);
    this.camera.lookAt(this.camCurrentLook);

    // Subtle glowing pharmacy cross breath
    if (this.crossLight) {
      this.crossLight.intensity = 0.75 + Math.sin(now * 2.2) * 0.18;
    }

    // Animate counter item rings & hover float
    for (const spec of COUNTER_ITEMS) {
      const obj = this.interactables.get(spec.id);
      const ring = this.itemRings.get(spec.id);
      const state = this.itemVisualStates.get(spec.id) || "idle";
      const baseY = this.itemBaseY.get(spec.id) ?? COUNTER_TOP_Y;

      if (obj) {
        const isHighlighted = this.hoveredId === spec.id || state === "active";
        const targetY = isHighlighted ? baseY + 0.025 + Math.sin(now * 3.5) * 0.01 : baseY;
        obj.position.y = THREE.MathUtils.lerp(obj.position.y, targetY, delta * 8);
      }

      if (ring) {
        const pulse = state === "active" || this.hoveredId === spec.id ? 1 + Math.sin(now * 5.0) * 0.08 : 1.0;
        ring.scale.setScalar(pulse);
      }
    }

    // Fatima movement & gestures
    if (this.fatimaModel) {
      const dist = this.fatimaModel.position.distanceTo(this.fatimaTargetPos);
      if (dist > 0.02) {
        this.walkTimer += delta * 7.5;
        this.fatimaModel.position.lerp(this.fatimaTargetPos, delta * 3.5);
        this.fatimaModel.position.y = Math.abs(Math.sin(this.walkTimer)) * 0.028;
      } else {
        this.fatimaModel.position.copy(this.fatimaTargetPos);
        this.fatimaModel.position.y = 0;
      }
    }

    if (this.skeleton) {
      if (this.isListening) {
        this.listenTimer += delta * 2.5;
        this.applyListeningPose(Math.sin(this.listenTimer) * 0.05);
      } else if (this.isSpeaking) {
        this.speakTimer += delta * 4.5;
        this.applyWelcomePose(Math.sin(this.speakTimer * 3.2) * 0.42, Math.sin(this.speakTimer * 1.8) * 0.14);
      } else {
        this.idleTime += delta * 1.8;
        this.applyWelcomePose(Math.sin(this.idleTime) * 0.02, 0);
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy(): void {
    this.isDestroyed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.speakTimeoutId) {
      clearTimeout(this.speakTimeoutId);
      this.speakTimeoutId = null;
    }

    window.removeEventListener("resize", this.onWindowResize);
    const dom = this.renderer.domElement;
    dom.removeEventListener("pointerdown", this.onPointerDown);
    dom.removeEventListener("pointermove", this.onPointerMove);
    dom.removeEventListener("pointerup", this.onPointerUp);
    dom.removeEventListener("pointercancel", this.onPointerCancel);

    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });

    this.renderer.dispose();
    if (dom.parentElement) {
      dom.parentElement.removeChild(dom);
    }
  }
}
