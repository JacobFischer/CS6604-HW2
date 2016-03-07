
function generateRing(numStations, numHosts) {
    numStations = numStations || 5;
    numHosts = numHosts || 12;

    var stations = [];
    for(var i = 0; i < numStations; i++) {
        console.log("new station", i);
        stations.push(new MobileSupportStation(stations[i-1]));
    }
    stations[0].next = stations[stations.length - 1]; // to wrap around

    var hosts = [];
    for(var i = 0; i < numHosts; i++) {
        console.log("new host", i);
        hosts.push(new MobileHost(stations.randomElement()));
    }

    return {
        stations: stations,
        hosts: hosts,
    };
};

function getDataForVisJS(ring) {
    var visNodes = [];
    var visEdges = [];

    for(var i = 0; i < ring.stations.length; i++) {
        var station = ring.stations[i];
        var color = "DeepSkyBlue";

        visNodes.push({
            id: station.id,
            label: station.id,
            color: color,
        });

        visEdges.push({
            from: station.id,
            to: station.next.id,
            color: color,
        });
    }

    for(var i = 0; i < ring.hosts.length; i++) {
        var host = ring.hosts[i];
        var color = "SandyBrown";

        visNodes.push({
            id: host.id,
            label: host.id,
            color: color,
        });

        visEdges.push({
            from: host.id,
            to: host.station.id,
            color: color,
        });
    }

    return {
        nodes: visNodes,
        edges: visEdges,
    };
};
