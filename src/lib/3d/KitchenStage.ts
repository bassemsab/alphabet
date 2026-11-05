import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export type ClickCallback = (objectId: string) => void;

export class KitchenStage {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private animFrameId: number | null = null;
  private clock: THREE.Clock = new THREE.Clock();

  // 3D Objects
  private interactables: Map<string, THREE.Object3D> = new Map();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private pointer: THREE.Vector2 = new THREE.Vector2();
  private onObjectClick: ClickCallback | null = null;

  // Touch/Mouse drag vs click tracking
  private pointerDownPos: { x: number; y: number } = { x: 0, y: 0 };
  private isPointerDown: boolean = false;

  // Fatima & Bones
  private fatimaModel: THREE.Object3D | null = null;
  private skeleton: THREE.Skeleton | null = null;
  private rightArmIdx: number = -1;
  private rightForearmIdx: number = -1;
  private rightHandIdx: number = -1;
  private leftArmIdx: number = -1;
  private leftForearmIdx: number = -1;
  private headIdx: number = -1;

  private isSpeaking: boolean = false;
  private speakTimer: number = 0;
  private idleTime: number = 0;

  // Textures
  private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

  constructor(container: HTMLElement, onObjectClick?: ClickCallback) {
    this.container = container;
    this.onObjectClick = onObjectClick || null;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeef2f6);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    this.camera.position.set(4.2, 3.8, 5.2);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    // 4. Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below floor
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 12.0;
    this.controls.target.set(-0.2, 0.9, 0);

    // 5. Lights & Environment
    this.setupLighting();

    // 6. Build the Kitchen Diorama
    this.buildRoom();
    this.buildTable();
    this.buildBread();
    this.buildMilk();
    this.loadFatima();

    // 7. Event Listeners
    this.setupInputEvents();
    window.addEventListener("resize", this.onWindowResize);

