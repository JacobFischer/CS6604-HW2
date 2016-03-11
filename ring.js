
function generateRing(numStations, numHosts) {
    numStations = numStations || 5;
    numHosts = numHosts || 12;

    var stations = [];
    for(var i = 0; i < numStations; i++) {
        stations.push(new MobileSupportStation(stations[i-1]));
    }
    stations[0].next = stations[stations.length - 1]; // to wrap around

    var token = new Token();
    token.pass(stations[0]);

    var hosts = [];
    for(var i = 0; i < numHosts; i++) {
        hosts.push(new MobileHost(stations.randomElement()));
    }

    var ring = {
        stations: stations,
        hosts: hosts,
        token: token,
        byID: {},
    };

    for(var key in ring) {
        if(ring.hasOwnProperty(key)) {
            var obj = ring[key];

            if(Array.isArray(obj)) {
                for(var i = 0; i < obj.length; i++) {
                    ring.byID[obj[i].id] = obj[i];
                }
            }
            else {
                ring.byID[obj.id] = obj;
            }
        }
    }

    return ring;
};

function getDataForVisJS(ring) {
    var visNodes = [];
    var visEdges = [];

    visNodes.push({
        id: "center",
        label: "Fixed Network",
        color: "#ddd",
    });

    for(var i = 0; i < ring.stations.length; i++) {
        var station = ring.stations[i];
        var color = "DeepSkyBlue";

        visNodes.push({
            id: station.id,
            label: station.id,
            color: color,
            title: formatInfo(station.getInfo()),
        });

        visEdges.push({
            from: station.id,
            to: station.next.id,
            color: color,
        });

        visEdges.push({
            from: station.id,
            to: "center",
            color: "#ddd",
        });
    }

    for(var i = 0; i < ring.hosts.length; i++) {
        var host = ring.hosts[i];
        var color = "SandyBrown";

        visNodes.push({
            id: host.id,
            label: host.id,
            color: color,
            title: formatInfo(host.getInfo()),
        });

        visEdges.push({
            from: host.id,
            to: host.station.id,
            color: color,
        });
    }

    for(var i = 0; i < visNodes.length; i++) {
        var visNode = visNodes[i];
        var obj = ring.byID[visNode.id];
        if(obj && obj.token) {
            visNode.color = {
                border: "red",
                highlight: {
                    border: 'red'
                },
                background: visNode.color,
            };
            visNode.borderWidth = 4;
            visNode.borderWidthSelected = 6;
            break;
        }
    }

    return {
        nodes: visNodes,
        edges: visEdges,
    };
};
