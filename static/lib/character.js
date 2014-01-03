var Character = function (config) {
    var ms = new Date().getTime();
    this.id = config.ip + ms;
    this.image = config.image;
    this.$element = null;
    this.position = null;
    this.utterance = '';
    this.messageTimer = null;
    this.directionClass = '';
    this.create();
};

Character.prototype.create = function () {
    // this.$element = $('<div>', {
    var $element = $('<div>', {
        id: this.id,
        class: 'character still'
    });

    if (!this.position) {
        this.position = {
            top: Math.floor(Math.random() * 500),
            left: Math.floor(Math.random() * 500),
        };
    }

    var csses = $.extend({
        'background-image': 'url("/static/assets/' + this.image + '")'
    }, this.position);

    $element.css(csses);

    // if (this.position) {
    //     $element.css(this.position);
    // } else {
    //     $element.css({
    //         top: Math.floor(Math.random() * 500),
    //         left: Math.floor(Math.random() * 500),
    //     })
    // }

    // this.$element.appendTo($body);
    $element.appendTo($body);
};

// Character.prototype.getElement = (function () {
Character.prototype.getElement = function () {
    var e = null;
    // return function () {
        // 'this' refers to "instantiated" character
        // if (e === null) {
            e = $('#' + this.id);
        // } 

        return e;
    };
// })();

Character.prototype.remove = function () {
    // if (this.$element) {
    //     this.$element.remove();
    // }
    this.getElement().remove();
    this.utterance = '';
};

Character.prototype.speak = function (message) {
    if (this.messageTimer) {
        clearTimeout(this.messageTimer);
    }

    // TODO: display message
    var $speechCloud;
    if (!this.utterance) {
        $speechCloud = $('<div>', {
            id: 'sc' + this.id,
            class: 'speechCloud'
        });

        $speechCloud.appendTo(this.getElement());
    } else {
        $speechCloud = $('#sc' + this.id);
    }

    this.updateUtterance(message);

    $speechCloud.text(this.utterance);
    
    // hide message after 
    var self = this;
    this.messageTimer = setTimeout(function () {
        self.removeUtterance();
    }, 5000);
};

Character.prototype.backspace = function () {
    if (this.messageTimer) {
        clearTimeout(this.messageTimer);
    }

    // remove last character
    this.utterance = this.utterance.substring(0, this.utterance.length - 1);
    // update speech cloud
    $('#sc' + this.id).text(this.utterance);

    if (!this.utterance) {
        clearTimeout(this.messageTimer);
        this.removeUtterance();
    } else {
        // hide message after
        var self = this;
        this.messageTimer = setTimeout(function () {
            self.removeUtterance();
        }, 5000);
    }
};

Character.prototype.updateUtterance = function (message) {
    this.utterance += message;

    var over = this.utterance.length - 35;
    if (over > 0) {
        this.utterance = this.utterance.substr(over);
    }
};

Character.prototype.removeUtterance = function () {
    $('#sc' + this.id).remove();
    this.utterance = '';
};

Character.prototype.moveToPoint = function (destination) {
    var $characterElement = this.getElement();

    var position = this.position;
    if($characterElement.is(':animated')) {
        $characterElement.stop();
        $characterElement.removeClass(this.directionClass);
        position = $characterElement.position();
        clearTimeout(this.walkingTimeout);
    }

    var deltaX = (destination.left - position.left);
    var deltaY = (destination.top - position.top);
    var distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    var time = distance / (125 / 1000);

    var directionClass = this.determineDirection(destination);
    $characterElement.addClass(directionClass);

    var self = this;    
    $characterElement.animate(destination, time, function onAnimationEnd () {
        // update new position
        self.position = destination;
    });

    this.walkingTimeout = setTimeout(function () {
        $characterElement.removeClass(directionClass);//.addClass('still');
    }, ((time < 300) ? 300 : time));
};

Character.prototype.determineDirection = function (destination) {
    var directionClass = '';
    if (destination.left > this.position.left + 65) {
        directionClass = 'right';
    } else if (destination.left < this.position.left - 65) {
        directionClass = 'left';
    } else if (destination.top > this.position.top) {
        directionClass = 'front';
    } else {
        directionClass = 'back';
    }

    this.directionClass = directionClass;

    return directionClass;
};