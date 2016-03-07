// represents a user in this system, they must have a location, and can move around nodes (nodes cannot move)

var colors = ["orange", "limegreen", "DeepPink", "Wheat", "MediumOrchid"];
var colorIndex = 0;

function User(id, location) {
    this.id = id;
    this.color = colors[colorIndex++];
    this.location = location;
    this.homeLocation = location;
    location.registerUser(this);

    this.calls = 0;
    this.moves = 0;
    this._replicating = {}; // people we know the location via replication
    this._replicatedOn = {}; // people that know our location via replication
    this._calculateCMR();
};

User.prototype.move = function(newLocation) {
    this.moves++;
    this._calculateCMR();

    newLocation.registerUser(this);

    var updates = 0;
    var node = this.location;
    while(node) {
        updates++;
        print("Updating Node " + node.id + " to track User " + this.id + " in sub tree");
        node = node.parent;
    }

    for(var userID in this._replicatedOn) {
        if(this._replicatedOn.hasOwnProperty(userID)) {
            updates++;
            this._replicatedOn[userID]._replicating[this.id] = this.location;
            if(useReplication) {
                print("Updating Replication on User " + userID + " to User " + this.id + "'s new Location");
            }
        }
    }

    return updates;
};

User.prototype._calculateCMR = function() {
    this.cmr = this.calls / this.moves;
};

User.prototype.called = function(callee) {
    this.calls++;
    this._calculateCMR();

    var replicatedOn
    var replicating;

    if(this.cmr > 1) { // then we are calling more than we are moving, so replicate the person we are calling's location for faster lookup
        replicating = this
        replicatedOn = callee;
    }
    else if(this.cmr >= 0) { // then we are moving more than calling, so they should cache our location
        replicating = callee;
        replicatedOn = this;
    }

    if(replicating) {
        if(useReplication) {
            print("Replicating location of User " + replicatedOn.id + " on User " + replicating.id);
        }

        replicating._replicating[replicatedOn.id] = replicatedOn.location;
        replicatedOn._replicatedOn[replicating.id] = replicating;
    }
};

User.prototype.replicatedLocationfor = function(user) {
    return this._replicating[user.id];
};

User.prototype.getInfo = function() {
    var replications;
    if(showForwardingPointers) {
        replications = {};
        for(var userID in this._replicating) {
            if(this._replicating.hasOwnProperty(userID)) {
                replications["User " + userID] = "Node " + this._replicating[userID].id;
            }
        }
    }

    return {
        title: "User " + user.id,
        data: {
            location: "Node " + this.location.id,
            calls: this.calls,
            moves: this.moves,
            CMR: this.cmr,
            home: "Nove " + this.homeLocation.id,
            replicating: replications,
        }
    };
};
