/*
 * String.prototype.format
 *
 * Usage: 'My name is {0}. Welcome to {1}.'.format('Bob', 'Denver');
 * Output: 'My name is Bob. Welcome to Denver.'
 *
 */
String.prototype.format = function() {
    var formattedString = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp('\\{' + i + '\\}', 'gm');
        formattedString = formattedString.replace(reg, arguments[i]);
    }

    return formattedString;
};

