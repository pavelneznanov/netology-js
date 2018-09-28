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

// const grid = [
// new Array(3),
// ['wall', 'wall', 'lava']
// ];
// const level = new Level(grid);
// runLevel(level, DOMDisplay);

class LevelParser {
  constructor(dictionary) {
    this.dictionary = dictionary;
    // console.log(this.dictionary);
    // console.log(this.dictionary['@']);
  }
  actorFromSymbol(symbolValue) {
    if (!symbolValue) {
      return undefined;
    }
    return this.dictionary[symbolValue];
  }
  obstacleFromSymbol(symbolValue) {
    symbolValue
    if (symbolValue === 'x') {
      return 'wall';
    }
    if (symbolValue === '!') {
      return 'lava';
    }
    return undefined;
  }
  createGrid(row) {
    if (row.length === 0) {
      return [];
    }
    let splitRow = row.map(function (row) {
      return row.split('');
    })
    splitRow = splitRow.map(function (row) {
      row = row.map(function (cell) {
        if (cell === 'x') {
          return cell = 'wall';
        }
        if (cell === '!') {
          return cell = 'lava';
        }
        if (cell === ' ') {
          return undefined;
        }
        return cell;
      })
      return row;
    })
    return splitRow;
  }
  createActors(gridItems) {
    // gridItems
    if (gridItems.length === 0) {
      return [];
    }

    let emptyItems;
    emptyItems = !gridItems.some(function (cell) {
      return cell === undefined;
    })
    if (emptyItems) {
      return [];
    }

    // let abcc =  gridItems.map(function(row, x){
    return gridItems.map(function (row, x) {
      // row
      // x
      return row.map(function (cell, y) {
        if (cell === undefined) {
          return undefined;
        }
        // cell
        // x
        // y
        // return this.actorFromSymbol(cell);
        return new Actor(new Vector(x, y));
      })
    })
    // abcc
  }
  parse(plan) {
    // plan
    let actors = this.createActors(plan); // сейчас не дописан
    // actors
    return new Level(this.createGrid(plan), actors);
  }
}

const plan = [
  ' @ ',
  'x!x'
];

const actorsDict = Object.create(null);
actorsDict['@'] = Actor;

const parser = new LevelParser(actorsDict);
const level = parser.parse(plan);

// let abc = parser.actorFromSymbol('@'); //!!!
// abc
// let abc2 = parser.obstacleFromSymbol('x'); //!!!
// abc2
// let abc3 = parser.createGrid(plan); //!!!
// abc3
let abc3 = parser.createGrid(plan); //!!!
// abc3
let abc4 = parser.createActors(abc3);
// abc4

// level.grid.forEach((line, y) => {
//   line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
// });

// level.actors.forEach(actor => console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`));
// (0:0) undefined
// (1:0) undefined
// (2:0) undefined
// (0:1) wall
// (1:1) lava
// (2:1) wall
// (1:0) actor

// class DOMDisplay {
// Отвечает за отрисовку в браузере сетки игрового поля и движущихся объектов.
// constructor(dom, level) {
// dom
// level
// }
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


// function runLevel(level, domDisplay) {
// Инициализирует процесс регулярной отрисовки текущего состояния 
// игрового поля и обработку событий клавиатуры.
// level
// domDisplay

// Функция возвращает промис, который разрешится статусом завершения игры, строка.
// С учетом реализации класса Level он может принимать значения won или lost.
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

class Fireball extends Actor {
  constructor(cords, speed) {
    super();
    this.pos = cords;
    this.size = new Vector(1, 1);
    this.speed = speed;
    this.cords = cords;
  }
  get type() {
    return 'fireball';
  }
  getNextPosition(time = 1) {
    let x = this.pos.x + this.speed.x * time;
    let y = this.pos.y + this.speed.y * time;
    return new Vector(x, y);
  }
  handleObstacle() {
    this.speed.x = -this.speed.x;
    this.speed.y = -this.speed.y;
  }
  act(time, level) {
    let newPosition = this.getNextPosition(time);
    let abc = level.obstacleAt(this.pos, this.size);
    // let abc2 = level.obstacleAt(newPosition, this.size);
    if (!abc) {
      this.pos = this.getNextPosition(time);
    }
    if (abc) {
      handleObstacle();
    }
    // 2 Выяснить, не пересечется ли в следующей позиции объект 
    // с каким-либо препятствием. Пересечения с другими движущимися 
    // объектами учитывать не нужно.
    
    // 4 Если объект пересекается с препятствием, то необходимо обработать 
    // это событие. При этом текущее положение остается прежним.

  }
}

// let testCords = new Vector(1,1);
// let testSpeed = 5;
// let testTime = 4;
// let testGrid = [
// new Array(3),
// ['wall', 'wall', 'lava']
// ];
// let testLevel = new Level(testGrid);
// let testFireball = new Fireball(testCords, testSpeed);
// let test1 = testFireball.act(testTime, testGrid);

class HorizontalFireball extends Fireball {
  constructor(cords) {
    super();
    this.pos = cords;
    this.size = new Vector(1, 1);
    this.speed = new Vector(2, 0);
  }
  get type() {
    return 'fireball';
  }
}

class VerticalFireball extends Fireball {
  constructor(cords) {
    super();
    this.pos = cords;
    this.size = new Vector(1, 1);
    this.speed = new Vector(0, 2);
  }
  get type() {
    return 'fireball';
  }
}

class FireRain extends Fireball {
  constructor(cords) {
    super();
    this.pos = cords;
    this.size = new Vector(1, 1);
    this.speed = new Vector(0, 3);
  }
}

class Coin extends Actor {
  constructor() {
    super();
    this.pos = new Vector(0.2, 0.1)
    this.size = new Vector(0.6, 0.6);
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring; //случайное число от 0 до 2π.
  }
  get type() {
    return 'coin';
  }
  updateSpring(time = 0) {
    time

    // Ничего не возвращает. Обновляет текущую фазу spring, 
    // увеличив её на скорость springSpeed, умноженную на время.
  }
  getSpringVector() {
    // Создает и возвращает вектор подпрыгивания. Не принимает аргументов.
    // Так как подпрыгивание происходит только по оси Y, 
    // то координата X вектора всегда равна нулю.
    // Координата Y вектора равна синусу текущей фазы, умноженному на радиус.
  }
  getNextPosition(time = 1) {
    // Обновляет текущую фазу, создает и возвращает вектор новой позиции монетки.
    // Принимает один аргумент — время, число, по умолчанию 1.
    // Новый вектор равен базовому вектору положения, увеличенному 
    // на вектор подпрыгивания. Увеличивать нужно именно базовый 
    // вектор положения, который получен в конструкторе, а не текущий.
  }
  act(time) {
    time
    // Принимает один аргумент — время.
    // Получает новую позицию объекта и задает её как текущую. Ничего не возвращает.
  }
}

class Player extends Actor {
  constructor(position) {
    super();
    // this.pos = new Vector(position.x, (position.y - 0.5));
    this.size = new Vector(0.8, 1.5);
    this.speed = new Vector(0, 0);
  }
  get type() {
    return 'player';
  }
}