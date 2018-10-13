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
    this.status = null;
    this.finishDelay = 1;
    let lenghts = this.grid.map(function(row){
      return row ? row.length : 0;
    });
    this.width = Math.max(...lenghts, 0);
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
    if ((objectPosition.y + ObjectSize.y) >= this.height || (objectPosition.y + ObjectSize.y) >= this.height) {
      return 'lava';
    }
    if (objectPosition.y < 0 || objectPosition.x < 0 || (objectPosition.x + ObjectSize.x) > this.width) {
      return 'wall';
    }
    let left = Math.floor(objectPosition.x);
    let top = Math.floor(objectPosition.y);
    let right = Math.ceil(objectPosition.x + ObjectSize.x);
    let bottom = Math.ceil(objectPosition.y + ObjectSize.y);
    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {   
        if (this.grid[y][x]) {
          return this.grid[y][x];
        }
      }
    }
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
    return plan.map(row => [...row].map(cell => this.obstacleFromSymbol(cell)));
  }
  createActors(actors) {
    return actors.reduce((actorsArray, row, y) => {
      [...row].forEach((symbol, x) => {
        let constructor = this.actorFromSymbol(symbol);
        if (typeof constructor === 'function') {
          let obj = new constructor(new Vector(x, y));
          if (obj instanceof Actor) {
            actorsArray.push(obj);
            return actorsArray;
          }
        }
      });
      return actorsArray;
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

const actorDict = {
    'v': FireRain,
    '@': Player,
    '=': HorizontalFireball,
    'o': Coin,
    '|': VerticalFireball
}

const parser = new LevelParser(actorDict);

loadLevels()
    .then((res) => {
      runGame(JSON.parse(res), parser, DOMDisplay)
        .then(() => console.log('Вы выиграли!'));
});