$(document).ready(function () {
    var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Audio, Touch, UI")
        .setup("lights-out", {
        maximize: false
    })
        .controls()
        .touch()
        .enableSound();

    var currLevel = 0;
    var levels = ["level-one", "level-two", "level-three", "level-four", "level-five", "final-level"];

    var highscores = [];

    var name = "Player";

    $('#player').change(function() {
    	if ($('#player').val() != "") {
	        name = $('#player').val();
	    }
    });

    Q.Sprite.extend("Player", {
        init: function (p) {
            this._super(p, {
                sheet: "player",
                x: 0,
                y: 0
            });

            this.add("2d, platformerControls");

            this.on("hit.sprite", function (collision) {
                if (collision.obj.isA("Gateway")) {
                    this.destroy();

                    if (levels[currLevel] === "final-level") {
                        Q.state.inc("score", 1000);
                        Q.stageScene("win", 1, {
                            label: Q.state.get("score")
                        });
                    } else {
                        Q.stageScene(levels[currLevel], 0);
                        Q.stageScene("hud", 1);
                        Q.state.inc("score", 10);
                    }
                }
            });
        },

        step: function (dt) {
            Q.state.inc("time", dt);
            console.log(this.p.x + ", " + this.p.y);
        }
    });

    Q.Sprite.extend("Enemy", {
        init: function (p) {
            this._super(p, {
                sheet: "enemy",
                vx: 100
            });

            this.add("2d, aiBounce");

            this.on("hit.sprite", function (collision) {
                if (collision.obj.isA("Player")) {
                    Q.stageScene("lose", 1, {
                        label: Q.state.get("score")
                    });
                    collision.obj.destroy();
                }
            });
        }
    });

    Q.Sprite.extend("Gateway", {
        init: function (p) {
            this._super(p, {
                sheet: "gateway"
            });
        }
    });

    Q.Sprite.extend("BouncePad", {
        init: function (p) {
            this._super(p, {
                sheet: "bounce-pad"
            });

            this.add("2d");

            this.on("bump.top", function (collision) {
                if (collision.obj.isA("Player")) {
                    collision.obj.p.vy = -500;
                }
            });
        }
    });

    Q.Sprite.extend("Orb", {
        init: function (p) {
            this._super(p, {
                sheet: "orb"
            });

            this.on("hit.sprite", function (collision) {
                if (collision.obj.isA("Player")) {
                    this.destroy();
                    Q.state.inc("score", 1);
                }
            });
        }
    });

    Q.UI.Text.extend("Score", {
        init: function (p) {
            this._super({
                label: "Score: 0",
                align: "center",
                x: 50,
                y: 30,
                weight: "normal",
                color: "white",
                size: 20
            });

            Q.state.on("change.score", this, "score")
        },

        score: function (score) {
            this.p.label = "Score: " + score;
        }
    });

    Q.UI.Text.extend("Time", {
        init: function (p) {
            this._super({
                label: "Time: 0",
                align: "left",
                x: Q.width - 80,
                y: 30,
                weight: "normal",
                color: "white",
                size: 20
            });

            Q.state.on("change.time", this, "time");
        },

        time: function (time) {
            this.p.label = "Time: " + time.toFixed(2);
        }
    });

    Q.UI.Text.extend("Name", {
        init: function (p) {
            this._super({
                label: name,
                x: Q.width / 2,
                y: 30,
                weight: "normal",
                color: "white",
                size: 30
            });
        }
    })

    Q.scene("title", function (stage) {
        Q.audio.stop();
        Q.load("adventure.mp3", function () {
            Q.audio.play("adventure.mp3", {
                loop: true
            });
        });

        stage.insert(new Q.Repeater({
            asset: "background.png",
            speedX: 1,
            speedY: 1
        }));

        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            fill: "gray"
        }));

        var play = container.insert(new Q.UI.Button({
            x: 0,
            y: 0,
            fill: "white",
            label: "Start Game"
        }));

        var label = container.insert(new Q.UI.Text({
            x: 0,
            y: -10 - play.p.h,
            label: stage.options.label
        }));

        var highscore = container.insert(new Q.UI.Button({
            x: 0,
            y: 50,
            fill: "white",
            label: "Recent Player Scores"
        }));

        play.on("click", function () {
            Q.state.set("score", 0);
            Q.state.set("time", 0);
            Q.clearStages();
            Q.stageScene(levels[currLevel]);
            Q.stageScene("hud", 1);
        });

        highscore.on("click", function () {
            Q.clearStages();
            Q.stageScene("highscores", 0);
        });

        container.fit(20);
    });

    Q.scene("hud", function (stage) {
        stage.insert(new Q.Score());
        stage.insert(new Q.Time());
        stage.insert(new Q.Name());
        var quit = stage.insert(new Q.UI.Button({
            x: Q.width - 50,
            y: Q.height - 30,
            fill: "white",
            label: "Menu"
        }));

        quit.on("click", function () {
            currLevel = 0;
            Q.clearStages();
            Q.stageScene("title", 0, {
                label: "In Search Of Light"
            });
        });
    }, {
        stage: 1
    });

    Q.scene("lose", function (stage) {
        Q.audio.stop();
        Q.load("lose.mp3", function () {
            Q.audio.play("lose.mp3", {
                loop: true
            });
        });

        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            fill: "gray"
        }));

        var again = container.insert(new Q.UI.Button({
            x: 0,
            y: 0,
            fill: "white",
            label: "Try Again?"
        }));

        var label = container.insert(new Q.UI.Text({
            x: 0,
            y: -40 - again.p.h,
            color: "red",
            label: "Triangulated!"
        }));

        var score = container.insert(new Q.UI.Text({
            x: 0,
            y: -5 - again.p.h,
            label: "Final Score: " + stage.options.label
        }));

        var quit = container.insert(new Q.UI.Button({
            x: 0,
            y: again.p.h + 10,
            fill: "red",
            label: "Quit"
        }));

        again.on("click", function () {
            currLevel -= 1;
            Q.clearStages();
            Q.stageScene("hud", 1);
            Q.state.dec("score", 10);
            Q.stageScene(levels[currLevel]);
        });

        quit.on("click", function () {
            currLevel = 0;
            Q.clearStages();
            Q.stageScene("title", 0, {
                label: "In Search Of Light"
            });
        });

        container.fit(20);
    }, {
        stage: 1
    });

    Q.scene("win", function (stage) {
        //Q.audio.stop();
        // Q.load("", function() {
        // 	Q.audio.play("", { loop: true });
        // });

        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            fill: "gray"
        }));

        var button = container.insert(new Q.UI.Button({
            x: 0,
            y: 0,
            fill: "white",
            label: "Menu"
        }));

        var label = container.insert(new Q.UI.Text({
            x: 0,
            y: -40 - button.p.h,
            color: "yellow",
            label: "Victorious!"
        }));

        var score = container.insert(new Q.UI.Text({
            x: 0,
            y: -5 - button.p.h,
            label: "Final Score: " + stage.options.label
        }));

        button.on("click", function () {
            currLevel = 0;
            Q.clearStages();
            updateHighscores();
            Q.stageScene("title", 0, {
                label: "In Search Of Light"
            });
        });

    }, {
        stage: 1
    });

    Q.scene("highscores", function (stage) {
        var highscores = JSON.parse(getValues());

        //sortScores(highscores);

        stage.insert(new Q.Repeater({
            asset: "background.png",
            speedX: 1,
            speedY: 1
        }));

        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 6,
            y: 50,
            fill: "gray"
        }));

        var button = container.insert(new Q.UI.Button({
            x: 650,
            y: 10,
            fill: "white",
            label: "Menu"
        }));

        for (var i = 0; i < highscores.length; i++) {
            container.insert(new Q.UI.Text({
                x: 10,
                y: 70 + i * 50,
                fill: "white",
                label: (i + 1) + ") Name: " + highscores[i].name
            }));
            container.insert(new Q.UI.Text({
                x: 310,
                y: 70 + i * 50,
                fill: "white",
                label: "Score: " + highscores[i].score
            }));

            container.insert(new Q.UI.Text({
                x: 610,
                y: 70 + i * 50,
                fill: "white",
                label: "Time: " + highscores[i].time
            }));

            button.on("click", function () {
                Q.clearStages();
                Q.stageScene("title", 0, {
                    label: "In Search Of Light"
                });
            });
        }

        container.fit(30);

    }, {
        stage: 1
    });

    Q.scene("level-one", function (stage) {
        Q.audio.stop();
        Q.load("vagabonds.mp3", function () {
            Q.audio.play("vagabonds.mp3", {
                loop: true
            });
        });

        stage.insert(new Q.Repeater({
            asset: "background.png",
            speedX: 1,
            speedY: 1
        }));

        stage.collisionLayer(new Q.TileLayer({
            dataAsset: "level-one.json",
            sheet: "tiles"
        }));

        var player = stage.insert(new Q.Player({
            x: 80,
            y: 592
        }));

        for (var i = 0; i < 10; i++) {
            stage.insert(new Q.Orb({
                x: player.p.x + i * 64,
                y: Q.height - 50
            }));
        }
        
        var orbCoords = [
            {x: 720, y: 560},
            {x: 752, y: 528},
            {x: 784, y: 496},
            {x: 816, y: 464},
            {x: 848, y: 432},
            {x: 784, y: 400},
            {x: 752, y: 368},
            {x: 720, y: 336},
            {x: 688, y: 304},
            {x: 622, y: 272},
            {x: 560, y: 304},
            {x: 528, y: 336},
            {x: 400, y: 336},
            {x: 368, y: 304},
            {x: 272, y: 272},
            {x: 208, y: 272},
            {x: 240, y: 240},
            {x: 305, y: 208},
            {x: 361, y: 176},
            {x: 432, y: 144},
            {x: 464, y: 112},
            {x: 532, y: 80},
            {x: 606, y: 80},
            {x: 668, y: 80},
            {x: 752, y: 112}
        ];
            
        for (var i = 0; i < orbCoords.length; i++) {
            stage.insert(new Q.Orb({
               x: orbCoords[i].x, 
               y: orbCoords[i].y, 
            }));
        }
        
        stage.insert(new Q.Gateway({
            x: 848,
            y: 144
        }));

        stage.add("viewport").follow(player, {
            x: true,
            y: true
        });
        stage.viewport.scale = 2;

        currLevel += 1;
    });

    Q.scene("level-two", function (stage) {
        stage.insert(new Q.Repeater({
            asset: "background.png",
            speedX: 1,
            speedY: 1
        }));

        stage.collisionLayer(new Q.TileLayer({
            dataAsset: "level-two.json",
            sheet: "tiles"
        }));

        var player = stage.insert(new Q.Player({
            x: 75,
            y: 592
        }));

        stage.insert(new Q.BouncePad({
            x: 130,
            y: 592
        }));
        stage.insert(new Q.BouncePad({
            x: 240,
            y: 432
        }));
        stage.insert(new Q.BouncePad({
            x: 688,
            y: 368
        }));
        
        var orbCoords = [
            {x: 48, y: 464},
            {x: 185, y: 432},
            {x: 304, y: 304},
            {x: 336, y: 272},
            {x: 368, y: 240},
            {x: 434, y: 208},
            {x: 496, y: 368},
            {x: 557, y: 368},
            {x: 625, y: 368},
            {x: 656, y: 240},
            {x: 592, y: 208},
            {x: 560, y: 176},
            {x: 528, y: 144},
            {x: 463, y: 112},
            {x: 365, y: 144},
            {x: 301, y: 144},
            {x: 237, y: 144},
            {x: 138, y: 144}
        ];
            
        for (var i = 0; i < orbCoords.length; i++) {
            stage.insert(new Q.Orb({
               x: orbCoords[i].x, 
               y: orbCoords[i].y, 
            }));
        }

        stage.insert(new Q.Gateway({
            x: 64,
            y: 240
        }));

        stage.add("viewport").follow(player, {
            x: true,
            y: true
        });
        stage.viewport.scale = 2;

        currLevel += 1;
    });

    Q.scene("level-three", function (stage) {
        stage.insert(new Q.Repeater({
            asset: "background.png",
            speedX: 1,
            speedY: 1
        }));

        stage.collisionLayer(new Q.TileLayer({
            dataAsset: "level-three.json",
            sheet: "tiles"
        }));

        var player = stage.insert(new Q.Player({
            x: 60,
            y: 592
        }));

        stage.insert(new Q.Enemy({
            x: 144,
            y: 592
        }));

        stage.insert(new Q.Enemy({
            x: 464,
            y: 592
        }));

        stage.insert(new Q.BouncePad({
            x: 848,
            y: 528
        }));
        
        var orbCoords = [
            {x: 113, y: 560},
            {x: 433, y: 560},
            {x: 752, y: 560},
            {x: 809, y: 528}
        ];
            
        for (var i = 0; i < orbCoords.length; i++) {
            stage.insert(new Q.Orb({
               x: orbCoords[i].x, 
               y: orbCoords[i].y, 
            }));
        }

        stage.insert(new Q.Gateway({
            x: 785,
            y: 400
        }));

        stage.add("viewport").follow(player, {
            x: true,
            y: true
        });
        stage.viewport.scale = 2;

        currLevel += 1;
    });

    Q.scene("level-four", function (stage) {
        stage.insert(new Q.Repeater({
            asset: "background.png",
            speedX: 1,
            speedY: 1
        }));

        stage.collisionLayer(new Q.TileLayer({
            dataAsset: "level-four.json",
            sheet: "tiles"
        }));

        var player = stage.insert(new Q.Player({
            x: 48,
            y: 592
        }));

        stage.insert(new Q.Enemy({
            x: 208,
            y: 560,
            vx: 200
        }));

        stage.insert(new Q.Enemy({
            x: 560,
            y: 560,
            vx: 200
        }));
        
        var orbCoords = [
            {x: 112, y: 592},
            {x: 144, y: 560},
            {x: 175, y: 528},
            {x: 592, y: 528},
            {x: 624, y: 560},
            {x: 656, y: 592},
            {x: 719, y: 592},
            {x: 764, y: 592}
        ];
            
        for (var i = 0; i < orbCoords.length; i++) {
            stage.insert(new Q.Orb({
               x: orbCoords[i].x, 
               y: orbCoords[i].y, 
            }));
        }

        stage.insert(new Q.Gateway({
            x: 848,
            y: 592
        }));

        stage.add("viewport").follow(player, {
            x: true,
            y: true
        });
        stage.viewport.scale = 2;

        currLevel += 1;
    });

    Q.scene("level-five", function (stage) {
        stage.insert(new Q.Repeater({
            asset: "background.png",
            speedX: 1,
            speedY: 1
        }));

        stage.collisionLayer(new Q.TileLayer({
            dataAsset: "level-five.json",
            sheet: "tiles"
        }));

        var player = stage.insert(new Q.Player({
            x: 62,
            y: 336
        }));

        stage.insert(new Q.Enemy({
            x: 176,
            y: 432,
            vx: 300
        }));

        stage.insert(new Q.Enemy({
            x: 656,
            y: 240,
            vx: 300
        }));

        stage.insert(new Q.BouncePad({
            x: 848,
            y: 304
        }));
        
        var orbCoords = [
            {x: 113, y: 336},
            {x: 144, y: 368},
            {x: 624, y: 400},
            {x: 656, y: 368},
            {x: 688, y: 336},
            {x: 722, y: 304},
            {x: 779, y: 304},
            {x: 784, y: 208},
            {x: 739, y: 208},
            {x: 699, y: 208},
            {x: 115, y: 208}
        ];
            
        for (var i = 0; i < orbCoords.length; i++) {
            stage.insert(new Q.Orb({
               x: orbCoords[i].x, 
               y: orbCoords[i].y, 
            }));
        }

        stage.insert(new Q.Gateway({
            x: 60,
            y: 208
        }));

        stage.add("viewport").follow(player, {
            x: true,
            y: true
        });
        stage.viewport.scale = 2;

        currLevel += 1;
    });

    Q.load("sprites.png, sprites.json, tiles.png, level-one.json, level-two.json, level-three.json, level-four.json, level-five.json, background.png", function () {
        Q.clearStages();
        Q.sheet("tiles", "tiles.png", {
            tilew: 32,
            tileh: 32
        });

        Q.compileSheets("sprites.png", "sprites.json");
        Q.compileSheets("tiles.png", "level-one.json");

        Q.stageScene("title", 0, {
            label: "In Search Of Light"
        });
    });

    function Entry(name, score, time) {
        this.name = name;
        this.score = score;
        this.time = time;
    }

    function updateHighscores() {
        highscores = JSON.parse(getValues());

        highscores.unshift(new Entry(name, Q.state.get("score"), Q.state.get("time").toFixed(2)));

        if (highscores.length >= 10) {
            highscores.pop();
        }

        //sortScores(highscores);

        $.post("highscores-save.php", {
            json: highscores
        });
    }

    function sortScores(highscores) {
        function compare(a, b) {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0
            }
        }

        highscores.sort(compare);
    }

    function getValues() {
        var result;

        $.ajax({
            url: "highscores-load.php",
            type: "GET",
            async: false,
            cache: false,
            success: function (data) {
                result = data;
            }
        });

        return result;
    }
});