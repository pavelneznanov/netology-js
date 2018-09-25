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
  // set type(newType) {
  // this.type === newType;
  // if (newType instanceof Actor) {
  //     this.type = newType;
  //   } else {
  //     new Error();
  // }
  // }
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

// class LevelParser {
//   constructor(dictionary) {
//     this.dictionary = dictionary;

//     console.log(this.dictionary);
//     console.log(this.dictionary['@']);
//   }
//   actorFromSymbol(symbolValue) {
//     symbolValue
//     // if (!symbolValue) {
//     //   return undefined;
//     // }
//     symbolValue
//     for (let symbol in this.dictionary) {
//       if (symbolValue === symbol) {
//         return new Actor();
//       }
//     }
//   }
//   obstacleFromSymbol() {

//   }
//   createGrid() {

//   }
//   createActors() {

//   }
//   parse() {

//   }
// }



// const plan = [
//   ' @ ',
//   'x!x'
// ];

// let test = new LevelParser(plan);
// test.actorFromSymbol('');

// const actorsDict = Object.create(null);
// actorsDict['@'] = Actor;

// const parser = new LevelParser(actorsDict);
// const level = parser.parse(plan);

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










// const grid = [
//   new Array(3),
//   ['wall', 'wall', 'lava']
// ];
// const level = new Level(grid);
// runLevel(level, DOMDisplay);

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
