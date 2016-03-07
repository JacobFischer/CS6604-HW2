// Mobile Host

_mhID = 1;

function MobileHost(station) {
    this.id = "MH_" + _mhID++;
    this.station = station;

    this._critical = false;
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
    this.station.requestToken(this);
};

MobileHost.prototype.getInfo = function() {
    return {
        title: this.id,
        data: {
            "Requested Token": this.station.hasRequest(this) !== undefined,
            MSS: this.station.id,
            "In Critical Region": this._critical,
        },
    };
};
