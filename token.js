// Token - the token that is passed around

function Token() {
    this.id = "Token";
};

Token.prototype.pass = function(newOwner) {
    if(this.owner) {
        this.owner.token = undefined;
    }

    this.owner = newOwner;
    this.owner.token = this;
};

Token.prototype.getInfo = function() {
    return {
        title: this.id,
        data: {
            "Owner": this.owner ? this.owner.id : null
        },
    };
};
