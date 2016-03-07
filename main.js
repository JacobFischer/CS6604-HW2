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

var numberOfMMSes = parseInt(getUrlParameter("mss"));
var numberOfMHs = parseInt(getUrlParameter("mh"));

var ring = generateRing(numberOfMMSes, numberOfMHs);

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

    var _selected = undefined;
    $selectedInfo = $("#selected-info");
    $requestToken = $("#request-token").on("click", function() {
        if(_selected) {
            clearPrint();
            print(_selected.id + " requesting token.");
            _selected.requestToken();
        }
        else {
            alert("can't request the token on nothing!");
        }
    });

    network
        .on("selectNode", function(e) {
            $selectedInfo.html("");
            _selected = undefined;
            if(e && e.nodes && e.nodes[0] !== undefined) {
                var id = e.nodes[0];

                var obj = ring.byID[id];
                _selected = obj;

                $selectedInfo.html(formatInfo(obj.getInfo()));
                $requestToken.toggle(obj instanceof MobileHost);
            }
        })
        .on("deselectNode", function() {
            $selectedInfo.html("");
        });
});
