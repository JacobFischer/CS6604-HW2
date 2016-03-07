// This is where we manipulate the Nodes to show the various caller <--> callee locators

function locateViaPointers(caller, callee, endNode, originalData) {
    // do LCA to travel upwards from the caller
    var hops = 0;
    print("Traversing from " + caller.location.id + " upwards to LCA(caller.location, callee.location)");

    var lca = caller.location;
    while(lca) {
        if(lca.contains(endNode) || lca === endNode) {
            print("&rarr; Node " + lca.id + " is LCA(caller.location, callee.location)");
            break;
        }

        if(lca.parent) {
            originalData.edges.push({ // we need to show a red edge over the blue one, so we add it here
                from: lca.id,
                to: lca.parent.id,
                color: "red",
            });

            print("&uarr; Node " + lca.id + " is not LCA, so need to continue looking upwards");
            hops++;

            lca = lca.parent;
        }
    }

    // we now found the LCA, so travel down to the callee.
    var downNode = lca;
    var count = 0;
    while(downNode !== endNode && ++count < 1000) { // find the node downwards that has the callee (LCA part 2)
        for(var childID in downNode.children) {
            if(downNode.children.hasOwnProperty(childID)) {
                var child = downNode.children[childID];

                if(child.contains(endNode) || child === endNode) {
                    originalData.edges.push({ // see above
                        from: downNode.id,
                        to: child.id,
                        color: "green",
                    });

                    print("&darr; Node " + downNode.id + " is not the callee's location, so need to continue downwards");
                    hops++;

                    downNode = child;
                    break;
                }
            }
        }
    }

    print("Node " + downNode.id + " is the final pointer Node to the Callee");

    return {
        hops: hops,
    };
};

function locateViaDatabase(caller, callee, endNode, originalData) {
    // do LCA to travel upwards from the caller
    var hops = 0;
    print("Traversing from " + caller.location.id + " upwards to LCA(caller.location, callee.location)");

    var lca = caller.location;
    while(lca) {
        if(lca.contains(endNode) || lca === endNode) {
            print("&rarr; Node " + lca.id + " is LCA(caller.location, callee.location)");
            break;
        }

        if(lca.parent) {
            originalData.edges.push({ // we need to show a red edge over the blue one, so we add it here
                from: lca.id,
                to: lca.parent.id,
                color: "red",
            });

            print("&uarr; Node " + lca.id + " is not LCA, so need to continue looking upwards");
            hops++;

            lca = lca.parent;
        }
    }


    // now we are at the LCA, it has the database location saved so go strait there.
    originalData.edges.push({ // see above
        from: lca.id,
        to: endNode.id,
        color: "green",
    });

    print("Read the database here at the LCA to find the Caller was at Node " + endNode.id);

    return {
        hops: hops + 1, // +1 for database hop
        updates: true,
    };
};
