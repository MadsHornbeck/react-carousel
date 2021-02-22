/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Carousel from "@hornbeck/react-carousel";

import Inputs from "./Inputs";

ReactDOM.render(
  <React.StrictMode>
    <div className="container">
      <h1>@hornbeck/react-carousel</h1>
      <Test />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);

function Test() {
  const [inputs, setInputs] = React.useState({});
  const ref = React.useRef();
  const { free, revolve, gap, itemsPerSlide } = inputs;
  return (
    <div>
      <Inputs ref={setInputs} />
      <hr />
      <Carousel
        ref={ref}
        itemsPerSlide={itemsPerSlide}
        revolve={revolve}
        free={free}
        gap={gap}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>{i}</div>
        ))}
      </Carousel>
      <button onClick={() => ref.current.prev()}>Prev</button>
      <button onClick={() => ref.current.next()}>Next</button>
    </div>
  );
}
