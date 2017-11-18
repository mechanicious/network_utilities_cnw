document.addEventListener("DOMContentLoaded", () => {
    let g1p = document.getElementById("g1-probability");
    let g1pd = document.getElementById("g1-probability-display");

    let g1n = document.getElementById("g1-node-count");
    let g1nd = document.getElementById("g1-node-count-display");

    let g1tc = document.getElementById("g1-triangle-count");
    let g1tdc = document.getElementById("g1-disconnected-nodes-count");

    let g1tlc = document.getElementById("g1-largest-component-size");

    let doDraw = document.getElementById("doDraw");
    let doRemoveNonTriangularNodes = document.getElementById("doClearNonTriangularNodes");
    let doClearConnectedNodes = document.getElementById("doClearConnectedNodes");
    let doRunEstimation = document.getElementById("doRunEstimation");

    let main = document.getElementById("main");


    let previousResizeHandler;
    let previousGraph;
    let previousGraphConfig;

    function drawERGraph(nodeCount, boundProbability, usePreviousGraph = false, usePreviousGraphConfig = false) {
        // The graph needs to redraw on window resize to recenter itself in the view
        if(usePreviousGraph === false) {
            if(typeof previousGraph === "object") {
                previousGraph.clear();
            }

            previousGraph = jsnx.gnpRandomGraph(nodeCount, boundProbability);
        }

        if(usePreviousGraphConfig === false) {
            previousGraphConfig = {
                element: '#main',
                withLabels: true,
                nodeAttr: {
                    r: 15
                },
                nodeStyle: {
                    fill: function(d) {
                        let fill = "#000";

                        Array.from(jsnx.triangles(previousGraph)).forEach((node) => {
                            if(node[1] > 0 && node[0] === d.node) {
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

        main.style.height = `${(150+Math.log10(Math.pow(nodeCount, 7))/Math.log10(2)*15)}px`;

        jsnx.draw(previousGraph, previousGraphConfig);

        g1nd.innerHTML = nodeCount;
        g1n.value = nodeCount;

        g1pd.innerHTML = boundProbability;
        g1p.value = boundProbability;

        g1tc.value = parseInt(Math.round(Array.from(jsnx.triangles(previousGraph).values()).reduce((sum, value) => sum+1/3*value, 0)));

        g1tdc.value = parseInt(Math.round(Array.from(jsnx.degree(previousGraph).values()).reduce((sum, value) => value === 0 ? sum+1: sum, 0)));

        g1tlc.value = parseInt(jsnx.graphCliqueNumber(previousGraph));

        let id;
        previousResizeHandler = () => {
            // Prevent bubbling up
            clearTimeout(id);

            id = setTimeout(() => {
                drawERGraph(nodeCount, boundProbability, true);
            }, 500);
        };
        window.addEventListener("resize", previousResizeHandler);

        return previousGraph;
    }

    g1p.addEventListener("mousemove", () => {
        document.getElementById("g1-probability-display").innerHTML = g1p.value;
    });

    g1n.addEventListener("mousemove", () => {
        document.getElementById("g1-node-count-display").innerHTML = g1n.value;
    });

    g1p.addEventListener("change", () => {
        drawERGraph(parseInt(g1n.value), parseFloat(g1p.value));
    });

    g1n.addEventListener("change", () => {
        drawERGraph(parseInt(g1n.value), parseFloat(g1p.value));
    });

    doDraw.addEventListener("click", () => {
        window.g = drawERGraph(parseInt(g1n.value), parseFloat(g1p.value));
    });

    doRemoveNonTriangularNodes.addEventListener("click", () => {
        Array.from(jsnx.triangles(previousGraph)).forEach((node, i) => {
            if(node[1] === 0) {
                previousGraph.removeNode(node[0]);
            }
        });
        window.g = drawERGraph(parseInt(g1n.value), parseFloat(g1p.value), true, false);
    });

    doClearConnectedNodes.addEventListener("click", () => {
        Array.from(Array.from(jsnx.degree(previousGraph))).forEach((node) => {
            if(node[1] !== 0) {
                previousGraph.removeNode(node[0]);
            }
        });
        window.g = drawERGraph(parseInt(g1n.value), parseFloat(g1p.value), true, false);
    });


    doRunEstimation.addEventListener("click", () => {
        let triangleCount = [];
        let isolatedNodesCount = [];
        let graphCliqueNumber = [];

        const n = parseInt(g1n.value);
        const p = parseFloat(g1p.value);
        let graph = jsnx.gnpRandomGraph(n, p);

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

            // New monster
            graph = jsnx.gnpRandomGraph(n, p);
        }

        const experimentTriangleCount = triangleCount.reduce((sum, value) => sum+value, 0)/(triangleCount.length);
        const experimentIsolatedNodeCount = isolatedNodesCount.reduce((sum, value) => sum+value, 0)/(isolatedNodesCount.length);
        const experimentGraphCliqueNumber = graphCliqueNumber.reduce((sum, value) => sum+value, 0)/(graphCliqueNumber.length);

        alert(`Onderzoek met ${monsterSize} monsters voor G(${n}, ${p}) is voltooid.\n ----\n Gemiddelde aantal driehoeken: ${experimentTriangleCount.toFixed(4)} (Theoretisch: ${theoreticTriangleCount})\n Gemiddelde aantal geïsoleerde knopen: ${experimentIsolatedNodeCount.toFixed(4)} (Theoretisch: ${theoreticIsolatedNodeCount})\n Gemiddelde grootte grootste groep: ${experimentGraphCliqueNumber.toFixed(4)} `);
    });

    window.g = drawERGraph(8, 0.4);
});