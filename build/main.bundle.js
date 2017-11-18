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

document.addEventListener("DOMContentLoaded", function () {
    var g1p = document.getElementById("g1-probability");
    var g1pd = document.getElementById("g1-probability-display");

    var g1n = document.getElementById("g1-node-count");
    var g1nd = document.getElementById("g1-node-count-display");

    var g1tc = document.getElementById("g1-triangle-count");
    var g1tdc = document.getElementById("g1-disconnected-nodes-count");

    var g1tlc = document.getElementById("g1-largest-component-size");

    var doDraw = document.getElementById("doDraw");
    var doRemoveNonTriangularNodes = document.getElementById("doClearNonTriangularNodes");
    var doClearConnectedNodes = document.getElementById("doClearConnectedNodes");
    var doRunEstimation = document.getElementById("doRunEstimation");

    var main = document.getElementById("main");

    var previousResizeHandler = void 0;
    var previousGraph = void 0;
    var previousGraphConfig = void 0;

    function drawERGraph(nodeCount, boundProbability) {
        var usePreviousGraph = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var usePreviousGraphConfig = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        // The graph needs to redraw on window resize to recenter itself in the view
        if (usePreviousGraph === false) {
            if ((typeof previousGraph === "undefined" ? "undefined" : _typeof(previousGraph)) === "object") {
                previousGraph.clear();
            }

            previousGraph = jsnx.gnpRandomGraph(nodeCount, boundProbability);
        }

        if (usePreviousGraphConfig === false) {
            previousGraphConfig = {
                element: '#main',
                withLabels: true,
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

        if (typeof previousResizeHandler === "function") {
            window.removeEventListener("resize", previousResizeHandler);
        }

        main.style.height = 150 + Math.log10(Math.pow(nodeCount, 7)) / Math.log10(2) * 15 + "px";

        jsnx.draw(previousGraph, previousGraphConfig);

        g1nd.innerHTML = nodeCount;
        g1n.value = nodeCount;

        g1pd.innerHTML = boundProbability;
        g1p.value = boundProbability;

        g1tc.value = parseInt(Math.round(Array.from(jsnx.triangles(previousGraph).values()).reduce(function (sum, value) {
            return sum + 1 / 3 * value;
        }, 0)));

        g1tdc.value = parseInt(Math.round(Array.from(jsnx.degree(previousGraph).values()).reduce(function (sum, value) {
            return value === 0 ? sum + 1 : sum;
        }, 0)));

        g1tlc.value = parseInt(jsnx.graphCliqueNumber(previousGraph));

        var id = void 0;
        previousResizeHandler = function previousResizeHandler() {
            // Prevent bubbling up
            clearTimeout(id);

            id = setTimeout(function () {
                drawERGraph(nodeCount, boundProbability, true);
            }, 500);
        };
        window.addEventListener("resize", previousResizeHandler);

        return previousGraph;
    }

    g1p.addEventListener("mousemove", function () {
        document.getElementById("g1-probability-display").innerHTML = g1p.value;
    });

    g1n.addEventListener("mousemove", function () {
        document.getElementById("g1-node-count-display").innerHTML = g1n.value;
    });

    g1p.addEventListener("change", function () {
        drawERGraph(parseInt(g1n.value), parseFloat(g1p.value));
    });

    g1n.addEventListener("change", function () {
        drawERGraph(parseInt(g1n.value), parseFloat(g1p.value));
    });

    doDraw.addEventListener("click", function () {
        window.g = drawERGraph(parseInt(g1n.value), parseFloat(g1p.value));
    });

    doRemoveNonTriangularNodes.addEventListener("click", function () {
        Array.from(jsnx.triangles(previousGraph)).forEach(function (node, i) {
            if (node[1] === 0) {
                previousGraph.removeNode(node[0]);
            }
        });
        window.g = drawERGraph(parseInt(g1n.value), parseFloat(g1p.value), true, false);
    });

    doClearConnectedNodes.addEventListener("click", function () {
        Array.from(Array.from(jsnx.degree(previousGraph))).forEach(function (node) {
            if (node[1] !== 0) {
                previousGraph.removeNode(node[0]);
            }
        });
        window.g = drawERGraph(parseInt(g1n.value), parseFloat(g1p.value), true, false);
    });

    doRunEstimation.addEventListener("click", function () {
        var triangleCount = [];
        var isolatedNodesCount = [];
        var graphCliqueNumber = [];

        var n = parseInt(g1n.value);
        var p = parseFloat(g1p.value);
        var graph = jsnx.gnpRandomGraph(n, p);

        var theoreticTriangleCount = n * (n - 1) * (n - 2) / 6 * Math.pow(p, 3).toFixed(4);
        var theoreticIsolatedNodeCount = (n * Math.pow(1 - p, n - 1)).toFixed(4);

        var monsterSize = parseInt(prompt("Voer in de monstergrootte (k > 0)", 100));

        if (typeof monsterSize !== "number" || monsterSize <= 0 || isNaN(monsterSize) === true) {
            return alert("Ongeldige invoer \"" + monsterSize + "\".");
        }

        for (var i = 0; i < monsterSize; i++) {
            triangleCount.push(parseFloat(Math.round(Array.from(jsnx.triangles(graph).values()).reduce(function (sum, value) {
                return sum + 1 / 3 * value;
            }, 0))));
            isolatedNodesCount.push(parseFloat(Math.round(Array.from(jsnx.degree(graph).values()).reduce(function (sum, value) {
                return value === 0 ? sum + 1 : sum;
            }, 0))));
            graphCliqueNumber.push(jsnx.graphCliqueNumber(graph));

            // New monster
            graph = jsnx.gnpRandomGraph(n, p);
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

        alert("Onderzoek met " + monsterSize + " monsters voor G(" + n + ", " + p + ") is voltooid.\n ----\n Gemiddelde aantal driehoeken: " + experimentTriangleCount.toFixed(4) + " (Theoretisch: " + theoreticTriangleCount + ")\n Gemiddelde aantal ge\xEFsoleerde knopen: " + experimentIsolatedNodeCount.toFixed(4) + " (Theoretisch: " + theoreticIsolatedNodeCount + ")\n Gemiddelde grootte grootste groep: " + experimentGraphCliqueNumber.toFixed(4) + " ");
    });

    window.g = drawERGraph(8, 0.4);
});

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map