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

	Q.Sprite.extend("Tile", {
		init: function(p) {
			this._super(p, {
				asset: "tile.png",
				x: 0,
				y: 0
			});
		}
	});

	Q.Sprite.extend("AirTile", {
		init: function(p) {
			this._super(p, {
				asset: "air-tile.png",
				x: 0,
				y: 0
			});

		}
	});

	Q.scene("testlevel", function(stage) {
		stage.add("viewport");

		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 0.5, speedY: 0.5}));

		stage.collisionLayer(new Q.TileLayer({
			dataAsset: "testlevel.json",
			sheet: "tiles"
		}));

		var player = stage.insert(new Q.Player());
		//var tiles = [];
		//var AirTile = [];
		
		// for (var i = 0; i < 30; i++) {
		// 	stage.insert(new Q.Tile({
		// 		x: 16 + 32 * i,
		// 		y: W.height() - 16
		// 	}));
		// }

		// for (var i = 0; i < 18; i++) {
		// 	stage.insert(new Q.AirTile({
		// 		x: W.width() - 16,
		// 		y: 8 + 32 * i
		// 	}));

		// 	stage.insert(new Q.AirTile({
		// 		x: 16,
		// 		y: 8 + 32 * i
		// 	}));
		// }

		//stage.add("viewport").follow(player, { x: true, y: false })''

		//stage.add("viewport");
	});

	Q.load("player.png, tiles.png, testlevel.json, background.png", function() {
		Q.sheet("tiles", "tiles.png", { tilew: 32, tileh: 32 });

		//Q.compileSheets("tiles.png", "testlevel.json");

		Q.stageScene("testlevel");
	});
});
