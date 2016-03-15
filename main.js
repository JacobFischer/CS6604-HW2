var nodes = null;
var edges = null;
var network = null;

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var inform = getUrlParameter("inform");

if(getUrlParameter("demo")) {
    inform = true;
    seed = 149;
}

var USE_REPLICATION = Boolean(getUrlParameter("rep"));

var numberOfMHs = DefaultNumber(parseInt(getUrlParameter("mh")), inform ? 12 : 20);
var numberOfMMSes = DefaultNumber(parseInt(getUrlParameter("mss")), inform ? 5 : 7);
var numberOfProxies =  DefaultNumber(parseInt(getUrlParameter("proxies")), inform ? 0 : 4);
seed = parseInt(getUrlParameter("seed")) || seed;

var ring = generateRing(numberOfMHs, numberOfMMSes, numberOfProxies);

var dataForVisJS;

function updateNetwork(data) {
    if(!data) {
        dataForVisJS = getDataForVisJS(ring);
        data = dataForVisJS;
    }

    network.setData(data);
};

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
};

function draw() {
    destroy();

    // create a network
    var container = document.getElementById('mynetwork');
    var options = {
        edges: {
            smooth: {
                type: 'cubicBezier',
                forceDirection: 'vertical',
                roundness: 0.4
            },
            arrows: 'to',
        },
        physics: {
            //stabilization: false,
        },
    };

    network = new vis.Network(container, {}, options);
    updateNetwork();
};

$(document).ready(function() {
    draw();

    $("#next").on("click", function() {
        clearPrint();
        ring.token.owner.act();
        updateNetwork();
    });

    $print = $("#print");
    $cost = $("#cost");

    _selected = undefined;
    _moving = false;
    function moveText() {
        $selectedInfo.html("Select a MSS to move <strong>" + _selected.id + "</strong> to.");
    };

    var $moveMH = $("#move-mh").on("click", function() {
        _moving = true;
        moveText();
    });

    $selectedInfo = $("#selected-info");
    $requestToken = $("#request-token").on("click", function() {
        if(_selected) {
            clearPrint();
            print(_selected.id + " requesting token.");
            _selected.requestToken();
            updateNetwork();
        }
        else {
            alert("can't request the token on nothing!");
        }
    });

    network
        .on("selectNode", function(e) {
            $selectedInfo.html("");
            var prevSelected = _selected;
            _selected = undefined;
            if(e && e.nodes && e.nodes[0] !== undefined) {
                var id = e.nodes[0];

                var obj = ring.byID[id];

                if(_moving) {
                    if(obj instanceof MobileSupportStation) {
                    	clearPrint();
                        prevSelected.moveTo(obj);
                        updateNetwork();
                        _moving = false;
                    }
                    else {
                        _selected = prevSelected;
                        moveText();
                    }
                    return;
                }

                _selected = obj;

                $selectedInfo.html(formatInfo(obj.getInfo()));
                var mh = Boolean(obj instanceof MobileHost);
                $requestToken.toggle(mh);
                $moveMH.toggle(mh);
            }
        })
        .on("deselectNode", function() {
            $selectedInfo.html("");
        });
});
