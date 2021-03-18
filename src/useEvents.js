import React from "react";

import useScrollLock from "./useScrollLock";

const defaultPos = { x: 0, y: 0, dx: 0, dy: 0 };

export default function useEvents({ changePosition, free, itemsPerSlide }) {
  const ref = React.useRef({ offsetWidth: 1 });
  const [initPos, setInitPos] = React.useState();
  const [currPos, setCurrPos] = React.useState(defaultPos);
  const [freeOffset, setFreeOffset] = React.useState(0);

  const isMoving = initPos !== undefined;
  const moveOffset = isMoving
    ? (currPos.x - initPos.x) / ref.current.offsetWidth
    : 0;

  React.useEffect(() => {
    if (!free) {
      setFreeOffset((m) => {
        // TODO: maybe reconsider this way of doing it.
        changePosition(Math.round(-m * itemsPerSlide));
        return 0;
      });
    }
  }, [changePosition, free, isMoving, itemsPerSlide]);

  React.useEffect(() => {
    if (free && !isMoving) {
      const trunc = Math.trunc(freeOffset);
      const deci = freeOffset % 1;
      console.log({ freeOffset, trunc, deci });
    }
  });

  const prevTouch = React.useRef();
  const getEventData = (e) => {
    const { clientX: x, clientY: y, movementX, movementY } = e.touches
      ? e.touches[0]
      : e;
    const dx = e.touches
      ? x - (prevTouch.current ? prevTouch.current.x : x)
      : movementX;
    const dy = e.touches
      ? y - (prevTouch.current ? prevTouch.current.y : y)
      : movementY;
    const rs = { x, y, dx, dy };
    prevTouch.current = e.touches && rs;
    return rs;
  };
  const isTouch = !!prevTouch.current;

  const handleStart = (e) => {
    const ed = getEventData(e);
    setInitPos(ed);
    setCurrPos(ed);
  };

  const [preventScroll, setPreventScroll] = React.useState(false);
  React.useEffect(() => {
    if (!isTouch || preventScroll || !initPos) return;

    if (Math.abs(currPos.dy) > 10) {
      setInitPos(undefined);
    } else if (
      Math.abs(currPos.dx) > 10 ||
      Math.abs(moveOffset) > 1 / (itemsPerSlide * 3)
    ) {
      setPreventScroll(true);
    }
  }, [currPos, initPos, isTouch, itemsPerSlide, moveOffset, preventScroll]);

  useScrollLock(preventScroll);

  const handleMove = (e) => {
    if (!isMoving) return;
    setCurrPos(getEventData(e));
  };

  const handleEnd = () => {
    if (free) {
      setFreeOffset((m) => m + moveOffset);
    } else if (
      Math.abs(currPos.dx) > 10 ||
      Math.abs(moveOffset) > 1 / (itemsPerSlide * 3)
    ) {
      const i =
        Math.ceil(Math.abs(moveOffset) * itemsPerSlide) * Math.sign(moveOffset);
      changePosition(-i);
    }
    setInitPos(undefined);
    setCurrPos(defaultPos);
    setPreventScroll(false);
    prevTouch.current = undefined;
  };

  const onKeyDown = (e) => {
    const i = { ArrowLeft: -1, ArrowRight: 1 }[e.code] || 0;
    changePosition(i);
  };

  const events = {
    ref,
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
    moveOffset: moveOffset + freeOffset,
  };
}
