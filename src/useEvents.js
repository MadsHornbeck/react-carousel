import React from "react";

export default function useEvents({ changePosition, free, itemsPerSlide }) {
  const [initPos, setInitPos] = React.useState();
  const [moveOffset, setMoveOffset] = React.useState(0);
  const [freeOffset, setFreeOffset] = React.useState(0);

  React.useEffect(() => {
    if (!free) {
      setFreeOffset((m) => {
        // TODO: maybe reconsider this way of doing it.
        changePosition(Math.round(-m * itemsPerSlide));
        return 0;
      });
    }
  }, [changePosition, free, itemsPerSlide]);

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
      setFreeOffset((m) => m + moveOffset);
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
    moveOffset: moveOffset + freeOffset,
  };
}
