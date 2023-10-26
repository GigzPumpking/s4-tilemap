import "./style.css";


//setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById("selectCanvas") as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

class ImageFlyweight {
    private imageSrc: string;
    private image: HTMLImageElement | null;
  
    constructor(src: string) {
      this.imageSrc = src;
      this.image = null;
    }
  
    getImage(): HTMLImageElement {
      if (!this.image) {
        this.image = new Image();
        this.image.src = this.imageSrc;
      }
      return this.image;
    }
  }

  const tile1 = new ImageFlyweight("/tile1.png");
  const tile2 = new ImageFlyweight("/tile2.png");
  const tile3 = new ImageFlyweight("/tile3.png");
  const tile4 = new ImageFlyweight("/tile4.png");
  const tile5 = new ImageFlyweight("/tile5.png");
  const tile6 = new ImageFlyweight("/tile6.png");
  const tile7 = new ImageFlyweight("/tile7.png");
  const tile8 = new ImageFlyweight("/tile8.png");

    //defining the textures to use
    const imageUrls = [
        tile1,
        tile2,
        tile3,
        tile4,
        tile5,
        tile6,
        tile7,
        tile8
    ];

//defining the size of the main grid
const numTiles = 32;
const tileSize = gridCanvas.width / numTiles;


//defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

//creating the tilemap nested array
let tilemap: HTMLImageElement[][] = new Array(numTiles);

for(let i = 0; i < numTiles; i++) {
    let row = new Array(numTiles);
    for (let j = 0; j < numTiles; j++) {
        row[j] = tile1.getImage();
    }
    tilemap[i] = row;
}

//track the selected tile
let currentTile : HTMLImageElement = tile1.getImage();

//draw the initial canvases
redrawTilemap();
drawSelectCanvas();


//Function that draws a texture to a specific canvas ctx
function drawTexture(row: number, col: number, ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number, cellSize: number) {
    image.onload = () => {
        ctx.drawImage(image, row * cellSize, col * cellSize, width, height)
    };
    ctx.drawImage(image, row * cellSize, col * cellSize, width, height)
}


// ----- Interacting with the main tilemap -----

function redrawTilemap()
{
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    for (let i = 0; i < numTiles; i++) {
        for (let j = 0; j < numTiles; j++) {
            drawTexture(i, j, gridCtx, tilemap[i][j], gridCanvas.width / numTiles, gridCanvas.height / numTiles, tileSize);
        }
    }
}


gridCanvas.addEventListener("click", (e) => {
    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);

    tilemap[coordX][coordY] = currentTile;
    redrawTilemap();
})


// ----- Interacting with the selectable tilemap -----

// Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas()
{
    for (let i = 0; i < numSelectables; i++) {
        const selectableImage = imageUrls[i].getImage();
        drawTexture(0, i, selectCtx, selectableImage, selectCanvas.width, selectHeight, 64);
    }
}

selectCanvas.addEventListener("click", (e) => {
    const coordY = Math.trunc(e.offsetY / selectHeight);
    currentTile = imageUrls[coordY].getImage();
})