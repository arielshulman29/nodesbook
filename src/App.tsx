import { GraphProvider } from "./providers/Neo4jProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PersonForm from "./components/forms/PersonForm";
import z from "zod";
// import { styled } from "styled-components";
// import { ErrorMessage } from "./components/ErrorMessage";
import LinksForm from "./components/forms/LinksForm";
import Graph from "./components/graph/Graph";
import { useEffect } from "react";

const envVariablesSchema = z.object({
  REACT_APP_NEO4J_HOST: z.string().min(1),
  REACT_APP_NEO4J_PORT: z.string().min(1),
  REACT_APP_NEO4J_USER: z.string().min(1),
  REACT_APP_NEO4J_PASSWORD: z.string().min(1),
});

// const InvalidWrapper = styled.div`
//   height: 100%;
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;

function App() {
  // const [invalidCreds, setInvalidCreds] = useState(false);
  useEffect(() => {
    const envValid = envVariablesSchema.safeParse(process.env);
    if (!envValid.success) {
      // setInvalidCreds(true);
      console.log(envValid.error.message);
    }
  }, []);
  return (
    <BrowserRouter>
      {/* {invalidCreds ? (
        <InvalidWrapper>
          <ErrorMessage message="Something Wrong With Credentials" />
        </InvalidWrapper>
      ) : ( */}
      <GraphProvider>
        <Routes>
          <Route path="/" Component={PersonForm} />
          <Route path="/:id" Component={LinksForm} />
          <Route path="/graph" Component={Graph} />
        </Routes>
      </GraphProvider>
      {/* )} */}
    </BrowserRouter>
  );
}

export default App;
