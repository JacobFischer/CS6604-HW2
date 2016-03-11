// Mobile Host

_mhID = 1;

function MobileHost(station) {
    this.id = "MH_" + _mhID++;
    this.moveTo(station);

    this._critical = false;
    this.totalRequests = 0; // h_count, but less stupidly named
};

MobileHost.prototype.act = function() {
    print(this.id + " has the token.");

    if(this._critical) {
        print(this.id +" has finished accessing the critical region.");
        print("Returning token to " + this.station.id);

        this.token.pass(this.station);
    }
    else {
        print(this.id + " has started accessing the critical region.");
    }

    this._critical = !this._critical;
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
            "Requested Token": this.station.hasRequest(this) !== undefined,
            MSS: this.station.id,
            "In Critical Region": this._critical,
        },
    };
};

MobileHost.prototype.moveTo = function(station) {
    var request = this.station && this.station.loseHost(this);

    this.station = station;
    station.joinHost(this, request);
};
