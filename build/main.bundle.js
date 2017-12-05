/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _JSNXWrapper = __webpack_require__(1);

var _JSNXWrapper2 = _interopRequireDefault(_JSNXWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

document.addEventListener("DOMContentLoaded", function () {
    var g1p = document.getElementById("g1-probability");
    var g1n = document.getElementById("g1-node-count");
    var g1r = document.getElementById("g1-row-count");
    var g1c = document.getElementById("g1-column-count");
    var g1ic = document.getElementById("g1-isComplete");

    var g1icd = document.getElementById("g1-isComplete-display");
    var g1cc = document.getElementById("g1-clique-count");

    var g1rd = document.getElementById("g1-row-count-display");
    var g1cd = document.getElementById("g1-column-count-display");

    var g1pd = document.getElementById("g1-probability-display");
    var g1nd = document.getElementById("g1-node-count-display");

    var g1tc = document.getElementById("g1-triangle-count");
    var g1tdc = document.getElementById("g1-disconnected-nodes-count");

    var g1tlc = document.getElementById("g1-largest-component-size");

    var varsInputd = document.getElementById("varsInput");
    var adjMat = document.getElementById("adjacency-matrix");
    var nodeDeg = document.getElementById("node-degree");
    var nodeDegd = document.getElementById("node-degree-display");
    var adjMatd = document.getElementById("adjacency-matrix-display");
    var paths = document.getElementById("paths");

    var fieldGraphType = document.getElementsByName("graphType");

    var isERGraph = document.getElementById("isERGraph");
    var isCycleGraph = document.getElementById("isCycleGraph");
    var isCompleteGraph = document.getElementById("isCompleteGraph");
    var isTreeGraph = document.getElementById("isTreeGraph");
    var isGrid2dGraph = document.getElementById("isGrid2dGraph");
    var isCustomFromEdges = document.getElementById("isCustomFromEdges");

    var customEdgeGraphFile = document.getElementById("customEdgeGraphFile");

    var doDraw = document.getElementById("doDraw");
    var doRemoveNonTriangularNodes = document.getElementById("doClearNonTriangularNodes");
    var doClearConnectedNodes = document.getElementById("doClearConnectedNodes");
    var doRunEstimation = document.getElementById("doRunEstimation");

    var main = document.getElementById("main");

    var previousResizeHandler = void 0;
    var previousGraph = void 0;
    var previousGraphConfig = void 0;

    for (var i = 0; i < fieldGraphType.length; i++) {
        fieldGraphType[i].addEventListener("change", function () {
            drawGraph();
        });
    }

    /**
     *
     * @param {Graph} g
     * @returns {Array<Array<int>>}
     */
    function getAdjacencyMatrix(g) {
        var nodes = g.nodes();
        var edges = g.edges();
        var adjMat = [];

        if (isGrid2dGraph.checked === true) {
            return [[""]];
        }

        var _loop = function _loop(_i) {
            adjMat.push([]);

            var _loop2 = function _loop2(j) {
                var edgeFound = 0;
                edges.forEach(function (edge) {
                    if (edge[0] === _i && edge[1] === j || edge[0] === j && edge[1] === _i) {
                        edgeFound = 1;
                    }
                });
                adjMat[_i][j] = edgeFound;
            };

            for (var j = 0; j < nodes.length; j++) {
                _loop2(j);
            }
        };

        for (var _i = 0; _i < nodes.length; _i++) {
            _loop(_i);
        }

        return adjMat;
    }

    function initControls() {
        g1p.parentNode.style.display = "none";
        g1n.parentNode.style.display = "none";
        g1r.parentNode.style.display = "none";
        g1c.parentNode.style.display = "none";

        g1icd.style.display = "block";
        g1ic.style.display = "block";

        // Not available for all graphs
        doRunEstimation.style.display = "none";
        adjMatd.style.display = "none";
        varsInputd.style.display = "none";
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function drawGraph() {
        var usePreviousGraph = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var usePreviousGraphConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        // The graph needs to redraw on window resize to recenter itself in the view
        if (usePreviousGraph === false) {
            if ((typeof previousGraph === "undefined" ? "undefined" : _typeof(previousGraph)) === "object") {
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
            } else if (isCycleGraph.checked === true) {
                previousGraph = window.g = jsnx.cycleGraph(g1n.value);

                g1n.parentNode.style.display = "block";
                adjMatd.style.display = "block";
                varsInputd.style.display = "block";
                g1nd.innerHTML = g1n.value;
            } else if (isCompleteGraph.checked === true) {
                previousGraph = window.g = jsnx.completeGraph(g1n.value);

                g1n.parentNode.style.display = "block";
                adjMatd.style.display = "block";
                varsInputd.style.display = "block";
                g1nd.innerHTML = g1n.value;
            } else if (isGrid2dGraph.checked === true) {
                previousGraph = window.g = jsnx.grid2dGraph(g1r.value, g1c.value);

                g1rd.innerHTML = g1r.value;
                g1cd.innerHTML = g1c.value;

                g1r.parentNode.style.display = "block";
                g1c.parentNode.style.display = "block";
                varsInputd.style.display = "block";

                g1icd.style.display = "none";
                g1ic.style.display = "none";
            } else if (isCustomFromEdges.checked === true) {
                adjMatd.style.display = "block";
            }
        }

        var gw = new _JSNXWrapper2.default(previousGraph);

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
                    fill: function fill(d) {
                        var fill = "#000";

                        Array.from(jsnx.triangles(previousGraph)).forEach(function (node) {
                            if (node[1] > 0 && node[0] === d.node) {
                                fill = "tomato";
                            }
                        });

                        return fill;
                    },
                    stroke: "#000"
                },
                labelStyle: { fill: 'white' },
                stickyDrag: true
            };
        }

        var degress = Array.from(jsnx.degree(previousGraph));
        nodeDeg.innerHTML = "" + [["knoop", "graad", "som=" + Array.from(jsnx.degree(previousGraph).values()).reduce(function (sum, value) {
            return sum + value;
        }, 0)]].concat(_toConsumableArray(degress)).map(function (item) {
            return item.join("\t");
        }).join("\n");

        if (typeof previousResizeHandler === "function") {
            window.removeEventListener("resize", previousResizeHandler);
        }

        /**
         * Set Adjacency
         */
        adjMat.innerHTML = "" + getAdjacencyMatrix(previousGraph).map(function (item) {
            return item.map(function (bit) {
                return bit === 1 ? bit : "<span style=\"color: rgba(0, 0, 0, 0.6)\">" + bit + "</span>";
            }).join(" ");
        }).join("\n");

        main.style.height = 150 + Math.log10(Math.pow(previousGraph.nodes().length, 7)) / Math.log10(2) * 15 + "px";

        jsnx.draw(previousGraph, previousGraphConfig);

        g1tc.value = parseInt(Math.round(Array.from(jsnx.triangles(previousGraph).values()).reduce(function (sum, value) {
            return sum + 1 / 3 * value;
        }, 0)));

        var isolatedNodeCount = parseInt(Math.round(Array.from(jsnx.degree(previousGraph).values()).reduce(function (sum, value) {
            return value === 0 ? sum + 1 : sum;
        }, 0)));
        g1tdc.value = isolatedNodeCount;

        var nodeCount = previousGraph.nodes().length;
        if (isolatedNodeCount > 0) {
            g1ic.value = "nee (Aantal Ge\xEFsoleerde Knopen > 0)";
        } else if (previousGraph.edges().length === nodeCount * (nodeCount - 1) / 2) {
            g1ic.value = "ja (Volledige Graaf)";
        } else {
            var res = gw.isFullyConnected(getRandomInt(previousGraph.nodes()[0], previousGraph.nodes().reverse()[0]));
            g1ic.value = res === true ? "ja" : "nee (bevat losse component (" + res.join(", ") + "))";
        }

        try {
            g1tlc.parentNode.display = "block";
            g1tlc.value = parseInt(jsnx.graphCliqueNumber(previousGraph));
        } catch (e) {
            g1tlc.parentNode.display = "none";
        }

        var id = void 0;
        previousResizeHandler = function previousResizeHandler() {
            // Prevent bubbling up
            clearTimeout(id);

            id = setTimeout(function () {
                drawGraph(true);
            }, 500);
        };
        window.addEventListener("resize", previousResizeHandler);

        return previousGraph;
    }

    customEdgeGraphFile.addEventListener("change", function () {
        var reader = new FileReader();
        reader.readAsText(customEdgeGraphFile.files[0], "UTF-8");

        reader.onload = function (evt) {
            var edgeList = evt.target.result.split("\n").map(function (item) {
                return item.split("\t").map(function (numeric) {
                    return parseInt(numeric);
                });
            });

            window.g = previousGraph = jsnx.fromEdgelist(edgeList);
            drawGraph(true);
        };
    });

    g1p.addEventListener("mousemove", function () {
        document.getElementById("g1-probability-display").innerHTML = g1p.value;
    });

    g1n.addEventListener("mousemove", function () {
        document.getElementById("g1-node-count-display").innerHTML = g1n.value;
    });

    g1r.addEventListener("mousemove", function () {
        document.getElementById("g1-row-count-display").innerHTML = g1r.value;
    });

    g1c.addEventListener("mousemove", function () {
        document.getElementById("g1-column-count-display").innerHTML = g1c.value;
    });

    isCustomFromEdges.addEventListener("change", function () {
        customEdgeGraphFile.value = "";
    });

    [g1p, g1n, g1c, g1r].forEach(function (field) {
        field.addEventListener("change", function () {
            drawGraph();
        });
    });

    doDraw.addEventListener("click", function () {
        window.g = drawGraph(parseInt(g1n.value), parseFloat(g1p.value));
    });

    doRemoveNonTriangularNodes.addEventListener("click", function () {
        Array.from(jsnx.triangles(previousGraph)).forEach(function (node, i) {
            if (node[1] === 0) {
                previousGraph.removeNode(node[0]);
            }
        });
        window.g = drawGraph(parseInt(g1n.value), parseFloat(g1p.value), true, false);
    });

    doClearConnectedNodes.addEventListener("click", function () {
        Array.from(Array.from(jsnx.degree(previousGraph))).forEach(function (node) {
            if (node[1] !== 0) {
                previousGraph.removeNode(node[0]);
            }
        });
        window.g = drawGraph(parseInt(g1n.value), parseFloat(g1p.value), true, false);
    });

    doRunEstimation.addEventListener("click", function () {
        var triangleCount = [];
        var isolatedNodesCount = [];
        var graphCliqueNumber = [];

        var n = parseInt(g1n.value);
        var p = parseFloat(g1p.value);
        var graph = jsnx.erdosRenyiGraph(n, p);

        var theoreticTriangleCount = n * (n - 1) * (n - 2) / 6 * Math.pow(p, 3).toFixed(4);
        var theoreticIsolatedNodeCount = (n * Math.pow(1 - p, n - 1)).toFixed(4);

        var monsterSize = parseInt(prompt("Voer in de monstergrootte (k > 0)", 100));

        if (typeof monsterSize !== "number" || monsterSize <= 0 || isNaN(monsterSize) === true) {
            return alert("Ongeldige invoer \"" + monsterSize + "\".");
        }

        for (var _i2 = 0; _i2 < monsterSize; _i2++) {
            triangleCount.push(parseFloat(Math.round(Array.from(jsnx.triangles(graph).values()).reduce(function (sum, value) {
                return sum + 1 / 3 * value;
            }, 0))));

            isolatedNodesCount.push(parseFloat(Math.round(Array.from(jsnx.degree(graph).values()).reduce(function (sum, value) {
                return value === 0 ? sum + 1 : sum;
            }, 0))));
            graphCliqueNumber.push(jsnx.graphCliqueNumber(graph));

            graph = jsnx.erdosRenyiGraph(n, p);
        }

        var experimentTriangleCount = triangleCount.reduce(function (sum, value) {
            return sum + value;
        }, 0) / triangleCount.length;
        var experimentIsolatedNodeCount = isolatedNodesCount.reduce(function (sum, value) {
            return sum + value;
        }, 0) / isolatedNodesCount.length;
        var experimentGraphCliqueNumber = graphCliqueNumber.reduce(function (sum, value) {
            return sum + value;
        }, 0) / graphCliqueNumber.length;

        alert("Onderzoek met " + monsterSize + " monsters voor G(" + n + ", " + p + ") is voltooid.\n ----\n Gemiddelde aantal driehoeken: " + experimentTriangleCount.toFixed(4) + " (Theoretisch: " + theoreticTriangleCount + ")\n Gemiddelde aantal ge\xEFsoleerde knopen: " + experimentIsolatedNodeCount.toFixed(4) + " (Theoretisch: " + theoreticIsolatedNodeCount + ")\n Gemiddelde grootte grootste clique: " + experimentGraphCliqueNumber.toFixed(4) + " ");
    });

    window.g = drawGraph();
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSNXWrapper = function () {
    function JSNXWrapper(g) {
        _classCallCheck(this, JSNXWrapper);

        this._g = g;
    }

    _createClass(JSNXWrapper, [{
        key: "getGraph",
        value: function getGraph() {
            return this._g;
        }

        /**
         * If the graph contains a clique then it is not fully connected;
         *
         * @param {int} u
         * @returns (Array<int>|true)
         */

    }, {
        key: "isFullyConnected",
        value: function isFullyConnected(u) {
            var _this = this;

            var visited = [];
            var walkRecursive = function walkRecursive(begin, previous) {
                _this._g.edges(previous).forEach(function (edge) {
                    if (visited.indexOf(edge[1]) === -1) {
                        visited.push(edge[1]);
                        walkRecursive(begin, edge[1], visited);
                    }
                });
            };

            walkRecursive(u, u);

            if (visited.length === this._g.nodes().length) {
                return true;
            } else {
                // Return clique
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

    }, {
        key: "getPaths",
        value: function getPaths(u, v) {
            var _this2 = this;

            var paths = [];
            var walkRecursive = function walkRecursive(endNode, previousNode) {
                var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
                var beginNode = arguments[3];
                var step = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

                if (previousNode === endNode) {
                    paths.push(path);
                } else if (step !== 0 && previousNode === beginNode) {
                    return;
                } else {
                    _this2._g.edges(previousNode).forEach(function (edge) {
                        if (path.indexOf(edge[1]) === -1) {
                            walkRecursive(endNode, edge[1], [].concat(_toConsumableArray(path), [edge[1]]), beginNode, step + 1);
                        }
                    });
                }
            };

            walkRecursive(v, u, [u], u);

            return paths;
        }
    }]);

    return JSNXWrapper;
}();

exports.default = JSNXWrapper;

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map