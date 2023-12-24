import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
/* 
    2.4 Rotación
    2.5 Sticky
  */
export class HomePage implements OnInit {
  private WIDTH_BOARD: number = 10;
  private HEIGHT_BOARD: number = 20;
  private SHAPES = [
    [[1, 1, 1, 1]],
    [
      [1, 1],
      [1, 1],
    ],
  ];
  private board: number[] = [];
  private tetramino: any;
  private dx:number=0;
  private dy:number=0;
  constructor() {}
  ngOnInit(): void {
    this.initBoard();
    this.generateTetramino();
    this.drawTetramino(this.dx,this.dy);
  }

  //1. Tablero
  initBoard(): void {
    for (let i = 0; i < this.WIDTH_BOARD * this.HEIGHT_BOARD; i++) {
      this.board[i] = 0;
    }
  }
  getBoard(): number[] {
    return this.board;
  }
  //Tablero

  //2. Tetramino
  //2.1 Forma

  generateTetramino() {
    const shape = this.SHAPES[Math.floor(Math.random() * this.SHAPES.length)];
    this.tetramino = {
      y: 0,
      x: Math.floor(this.WIDTH_BOARD / 2 - shape.length / 2),
      shape: shape,
      newX:0,//2.3 Colisión
      newY:0//2.3 Colisión
    };
  }
  eraseTetramino(dx:number,dy:number){
    for (let y = 0; y < this.tetramino.shape.length; y++) {
      for (let x = 0; x < this.tetramino.shape[y].length; x++) {
        const newX= this.tetramino.x + x + dx; 
        const newY= this.tetramino.y + y +dy;
        this.board[newY*this.WIDTH_BOARD+newX] = 0; 
      }
    }
  }
  drawTetramino(dx:number,dy:number){
    for (let y = 0; y < this.tetramino.shape.length; y++) {
      for (let x = 0; x < this.tetramino.shape[y].length; x++) {
        const newX= this.tetramino.x + x +dx; 
        const newY= this.tetramino.y + y +dy;
        this.board[newY*this.WIDTH_BOARD+newX] = this.tetramino.shape[y][x]; 
        this.tetramino.newX=newX;//2.3 Colisión
        this.tetramino.newY=newY;//2.3 Colisión
      }
    }
  }


  //2.2 Movimiento
  onKeyDown(e:KeyboardEvent):void{

    this.eraseTetramino(this.dx,this.dy);//borrar la antigua figura
    switch(e.key){
      case 'ArrowDown':
        if(this.tetramino.newY < this.HEIGHT_BOARD-1){//2.3 Colisión
          this.dy++;
        }
      break;
      case 'ArrowLeft':
        if(this.tetramino.newX >= this.tetramino.shape[0].length){//2.3 Colisión
          this.dx--;
        }
      break;
      case 'ArrowRight':
        if(this.tetramino.newX <= this.WIDTH_BOARD-2){//2.3 Colisión
          this.dx++;
        }
      break;
    }
    this.drawTetramino(this.dx,this.dy);//dibujar la nueva figura
  }
}
