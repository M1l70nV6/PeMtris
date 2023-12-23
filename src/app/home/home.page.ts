import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private rows: number;
  private cols: number;
  private game_grid: number[];
  private block: number[][];

  private xo: number;
  private yo: number;
  private xf: number;
  private yf: number;

  private fps: number = 60;
  private interval: number = 0;
  private lastTime: number = 0;

  constructor(private ngzone: NgZone, private cdr: ChangeDetectorRef) {
    this.rows = 20;
    this.cols = 10;
    this.game_grid = [];
    this.block = [
      [1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 1],
    ];
    this.xo = 0;
    this.yo = 0;
    this.xf = 0;
    this.yf = 0;
  }

  ngOnInit(): void {
    this.gameinit();
    this.startGameLoop();
  }

  //Iniciar rejilla de juego
  gameinit(): void {
    for (let i = 0; i < this.rows * this.cols; i++) {
      this.game_grid[i] = 0;
    }
  }
  //Inicia el Game Loop
  private startGameLoop(): void {
    this.ngzone.runOutsideAngular(() => {
      //Iniciar el bucle del juego y correrlo fuera de angular
      this.gameloop();
    });
  }
  //bucle del juego a FPS
  gameloop(): void {
    const animate = (time: number) => {
      if (!this.lastTime) {
        this.lastTime = time;
      }
      let transcurrido = time - this.lastTime;

      if (transcurrido > 1000 / this.fps) {
        this.update();
        this.lastTime = time - (transcurrido % (1000 / this.fps));
      }
      this.interval = requestAnimationFrame(animate);
    };
    animate(0);
  }

  //lienzo de accion
  update(): void {
    this.draw();
  }
  draw(): void {
    const blockaleatorio = Math.floor(Math.random() * 4);
    this.dropBlock(100);
    this.eraseBlock(0);
    this.drawBlock(0);
    this.cdr.detectChanges();
  }

  dropBlock(ms:number){
    if (this.interval % ms === 0) {
      this.yo = this.yf;
      this.xo = this.xf;
      if(this.yf<this.rows-2){
        this.yf++;
      }else{
        this.yf=this.yo;
      }
    }
  }
  eraseBlock(b: number) {
    let size = this.block[b].length / 2;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < size; j++) {
        console.log(this.game_grid[(i + this.yo) * this.cols + (j + this.xo)]);
        this.game_grid[(i + this.yo) * this.cols + (j + this.xo)] = 0;
      }
    }
  }
  drawBlock(b: number) {
    let size = this.block[b].length / 2;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < size; j++) {
        this.game_grid[(i + this.yf) * this.cols + (j + this.xf)] =
          this.block[b][i * size + j];
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    this.yo = this.yf;
    this.xo = this.xf;

    switch (event.key) {
      case 'ArrowDown':
      if(this.yf<this.rows-2){
        this.yf++;
      }else{
        this.yf=this.yo;
      }

      break;
      case 'ArrowRight':
        this.xf++;
        break;
      case 'ArrowLeft':
        this.xf--;
        break;
    }
  }
  //regresa el vector rejilla del juego
  getGameGrid() {
    return this.game_grid;
  }
  //cierre del app
  ngOnDestroy(): void {
    cancelAnimationFrame(this.interval);
  }
}
