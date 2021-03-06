var canvas;
var context;
var keystate;
var frames;
var score;

var columns = 25;
var rows = 25;
var empty = 0;
var snake = 1;
var food = 2;

var up = 1;
var right = 2;
var down = 3;
var left = 0;

var pauseGame = false;
var quitGame = false;
var startGame = false;
var stopGame = false;

var keyUp = 38;
var keyRight = 39;
var keyDown = 40;
var keyLeft = 37;
var keyW = 87;
var keyA = 65;
var keyD = 68;
var keyP = 80;
var keyQ = 113;
var keyS = 83;



/** SETGRID
 * ... */

var setGrid = {
    width: null,
    height: null,
    _grid: null,

    initiate: function (d, c, r) {
        this.width = c;
        this.height = r;
        this._grid = [];
        for (var x = 0; x < c; x++) {
            this._grid.push([]);
            for (var y = 0; y < r; y++) {
                this._grid[x].push(d);
            }
        }
    },

    set: function (val, x, y) {
        this._grid[x][y] = val;
    },

    get: function (x, y) {
        return this._grid[x][y];
    }
};




/** SETSNAKE()
 * ... */

var setSnake = {
    direction: null,
    last: null,
    _queue: null,

    initiate: function (d, x, y) {
        this.direction = d;
        this._queue = [];
        this.insert(x, y);
    },

    insert: function (x, y) {
        this._queue.unshift({ x: x, y: y });
        this.last = this._queue[0];
    },

    remove: function () {
        return this._queue.pop();
    }
};



/** SETFOOD()
 * ... */

var setFood = function () {

    var emptyCell = [];
    for (var x = 1; x < setGrid.width - 2; x++) {
        for (var y = 1; y < setGrid.height - 2; y++) {
            if (setGrid.get(x, y) === empty) {
                emptyCell.push({ x: x, y: y });
            }
        }
    }

    var randomPosition = emptyCell[Math.round(Math.random() * (emptyCell.length - 1))]
    setGrid.set(food, randomPosition.x, randomPosition.y);
};



/** START()
 * ... */

var start = function () {
    pauseGame = false;
    quitGame = false;
    stopGame = false;

    canvas = document.getElementById('canvas');
    canvas.width = columns * 15;
    canvas.height = rows * 15;
    context = canvas.getContext("2d");
    context.font = "10px Slackey";
    frames = 0;
    keystate = {};

    document.addEventListener("keydown", function (event) {
        keystate[event.keyCode] = true;
    })

    document.addEventListener("keyup", function (event) {
        delete keystate[event.keyCode];
    })

    initiate();
    if (!startGame) {
        startGame = true;
        loop();
    }
};



/** INITIATE()
 * ... */

var initiate = function () {
    score = 0;
    setGrid.initiate(empty, columns, rows);
    var startPosition = { x: Math.floor(columns / 2), y: rows - 1 };
    setSnake.initiate(up, startPosition.x, startPosition.y);
    setGrid.set(snake, startPosition.x, startPosition.y);
    setFood();
};



/** LOOP() 
 * Here loop() runs and checks to make sure that the pause, quit, and stop values are all set to FALSE.
 * If the values of pause, quit, and stop are all set to FALSE then update() and draw() are invoked.
 * From there we call on the requestAnimationFrame command within the global scope, and run both loop() and the canvas element */

var loop = function () {
    if (!pauseGame && !quitGame && !stopGame) {
        update();
        draw();
    }
    window.requestAnimationFrame(loop, canvas);
};



/** UPDATE() 
 * Here we run through update the frame with a new snakes position, in accordance with player commands
 * keyLeft, keyUp, keyRight, keyDown all change the direction of the "snake" animation.
 * whereas keyQ haults frame progression, by switching the value of quitgame from FALSE to TRUE*/

var update = function () {
    frames++;

    if (keystate[keyLeft] && setSnake.direction !== right || keystate[keyA] && setSnake.direction !== right) {
        setSnake.direction = left;
    }
    if (keystate[keyUp] && setSnake.direction !== down || keystate[keyW] && setSnake.direction !== down) {
        setSnake.direction = up;
    }
    if (keystate[keyRight] && setSnake.direction !== left || keystate[keyD] && setSnake.direction !== left) {
        setSnake.direction = right;
    }
    if (keystate[keyDown] && setSnake.direction !== up || keystate[keyS] && setSnake.direction !== up) {
        setSnake.direction = down;
    }
    if (keystate[keyQ]) {
        if (quitGame === false) {
            quitGame = true;
        } else {
            quitGame = false;
        }
    }

    /* ... */

    if (frames % 5 === 0) {

        var nx = setSnake.last.x;
        var ny = setSnake.last.y;

        switch (setSnake.direction) {
            case left:
                nx--;
                break;
            case up:
                ny--;
                break;
            case right:
                nx++;
                break;
            case down:
                ny++;
                break;
        }

        /* ... */

        if (1 > nx || nx > setGrid.width - 2 || 1 > ny || ny > setGrid.height - 2 || setGrid.get(nx, ny) === snake) {
            stopGame = true;

            setTimeout(function () {
                $('div.scoreSubmit').css('display', 'block');
            }, 1000);
            angular.element(document.getElementById('scoreSubmit')).scope(stopGame);
        }

        if (setGrid.get(nx, ny) === food) {
            score++;
            setFood();
        } else {
            var tail = setSnake.remove();
            setGrid.set(empty, tail.x, tail.y);
        }
        setGrid.set(snake, nx, ny);
        setSnake.insert(nx, ny);
    }
};



/** DRAW() 
 * ... */

var draw = function () {

    var tw = canvas.width / setGrid.width;
    var th = canvas.height / setGrid.height;

    for (var x = 0; x < setGrid.width; x++) {
        for (var y = 0; y < setGrid.height; y++) {
            switch (setGrid.get(x, y)) {
                case empty:
                    context.fillStyle = "rgba(0,0,0,1)";
                    break;
                case snake:
                    context.fillStyle = "rgba(50,200,50,1)";
                    break;
                case food:
                    context.fillStyle = "rgba(200,0,0,1)";
                    break;
            }
            context.fillRect(x * tw, y * th, tw, th);
        }
    }
    context.fillStyle = "rgba(255,255,255,.75)";
    context.font = '1vw Slackey';
    context.fillText("SCORE: " + score, 12.5, canvas.height - 10);
};
