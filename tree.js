function generateGraph(nodeCount) {
    var nodes = [];
    var edges = [];
    var connectionCount = [];

    // randomly create some nodes and edges
    for (var i = 0; i < nodeCount; i++) {
        var node = new Node();
        nodes.push(node);

        connectionCount[i] = 0;
        var to = null; // we'll find the connection

        // create edges in a scale-free-network way
        if(i > 0) {
            if (i == 1) {
                to = nodes[0];
            }
            else if (i > 1) {
                var conn = edges.length * 2;
                var rand = Math.floor(Math.random() * conn);
                var cum = 0;
                var j = 0;
                while (j < connectionCount.length && cum < rand) {
                    cum += connectionCount[j];
                    j++;
                }

                to = nodes[j];
            }

            edges.push(new Edge(node, to));

            connectionCount[node.id]++;
            connectionCount[to.id]++;
        }
    }

    return {nodes:nodes, edges:edges};
}

function randomElementFromArray(items) {
    return items[Math.floor(Math.random()*items.length)];
};

function generateTree(size) {
    var nodes = [];
    for(var i = 0; i < size; i++) {
        var randomParent = randomElementFromArray(nodes);
        nodes.push(new Node(randomParent));
    }

    return nodes; // this is the root node, it's a tree so you can follow .children to traverse it
};

function getDataForVisJS(tree, users, showForwardingPointers) {
    var rootNode = tree[0];
    var visNodes = [];
    var visEdges = [];

    var nodes = [ rootNode ];
    while(nodes.length > 0) {
        var node = nodes.pop();
        visNodes.push({
            id: node.id,
            label: String(node.id),
            level: node.level,
            title: formatInfo(node.getInfo()),
        });

        for(var childNodeID in node.children) {
            if(node.children.hasOwnProperty(childNodeID)) {
                var childNode = node.children[childNodeID];

                visEdges.push({
                    from: node.id,
                    to: childNode.id,
                });

                nodes.push(childNode);
            }
        }

        if(showForwardingPointers) {
            for(var userID in node.forwardingPointers) {
                if(node.forwardingPointers.hasOwnProperty(userID)) {
                    var forwardingPointerNode = node.forwardingPointers[userID];
                    visEdges.push({
                        from: node.id,
                        to: forwardingPointerNode.id,
                        color: usersByID[userID].color,
                    });
                }
            }
        }
    }

    for(var i = 0; i < users.length; i++) {
        var user = users[i];
        var info = user.getInfo();
        visNodes.push({
            id: user.id,
            label: user.id,
            color: user.color,
            level: user.location.level + 1,
            title: formatInfo(user.getInfo()),
        });

        visEdges.push({
            from: user.id,
            to: user.location.id,
            color: "black",
        });
    }

    return {
        nodes: visNodes,
        edges: visEdges,
    };
};
