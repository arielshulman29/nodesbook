import { ReactNode } from "react";
import { Neo4jProvider } from "use-neo4j";
import { driver } from "./driver";

export const GraphProvider = ({ children }: { children: ReactNode }) => (
  <Neo4jProvider driver={driver}>{children}</Neo4jProvider>
);
