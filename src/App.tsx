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
          width="588"
          height="619"
          viewBox="0 0 588 619"
          fill="none"
        >
          <path
            d="M153 615C101.5 624.667 10.2 612.9 57 488.5C115.5 333 161 201 269 261C377 321 652.5 423 572 245.5C491.5 68 325.5 -45 226.5 20C127.5 85 -14.5 170 2.50001 245.5C19.5 321 199.5 639 319 586C438.5 533 534 522.5 520.5 596"
            stroke="black"
          />
        </svg>
      </BezierInput>
      <h1>{value.toFixed(2)}</h1>
    </>
  );
}

export default App;
