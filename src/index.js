import React from "react";

import useEvents from "./useEvents";
import { toIndex, sum, calcItemsOnLastSlide } from "./util";

// TODO: maybe rename free
const Carousel = React.forwardRef(
  (
    { center, children, free, gap, itemsPerSlide, revolve, vertical, ...rest },
    r
  ) => {
    const ips = center ? Math.ceil(itemsPerSlide / 2) : itemsPerSlide;
    const ref = React.useRef();
    const [position, setPosition] = React.useState(0);
    const length = children.length;

    // TODO: maybe use useMemo instead of useEffect and useState
    const [itemSizes, setItemSizes] = React.useState([]);
    React.useEffect(() => {
      const asdf = vertical ? "row" : "column";
      const i = [...ref.current.children]
        .map((n) => window.getComputedStyle(n)[`grid-${asdf}-start`])
        .map((s) => Number(s.split(" ")[1]) || 1);
      setItemSizes(i);
    }, [children, vertical]);

    const itemSizeSums = React.useMemo(
      () =>
        itemSizes.reduce((a, b) => a.concat(b + a[a.length - 1]), [0]).slice(1),
      [itemSizes]
    );
    const itemCount = itemSizeSums[itemSizeSums.length - 1] || length;

    const itemsOnLastSlide = React.useMemo(
      () => calcItemsOnLastSlide(itemSizes, ips),
      [itemSizes, ips]
    );

    const max = length - itemsOnLastSlide;
    const changePosition = React.useCallback(
      (v) => {
        const clamp = (x) => (revolve ? x : Math.max(0, Math.min(x, max)));
        setPosition((a) => clamp(a + v));
      },
      [max, revolve]
    );

    const { events, moveOffset, isMoving } = useEvents({
      changePosition,
      free,
      itemsPerSlide: ips,
    });

    const isOnLastSlide = !revolve && position === max;
    const endAlignment =
      isOnLastSlide && ips - sum(itemSizes.slice(-itemsOnLastSlide));

    const active =
      sum(itemSizes.slice(0, toIndex(position, length))) - endAlignment;

    const page = Math.floor(position / length);
    const offset = active - moveOffset * ips + page * itemCount;

    // TODO: find a better way to get the correct index.
    const dist = Math.round(toIndex(offset, itemCount));
    const id = itemSizeSums.findIndex((a) => dist < a);
    const index = id && (~id ? id : length - 1);

    React.useImperativeHandle(
      r,
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
      const churds = [...ref.current.children];
      churds.forEach((child, i) => {
        const diff = index - i;
        const moveHead = diff >= length - ips;
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
    }, [index, itemCount, itemSizes, ips, length, max, offset, revolve]);

    const [carouselHeight, setCarouselHeight] = React.useState();
    React.useLayoutEffect(() => {
      setCarouselHeight(
        vertical ? (ref.current.clientHeight * itemsPerSlide) / itemCount : ""
      );
    }, [gap, itemCount, itemsPerSlide, vertical]);

    return React.createElement(
      "div",
      {
        ...rest,
        className: [
          "hornbeck-carousel",
          center && "center",
          vertical ? "vertical" : "horizontal",
          rest.className,
        ]
          .filter(Boolean)
          .join(" "),
        style: {
          ...rest.style,
          "--gap": gap,
          "--offset": `${offset} / ${itemCount}`,
          "--slides": `${itemCount} / ${ips}`,
          "--itemCount": itemCount,
          "--center":
            center && `${Math.floor(itemsPerSlide / 2)} / ${itemsPerSlide}`,
          "--carousel-height": vertical && `${carouselHeight}px`,
        },
      },
      React.createElement(
        "div",
        { tabIndex: "0", ...events },
        React.createElement(
          "div",
          {
            ref,
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

Carousel.defaultProps = {
  itemsPerSlide: 1,
};

Carousel.displayName = "Carousel";

export default Carousel;
