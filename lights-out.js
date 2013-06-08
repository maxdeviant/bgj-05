$(document).ready(function() {
	var Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
		.setup({ maximize: true })
		.controls()
		.touch();

	Q.Sprite.extend("Player", {
		init: function(p) {
			this._super(p, {
				asset: "player.png",
				x: 0,
				y: 0
			});

			this.add("2d, platformerControls");
		}
	});

	Q.Sprite.extend("Tile", {
		init: function(p) {
			this._super(p, {
				asset: "tile.png",
				x: 0,
				y: 600,
			});
		}
	});

	Q.scene("testlevel", function(stage) {
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 0.5, speedY: 0.5}));

		var player = stage.insert(new Q.Player());
		var tile = stage.insert(new Q.Tile());

		stage.add("viewport").follow(player);
	});

	Q.load("player.png, tile.png, background.png", function() {
		var player = new Q.Player();
		var tile = new Q.Tile();

		Q.stageScene("testlevel");
	});
});
