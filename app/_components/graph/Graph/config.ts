// @ts-nocheck
export const layout = {
  name: "concentric",

  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  startAngle: (3 / 2) * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  minNodeSpacing: 50, // min spacing between outside of nodes (used for radius adjustment)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  height: "100%", // height of layout area (overrides container height)
  width: "100%", // width of layout area (overrides container width)
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  concentric: function (node) {
    // returns numeric value for each node, placing higher nodes in levels towards the centre
    return node.degree();
  },
  levelWidth: function (nodes) {
    // the variation of concentric values in each level
    return nodes.maxDegree() / 4;
  },
  animate: true, // whether to transition the node positions
  animationDuration: 20000, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function (node, i) {
    return true;
  }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position) {
    return position;
  }, // transform a given node position. Useful for changing flow direction in discrete layouts
};

export const styleSheet: cytoscape.Stylesheet[] = [
  {
    selector: "node",
    style: {
      backgroundColor: "#AAD8FF",
      // width: 10,
      // height: 10,
      label: "data(label)",

      // width: "mapData(score, 0, 0.006769776522008331, 20, 60)",
      // height: "mapData(score, 0, 0.006769776522008331, 20, 60)",
      "text-valign": "center",
      "text-halign": "center",
      "overlay-padding": "6px",
      // "z-index": "10",
      //text props
      "text-outline-color": "var(--main)",
      "text-outline-width": "1px",
      color: "white",
      // fontSize: 10,
    },
  },
  {
    selector: "node[main='true']",
    style: {
      "border-width": "60px",
      "border-color": "red",
      "border-opacity": "0.5",
    },
  },
  {
    selector: "node[selected='true']",
    style: {
      "border-width": "60px",
      "border-color": "#AAD8FF",
      "border-opacity": "0.5",
    },
  },
  {
    selector: "node:selected",
    style: {
      "border-width": "80px",
      "border-color": "#AAD8FF",
      "border-opacity": "0.5",
    },
  },
  {
    selector: "edge",
    style: {
      width: 1,
      "line-color": "white",
      "target-arrow-color": "#6774cb",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
  {
    selector: "edge[selected='true']",
    style: {
      width: 4,
      "line-color": "red",
      "target-arrow-color": "red",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
];
