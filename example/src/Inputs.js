import React from "react";

const Inputs = React.forwardRef((_, ref) => {
  const [free, setFree] = React.useState(0);
  const [revolve, setRevolve] = React.useState(0);
  const [center, setCenter] = React.useState(0);
  const [vertical, setVertical] = React.useState(0);
  const [gap, setGap] = React.useState(0);
  const [itemsPerSlide, setItemsPerSlide] = React.useState(3);

  React.useImperativeHandle(
    ref,
    () => ({
      center,
      free,
      gap: `${gap}rem`,
      itemsPerSlide:
        Number.isFinite(+itemsPerSlide) && itemsPerSlide > 0
          ? itemsPerSlide
          : 1,
      revolve,
      vertical,
    }),
    [center, free, gap, itemsPerSlide, revolve, vertical]
  );

  return (
    <div>
      <div>
        <label>
          Free:
          <input
            type="checkbox"
            onChange={(e) => setFree(e.currentTarget.checked)}
            value={free}
            checked={free}
          />
        </label>
      </div>
      <div>
        <label>
          Revolve:
          <input
            type="checkbox"
            onChange={(e) => setRevolve(e.currentTarget.checked)}
            value={revolve}
            checked={revolve}
          />
        </label>
      </div>
      <div>
        <label>
          Center:
          <input
            type="checkbox"
            onChange={(e) => setCenter(e.currentTarget.checked)}
            value={center}
            checked={center}
          />
        </label>
      </div>
      <div>
        <label>
          vertical:
          <input
            type="checkbox"
            onChange={(e) => setVertical(e.currentTarget.checked)}
            value={vertical}
            checked={vertical}
          />
        </label>
      </div>
      <div>
        <label>
          Gap:
          <input
            type="number"
            onChange={(e) => setGap(e.currentTarget.value)}
            value={gap}
            min="0"
          />
        </label>
      </div>
      <div>
        <label>
          Items per slide:
          <input
            type="number"
            onChange={(e) => setItemsPerSlide(e.currentTarget.value)}
            value={itemsPerSlide}
            min="1"
          />
        </label>
      </div>
    </div>
  );
});

Inputs.displayName = "Inputs";

export default Inputs;
