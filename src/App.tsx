import { useState } from "react";
import "./App.css";
import BezierInput from "./BezierInput/BezierInput";

function App() {
  const [value, setValue] = useState(0);

  return (
    <>
      <BezierInput
        onInput={setValue}
        maxDistance={100}
        controlClassName={{
          base: "red",
          active: "active",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="163"
          height="730"
          viewBox="0 0 163 730"
          strokeLinecap="round"
          strokeWidth={5}
          fill="none"
        >
          <path
            d="M84 729.5C134.833 704.5 206 635.3 84 558.5C-38 481.7 33.1667 405.5 84 377C142.833 344.833 225.2 265.7 84 206.5C-92.5 132.5 66 -15.5 75 3"
            stroke="lightgray"
          />
        </svg>
      </BezierInput>
      <h1>{value.toFixed(2)}</h1>
    </>
  );
}

export default App;
