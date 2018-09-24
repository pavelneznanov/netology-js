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
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
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
// const start = new Vector(30, 50);
// const moveTo = new Vector(5, 10);
// const finish = start.plus(moveTo.times(2));
// console.log(`Исходное расположение: ${start.x}:${start.y}`);
// console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
// Исходное расположение: 30:50
// Текущее расположение: 40:70¨

class Actor {
  // Контролирует все движущиеся объекты на игровом поле и контролирует их пересечение
  constructor(pos, size, speed) {
    pos = pos || new Vector(0, 0);
    size = size || new Vector(1, 1);
    speed = speed || new Vector(0, 0);
    if (!(pos instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
    }
    this.pos = pos;
    this.size = size;
    this.speed = speed;
    this.id = Math.random();
    // this.type = 'actor';
    Object.defineProperty(this, 'type', {
      value: 'actor',
      writable: false
    });
    Object.defineProperty(this, 'left', {
      value: this.pos.x,
      writable: false
    });
    Object.defineProperty(this, 'top', {
      value: this.pos.y,
      writable: false
    });
    Object.defineProperty(this, 'right', {
      value: this.pos.x + this.size.x,
      writable: false
    });
    Object.defineProperty(this, 'bottom', {
      value: this.pos.y + this.size.y,
      writable: false
    });
  }
  isIntersect(movingObject) {
    if (!movingObject || !(movingObject instanceof Actor)) {
      throw new Error('Объект должен быть типа Actor');
    }
    if (movingObject.id === this.id) {
      return false;
    }
    if (movingObject.top >= this.bottom) {
      return false;
    }
    if (movingObject.bottom <= this.top) {
      return false;
    }
    if (movingObject.left >= this.right) {
      return false;
    }
    if (movingObject.right <= this.left) {
      return false;
    }
    return true;
  }
  act() {
  }
}
// const items = new Map();
// const player = new Actor();
// items.set('Игрок', player);
// items.set('Первая монета', new Actor(new Vector(10, 10)));
// items.set('Вторая монета', new Actor(new Vector(15, 5)));
// function position(item) {
//   return ['left', 'top', 'right', 'bottom']
//     .map(side => `${side}: ${item[side]}`)
//     .join(', ');
// }
// function movePlayer(x, y) {
//   player.pos = player.pos.plus(new Vector(x, y));
// }
// function status(item, title) {
//   console.log(`${title}: ${position(item)}`);
//   if (player.isIntersect(item)) {
//     console.log(`Игрок подобрал ${title}`);
//   }
// }
// items.forEach(status);
// movePlayer(10, 10);
// items.forEach(status);
// movePlayer(5, -5);
// items.forEach(status);
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
  // Реализуют схему игрового поля конкретного уровня,
  // контролируют все движущиеся объекты на нём и реализуют логику игры.
  constructor(grid, actors) {
    this.grid = grid || [];
    this.actors = actors || [];
    // this.player = new Actor();
    // this.player.type = 'player';
    // console.log(this.player);
    this.height = this.grid.length;
    this.width = this.grid.reduce(function (acc, row) {
      let innerRow = row || [];
      if (innerRow.length > acc) {
        return innerRow.length
      } else {
        return acc;
      }
    }, 0);
    this.status = null;
    this.finishDelay = 1;
  }
  isFinished() {
    if (this.status !== 'null' && this.finishDelay < 0) {
      return true;
    }
    return false;
  }
  actorAt(movingObject) {
    // Определяет, расположен ли какой-то другой движущийся
    // объект в переданной позиции, и если да, вернёт этот объект.
    if (!movingObject || !(movingObject instanceof Actor)) {
      throw new Error('Объект должен быть типа Actor');
    }
    return this.actors.find(function (actor) {
      if (!(actor instanceof Actor)) {
        return false;
      }
      return actor.isIntersect(movingObject);
    });
  }
  obstacleAt(objectPosition, ObjectSize) {
    if (!(objectPosition instanceof Vector) || !(ObjectSize instanceof Vector)) {
      throw new Error('Объект должен быть типа Vector');
    }
    if ((objectPosition.y + ObjectSize.y) >= this.height) {
      return 'lava';
    }
    if ((objectPosition.x + ObjectSize.x) >= this.width) {
      return 'wall';
    }
    if ((objectPosition.x) <= 0) {
      return 'wall';
    }
    if ((objectPosition.y) <= 0) {
      return 'wall';
    }
  }
  removeActor(removeActor) {
    let findedElements = [];
    this.actors.forEach(function(actor, i){
      if (removeActor.type === actor.type) {
        findedElements.push(i);
      }
    })
    this.actors.splice(findedElements[0],1);
  }
  noMoreActors(actorType) {
    // actorType
  }
  playerTouched(barrier, movingObject) {
    // barrier
    // movingObject
  }
}

const grid = [
  [undefined, undefined],
  ['wall', 'wall']
];

function MyCoin(title) {
  this.type = 'coin';
  this.title = title;
}
MyCoin.prototype = Object.create(Actor);
MyCoin.constructor = MyCoin;

const goldCoin = new MyCoin('Золото');
const bronzeCoin = new MyCoin('Бронза');
const player = new Actor();
const fireball = new Actor();

const level = new Level(grid, [goldCoin, bronzeCoin, player, fireball]);

level.playerTouched('coin', goldCoin);
level.playerTouched('coin', bronzeCoin);

if (level.noMoreActors('coin')) {
  console.log('Все монеты собраны');
  console.log(`Статус игры: ${level.status}`);
}

const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
if (obstacle) {
  console.log(`На пути препятствие: ${obstacle}`);
}

const otherActor = level.actorAt(player);
if (otherActor === fireball) {
  console.log('Пользователь столкнулся с шаровой молнией');
}

level.removeActor(goldCoin);


// Все монеты собраны
// Статус игры: won
// На пути препятствие: wall
// Пользователь столкнулся с шаровой молнией


// const grid = [
//   new Array(3),
//   ['wall', 'wall', 'lava']
// ];
// const level = new Level(grid);
// runLevel(level, DOMDisplay);

// class DOMDisplay {
//   // Отвечает за отрисовку в браузере сетки игрового поля и движущихся объектов.
//   constructor(dom, level) {

//   }
// }

// const schema = [
//   '         ',
//   '         ',
//   '    =    ',
//   '         ',
//   '     !xxx',
//   ' @       ',
//   'xxx!     ',
//   '         '
// ];
// const actorDict = {
//   '@': Player,
//   '=': HorizontalFireball
// }
// const parser = new LevelParser(actorDict);
// const level = parser.parse(schema);
// DOMDisplay(document.body, level);


// function runLevel(level) {
//   // Инициализирует процесс регулярной отрисовки текущего состояния 
// игрового поля и обработку событий клавиатуры.

// }

// const schema = [
//   '         ',
//   '         ',
//   '    =    ',
//   '       o ',
//   '     !xxx',
//   ' @       ',
//   'xxx!     ',
//   '         '
// ];
// const actorDict = {
//   '@': Player,
//   '=': HorizontalFireball
// }
// const parser = new LevelParser(actorDict);
// const level = parser.parse(schema);
// runLevel(level, DOMDisplay)
//   .then(status => console.log(`Игрок ${status}`));
