
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function DefaultNumber(num, def) {
    return typeof(num) === "number" && !isNaN(num) ? num : def;
};

Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random()*this.length)];
};

$print = undefined;
function print(str) {
    if($print) {
        $print.append(
            $("<li>").html(str)
        );
    }
};

function clearPrint() {
    if($print) {
        $print.html("");
        $selectedInfo.html("");
    }
};

function formatInfo(info) {
    return String("<h2>" + info.title + "</h2><pre>" + JSON.stringify(info.data, null, 4) + "</pre>");
};
