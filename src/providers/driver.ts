import { createDriver } from "use-neo4j";

// Create driver instance
export const driver = createDriver(
  "neo4j+s",
  process.env.REACT_APP_NEO4J_HOST ?? "",
  process.env.REACT_APP_NEO4J_PORT ?? "",
  process.env.REACT_APP_NEO4J_USER ?? "",
  process.env.REACT_APP_NEO4J_PASSWORD ?? ""
);
