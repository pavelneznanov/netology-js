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
      newPosition.y += vector.y;
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

class Actor extends Vector {
  // Контролирует все движущиеся объекты на игровом поле и контролирует их пересечение
  constructor(pos, size, speed) {
    super();
    this.pos = new Vector(pos);
    this.size = new Vector(1, 1);
    this.speed = new Vector(speed);
    this.type = '';

    pos
    size
    speed
    console.log(this.pos);
    console.log(this.size);
    console.log(this.speed);
    console.log(this.x);
    console.log(this.y);

    // let abc = super.plus(start);
    // abc
    // console.log(abc.x);
    // console.log(abc.y);

    // console.log(abc.x);
    // console.log(abc.y);


    // console.log(this.x);
    // console.log(this.y);
    console.log(this.pos.x);
    console.log(this.pos.y);
    console.log(this.size.x);
    console.log(this.size.y);

    Object.defineProperty(this, 'type', {
      value: 'actor',
      writable: false
    });
    Object.defineProperty(this, 'left', {
      // 30
      value: 0,
      writable: false
    });
    Object.defineProperty(this, 'top', {
      // 50
      value: 0,
      writable: false
    });
    Object.defineProperty(this, 'right', {
      // 35
      value: 0,
      writable: false
    });
    Object.defineProperty(this, 'bottom', {
      // 55
      value: 0,
      writable: false
    });

    // console.log(this.pos instanceof Vector)
    // console.log(this.pos)

    // if (this.pos instanceof Vector) {
    //   const position = new Vector(this.x, this.y);
    //   let newPosition = position;
    //   position
    // } else {
    //   throw error;
    // }

    // const player = {};
    // player.pos = this.pos;
    // console.log(player.pos);
    // console.log(player.pos instanceof Vector)

    // console.log(this.pos);
    // console.log(this.size);
    // console.log(this.speed);
    // console.log(this.type);
  }
  isIntersect(movingObject) {
    // const player = new Actor(this.pos, this.size);
    // player
    // movingObject
    // const notIntersected = player.isIntersect(player);
    // console.log(notIntersected);
    // console.log(movingObject.)
    // console.log(movingObject.left);
    // console.log(movingObject.top);
    // console.log(movingObject.bottom);
    // console.log(movingObject.right);
    // console.log(this.left);
    movingObject
    if (movingObject instanceof Actor) {
      // const position = new Vector(this.x, this.y);
      // let newPosition = position;
      return true;
    } else {
      throw (error);
    }
  }
  act() {
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


class Level {
  constructor(grid, actors) {
    grid
    actors
    // this.player;
    this.height;
    this.width;
    this.status = null;
    this.finishDelay = 1;
  }
  isFinished() {

  }
  actorAt() {

  }
  obstacleAt() {

  }
  removeActor() {

  }
  noMoreActors() {

  }
  playerTouched() {

  }
}
// const grid = [
//   [undefined, undefined],
//   ['wall', 'wall']
// ];

// function MyCoin(title) {
//   this.type = 'coin';
//   this.title = title;
// }
// MyCoin.prototype = Object.create(Actor);
// MyCoin.constructor = MyCoin;

// const goldCoin = new MyCoin('Золото');
// const bronzeCoin = new MyCoin('Бронза');
// const player = new Actor();
// const fireball = new Actor();

// const level = new Level(grid, [ goldCoin, bronzeCoin, player, fireball ]);

// level.playerTouched('coin', goldCoin);
// level.playerTouched('coin', bronzeCoin);

// if (level.noMoreActors('coin')) {
//   console.log('Все монеты собраны');
//   console.log(`Статус игры: ${level.status}`);
// }

// const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
// if (obstacle) {
//   console.log(`На пути препятствие: ${obstacle}`);
// }

// const otherActor = level.actorAt(player);
// if (otherActor === fireball) {
//   console.log('Пользователь столкнулся с шаровой молнией');
// }

// Все монеты собраны
// Статус игры: won
// На пути препятствие: wall
// Пользователь столкнулся с шаровой молнией