export default class PseudoWeightedEdgeGraph {
    constructor(edges) {
        this._edges = edges || [[1,8,2], [8,12,4], [1,5,8], [5,9,4],
            [12,13,12], [1,2,4], [5,2,5], [12,9,2],
            [9,6,6], [9,13,4], [13,10,6], [2,6,3],
            [2,3,5], [13,14,6], [10,6,0], [6,3,0],
            [10,14,6], [10,7,4], [3,7,9], [14,11,6],
            [14,15,4], [11,15,10], [7,11,1], [15,4,10],
            [7,4,3], [3,4,5]];
    }

    /**
     * Get edges containing node u;
     * @param u
     */
    getEdge(u) {
        let edges = [];
        this._edges.forEach((edge) => {
            if(edge[0] === u || edge[1] ===u) {
                const sortedEdge = edge[0] === u ? [edge[0], edge[1], edge[2]] : [edge[1], edge[0], edge[2]];
                edges.push(sortedEdge);
            }
        });

        return edges;
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
    getEdgePaths(u, v) {
        const edges = [];
        const walkRecursive = (endNode, previousNode, path = [], edgeBag = [], beginNode, step=0) => {
            if (previousNode === endNode) {
                edges.push(edgeBag);
            }
            else if(step !== 0 && previousNode === beginNode) {
                return;
            }
            else {
                this.getEdge(previousNode).forEach((edge) => {
                    if(path.indexOf(edge[1]) === -1) {
                        walkRecursive(endNode, edge[1], [...path, edge[1]], [...edgeBag, edge], beginNode, step+1);
                    }
                });
            }
        };

        walkRecursive(v, u, [u], u);

        return edges;
    }

    /**
     * Get shortest path(s); The first index is the distance;
     *
     * @param u
     * @param v
     * @returns {Array<int, Array<int>>}
     */
    getShortestPath(u, v) {
        const edges = this.getEdgePaths(u, v);
        const dist = [];
        let shortestPath = [];

        for(let i=0; i<edges.length; i++) {
            dist[i] = null;
            for(let j=0; j<edges[i].length; j++) {
                if(dist[i] === null) {
                    dist[i] = edges[i][j][2];
                } else {
                    dist[i] += edges[i][j][2];
                }
            }
        }

        // Clone dist; need to keep dist unsorted...
        let sortedDist = JSON.parse(JSON.stringify(dist));
        sortedDist.sort((a, b) => a-b);

        // In case there are multiple shortest paths...
        for(let k=0; k<sortedDist.length; k++) {
            if(dist[k] === sortedDist[0]) {
                shortestPath.push([dist[k], edges[k]]);
            }
        }

        return shortestPath;
    }
}