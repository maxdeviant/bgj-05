window.addEventListener("load", function() {
	var Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
		.setup()
		.controls()
		.touch();

	Q.Sprite.extend("Player", {
		init: function(p) {
			this._super(p, {
				x: 10,
				y: 10,
				asset: "player.png"
			});

			this.add("2d, platformerControls");
		}
	});

	Q.scene("testlevel", function(stage) {
		stage.insert(new Q.Repeater({ asset: "background.png", speedX: 0.5, speedY: 0.5}));

		var player = stage.insert(new Q.Player());

		stage.add("viewport").follow(player);

	});

	Q.load("player.png, background.png", function() {
		var player = new Q.Player();

		Q.stageScene("testlevel");

	});
});
