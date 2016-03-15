// Mobile Host

_mhID = 1;

function MobileHost(station) {
    this.id = "MH_" + _mhID++;
    this.moveTo(station);

    this.inCritical = false;
    this.totalRequests = 0; // h_count, but less stupidly named
};

MobileHost.prototype.act = function() {
    print(this.id + " has the token.");

    if(this.inCritical) {
        print(this.id +" has finished accessing the critical region.");
        print("Returning token to " + this.station.id);

        this.token.pass(this.station);
    }
    else {
        print(this.id + " has started accessing the critical region.");
    }

    this.inCritical = !this.inCritical;
};

MobileHost.prototype.requestToken = function() {
    this.totalRequests++;
    this.station.requestToken(this);
};

MobileHost.prototype.getInfo = function() {
    return {
        title: this.id,
        data: {
            "Has Token": this.token ? true : undefined,
            "Requested Token": this.hasRequestedToken(),
            MSS: this.station.id,
            "In Critical Region": this.inCritical,
        },
    };
};

MobileHost.prototype.hasRequestedToken = function() {
    return this.station.hasRequest(this) !== undefined;
};

MobileHost.prototype.moveTo = function(station) {
    var request = this.station && this.station.loseHost(this);

    if(this.station) {
        print(this.id + " is moving and has request, need to inform " + this.station.id + " of move to " + station.id);
    }

    station.joinHost(this, request);
    this.station = station;
};
