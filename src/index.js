import React from "react";

import "./index.css";

// TODO: rename itemsPerSlide
// TODO: maybe rename free
// TODO: handle case where items have grid-column of > span 1
const Carousel = React.forwardRef(
  ({ children, className, revolve, itemsPerSlide, gap, free }, ref) => {
    const r = React.useRef();
    const [active, setActive] = React.useState(0);

    const [asdf, setAsdf] = React.useState([]);
    const [items, setItems] = React.useState(children.length);

    React.useEffect(() => {
      const i = [...r.current.children]
        .map((n) => window.getComputedStyle(n)["grid-column-start"])
        .map((s) => Number(s.split(" ")[1]) || 1);
      setAsdf(i);
      setItems(i.reduce((a, b) => a + b, 0));
    }, [children]);

    // TODO: figure out how to handle when toggling free from true -> false
    const changePosition = React.useCallback(
      (v) => {
        setActive((a) =>
          revolve ? a + v : Math.max(0, Math.min(a + v, items - itemsPerSlide))
        );
      },
      [itemsPerSlide, revolve, items]
    );

    const { events, moveOffset, isMoving } = useEvents({
      changePosition,
      free,
    });

    const offset = active - moveOffset * itemsPerSlide;
    const index = ((offset % items) + items) % items;

    React.useImperativeHandle(
      ref,
      () => ({
        changePosition,
        index,
        next: () => changePosition(1),
        prev: () => changePosition(-1),
      }),
      [changePosition, index]
    );

    React.useEffect(() => {
      if (!revolve) return;
      const page = Math.floor(offset / items);
      const churds = [...r.current.children];
      churds.forEach((child, i) => {
        const diff = index - i;
        const a = diff >= items - itemsPerSlide;
        const b = items > itemsPerSlide;
        const c = Math.abs(diff) === items - 1;
        const shift = (a || (b && c)) * Math.sign(diff);
        child.style.setProperty("--shift", (page + shift) * items);
      });
      return () => {
        churds.forEach((child) => {
          child.style.removeProperty("--shift");
        });
      };
    }, [index, items, itemsPerSlide, offset, revolve]);

    return React.createElement(
      "div",
      {
        className: `outer ${className}`,
        style: {
          "--gap": gap,
          "--offset": `${offset} / ${items}`,
          "--slides": `${items} / ${itemsPerSlide}`,
          "--items": items,
        },
      },
      React.createElement(
        "div",
        { tabIndex: "0", ...events },
        React.createElement(
          "div",
          {
            ref: r,
            className: "inner",
            style: {
              transition: isMoving ? "none" : null,
            },
          },
          children
        )
      )
    );
  }
);

// TODO: add prop-types.

Carousel.defaultProps = {
  className: "",
  free: false,
  gap: "0px",
  itemsPerSlide: 1,
  revolve: false,
};

Carousel.displayName = "Carousel";

export default Carousel;

function useEvents({ changePosition, free }) {
  const [initPos, setInitPos] = React.useState();
  const [moveOffset, setMoveOffset] = React.useState(0);

  const isMoving = initPos !== undefined;

  const handleStart = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    setInitPos({ x, y });
  };

  const handleMove = (e) => {
    // TODO: needs work, issues with scrolling on mobile.
    // TODO: make the swiping experience better!
    if (!isMoving) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const xDiff = x - initPos.x;
    const verticalScroll = Math.abs(y - initPos.y) > Math.abs(xDiff);
    if (
      e.touches &&
      verticalScroll &&
      !document.body.classList.contains("overflow-hidden")
    )
      return;
    setMoveOffset(xDiff / e.currentTarget.offsetWidth);

    if (e.touches && !verticalScroll) {
      document.body.classList.add("overflow-hidden");
    }
  };

  const handleEnd = () => {
    if (free) {
      changePosition(-moveOffset);
    } else if (Math.abs(moveOffset) > 0.3) {
      const i = Math.ceil(Math.abs(moveOffset)) * Math.sign(moveOffset);
      changePosition(-i);
    }
    setInitPos(undefined);
    setMoveOffset(0);
    document.body.classList.remove("overflow-hidden");
  };

  const onKeyDown = (e) => {
    const i = { ArrowLeft: -1, ArrowRight: 1 }[e.code] || 0;
    changePosition(i);
  };

  const events = {
    onKeyDown,
    onMouseDown: handleStart,
    onMouseLeave: handleEnd,
    onMouseMove: handleMove,
    onMouseUp: handleEnd,
    onTouchEnd: handleEnd,
    onTouchMove: handleMove,
    onTouchStart: handleStart,
  };

  return {
    events,
    isMoving,
    moveOffset,
  };
}
