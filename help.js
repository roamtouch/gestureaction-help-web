/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

(function (window, document, gesturekit) {
    'use strict';

    var body = document.body,
        url = 'http://api.gesturekit.com/v1.1/index.php/sdk/getgestures_help/',
        defaults = {
            'title': 'Gestures'
        };

    function render(gesture) {
        return [
            '<div class="gk-help-gesture">',
            '<img src="data:image/png;base64,' + gesture.img + '" height="150">',
            '<p class="gk-help-label">' +  gesture.method + '</p>',
            '<p class="gk-help-label">' +  gesture.img_description + '</p>',
            '</div>'
        ].join('');
    }

    function createNode(tag, classes, parent) {
        parent = parent || body;

        var node = document.createElement(tag);
        node.className = classes;

        parent.appendChild(node);

        return node;
    }

    function customizeOptions(options) {
        var prop;
        for (prop in defaults) {
            if (!options.hasOwnProperty(prop)) {
                options[prop] = defaults[prop];
            }
        }
        return options;
    }

    /**
     * Creates a new instance of Help.
     * @constructor
     * @returns {help}
     */
    function Help(options) {
        this._init(options);
    }

    /**
     * Initializes a new instance of Help.
     * @memberof! Help.prototype
     * @function
     * @private
     * @returns {help}
     */
    Help.prototype._init = function (options) {
        var that = this;

        this._options = customizeOptions(options || {});

        this.container = createNode('div', 'gk-help-container gk-help-hide');

        this.title = createNode('h2', 'gk-help-title', this.container);
        this.title.innerHTML = this._options.title;

        this.closeBtn = createNode('button', 'gk-help-close', this.container);

        this.closeBtn.addEventListener('touchend', function () {
            that.hide();
        });

        if (this._options.uid) {
            this.loadGestures();
        }

        return this;
    };

    /**
     * Show help.
     * @memberof! Help.prototype
     * @function
     * @returns {help}
     * @example
     * // Show help.
     * help.show();
     */
    Help.prototype.show = function () {
        this.container.style.display = 'block';
        gesturekit.disable();

        return this;
    };

    /**
     * Hide help.
     * @memberof! Help.prototype
     * @function
     * @returns {help}
     * @example
     * // Hide help.
     * help.hide();
     */
    Help.prototype.hide = function () {
        this.container.style.display = 'none';
        gesturekit.enable();

        return this;
    };

    /**
     * Loads gestures.
     * @memberof! Help.prototype
     * @function
     * @returns {help} Returns a new instance of Help.
     */
    Help.prototype.loadGestures = function () {
        var that = this,
            xhr = new window.XMLHttpRequest(),
            status,
            response;

        xhr.open('GET', url + this._options.uid);

        // Add events
        xhr.onreadystatechange = function () {
            if (xhr.readyState === xhr.DONE) {
                status = xhr.status;

                if ((status >= 200 && status < 300) || status === 304 || status === 0) {
                    response = JSON.parse(xhr.response || xhr.responseText);
                    that.renderGestures(response.gestureset.gestures);
                }
            }
        };

        xhr.send();

        return this;
    };

    /**
     * Render a given collection of gestures.
     * @memberof! Help.prototype
     * @function
     * @returns {help}
     */
    Help.prototype.renderGestures = function (gestures) {
        var tmp = '';

        gestures.forEach(function (gesture) {
            tmp += render(gesture);
        });

        this.container.insertAdjacentHTML('beforeend', tmp);

        return this;
    };

    /**
     * Expose Help
     */
    // AMD suppport
    if (typeof window.define === 'function' && window.define.amd !== undefined) {
        window.define('Help', [], function () {
            return Help;
        });

    // CommonJS suppport
    } else if (typeof module !== 'undefined' && module.exports !== undefined) {
        module.exports = Help;

    // Default
    } else {
        window.Help = Help;
    }

}(this, this.document, this.gesturekit));