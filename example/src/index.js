/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "@hornbeck/react-carousel/index.css";

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
  const { center, free, gap, itemsPerSlide, revolve, vertical } = inputs;
  return (
    <div>
      <Inputs ref={setInputs} />
      <hr />
      <Carousel
        ref={ref}
        center={center}
        free={free}
        gap={gap}
        itemsPerSlide={itemsPerSlide}
        revolve={revolve}
        vertical={vertical}
      >
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i}>{i}</div>
        ))}
      </Carousel>
      <hr />
      <button onClick={() => ref.current.prev()}>Prev</button>
      <button onClick={() => ref.current.next()}>Next</button>
      <div style={{ height: "200vh" }} />
    </div>
  );
}
