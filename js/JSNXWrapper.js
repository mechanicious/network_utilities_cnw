export default class JSNXWrapper{
    constructor(g) {
        this._g = g;
    }

    getGraph() {
        return this._g;
    }

    /**
     * If the graph contains a subgraph then it is not fully connected;
     *
     * @param {int} u
     * @returns (Array<int>|boolean)
     */
    isFullyConnected(u) {
        const visited = [];
        const walkRecursive = (begin, previous) => {
            this._g.edges(previous).forEach((edge) => {
                if(visited.indexOf(edge[1]) === -1) {
                    visited.push(edge[1]);
                    walkRecursive(begin, edge[1], visited);
                }
            });
        };

        walkRecursive(u, u);

        if(visited.length === this._g.nodes().length) {
            return true;
        } else {
            // Return subgraph
            return visited;
        }
    }

    /**
     * Check whether u connects to v in graph g;
     *
     * Note: will not work for graphs wherein node labels are arrays;
     *
     * @param {int} u start point
     * @param {int} v end point
     * @returns (Array<Array<int>>|Array<int>)
     */
    getPaths(u, v) {
        const paths = [];
        const walkRecursive = (endNode, previousNode, path = [], beginNode, step=0) => {
            if (previousNode === endNode) {
                paths.push(path);
            }
            else if(step !== 0 && previousNode === beginNode) {
                return;
            }
            else {
                this._g.edges(previousNode).forEach((edge) => {
                    if(path.indexOf(edge[1]) === -1) {
                        walkRecursive(endNode, edge[1], [...path, edge[1]], beginNode, step+1);
                    }
                });
            }
        };

        walkRecursive(v, u, [u], u);

        return paths;
    }
}
