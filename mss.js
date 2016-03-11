// Mobile Support Station

_mssID = 1;
GlobalRequests = [];

function MobileSupportStation(nextStation) {
    this.id = "MSS_" + _mssID++;
    this.next = nextStation;
    this.requests = [];
    this.replications = []; // replication based "delivery" queue
    this.hosts = {};
};

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

    var request = {
        host: host,
    };

    // proxy stuff
    if(this.proxy) {
        this.proxy.inform(host, request);
    }
    // end proxy stuff

    // replication stuff
    var mss = this.next;
    var tempPriorities = [ this.replicate(request) ];
    while(mss !== this) {
        tempPriorities.push(mss.replicate(request));
        mss = mss.next;
    }

    var maxPriority = Math.max.apply(Math.max, tempPriorities);

    mss = this.next;
    while(mss !== this) {
        mss.finalizeReplication(request, maxPriority);
        mss = mss.next;
    }

    this._sortReplications();
    // end replcation stuff

    this.requests.push(request);
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
        if(this.proxy) {
            print(this.id + " returning Token to " + this.proxy.id);
            this.token.pass(this.proxy);
        }
        else {
            print(this.id + " forwarding token to successor " + this.next.id);
            this.token.pass(this.next);
        }
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

    // delete the request from all replications
    var mss = this;
    do {
        for(var i = 0; i < mss.replications.length; i++) {
            var replication = mss.replications[i];
            if(replication.request.host === host) {
                mss.replications.splice(i, 1);
                break;
            }
        }
        mss = mss.next;
    } while(mss !== this);

    var index = this.hasRequest(host);
    if(index !== undefined) {
        return this.requests.splice(index, 1)[0]; // remove the request at that index and return it
    }
};

MobileSupportStation.prototype.replicate = function(request) {
    var replication = {
        request: request,
        deliverable: false,
        priority: -1,
    };

    for(var i = 0; i < this.replications.length; i++) {
        replication.priority = Math.max(replication.priority, this.replications[i].priority);
    }

    replication.priority++;
    return replication.priority;
};

MobileSupportStation.prototype.finalizeReplication = function(request, priority) {
    for(var i = 0; i < this.replications.length; i++) {
        var replication = this.replications[i];
        if(replication.request === request) {
            replication.priority = priority;
            replication.deliverable = true;
            break;
        }
    }

    this._sortReplications();
};

MobileSupportStation.prototype._sortReplications = function(request, priority) {
    this.replications.sort(function(a, b) {
        return b.priority - a.priority;
    });
};
