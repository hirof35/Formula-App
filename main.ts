import './style.css'
/*import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupCounter } from './counter.ts'*/
// --- 設定と定数 ---
const TILE_SIZE = 64;
const FOV = Math.PI / 3;
const WIDTH = 640;
const HEIGHT = 480;

// マップ (0: 空, 1: 石, 2: 木)
const MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 0, 2, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
];

interface Sprite {
    x: number; y: number; texture: HTMLImageElement;
}

class RaycastEngine {
    private ctx: CanvasRenderingContext2D;
    private zBuffer: number[] = new Array(WIDTH);
    private textures: Record<number, HTMLImageElement> = {};
    
    // プレイヤー状態
    public posX = 120;
    public posY = 120;
    public dirAngle = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext("2d")!;
        this.initPointerLock(canvas);
    }

    // テクスチャの登録
    public addTexture(id: number, img: HTMLImageElement) {
        this.textures[id] = img;
    }

    private initPointerLock(canvas: HTMLCanvasElement) {
        canvas.addEventListener("click", () => canvas.requestPointerLock());
        document.addEventListener("mousemove", (e) => {
            if (document.pointerLockElement === canvas) {
                this.dirAngle += e.movementX * 0.003;
            }
        });
    }

    // メイン更新 & 描画
    public render(sprites: Sprite[]) {
        this.drawBackground();
        this.renderWalls();
        this.renderSprites(sprites);
        this.drawUI();
    }

    private drawBackground() {
        this.ctx.fillStyle = "#222"; // 天井
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT / 2);
        this.ctx.fillStyle = "#444"; // 床
        this.ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT / 2);
    }

    private renderWalls() {
        for (let x = 0; x < WIDTH; x++) {
            const rayAngle = (this.dirAngle - FOV / 2) + (x / WIDTH) * FOV;
            const rayDirX = Math.cos(rayAngle);
            const rayDirY = Math.sin(rayAngle);

            // --- DDA アルゴリズム ---
            let mapX = Math.floor(this.posX / TILE_SIZE);
            let mapY = Math.floor(this.posY / TILE_SIZE);

            const deltaDistX = Math.abs(1 / rayDirX);
            const deltaDistY = Math.abs(1 / rayDirY);

            const stepX = rayDirX < 0 ? -1 : 1;
            const stepY = rayDirY < 0 ? -1 : 1;

            let sideDistX = rayDirX < 0 ? (this.posX / TILE_SIZE - mapX) * deltaDistX : (mapX + 1 - this.posX / TILE_SIZE) * deltaDistX;
            let sideDistY = rayDirY < 0 ? (this.posY / TILE_SIZE - mapY) * deltaDistY : (mapY + 1 - this.posY / TILE_SIZE) * deltaDistY;

            let hit = 0;
            let side = 0;
            while (hit === 0) {
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                } else {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }
                if (MAP[mapY][mapX] > 0) hit = MAP[mapY][mapX];
            }

            const dist = side === 0 ? (sideDistX - deltaDistX) : (sideDistY - deltaDistY);
            const wallDist = dist * Math.cos(rayAngle - this.dirAngle);
            this.zBuffer[x] = wallDist; // Zバッファ保存

            // 描画計算
            const wallHeight = (TILE_SIZE * HEIGHT) / (wallDist * TILE_SIZE);
            const tex = this.textures[hit];
            
            // テクスチャのX座標
            let wallHit = side === 0 ? (this.posY / TILE_SIZE + dist * rayDirY) : (this.posX / TILE_SIZE + dist * rayDirX);
            wallHit -= Math.floor(wallHit);
            let texX = Math.floor(wallHit * TILE_SIZE);

            this.ctx.drawImage(tex, texX, 0, 1, TILE_SIZE, x, (HEIGHT - wallHeight) / 2, 1, wallHeight);
            
            // 陰影
            if (side === 1) {
                this.ctx.fillStyle = "rgba(0,0,0,0.2)";
                this.ctx.fillRect(x, (HEIGHT - wallHeight) / 2, 1, wallHeight);
            }
        }
    }

    private renderSprites(sprites: Sprite[]) {
        // 距離でソート
        const sorted = sprites.map(s => ({
            ...s,
            dist: Math.sqrt((this.posX - s.x) ** 2 + (this.posY - s.y) ** 2)
        })).sort((a, b) => b.dist - a.dist);

        sorted.forEach(s => {
            const dx = s.x - this.posX;
            const dy = s.y - this.posY;
            const cos = Math.cos(-this.dirAngle);
            const sin = Math.sin(-this.dirAngle);
            const rotX = dx * cos - dy * sin;
            const rotY = dx * sin + dy * cos;

            if (rotY <= 0) return;

            const size = (TILE_SIZE * HEIGHT) / rotY;
            const screenX = (WIDTH / 2) + (rotX / rotY) * (WIDTH / FOV);
            const startX = Math.floor(screenX - size / 2);

            for (let i = 0; i < size; i++) {
                const targetX = startX + i;
                if (targetX >= 0 && targetX < WIDTH && rotY / TILE_SIZE < this.zBuffer[targetX]) {
                    const texX = Math.floor((i / size) * TILE_SIZE);
                    this.ctx.drawImage(s.texture, texX, 0, 1, TILE_SIZE, targetX, (HEIGHT - size) / 2, 1, size);
                }
            }
        });
    }

    private drawUI() {
        // クロスヘア
        this.ctx.strokeStyle = "lime";
        this.ctx.beginPath();
        this.ctx.moveTo(WIDTH/2 - 10, HEIGHT/2); this.ctx.lineTo(WIDTH/2 + 10, HEIGHT/2);
        this.ctx.moveTo(WIDTH/2, HEIGHT/2 - 10); this.ctx.lineTo(WIDTH/2, HEIGHT/2 + 10);
        this.ctx.stroke();
    }
}
// --- 起動処理 ---

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const engine = new RaycastEngine(canvas);

