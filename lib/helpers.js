// Global helpers

// defaultTime returns the default time for issues
defaultTime = function() {
    var day = 86400;
    return Math.floor((new Date()).getTime()/1000) + day;
}
