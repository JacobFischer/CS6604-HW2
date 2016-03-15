
function generateRing(numHosts, numStations, numProxies) {
    var proxies = [];
    for(var i = 0; i < numProxies; i++) {
        var proxy = new Proxy();
        proxies.push(proxy);
        proxy.next = proxies[i - 1];
    }
    if(proxies[0]) {
        proxies[0].next = proxies[proxies.length - 1];
    }

    var stations = [];
    for(var i = 0; i < numStations; i++) {
        var station = new MobileSupportStation(stations[i-1]);

        if(proxies.length > 0) {
            proxies.randomElement().addStation(station);
        }

        stations.push(station);
    }
    stations[0].next = stations[stations.length - 1]; // to wrap around

    var token = new Token();
    token.pass(proxies[0] || stations[0]);

    var hosts = [];
    for(var i = 0; i < numHosts; i++) {
        hosts.push(new MobileHost(stations.randomElement()));
    }

    var ring = {
        stations: stations,
        proxies: proxies,
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

    for(var i = 0; i < ring.proxies.length; i++) {
        var proxy = ring.proxies[i];

        visNodes.push({
            id: proxy.id,
            label: proxy.id,
            color: "yellow",
        });

        visEdges.push({
            from: proxy.id,
            to: proxy.next.id,
            color: "yellow",
        });

        visEdges.push({
            from: proxy.id,
            to: "center",
            color: "#ddd",
        });
    }

    for(var i = 0; i < ring.stations.length; i++) {
        var station = ring.stations[i];
        var color = "DeepSkyBlue";

        visNodes.push({
            id: station.id,
            label: station.id,
            color: color,
            title: formatInfo(station.getInfo()),
        });

        if(station.proxy) {
            visEdges.push({
                from: station.id,
                to: station.proxy.id,
                color: color,
            });
        }
        else {
            if(station.next) {
                visEdges.push({
                    from: station.id,
                    to: station.next.id,
                    color: color,
                });
            }

            visEdges.push({
                from: station.id,
                to: "center",
                color: "#ddd",
            });
        }
    }

    for(var i = 0; i < ring.hosts.length; i++) {
        var host = ring.hosts[i];
        var color = "SandyBrown";

        var request = host.station.hasRequest(host);
        visNodes.push({
            id: host.id,
            label: host.id + (request !== undefined? " @ " + request : "") + (host.inCritical ? "!!!" : ""),
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
