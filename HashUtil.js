;(function (parent, $, undefined) {

    var location = document.location;
    var e = encodeURIComponent;
    var d = decodeURIComponent;

    // Ensures no '#' in the beginning
    function getHash() {

        var h = location.hash;
        return (h.length > 0 && h[0] == '#') ? h.substring(1) : h
    }

    // Get value from key from hash parameters. If it doesn't exist returns null
    function getValue(key) {
        var hash = getHash();
        var params = hash.split('&');
        for (var i = 0; i < params.length; i++) {
            var paramPair = params[i].split('=');
            if (d(paramPair[0]) == key) {
                return typeof paramPair[1] === 'undefined' ? null : d(paramPair[1]);
            }
        }

        return null;
    }

    // Set value from to hash parameters
    function setValue(key, value) {
        var existingValue = getValue(key);
        if (existingValue != null) {
            location.hash = getHash().replace(
                new RegExp('(&|^)?(' + key + ')=([^&$]*)'),
                '$1$2' + '=' + e(value));

        } else {
            if (getHash() != '') {
                location.hash += '&';
            }

            location.hash += key + '=' + e(value);
        }
    }

    // Set all properties of a flat object to the hash parameters. The existing ones with different key will not be changed
    function setObject(object) {
        for (var pair in object) {
            setValue(e(pair), object[pair]);
        }
    }

    // Get all hash parameters as a flat object.
    function getObject() {
        var result = {}
        var hash = getHash();
        if (hash != '') {
            var params = hash.split('&');
            for (var i = 0; i < params.length; i++) {
                var paramPair = d(params[i]).split('=');
                result[paramPair[0]] = typeof paramPair[1] === 'undefined' ? null : d(paramPair[1]);
            }
        }
        return result;
    }

    parent.HashUtil = {
        get: function (key) {
            if (typeof key === 'undefined') {
                return getObject();

            } else {
                return getValue(key);

            }
        },

        set: function (key, value) {
            if (typeof key === 'string' && typeof value !== 'undefined') {
                setValue(key, value)

            } else if (typeof key === 'object') {
                setObject(key);

            } else {
                throw new Error('Incorrect call of set method.');
            }
        }
    };

})(window, Wican, jQuery);