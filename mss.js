// Mobile Support Station

_mssID = 1;

function MobileSupportStation(nextStation) {
    this.id = "MSS_" + _mssID++;
    this.next = nextStation;
    this.requests = [];
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
        print(this.id + " has not hosts requesting the token.");
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
            Requests: requests,
            Successor: next.id,
        },
    };
};
