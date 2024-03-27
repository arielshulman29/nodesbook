export const layouts: Record<string, any> = {
  random: {
    name: "random",
    animate: true,
  },
  grid: {
    name: "grid",
    animate: true,
  },
  circle: {
    name: "circle",
    animate: true,
  },
  breadthfirst: {
    name: "breadthfirst",
    animate: true,
  },
  klay: {
    name: "klay",
    animate: true,
    padding: 4,
    nodeDimensionsIncludeLabels: true,
    klay: {
      spacing: 40,
      mergeEdges: false,
    },
  },
  fcose: {
    name: "fcose",
    animate: true,
  },
  cose: {
    name: "cose",
    animate: true,
  },

  cola: {
    name: "cola",
    animate: true,
    maxSimulationTime: 40000,
  },
  dagre: {
    name: "dagre",
    animate: true,
  },
};

const layoutKeys = Object.keys(layouts);

layoutKeys.forEach((elkAlgo) => {
  layouts[`elk_${elkAlgo}`] = {
    name: "elk",
    animate: true,
    elk: {
      algorithm: elkAlgo,
    },
  };
});
