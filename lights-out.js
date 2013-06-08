$(document).ready(function() {
	var Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
		.setup("lights-out", { maximize: false })
		.controls()
		.touch();

	var W = $('#lights-out');

	Q.Sprite.extend("Player", {
		init: function(p) {
			this._super(p, {
				asset: "player.png",
				x: 64,
				y: W.height() - 48
			});

			this.add("2d, platformerControls");
		}
	});

	Q.scene("level-one", function(stage) {
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 0.5, speedY: 0.5}));

		stage.collisionLayer(new Q.TileLayer({
			dataAsset: "level-one.json",
			sheet: "tiles"
		}));

		var player = stage.insert(new Q.Player());

		stage.add("viewport").follow(player, { x: true, y: true });
		//stage.viewport.scale = 2;
	});

	Q.load("player.png, tiles.png, level-one.json, background.png", function() {
		Q.sheet("tiles", "tiles.png", { tilew: 32, tileh: 32 });

		Q.compileSheets("tiles.png", "testlevel.json");

		Q.stageScene("level-one");
	});
});
