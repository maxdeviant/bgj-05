$(document).ready(function() {
	var Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
		.setup("lights-out", { maximize: false })
		.controls()
		.touch();

	var W = $('#lights-out');

	var currLevel = 0;
	var levels = ["level-one", "level-two"];

	Q.Sprite.extend("Player", {
		init: function(p) {
			this._super(p, {
				sheet: "player",
				x: 64,
				y: W.height() - 48
			});

			this.add("2d, platformerControls");

			this.on("hit.sprite", function(collision) {
				if (collision.obj.isA("Gateway")) {
					Q.stageScene(levels[currLevel], 1);
					this.destroy();
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
		
			this.add("2d, aiBounce");


			this.on("bump.top", function(collision) {
				if (collision.obj.isA("Player")) {
					collision.obj.p.vy = -500;
				}

			});
		}
	});

	//var player = new Q.Player();

	Q.scene("level-one", function(stage) {
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 1, speedY: 1}));

		stage.collisionLayer(new Q.TileLayer({
			dataAsset: "level-one.json",
			sheet: "tiles"
		}));

		var player = stage.insert(new Q.Player());

		stage.insert(new Q.Gateway({ x: W.width() - 48, y: 144 }));

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

		stage.insert(new Q.BouncePad({ x: 128, y: W.height() - 48 }));

		stage.add("viewport").follow(player, { x: true, y: true });
		stage.viewport.scale = 2;
	});

	Q.load("sprites.png, sprites.json, tiles.png, level-one.json, level-two.json, background.png", function() {
		Q.sheet("tiles", "tiles.png", { tilew: 32, tileh: 32 });

		Q.compileSheets("sprites.png", "sprites.json");
		Q.compileSheets("tiles.png", "level-one.json");

		Q.clearStages();
		//Q.stageScene(levels[currLevel]);
		Q.stageScene("level-two");
	});
});
