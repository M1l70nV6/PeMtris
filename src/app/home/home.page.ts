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
  private readonly WIDTH_BOARD: number = 10;
  private readonly HEIGHT_BOARD: number = 20;
  private SHAPES = [
    [[1, 1, 1, 1]],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
  ];
  private board: number[] = [];
  private tetramino: any;

  constructor() {}
  ngOnInit(): void {
    this.initBoard();
    this.generateTetramino();
    this.drawTetramino();
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
      x: Math.floor(this.WIDTH_BOARD / 2 - shape[0].length / 2),
      shape: shape,
    };
  }
  eraseTetramino() {
    for (let y = 0; y < this.tetramino.shape.length; y++) {
      for (let x = 0; x < this.tetramino.shape[y].length; x++) {
        const newX = this.tetramino.x + x;
        const newY = this.tetramino.y + y;
        this.board[newY * this.WIDTH_BOARD + newX] = 0;
      }
    }
  }
  drawTetramino() {
    for (let y = 0; y < this.tetramino.shape.length; y++) {
      for (let x = 0; x < this.tetramino.shape[y].length; x++) {
        const newX = this.tetramino.x + x;
        const newY = this.tetramino.y + y;
        this.board[newY * this.WIDTH_BOARD + newX] = this.tetramino.shape[y][x];
      }
    }
  }
  stickTetramino() {
    for (let y = 0; y < this.tetramino.shape.length; y++) {
      for (let x = 0; x < this.tetramino.shape[y].length; x++) {
        const newX = this.tetramino.x + x;
        const newY = this.tetramino.y + y;
        if (this.tetramino.shape[y][x] === 1) {
          this.board[newY * this.WIDTH_BOARD + newX] = 2;
        } else {
          this.board[newY * this.WIDTH_BOARD + newX] = 0;
        }
      }
    }
  }
  checkTetramino(dx: number, dy: number): boolean {
    for (let y = 0; y < this.tetramino.shape.length; y++) {
      for (let x = 0; x < this.tetramino.shape[y].length; x++) {
        const newX = this.tetramino.x + x + dx;
        const newY = this.tetramino.y + y + dy;
          if (newX < 0 || newX >= this.WIDTH_BOARD) return false;
          if (newY >= this.HEIGHT_BOARD) return false;
          if (this.board[newY * this.WIDTH_BOARD + newX] === 2) return false;
      }
    }
    return true;
  }

  clearLines() {
    for (let y = 0; y < this.HEIGHT_BOARD; y++) {
      let count = 0; // Move count initialization inside the loop for each row
      for (let x = 0; x < this.WIDTH_BOARD; x++) {
        if (this.board[y * this.WIDTH_BOARD + x] === 2) {
          count++;
        }
      }
      if (count === this.WIDTH_BOARD) {
        this.board.splice(y * this.WIDTH_BOARD, this.WIDTH_BOARD);
        // Add a new empty line at the top
        this.board.unshift(...Array(this.WIDTH_BOARD).fill(0));
      }
    }
  }

  moveTetramino(dx: number = 0, dy: number = 0) {
    const valid = this.checkTetramino(dx, dy);
    if (!valid && dy) {
      this.stickTetramino();
      this.clearLines();
      this.generateTetramino();
    }
    if (!valid) {
      return;
    }
    this.eraseTetramino();
    this.tetramino.x += dx;
    this.tetramino.y += dy;
    this.drawTetramino();
  }
  //2.2 Movimiento
  onKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowDown':
        this.moveTetramino(0, 1);
        break;
      case 'ArrowLeft':
        this.moveTetramino(-1, 0);
        break;
      case 'ArrowRight':
        this.moveTetramino(1, 0);
        break;
    }
  }
}
