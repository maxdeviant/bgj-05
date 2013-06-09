$(document).ready(function() {
	var Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Audio, Touch, UI")
		.setup("lights-out", { maximize: false })
		.controls()
		.touch()
		.enableSound();

	//var W = $('#lights-out');

	var currLevel = 0;
	var levels = ["level-one", "level-two", "level-three", "level-four", "final-level"];

	Q.Sprite.extend("Player", {
		init: function(p) {
			this._super(p, {
				sheet: "player",
				x: 64,
				y: Q.height - 48
			});

			this.add("2d, platformerControls");

			this.on("hit.sprite", function(collision) {
				if (collision.obj.isA("Gateway")) {
					this.destroy();

					if (levels[currLevel] === "final-level") {
						Q.state.inc("score", 1000);
						Q.stageScene("win", 1, { label: Q.state.get("score") });
					} else {
						Q.stageScene(levels[currLevel], 0);
						Q.stageScene("hud", 1);
						Q.state.inc("score", 10);
					}
				}
			});
		},

		step: function(dt) {
			Q.state.inc("time", dt);
		}
	});

	Q.Sprite.extend("Enemy", {
		init: function(p) {
			this._super(p, {
				sheet: "enemy",
				vx: 100
			});

			this.add("2d, aiBounce");

			this.on("hit.sprite", function(collision) {
				if (collision.obj.isA("Player")) {
					Q.stageScene("lose", 1, { label: Q.state.get("score") });
					collision.obj.destroy();
				}
			});
		}
	});

	Q.Sprite.extend("Gateway", {
		init: function(p) {
			this._super(p, { sheet: "gateway" });
		}
	});

	Q.Sprite.extend("BouncePad", {
		init: function(p) {
			this._super(p, { sheet: "bounce-pad" });
		
			this.add("2d");

			this.on("bump.top", function(collision) {
				if (collision.obj.isA("Player")) {
					collision.obj.p.vy = -500;
				}
			});
		}
	});

	Q.Sprite.extend("Orb", {
		init: function(p) {
			this._super(p, { sheet: "orb" });

			this.on("hit.sprite", function(collision) {
				if (collision.obj.isA("Player")) {
					this.destroy();
					Q.state.inc("score", 1);
				}
			});
		}
	});

	Q.UI.Text.extend("Score", {
		init: function(p) {
			this._super({
				label: "Score: 0",
				align: "center",
				x: 50,
				y: 30,
				weight: "normal",
				size: 20
			});

			Q.state.on("change.score", this, "score")
		},

		score: function(score) {
			this.p.label = "Score: " + score;
		}
	});

	Q.UI.Text.extend("Time", {
		init: function(p) {
			this._super({
				label: "Time: 0",
				align: "left",
				x: Q.width - 80,
				y: 30,
				weight: "normal",
				size: 20
			});

			Q.state.on("change.time", this, "time");
		},

		time: function(time) {
			this.p.label = "Time: " + time.toFixed(2);
		}
	});

	Q.scene("title", function(stage) {
		Q.audio.stop();
		Q.load("title.mp3", function() {
			Q.audio.play("title.mp3", { loop: true });
		});

		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 1, speedY: 1 }));

		var container = stage.insert(new Q.UI.Container({
			x: Q.width / 2, y: Q.height / 2, fill: "gray"
		}));

		var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "white", label: "Start Game" }));

		var label = container.insert(new Q.UI.Text({ x: 0, y: -10 - button.p.h, label: stage.options.label }));

		button.on("click", function() {
			Q.state.set("score", 0);
			Q.state.set("time", 0);
			Q.clearStages();
			Q.stageScene(levels[currLevel]);
			Q.stageScene("hud", 1);
		});

		container.fit(20);
	});

	Q.scene("hud", function(stage) {
		stage.insert(new Q.Score());
		stage.insert(new Q.Time());
	}, { stage: 1 });

	Q.scene("lose", function(stage) {
		Q.audio.stop();
		Q.load("lose.mp3", function() {
			Q.audio.play("lose.mp3", { loop: true });
		});

		var container = stage.insert(new Q.UI.Container({
			x: Q.width / 2, y: Q.height / 2, fill: "gray"
		}));

		var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "white", label: "Try Again?" }));

		var label = container.insert(new Q.UI.Text({ x: 0, y: -40 - button.p.h, color: "red", label: "Triangulated!" }));

		var score = container.insert(new Q.UI.Text({ x: 0, y: -5 - button.p.h, label: "Final Score: " + stage.options.label }));

		button.on("click", function() {
			//currLevel = 0;
			currLevel -= 1;
			Q.clearStages();
			Q.stageScene("hud", 1);
			Q.state.dec("score", 10);
			//Q.stageScene("title", 0, { label: "In Search Of Light" });
			Q.stageScene(levels[currLevel]);
		});

		container.fit(20);
	}, { stage: 1 });

	Q.scene("win", function(stage) {
		Q.audio.stop();
		// Q.load("", function() {
		// 	Q.audio.play("", { loop: true });
		// });

		var container = stage.insert(new Q.UI.Container({
			x: Q.width / 2, y: Q.height / 2, fill: "gray"
		}));

		var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "white", label: "Menu" }));

		var label = container.insert(new Q.UI.Text({ x: 0, y: -40 - button.p.h, color: "yellow", label: "Victorious!" }));

		var score = container.insert(new Q.UI.Text({ x: 0, y: -5 - button.p.h, label: "Final Score: " + stage.options.label }));

		button.on("click", function() {
			currLevel = 0;
			Q.clearStages();
			Q.stageScene("title", 0, { label: "In Search Of Light" });
		});

	}, { stage: 1 });

	Q.scene("level-one", function(stage) {
		Q.audio.stop();
		Q.load("vagabonds.mp3", function() {
			Q.audio.play("vagabonds.mp3", { loop: true });
		});

		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 1, speedY: 1}));

		stage.collisionLayer(new Q.TileLayer({
			dataAsset: "level-one.json",
			sheet: "tiles"
		}));

		var player = stage.insert(new Q.Player());

		stage.insert(new Q.Orb({ x: player.p.x + 64, y: Q.height - 50 }))

		stage.insert(new Q.Gateway({ x: Q.width - 48, y: 144 }));

		stage.add("viewport").follow(player, { x: true, y: true });
		stage.viewport.scale = 2;

		currLevel += 1;
	});

	Q.scene("level-two", function(stage) {
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 1, speedY: 1}));

		stage.collisionLayer(new Q.TileLayer({
			dataAsset: "level-two.json",
			sheet: "tiles"
		}));

		var player = stage.insert(new Q.Player());

		stage.insert(new Q.BouncePad({ x: 128, y: Q.height - 32 }));
		stage.insert(new Q.BouncePad({ x: 240, y: Q.height - 256 }));
		stage.insert(new Q.BouncePad({ x: Q.width - 7 * 32 + 16, y: Q.height - 12 * 32 }));

		stage.insert(new Q.Gateway({ x: 64, y: 8 * 32 - 16}));

		stage.add("viewport").follow(player, { x: true, y: true });
		stage.viewport.scale = 2;

		currLevel += 1;
	});

	Q.scene("level-three", function(stage) {
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 1, speedY: 1}));

		stage.collisionLayer(new Q.TileLayer({
			dataAsset: "level-three.json",
			sheet: "tiles"
		}));

		var player = stage.insert(new Q.Player());

		var enemy = stage.insert(new Q.Enemy({ x: player.p.x + 120, y: Q.height - 64 }));

		stage.insert(new Q.Enemy({ x: enemy.p.x + 240, y: Q.height - 64 }));

		stage.insert(new Q.BouncePad({ x: Q.width - 48, y: Q.height - 192 }));

		stage.insert(new Q.Gateway({ x: Q.width - 112 , y: 13 * 32 - 16}));

		stage.add("viewport").follow(player, { x: true, y: true });
		stage.viewport.scale = 2;

		currLevel += 1;
	});

	Q.scene("level-four", function(stage) {
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 1, speedY: 1}));

		stage.collisionLayer(new Q.TileLayer({
			dataAsset: "level-four.json",
			sheet: "tiles"
		}));

		var player = stage.insert(new Q.Player());

		stage.insert(new Q.Enemy({ x: player.p.x + 160, y: Q.height - 96, vx: 200 }));

		stage.insert(new Q.Enemy({ x: player.p.x + 360, y: Q.height - 96, vx: 200 }));

		stage.insert(new Q.Gateway({ x: Q.width - 48 , y: Q.height - 48 }));

		stage.add("viewport").follow(player, { x: true, y: true });
		stage.viewport.scale = 2;

		currLevel += 1;
	});

	Q.load("sprites.png, sprites.json, tiles.png, level-one.json, level-two.json, level-three.json, level-four.json, background.png", function() {
		Q.clearStages();
		Q.sheet("tiles", "tiles.png", { tilew: 32, tileh: 32 });

		Q.compileSheets("sprites.png", "sprites.json");
		Q.compileSheets("tiles.png", "level-one.json");

		Q.stageScene("title", 0, { label: "In Search Of Light" });
	});
});
