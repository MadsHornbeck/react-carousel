import React from "react";

import "./index.css";
import useEvents from "./useEvents";
import { toIndex, sum, calcItemsOnLastSlide } from "./util";

// TODO: maybe rename itemsPerSlide
// TODO: maybe rename free
const Carousel = React.forwardRef(
  ({ children, className, revolve, itemsPerSlide, gap, free }, ref) => {
    const r = React.useRef();
    const [position, setPosition] = React.useState(0);
    const length = children.length;

    // TODO: maybe use useMemo instead of useEffect and useState
    const [itemSizes, setItemSizes] = React.useState([]);
    React.useEffect(() => {
      const i = [...r.current.children]
        .map((n) => window.getComputedStyle(n)["grid-column-start"])
        .map((s) => Number(s.split(" ")[1]) || 1);
      setItemSizes(i);
    }, [children]);

    const itemCount = React.useMemo(() => sum(itemSizes) || length, [
      length,
      itemSizes,
    ]);

    const itemsOnLastSlide = React.useMemo(
      () => calcItemsOnLastSlide(itemSizes, itemsPerSlide),
      [itemSizes, itemsPerSlide]
    );

    const max = length - itemsOnLastSlide;
    const changePosition = React.useCallback(
      (v) => {
        setPosition((a) =>
          revolve ? a + v : Math.max(0, Math.min(a + v, max))
        );
      },
      [max, revolve]
    );

    const { events, moveOffset, isMoving } = useEvents({
      changePosition,
      free,
      itemsPerSlide,
    });

    const isOnLastSlide = !revolve && position === max;
    // TODO: find better name than `endAlignment`
    const endAlignment =
      isOnLastSlide && itemsPerSlide - sum(itemSizes.slice(-itemsOnLastSlide));

    const active =
      sum(itemSizes.slice(0, toIndex(position, length))) - endAlignment;

    const page = Math.floor(position / length);
    const offset = active - moveOffset * itemsPerSlide + page * itemCount;

    // TODO: find a better way to get the correct index.
    const itemSizeSums = React.useMemo(
      () =>
        itemSizes.reduce((a, b) => a.concat(b + a[a.length - 1]), [0]).slice(1),
      [itemSizes]
    );
    const dist = Math.round(toIndex(offset, itemCount));
    const id = itemSizeSums.findIndex((a) => dist < a);
    const index = id && (~id ? id : length - 1);

    React.useImperativeHandle(
      ref,
      () => ({
        changePosition,
        index,
        next: () => changePosition(1),
        prev: () => changePosition(-1),
        setPosition,
      }),
      [changePosition, index]
    );

    React.useEffect(() => {
      if (!revolve) return;
      const page = Math.floor(offset / itemCount);
      const churds = [...r.current.children];
      churds.forEach((child, i) => {
        const diff = index - i;
        const moveHead = diff >= length - itemsPerSlide;
        const moveTail = Math.abs(diff) >= max;
        const shift = (moveHead || moveTail) * Math.sign(diff);
        child.style.setProperty(
          "--shift",
          `${(page + shift) * itemCount} / ${itemSizes[i]}`
        );
      });
      return () => {
        churds.forEach((child) => {
          child.style.removeProperty("--shift");
        });
      };
    }, [
      index,
      itemCount,
      itemSizes,
      itemsPerSlide,
      length,
      max,
      offset,
      revolve,
    ]);

    return React.createElement(
      "div",
      {
        className: `hornbeck-carousel ${className}`,
        style: {
          "--gap": gap,
          "--offset": `${offset} / ${itemCount}`,
          "--slides": `${itemCount} / ${itemsPerSlide}`,
          "--itemCount": itemCount,
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
