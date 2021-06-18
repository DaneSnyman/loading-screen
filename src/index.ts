import { LoadingScene } from "./loading-scene";
import "./style.scss";

const loadingScene = new LoadingScene(200);
const animate = (): void => {
  requestAnimationFrame(animate);
  loadingScene.animationLoop();
};
animate();
