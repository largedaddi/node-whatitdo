var World = function ($container, onConnect, isMaster) {
	this.characterImages = ['amg1.png', 'amg4.png', 'avt1.png', 'jli1.png'];
	this.characterCache = {};
	this.$container = $container;
  this.mainCharacter = isMaster ? null : this._createCharacter();
  this.socket = null;

  this._setupSockets(onConnect);
  this._setupReveal(isMaster);
};

World.prototype._setupSockets = function (onConnect) {
	this.socket = io.connect(null, {port: 9001});
  var self = this;

	this.socket.on('connect', onConnect.bind(this));

  this.socket.on('load', self.loadExistingCharacters.bind(this));

  this.socket.on('enter', self.insertCharacter.bind(this));

  this.socket.on('move', self.moveCharacter.bind(this));

  this.socket.on('exit', function onExit (characterId) {
      var character = self.findCharacter(characterId);
      self.removeCharacter(character);
  });

  this.socket.on('speak', function onSpeak (data) {
      var character = self.findCharacter(data.characterId);
      character.speak(data.utterance);
  });

  this.socket.on('speakBackspace', function onspeakBackspace (characterId) {
      var character = self.findCharacter(characterId)
      character.backspace();
  });
};

World.prototype._setupReveal = function (isMaster) {
	Reveal.initialize({
	  controls: false,
	  progress: false,
	  slideNumber: false,
	  history: false,
	  keyboard: true,
	  overview: false,
	  center: true,
	  touch: true,
	  loop: false,
	  rtl: false,
	  fragments: true,
	  autoSlide: 0,
	  autoSlideStoppable: true,
	  mouseWheel: false,
	  hideAddressBar: true,
	  previewLinks: false,
	  transition: 'none', // default/cube/page/concave/zoom/linear/fade/none
	  transitionSpeed: 'default', // default/fast/slow
	  backgroundTransition: 'default', // default/none/slide/concave/convex/zoom
	  viewDistance: 3,
	  parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
	  parallaxBackgroundSize: '' // CSS syntax, e.g. "2100px 900px"
	});

	this.socket.on('slidechanged', function onSlideChange (data) {
		Reveal.slide(data.indexH, data.indexV, data.indexF);
	});

	if (isMaster) {
		Reveal.addEventListener('slidechanged', notifyServer);
		Reveal.addEventListener('fragmentshown', notifyServer);
		Reveal.addEventListener('fragmenthidden', notifyServer);

		var self = this;
		function notifyServer () {
			var data = {
				indexV: Reveal.getIndices().v,
				indexH: Reveal.getIndices().h,
				indexF: Reveal.getIndices().f || 0
			};
			self.socket.emit('slidechanged', data);
		}
	}
};

World.prototype.findCharacter = function (id) { 
  return this.characterCache[id];
};

World.prototype.loadExistingCharacters = function (characters) {
	var self = this;
	characters.forEach(function forEachCharacter (e, i, a) {
      self.insertCharacter(e);
  });
};

World.prototype._createCharacter = function () {
	var characterIndex = Math.floor(Math.random() * this.characterImages.length);

	var newCharacter = new Character({
		$parent: this.$container,
	  ip: 1230 + Math.floor((Math.random() * 10 + 1)),
	  image: this.characterImages[characterIndex]
  });

  return newCharacter;
};

World.prototype.insertCharacter = function (character) {
	if (!('getElement' in character)) {
      var newCharacter = Object.create(Character.prototype);
      $.extend(newCharacter, character);
      newCharacter.insert(this.$container);

      this.characterCache[newCharacter.id] = newCharacter;
  } 
};

World.prototype.moveCharacter = function (characterData) {
  var character = this.findCharacter(characterData.characterId);
  character.moveToPoint(characterData.destination);
};

World.prototype.removeCharacter = function (character) {
	character.remove();
  delete this.characterCache[character.id];
};