    // 8. Start Loop
    this.animate();
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0xfff6ea, 0.9);
    this.scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xddeeff, 0x554433, 0.6);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffeedd, 1.4);
    sun.position.set(5, 8, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 25;
    const d = 4.5;
    sun.shadow.camera.left = -d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = -d;
    sun.shadow.bias = -0.0005;
    this.scene.add(sun);

    // Warm table accent light
    const tableLight = new THREE.PointLight(0xffecd0, 0.8, 4);
    tableLight.position.set(0, 2.5, 0);
    this.scene.add(tableLight);
  }

  private buildRoom(): void {
    // Parquet Floor
    const floorGeo = new THREE.BoxGeometry(6, 0.2, 6);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xb88860, roughness: 0.55 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.1, 0);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Back Wall
    const wallBackGeo = new THREE.BoxGeometry(6, 4, 0.2);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.85 });
    const wallBack = new THREE.Mesh(wallBackGeo, wallMat);
    wallBack.position.set(0, 1.9, -2.9);
    wallBack.receiveShadow = true;
    this.scene.add(wallBack);

    // Sage Green Kitchen Backsplash
    const splashGeo = new THREE.BoxGeometry(5.9, 1.1, 0.05);
    const splashMat = new THREE.MeshStandardMaterial({ color: 0x487068, roughness: 0.35 });
    const splash = new THREE.Mesh(splashGeo, splashMat);
    splash.position.set(0, 1.3, -2.78);
    splash.receiveShadow = true;
    this.scene.add(splash);

    // Left Wall
    const wallLeftGeo = new THREE.BoxGeometry(0.2, 4, 6);
    const wallLeft = new THREE.Mesh(wallLeftGeo, wallMat);
    wallLeft.position.set(-2.9, 1.9, 0);
    wallLeft.receiveShadow = true;
    this.scene.add(wallLeft);
  }

  private buildTable(): void {
    const tableGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5a341a, roughness: 0.35 });

    // Tabletop
    const topGeo = new THREE.BoxGeometry(2.6, 0.08, 1.6);
    const top = new THREE.Mesh(topGeo, woodMat);
    top.position.set(0, 0.94, 0);
    top.castShadow = true;
    top.receiveShadow = true;
    tableGroup.add(top);

    // Table Runner
    const runnerGeo = new THREE.BoxGeometry(0.85, 0.005, 1.62);
    const runnerMat = new THREE.MeshStandardMaterial({ color: 0xe8e4d8, roughness: 0.85 });
    const runner = new THREE.Mesh(runnerGeo, runnerMat);
    runner.position.set(0, 0.985, 0);
    runner.receiveShadow = true;
    tableGroup.add(runner);

    // 4 Table Legs
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

    // Loaf (Pain de Campagne)
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

    // Expansion score along top
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
        model.position.set(-1.35, 0, -0.85);
        model.rotation.y = THREE.MathUtils.degToRad(55);
        model.scale.set(1, 1, 1);

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
          this.rightArmIdx = names.indexOf("mixamorig_RightArm");
          this.rightForearmIdx = names.indexOf("mixamorig_RightForeArm");
          this.rightHandIdx = names.indexOf("mixamorig_RightHand");
          this.leftArmIdx = names.indexOf("mixamorig_LeftArm");
          this.leftForearmIdx = names.indexOf("mixamorig_LeftForeArm");
          this.headIdx = names.indexOf("mixamorig_Head");

          this.applyPointingPose(0, 0, 0);
        }

        this.scene.add(model);
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

    // Right arm raised and pointing to table
    if (this.rightArmIdx !== -1) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(-20 + waveArm * 16),
          THREE.MathUtils.degToRad(35 + waveArm * 18),
          THREE.MathUtils.degToRad(-50 + waveArm * 12)
        )
      );
      bones[this.rightArmIdx].quaternion.copy(q);
    }
    if (this.rightForearmIdx !== -1) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(-10 + waveHand * 15),
          THREE.MathUtils.degToRad(28 + waveHand * 12),
          THREE.MathUtils.degToRad(10)
        )
      );
      bones[this.rightForearmIdx].quaternion.copy(q);
    }
    if (this.rightHandIdx !== -1) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(15 + waveHand * 25),
          THREE.MathUtils.degToRad(20 + waveHand * 20),
          THREE.MathUtils.degToRad(10)
        )
      );
      bones[this.rightHandIdx].quaternion.copy(q);
    }

    // Head nodding & looking warmly towards table
    if (this.headIdx !== -1) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(-6 + nod * 12),
          THREE.MathUtils.degToRad(-14 + nod * 6),
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
    const duration = 320;

    const animateBounce = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Sine bounce curve
      const factor = 1 + Math.sin(progress * Math.PI) * 0.25;
      obj.scale.copy(baseScale).multiplyScalar(factor);

      if (progress < 1) {
        requestAnimationFrame(animateBounce);
      } else {
        obj.scale.copy(baseScale);
      }
    };
    requestAnimationFrame(animateBounce);
  }

  private setupInputEvents(): void {
    const dom = this.renderer.domElement;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      this.isPointerDown = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      this.pointerDownPos = { x: clientX, y: clientY };
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;

      const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
      const dist = Math.hypot(clientX - this.pointerDownPos.x, clientY - this.pointerDownPos.y);

      // Only treat as click if pointer moved less than 15px (not a drag/rotate)
      if (dist < 15) {
        this.handleClick(clientX, clientY);
      }
    };

    dom.addEventListener("mousedown", onPointerDown);
    dom.addEventListener("mouseup", onPointerUp);
    dom.addEventListener("touchstart", onPointerDown, { passive: true });
    dom.addEventListener("touchend", onPointerUp);
  }

  private handleClick(clientX: number, clientY: number): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const candidates: THREE.Object3D[] = [];
    this.interactables.forEach((val) => candidates.push(val));

    const intersects = this.raycaster.intersectObjects(candidates, true);

    if (intersects.length > 0) {
      let topObj: THREE.Object3D | null = intersects[0].object;
      let matchedId: string | null = null;

      while (topObj && topObj !== this.scene) {
        if (topObj.name === "pain" || topObj.name === "lait") {
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
    const delta = this.clock.getDelta();

    this.controls.update();

    // Fatima animation
    if (this.skeleton) {
      if (this.isSpeaking) {
        this.speakTimer += delta * 4.5;
        const waveArm = Math.sin(this.speakTimer) * 0.22;
        const waveHand = Math.sin(this.speakTimer * 1.3) * 0.25;
        const nod = Math.sin(this.speakTimer * 1.5) * 0.1;
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
    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