// 入力管理
const keys: Record<string, boolean> = {};
window.addEventListener("keydown", (e) => keys[e.code] = true);
window.addEventListener("keyup", (e) => keys[e.code] = false);

// テクスチャとスプライトの準備（仮の画像生成）
const createPlaceholderTexture = (color: string) => {
    const cvs = document.createElement("canvas");
    cvs.width = cvs.height = TILE_SIZE;
    const ctx = cvs.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = "white";
    ctx.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);
    const img = new Image();
    img.src = cvs.toDataURL();
    return img;
};

engine.addTexture(1, createPlaceholderTexture("#7f8c8d")); // 石
engine.addTexture(2, createPlaceholderTexture("#d35400")); // 木

const sprites: Sprite[] = [
    { x: 300, y: 300, texture: createPlaceholderTexture("gold") } // 宝箱
];

// メインループ
function update() {
    const moveSpeed = 2.0;
    
    // WASD移動ロジック
    if (keys["KeyW"]) {
        engine.posX += Math.cos(engine.dirAngle) * moveSpeed;
        engine.posY += Math.sin(engine.dirAngle) * moveSpeed;
    }
    if (keys["KeyS"]) {
        engine.posX -= Math.cos(engine.dirAngle) * moveSpeed;
        engine.posY -= Math.sin(engine.dirAngle) * moveSpeed;
    }
    if (keys["KeyA"]) {
        engine.posX += Math.sin(engine.dirAngle) * moveSpeed;
        engine.posY -= Math.cos(engine.dirAngle) * moveSpeed;
    }
    if (keys["KeyD"]) {
        engine.posX -= Math.sin(engine.dirAngle) * moveSpeed;
        engine.posY += Math.cos(engine.dirAngle) * moveSpeed;
    }

    // 描画
    engine.render(sprites);
    
    requestAnimationFrame(update);
}

// 実行
update();

/*document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
    <img src="${viteLogo}" class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>Get started</h1>
    <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
  </div>
  <button id="counter" type="button" class="counter"></button>
</section>

<div class="ticks"></div>

<section id="next-steps">
  <div id="docs">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
    <h2>Documentation</h2>
    <p>Your questions, answered</p>
    <ul>
      <li>
        <a href="https://vite.dev/" target="_blank">
          <img class="logo" src="${viteLogo}" alt="" />
          Explore Vite
        </a>
      </li>
      <li>
        <a href="https://www.typescriptlang.org" target="_blank">
          <img class="button-icon" src="${typescriptLogo}" alt="">
          Learn more
        </a>
      </li>
    </ul>
  </div>
  <div id="social">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
    <h2>Connect with us</h2>
    <p>Join the Vite community</p>
    <ul>
      <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
      <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
      <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
      <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
    </ul>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)*/
