'use strict';

class Vector {
  // Контролирует расположение объектов в двумерном пространстве и управляет их размером и перемещением
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  plus(vector) {
    if (vector instanceof Vector) {
      const position = new Vector(this.x, this.y);
      let newPosition = position;
      newPosition.x += vector.x; 
      newPosition.y +=  vector.y;
      return newPosition;
    } else {
      throw 'Можно прибавлять к вектору только вектор типа Vector';
    }
  }
  times(multiplier) {
    const position = new Vector(this.x, this.y);
    let newPosition = position;
    newPosition.x = this.x * multiplier;
    newPosition.y = this.y * multiplier;
    return newPosition;
  }
}
const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));
// let array1 = [1,2,3];
// const finish = start.plus(array1);
console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
// Результат выполнения кода:
// Исходное расположение: 30:50
// Текущее расположение: 40:70¨

class Actor {
  // Контролирует все движущиеся объекты на игровом поле и контролирует их пересечение
  constructor(pos, size, speed) {

    const player = new Vector(this.pos);
    player.pos
    console.log(player.pos instanceof Vector)

    let vector = {};
    vector.posX = 0;
    vector.posY = 0;
    vector.sizeX = 0;
    vector.sizeY = 0;
    vector.speedX = 0;
    vector.speedY = 0;
    
    pos
    pos
    size
    speed
    vector
  }
  isIntersect(movingObject){
    movingObject
    console.log(typeof movingObject === 'object')
    console.log(typeof movingObject === 'object')
    try {
      
    } catch (error) {
    }
  }
  act(){
  }
}
const items = new Map();
const player = new Actor();
items.set('Игрок', player);
items.set('Первая монета', new Actor(new Vector(10, 10)));
items.set('Вторая монета', new Actor(new Vector(15, 5)));
function position(item) {
  return ['left', 'top', 'right', 'bottom']
    .map(side => `${side}: ${item[side]}`)
    .join(', ');
}
function movePlayer(x, y) {
  player.pos = player.pos.plus(new Vector(x, y));
}
function status(item, title) {
  console.log(`${title}: ${position(item)}`);
  if (player.isIntersect(item)) {
    console.log(`Игрок подобрал ${title}`);
  }
}
items.forEach(status);
movePlayer(10, 10);
items.forEach(status);
movePlayer(5, -5);
items.forEach(status);
// Игрок: left: 0, top: 0, right: 1, bottom: 1
// Первая монета: left: 10, top: 10, right: 11, bottom: 11
// Вторая монета: left: 15, top: 5, right: 16, bottom: 6
// Игрок: left: 10, top: 10, right: 11, bottom: 11
// Первая монета: left: 10, top: 10, right: 11, bottom: 11
// Игрок подобрал Первая монета
// Вторая монета: left: 15, top: 5, right: 16, bottom: 6
// Игрок: left: 15, top: 5, right: 16, bottom: 6
// Первая монета: left: 10, top: 10, right: 11, bottom: 11
// Вторая монета: left: 15, top: 5, right: 16, bottom: 6
// Игрок подобрал Вторая монета