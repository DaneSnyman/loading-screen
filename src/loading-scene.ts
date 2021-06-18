import {
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class LoadingScene {
  private camera: PerspectiveCamera;
  private scene: Scene;
  private pointLight: PointLight;
  private renderer: WebGLRenderer;
  private shiba: GLTF;
  private planet: GLTF;
  private readonly speed = Math.floor(Math.random() * (1400 - 1000) + 1000);

  constructor(nStars: number) {
    this.scene = new Scene();
    this.addCamera();
    this.addLight();
    this.loadModels();
    this.starField(nStars);
    this.setupRenderer();
    this.resizeListener();
  }

  animationLoop(): void {
    const time = Date.now();
    if (this.shiba?.scene) {
      this.shiba.scene.rotation.x = time / 2000;
      this.shiba.scene.rotation.y = time / 1000;
      this.shiba.scene.rotation.z = time / 1000;
      const scale = Math.sin(time / this.speed);
      this.shiba.scene.scale.setScalar(scale < 0 ? -scale : scale);
    }
    if (this.planet?.scene) {
      this.planet.scene.rotation.x = time / 4000;
      this.planet.scene.rotation.y = time / 2000;
    }
    this.renderer.render(this.scene, this.camera);
  }

  private setupRenderer(): void {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  private addCamera(): void {
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    this.camera.position.z = 1;
  }

  private addLight(): void {
    this.pointLight = new PointLight(0xffffff);
    this.pointLight.position.set(5, 5, 5);
    this.scene.add(this.pointLight);
  }

  private loadModels(): void {
    const loader = new GLTFLoader();

    loader.load(
      "./assets/models/shiba/scene.gltf",
      (gltf) => {
        this.shiba = gltf;
        this.scene.add(this.shiba.scene);
        this.shiba.scene.position.z = -1;
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
    loader.load(
      "./assets/models/planet/scene.gltf",
      (gltf) => {
        this.planet = gltf;
        this.scene.add(this.planet.scene);
        this.planet.scene.position.z = -600;
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }

  private starField(nStars: number): void {
    for (let i = 0; i < nStars; i++) {
      this.createStar();
    }
  }

  private createStar(): void {
    const geometry = new SphereGeometry(0.15, 24, 24);
    const material = new MeshStandardMaterial({ color: 0xffffff });
    const star = new Mesh(geometry, material);

    const [x, y, z] = Array(3)
      .fill("")
      .map(() => MathUtils.randFloatSpread(800));
    star.position.set(x, y, z);
    this.scene.add(star);
  }

  private resizeListener(): void {
    addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
