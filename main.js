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

var $print;
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
}

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
    $print = $("#print");
    $cost = $("#cost");
    var $caller = $("#caller");
    var $callee = $("#callee");

    var $userSelect = $(".user-select");
    var htmlStr = "";
    for(var i = 0; i < ring.hosts.length; i++) {
        var id = ring.hosts[i].id;
        htmlStr += '<option value="' + id + '">' + id + '</option>';
    }
    $userSelect.html(htmlStr);

    var flip = function($flipping, $flipped) {
        var val = $flipped.val();
        var options = $flipping.children();
        for(var i = 0; i < options.length; i++) {
            var $option = $(options[i]);
            if($option.val() !== val) {
                $flipping.val($option.val());
                break;
            }
        }
    }

    $caller.on("change", function() {
        flip($callee, $caller);
    });

    $callee.on("change", function() {
        flip($caller, $callee);
    });

    $useForwardingPointers = $("#use-forwarding-pointers");
    $useForwardingPointers.on("change", function() {
        showForwardingPointers = $useForwardingPointers.is(':checked');
        updateNetwork();
    });

    $useReplication = $("#use-replication");
    $useReplication.on("change", function() {
        useReplication = $useReplication.is(':checked');
    });

    flip($callee, $caller);

    $moveUserTo = $("#move-user-to")
        .attr("max", tree.length);

    $("#move-user").on("submit", function(e) { // try to move the user
        e.preventDefault();
        var $form = $(this);
        var $number = $moveUserTo;

        var newLocationID = parseInt($number.val());
        var newLocation = tree[newLocationID];
        if(!newLocation) {
            alert("Error: invalid new location id '" + newLocationID + "'.");
            return;
        }

        var user = usersByID[$("#move-user-id").val()];

        if(!user) {
            alert("Error: could not find the user '" + id +"'.");
            return;
        }

        clearPrint();
        var updates = user.move(newLocation);
        $cost.html("Update total cost: " + updates + " updates.");
        $number.val(0);
        updateNetwork();
    });

    $("#locate-via-pointer").on("click", function() {
        locate(locateViaPointers);
    });

    $("#locate-via-database").on("click", function() {
        locate(locateViaDatabase);
    });

    $selectedInfo = $("#selected-info");
    network
        .on("selectNode", function(e) {
            $selectedInfo.html("");
            if(e && e.nodes && e.nodes[0] !== undefined) {
                var id = e.nodes[0];
                var intID = parseInt(id);

                var obj = (isNaN(intID) ? usersByID[id] : tree[intID]);
                console.log(obj);

                $selectedInfo.html(formatInfo(obj.getInfo()));
            }
        })
        .on("deselectNode", function() {
            $selectedInfo.html("");
        });
});
