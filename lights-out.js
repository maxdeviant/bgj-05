$(document).ready(function() {
	var Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
		.setup("lights-out", { maximize: false })
		.controls()
		.touch();

	Q.Sprite.extend("Player", {
		init: function(p) {
			this._super(p, {
				asset: "player.png",
				x: 64,
				y: $('#lights-out').height() - 48
			});

			this.add("2d, platformerControls");
		}
	});

	Q.Sprite.extend("Tile", {
		init: function(p) {
			this._super(p, {
				asset: "tile.png",
				x: 0,
				y: 0
			});
		}
	});

	Q.Sprite.extend("Air", {
		init: function(p) {
			this._super(p, {
				asset: "air.png",
				x: 0,
				y: 0
			});

		}
	});

	Q.scene("testlevel", function(stage) {
		stage.add("viewport");

		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 0.5, speedY: 0.5}));

		var player = stage.insert(new Q.Player());
		var tiles = [];
		
		for (var i = 0; i < 30; i++) {
			tiles[i] = stage.insert(new Q.Tile({
				x: 16 + 32 * i,
				y: $('#lights-out').height() - 16
			}));
		}

		var air = stage.insert(new Q.Air({
			x: 16,
			y: 16
		}));

		//stage.add("viewport").follow(player, { x: true, y: false })''

		//stage.add("viewport");
	});

	Q.load("player.png, tile.png, air.png, background.png", function() {
		Q.stageScene("testlevel");
	});
});
