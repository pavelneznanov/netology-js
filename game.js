'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
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

class Actor {
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
  }
  get type() {
    return 'actor';
  }
  get left() {
    return this.pos.x;
  }
  get top() {
    return this.pos.y;
  }
  get right() {
    return this.pos.x + this.size.x;
  }
  get bottom() {
    return this.pos.y + this.size.y;
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

class Level {
  constructor(grid, actors) {
    this.grid = grid || [];
    this.actors = actors || [];
    this.player = this.actors.find(function (actor) {
      return actor.type === 'player';
    })
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
    if (this.status && this.finishDelay < 0) {
      return true;
    }
    return false;
  }
  actorAt(movingObject) {
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
    if ((objectPosition.y + ObjectSize.y) >= this.height) {
      return 'lava';
    }
    if ((objectPosition.x + ObjectSize.x) > this.width) {
      return 'wall';
    }
    if (objectPosition.x < 0) {
      return 'wall';
    }
    if (objectPosition.y < 0) {
      return 'wall';
    }
    let actor = new Actor(objectPosition, ObjectSize);
    let obstacleWall = false;
    let obstacleLava = false;
    this.grid.forEach(function (row, y) {
      row.forEach(function (column, x) {
        let currentCell = new Actor(new Vector(x, y));
        if (actor.isIntersect(currentCell)) {
          if (column === 'wall') {
            obstacleWall = true;
          }
          if (column === 'lava') {
            obstacleLava = true;
          }
        }
      })
    })
    if (obstacleWall) {
      return 'wall';
    }
    if (obstacleLava) {
      return 'lava';
    }
    return undefined;
  }
  removeActor(removeActor) {
    let foundElements = [];
    this.actors.forEach(function (actor, i) {
      if (removeActor.type === actor.type) {
        foundElements.push(i);
      }
    })
    this.actors.splice(foundElements[0], 1);
  }
  noMoreActors(actorType) {
    return !this.actors.some(function (actor) {
      return actorType == actor.type;
    })
  }
  playerTouched(barrier, movingObject) {
    if (this.status) {
      return;
    }
    if (barrier === 'lava' || barrier === 'fireball') {
      this.status = 'lost';
      return;
    }
    if (barrier === 'coin' && movingObject) {
      this.removeActor(movingObject);
      if (this.noMoreActors('coin')) {
        this.status = 'won';
      }
    }
  }
}

class LevelParser {
  constructor(dictionary) {
    this.dictionary = Object.assign({}, dictionary);
  }
  actorFromSymbol(sym) {
    return this.dictionary[sym];
  }
  obstacleFromSymbol(symbolValue) {
    symbolValue
    if (symbolValue === 'x') {
      return 'wall';
    }
    if (symbolValue === '!') {
      return 'lava';
    }
  }
  createGrid(plan) {
    return plan.map(row => row.split('').map(cell => this.obstacleFromSymbol(cell)));
  }

  createActors(actors) {
    return actors.reduce((memo, el, y) => {
      el.split('').forEach((item, x) => {
        let constructor = this.actorFromSymbol(item);
        if (typeof constructor === 'function') {
          let obj = new constructor(new Vector(x, y));
          if (obj instanceof Actor) {
            memo.push(obj);
            return memo;
          }
        }
      });
      return memo;
    }, []);
  }
  parse(plan) {
    return new Level(this.createGrid(plan), this.createActors(plan));
  }
}

class Fireball extends Actor {
  constructor(pos, speed) {
    super();
    this.pos = pos;
    this.speed = speed;
  }
  get type() {
    return 'fireball';
  }
  getNextPosition(time = 1) {
    return this.pos.plus(new Vector(this.speed.x, this.speed.y).times(time));
  }
  handleObstacle() {
    this.speed.x = -this.speed.x;
    this.speed.y = -this.speed.y;
  }
  act(time, level) {
    let checkBarrie = level.obstacleAt(this.getNextPosition(time), this.size);
    if (!checkBarrie) {
      this.pos = this.getNextPosition(time);
    } else {
      this.handleObstacle();
    }
  }
}

class HorizontalFireball extends Fireball {
  constructor(pos) {
    super();
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.speed = new Vector(2, 0);
  }
  get type() {
    return 'fireball';
  }
}

class VerticalFireball extends Fireball {
  constructor(pos) {
    super();
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.speed = new Vector(0, 2);
  }
  get type() {
    return 'fireball';
  }
}

class FireRain extends Fireball {
  constructor(pos = new Vector()) {
    super();
    this.posDefault = pos;
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.speed = new Vector(0, 3);
  }
  handleObstacle() {
    this.speed.plus(new Vector(-this.speed.x, -this.speed.y));
    this.pos = this.posDefault;
  }
}

class Coin extends Actor {
  constructor(pos = new Vector()) {
    let posDefault = pos.plus(new Vector(0.2, 0.1));
    super(posDefault);
    this.posDefault = posDefault;
    this.size = new Vector(0.6, 0.6);
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = 2 * Math.PI;
  }
  get type() {
    return 'coin';
  }
  updateSpring(time = 1) {
    this.spring = this.spring + (this.springSpeed * time);
  }
  getSpringVector() {
    return new Vector(0, ((Math.sin(this.spring)) * this.springDist));
  }
  getNextPosition(time = 1) {
    this.updateSpring(time);
    let newPosition = this.posDefault.plus(this.getSpringVector());
    return newPosition;
  }
  act(time) {
    this.pos = this.getNextPosition(time);
  }
}

class Player extends Actor {
  constructor(pos = new Vector()) {
    super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5), new Vector(0, 0));
  }
  get type() {
    return 'player';
  }
}

// class DOMDisplay {
//   // Отвечает за отрисовку в браузере сетки игрового поля и движущихся объектов.
//   constructor(dom, level) {
//     // dom
//     // level
//   }
// }

// function runLevel(level, domDisplay) {
//   // Инициализирует процесс регулярной отрисовки текущего состояния 
//   // игрового поля и обработку событий клавиатуры.
//   // level
//   // domDisplay

//   // Функция возвращает промис, который разрешится статусом завершения игры, строка.
//   // С учетом реализации класса Level он может принимать значения won или lost.
// }

// const schemas = loadLevels();

// function runGame(schemas, parser, DOMDisplay){
//   // Возвращает промис, который разрешится, когда пользователь пройдет все уровни.
// }

// const schemas = [
//   [
//     '         ',
//     '         ',
//     '    =    ',
//     '       o ',
//     '     !xxx',
//     ' @       ',
//     'xxx!     ',
//     '         '
//   ],
//   [
//     '      v  ',
//     '    v    ',
//     '  v      ',
//     '        o',
//     '        x',
//     '@   x    ',
//     'x        ',
//     '         '
//   ]
// ];
// const actorDict = {
//     'v': FireRain,
//     '@': Player,
//     '=': HorizontalFireball,
//     'o': Coin,
//     '|': VerticalFireball
// }
// const parser = new LevelParser(actorDict);
// runGame(schemas, parser, DOMDisplay)
//   .then(() => console.log('Вы выиграли приз!'));

const grid = [
  new Array(3),
  ['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);