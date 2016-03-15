// Proxy, contains MSSs

_proxyID = 1;

function Proxy() {
    this.id = "Proxy_" + _proxyID++;
    this.stations = {};
    this.requests = [];
};

Proxy.prototype.addStation = function(station) {
    this.stations[station.id] = station;
    station.proxy = this;
};

Proxy.prototype.inform = function(host, request) {
    request.proxy = this;
    this.requests.push(request);
};

Proxy.prototype.act = function() {
    print(this.id + " has the Token.");

    if(this.requests.length > 0) {
        var request;
        for(var i = 0; i < this.requests.length; i++) {
            if(this.requests[i].proxy === this) {
                request = this.requests[i];
                break; // we found it
            }
        }

        print(this.id + " delivering Token to " + request.host.station.id + " where " + request.host.id + " is active.");
        this.token.pass(request.host.station);
    }
    else {
        print(this.id + " has no requests in the queue, forwarding to successor " + this.next.id);
        this.token.pass(this.next);
    }
};

Proxy.prototype.requestFullfilled = function(request) {
    this.requests.removeElement(request);
};

Proxy.prototype.getInfo = function() {
    var requests = [];
    for(var i = 0; i < this.requests.length; i++) {
        var host = this.requests[i].host;
        requests.push(host.id + " in " + host.station.id);
    }

    return {
        title: this.id,
        data: {
            "Has Token": this.token ? true : undefined,
            Requests: requests,
            Successor: next.id,
        },
    };
};

