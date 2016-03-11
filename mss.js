// Mobile Support Station

_mssID = 1;

function MobileSupportStation(nextStation) {
    this.id = "MSS_" + _mssID++;
    this.next = nextStation;
    this.requests = [];
    this.hosts = {};
}

MobileSupportStation.prototype.hasRequest = function(host) {
    for(var i = 0; i < this.requests.length; i++) {
        var request = this.requests[i];

        if(request.host === host) {
            return i;
        }
    }
};

MobileSupportStation.prototype.requestToken = function(host) {
    print(host.id + " has added a request to " + this.id + " and is queued at " + this.requests.length);

    if(this.hasRequest(host) !== undefined) {
        var str = host.id + " cannot request the token more than once";
        print(str);
        alert(str);
        return;
    }

    this.requests.push({
        host: host,
    });
};

MobileSupportStation.prototype.act = function() {
    print(this.id + " has the token.");

    if(this.requests.length > 0) {
        var request = this.requests.shift();
        print(this.id + " has hosts requesting the token.");
        print(this.id + " is delivering token to " + request.host.id);

        this.token.pass(request.host);
    }
    else {
        print(this.id + " has no hosts requesting the token.");
        print(this.id + " forwarding token to successor " + this.next.id);

        this.token.pass(this.next);
    }
};

MobileSupportStation.prototype.getInfo = function() {
    var requests = [];
    for(var i = 0; i < this.requests.length; i++) {
        requests.push(this.requests[i].host.id);
    }

    return {
        title: this.id,
        data: {
            "Has Token": this.token ? true : undefined,
            Requests: requests,
            Successor: next.id,
            Hosts: Object.keys(this.hosts),
        },
    };
};

// this is basically join(mh_id, req_loc) from the slides
MobileSupportStation.prototype.joinHost = function(host, request) {
    this.hosts[host.id] = host;

    if(request) {
        this.requests.push(request);
    }

};

MobileSupportStation.prototype.loseHost = function(host) {
    delete this.hosts[host.id];

    var index = this.hasRequest(host);
    if(index !== undefined) {
        return this.requests.splice(index, 1)[0]; // remove the request at that index and return it
    }
};
