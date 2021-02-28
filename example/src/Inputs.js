import React from "react";

const Inputs = React.forwardRef((_, ref) => {
  const [free, setFree] = React.useState(false);
  const [revolve, setRevolve] = React.useState(false);
  const [gap, setGap] = React.useState(0);
  const [itemsPerSlide, setItemsPerSlide] = React.useState(3);

  React.useImperativeHandle(
    ref,
    () => ({
      free,
      revolve,
      gap: `${gap}rem`,
      itemsPerSlide,
    }),
    [free, gap, itemsPerSlide, revolve]
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
          Gap:
          <input
            type="number"
            onChange={(e) => setGap(e.currentTarget.valueAsNumber)}
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
            onChange={(e) => setItemsPerSlide(e.currentTarget.valueAsNumber)}
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
