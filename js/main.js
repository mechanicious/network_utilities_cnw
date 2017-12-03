document.addEventListener("DOMContentLoaded", () => {
    const g1p = document.getElementById("g1-probability");
    const g1n = document.getElementById("g1-node-count");
    const g1r = document.getElementById("g1-row-count");
    const g1c = document.getElementById("g1-column-count");
    const g1ic = document.getElementById("g1-isComplete");

    const g1icd = document.getElementById("g1-isComplete-display");
    const g1cc = document.getElementById("g1-clique-count");

    const g1rd = document.getElementById("g1-row-count-display");
    const g1cd = document.getElementById("g1-column-count-display");

    const g1pd = document.getElementById("g1-probability-display");
    const g1nd = document.getElementById("g1-node-count-display");

    const g1tc = document.getElementById("g1-triangle-count");
    const g1tdc = document.getElementById("g1-disconnected-nodes-count");

    const g1tlc = document.getElementById("g1-largest-component-size");

    const varsInputd = document.getElementById("varsInput");
    const adjMat = document.getElementById("adjacency-matrix");
    const adjMatd = document.getElementById("adjacency-matrix-display");
    const paths = document.getElementById("paths");

    const fieldGraphType = document.getElementsByName("graphType");

    const isERGraph         = document.getElementById("isERGraph");
    const isCycleGraph      = document.getElementById("isCycleGraph");
    const isCompleteGraph   = document.getElementById("isCompleteGraph");
    const isTreeGraph       = document.getElementById("isTreeGraph");
    const isGrid2dGraph     = document.getElementById("isGrid2dGraph");
    const isCustomFromEdges = document.getElementById("isCustomFromEdges");

    const customEdgeGraphFile     = document.getElementById("customEdgeGraphFile");

    const doDraw = document.getElementById("doDraw");
    const doRemoveNonTriangularNodes = document.getElementById("doClearNonTriangularNodes");
    const doClearConnectedNodes = document.getElementById("doClearConnectedNodes");
    const doRunEstimation = document.getElementById("doRunEstimation");

    const main = document.getElementById("main");


    let previousResizeHandler;
    let previousGraph;
    let previousGraphConfig;

    for(let i=0; i<fieldGraphType.length; i++) {
        fieldGraphType[i].addEventListener("change", () => {
            drawGraph();
        });
    }

    /**
     *
     * @param {Graph} g
     * @returns {Array<Array<int>>}
     */
    function getAdjacencyMatrix(g) {
        const nodes = g.nodes();
        const edges = g.edges();
        const adjMat = [];

        if(isGrid2dGraph.checked === true) {
            return [[""]];
        }

        for(let i=0; i<nodes.length; i++) {
            adjMat.push([]);
            for(let j=0; j<nodes.length; j++) {
                let edgeFound = 0;
                edges.forEach((edge) => {
                    if((edge[0] === i && edge[1] === j) || (edge[0] === j && edge[1] === i)){
                        edgeFound = 1;
                    }
                });
                adjMat[i][j] = edgeFound;
            }
        }

        return adjMat;
    }

    function initControls() {
        g1p.parentNode.style.display = "none";
        g1n.parentNode.style.display = "none";
        g1r.parentNode.style.display = "none";
        g1c.parentNode.style.display = "none";

        // Not available for all graphs
        doRunEstimation.style.display = "none";
        adjMatd.style.display = "none";
        varsInputd.style.display = "none";
    }

    function drawGraph(usePreviousGraph = false, usePreviousGraphConfig = false) {
        // The graph needs to redraw on window resize to recenter itself in the view
        if (usePreviousGraph === false) {
            if (typeof previousGraph === "object") {
                previousGraph.clear();
            }

            initControls();

            if (isERGraph.checked === true) {
                previousGraph = window.g = jsnx.erdosRenyiGraph(g1n.value, g1p.value);

                g1p.parentNode.style.display = "block";
                g1n.parentNode.style.display = "block";
                adjMatd.style.display = "block";
                doRunEstimation.style.display = "inline-block";
                varsInputd.style.display = "block";

                g1nd.innerHTML = g1n.value;
                g1pd.innerHTML = g1p.value;
            }
            else if (isCycleGraph.checked === true) {
                previousGraph = window.g = jsnx.cycleGraph(g1n.value);

                g1n.parentNode.style.display = "block";
                adjMatd.style.display = "block";
                varsInputd.style.display = "block";
                g1nd.innerHTML = g1n.value;
            }
            else if (isCompleteGraph.checked === true) {
                previousGraph = window.g = jsnx.completeGraph(g1n.value);

                g1n.parentNode.style.display = "block";
                adjMatd.style.display = "block";
                varsInputd.style.display = "block";
                g1nd.innerHTML = g1n.value;
            }
            // else if(isTreeGraph.checked === true) {
            //     previousGraph = jsnx.balancedTree(0.1, 2);
            // }
            else if (isGrid2dGraph.checked === true) {
                previousGraph = window.g = jsnx.grid2dGraph(g1r.value, g1c.value);

                g1rd.innerHTML = g1r.value;
                g1cd.innerHTML = g1c.value;

                g1r.parentNode.style.display = "block";
                g1c.parentNode.style.display = "block";
                varsInputd.style.display = "block";

            } else if(isCustomFromEdges.checked === true) {
                adjMatd.style.display = "block";
            }
        }

        if (usePreviousGraphConfig === false) {
            previousGraphConfig = {
                element: '#main',
                withLabels: true,
                layoutAttr: {
                    charge: -200
                },
                nodeAttr: {
                    r: 15
                },
                nodeStyle: {
                    fill: function (d) {
                        let fill = "#000";

                        Array.from(jsnx.triangles(previousGraph)).forEach((node) => {
                            if (node[1] > 0 && node[0] === d.node) {
                                fill = "tomato";
                            }
                        });

                        return fill;
                    },
                    stroke: "#000"
                },
                labelStyle: {fill: 'white'},
                stickyDrag: true
            };
        }



        if(typeof previousResizeHandler === "function") {
            window.removeEventListener("resize", previousResizeHandler);
        }

        /**
         * Set Adjacency
         */
        adjMat.innerHTML = `${getAdjacencyMatrix(previousGraph).map((item) => {
            return item.map((bit) => {
                return bit === 1 ?  bit : `<span style="color: rgba(0, 0, 0, 0.6)">${bit}</span>`;
            }).join(`<span style="color: rgba(0, 0, 0, 0.6)">, </span>`)
        }).join("\n")}`;

        main.style.height = `${(150+Math.log10(Math.pow(previousGraph.nodes().length, 7))/Math.log10(2)*15)}px`;

        jsnx.draw(previousGraph, previousGraphConfig);

        g1tc.value = parseInt(Math.round(Array.from(jsnx.triangles(previousGraph).values()).reduce((sum, value) => sum+1/3*value, 0)));

        g1tdc.value = parseInt(Math.round(Array.from(jsnx.degree(previousGraph).values()).reduce((sum, value) => value === 0 ? sum+1: sum, 0)));

        g1ic.value = previousGraph.edges().length===previousGraph.nodes().length*(previousGraph.nodes().length-1)/2 ? "ja" : "nee";

        g1cc.value;

        try {
            g1tlc.parentNode.display = "block";
            g1tlc.value = parseInt(jsnx.graphCliqueNumber(previousGraph));
        } catch (e) {
            g1tlc.parentNode.display = "none";
        }

        let id;
        previousResizeHandler = () => {
            // Prevent bubbling up
            clearTimeout(id);

            id = setTimeout(() => {
                drawGraph(true);
            }, 500);
        };
        window.addEventListener("resize", previousResizeHandler);

        return previousGraph;
    }

    customEdgeGraphFile.addEventListener("change", () => {
        let reader = new FileReader();
        reader.readAsText(customEdgeGraphFile.files[0], "UTF-8");

        reader.onload = function (evt) {
            const edgeList = evt.target.result.split("\n").map((item) => {
                return item.split("\t").map((numeric) => {
                    return parseInt(numeric);
                });
            });

            previousGraph = jsnx.fromEdgelist(edgeList);
            drawGraph(true);
        };

        reader.onerror = function (evt) {
            document.getElementById("fileContents").innerHTML = "error reading file";
        }
    });

    g1p.addEventListener("mousemove", () => {
        document.getElementById("g1-probability-display").innerHTML = g1p.value;
    });

    g1n.addEventListener("mousemove", () => {
        document.getElementById("g1-node-count-display").innerHTML = g1n.value;
    });

    g1r.addEventListener("mousemove", () => {
        document.getElementById("g1-row-count-display").innerHTML = g1r.value;
    });

    g1c.addEventListener("mousemove", () => {
        document.getElementById("g1-column-count-display").innerHTML = g1c.value;
    });

    isCustomFromEdges.addEventListener("change", () => {
        customEdgeGraphFile.value = "";
    });

    [g1p, g1n, g1c, g1r].forEach((field) => {
    field.addEventListener("change", () => {
            drawGraph();
        });
    });

    doDraw.addEventListener("click", () => {
        window.g = drawGraph(parseInt(g1n.value), parseFloat(g1p.value));
    });

    doRemoveNonTriangularNodes.addEventListener("click", () => {
        Array.from(jsnx.triangles(previousGraph)).forEach((node, i) => {
            if(node[1] === 0) {
                previousGraph.removeNode(node[0]);
            }
        });
        window.g = drawGraph(parseInt(g1n.value), parseFloat(g1p.value), true, false);
    });

    doClearConnectedNodes.addEventListener("click", () => {
        Array.from(Array.from(jsnx.degree(previousGraph))).forEach((node) => {
            if(node[1] !== 0) {
                previousGraph.removeNode(node[0]);
            }
        });
        window.g = drawGraph(parseInt(g1n.value), parseFloat(g1p.value), true, false);
    });


    doRunEstimation.addEventListener("click", () => {
        let triangleCount = [];
        let isolatedNodesCount = [];
        let graphCliqueNumber = [];

        const n = parseInt(g1n.value);
        const p = parseFloat(g1p.value);
        let graph = jsnx.erdosRenyiGraph(n, p);

        const theoreticTriangleCount = (n*(n-1)*(n-2))/6*Math.pow(p,3).toFixed(4);
        const theoreticIsolatedNodeCount = (n*Math.pow((1-p), n-1)).toFixed(4);


        const monsterSize = parseInt(prompt("Voer in de monstergrootte (k > 0)", 100));

        if(typeof monsterSize !== "number" || monsterSize <= 0 || isNaN(monsterSize) === true) {
            return alert(`Ongeldige invoer "${monsterSize}".`);
        }

        for(let i=0; i<monsterSize; i++) {
            triangleCount.push(parseFloat(Math.round(Array.from(jsnx.triangles(graph).values()).reduce((sum, value) => sum+1/3*value, 0))));

            isolatedNodesCount.push(parseFloat(Math.round(Array.from(jsnx.degree(graph).values()).reduce((sum, value) => value === 0 ? sum+1: sum, 0))));
            graphCliqueNumber.push(jsnx.graphCliqueNumber(graph));

            graph = jsnx.erdosRenyiGraph(n, p);
        }

        const experimentTriangleCount = triangleCount.reduce((sum, value) => sum+value, 0)/(triangleCount.length);
        const experimentIsolatedNodeCount = isolatedNodesCount.reduce((sum, value) => sum+value, 0)/(isolatedNodesCount.length);
        const experimentGraphCliqueNumber = graphCliqueNumber.reduce((sum, value) => sum+value, 0)/(graphCliqueNumber.length);

        alert(`Onderzoek met ${monsterSize} monsters voor G(${n}, ${p}) is voltooid.\n ----\n Gemiddelde aantal driehoeken: ${experimentTriangleCount.toFixed(4)} (Theoretisch: ${theoreticTriangleCount})\n Gemiddelde aantal geïsoleerde knopen: ${experimentIsolatedNodeCount.toFixed(4)} (Theoretisch: ${theoreticIsolatedNodeCount})\n Gemiddelde grootte grootste clique: ${experimentGraphCliqueNumber.toFixed(4)} `);
    });

    window.g = drawGraph();
});