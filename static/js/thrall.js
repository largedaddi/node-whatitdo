var presentation = new World($('.container'), function onConnection () {
    var mainCharacter = this.mainCharacter;
    var socket = this.socket;

    this.$container.click(function onBodyClick (event) {
        var destination = {
            left: event.pageX,
            top: event.pageY
        };

        mainCharacter.moveToPoint(destination);

        socket.emit('move', {
            characterId: mainCharacter.id,
            destination: destination
        });
    });

    $('body').keydown(function onKeyUp (event) {
        if ((event.which >= 48 && event.which <= 57) || // number
            (event.which >= 65 && event.which <= 90) || // letter
            event.which == 32) // space
        {
            var letter = String.fromCharCode(event.which);
            mainCharacter.speak(letter);
            socket.emit('speak', {
                characterId: mainCharacter.id,
                utterance: letter
            });
        }
        else if (mainCharacter.utterance != '' && (event.which == 8 || event.which == 46)) {
            event.preventDefault();
            mainCharacter.backspace();
            socket.emit('speakBackspace', mainCharacter.id);
        }
    });

    socket.emit('new character', mainCharacter);
});
