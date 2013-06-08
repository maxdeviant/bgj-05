$(document).ready(function() {
	var Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
		.setup("lights-out", { maximize: false })
		.controls()
		.touch();

	//var W = $('#lights-out');

	var currLevel = 0;
	var levels = ["level-one", "level-two", "level-three"];

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
					Q.stageScene(levels[currLevel], 0);
					Q.stageScene("hud", 1);
					Q.state.inc("score", 10);
				}
			});
		},

		step: function(dt) {
			Q.state.inc("time", dt);
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

	Q.Sprite.extend("Switch", {
		init: function(p) {
			this._super(p, { sheet: "switch-unactivated" });

			this.on("bump.top", function(collision) {
				if (collision.obj.isA("Player")) {
					alert("switch activated");
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

	Q.Sprite.extend("Dark", {
		init: function(p) {
			this._super(p, {
				color: "#000000",
				w: Q.width,
				h: Q.height
			});
		},
		draw: function(ctx) {
			ctx.fillStyle = this.p.color;
			//ctx.globalAlpha = 0.5;
			ctx.fillRect(0, 0, Q.width, Q.height);
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
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 1, speedY: 1}));

		var container = stage.insert(new Q.UI.Container({
			x: Q.width / 2, y: Q.height / 2, fill: "#404040"
		}));

		var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "white", label: "Start Game" }));

		var label = container.insert(new Q.UI.Text({ x: 0, y: -10 - button.p.h, label: stage.options.label }));

		button.on("click", function() {
			Q.state.set("score", 0);
			Q.state.set("time", 0);
			Q.clearStages();
			Q.stageScene("level-one");
			Q.stageScene("hud", 1);
		});

		container.fit(20);
	});

	Q.scene("hud", function(stage) {
		stage.insert(new Q.Score());
		stage.insert(new Q.Time());
	}, { stage: 1 });

	Q.scene("level-one", function(stage) {
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 1, speedY: 1}));

		stage.collisionLayer(new Q.TileLayer({
			dataAsset: "level-one.json",
			sheet: "tiles"
		}));

		var player = stage.insert(new Q.Player());

		stage.insert(new Q.Orb({ x: player.p.x + 64, y: Q.height - 50 }))

		stage.insert(new Q.Gateway({ x: Q.width - 48, y: 144 }));

		var mask = new Q.Dark();
		stage.insert(mask);
		mask.render(Q.ctx);

		stage.add("viewport").follow(player, { x: true, y: true });
		stage.viewport.scale = 2;

		currLevel += 1;
	});

	Q.scene("level-two", function(stage) {
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 0.5, speedY: 0.5}));

		stage.collisionLayer(new Q.TileLayer({
			dataAsset: "level-two.json",
			sheet: "tiles"
		}));

		var player = stage.insert(new Q.Player());

		stage.insert(new Q.BouncePad({ x: 128, y: Q.height - 32 }));
		stage.insert(new Q.BouncePad({ x: 240, y: Q.height - 256 }));
		stage.insert(new Q.BouncePad({ x: Q.width - 7 * 32 + 16, y: Q.height - 12 * 32 }));

		stage.insert(new Q.Gateway({ x: 64, y: 8 * 32 - 16}));

		//stage.insert(new Q.Switch({ x: 256, y: Q.height - 32 }));

		stage.add("viewport").follow(player, { x: true, y: true });
		stage.viewport.scale = 2;

		currLevel += 1;
	});

	Q.scene("level-three", function(stage) {
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 0.5, speedY: 0.5}));

		stage.collisionLayer(new Q.TileLayer({
			dataAsset: "level-three.json",
			sheet: "tiles"
		}));

		var player = stage.insert(new Q.Player());

		// stage.insert(new Q.BouncePad({ x: 128, y: Q.height - 32 }));
		// stage.insert(new Q.BouncePad({ x: 240, y: Q.height - 256 }));
		// stage.insert(new Q.BouncePad({ x: Q.width - 7 * 32 + 16, y: Q.height - 12 * 32 }));

		// stage.insert(new Q.Gateway({ x: 64, y: 8 * 32 - 16}));

		//stage.insert(new Q.Switch({ x: 256, y: Q.height - 32 }));

		stage.add("viewport").follow(player, { x: true, y: true });
		stage.viewport.scale = 2;

		currLevel += 1;
	});

	Q.load("sprites.png, sprites.json, tiles.png, level-one.json, level-two.json, level-three.json, background.png", function() {
		Q.clearStages();
		Q.sheet("tiles", "tiles.png", { tilew: 32, tileh: 32 });

		Q.compileSheets("sprites.png", "sprites.json");
		Q.compileSheets("tiles.png", "level-one.json");

		//Q.stageScene(levels[currLevel]);
		Q.stageScene("title", 0, { label: "In Search Of Light" });
	});
});
