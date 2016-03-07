// Mobile Support Station

_mssID = 1;

function MobileSupportStation(nextStation) {
    this.id = "MSS_" + _mssID++;
    this.next = nextStation;
}
