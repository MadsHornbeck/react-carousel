import React from "react";

export default function useScrollLock(bool) {
  React.useEffect(() => {
    if (bool) {
      const scrollTop = window.pageYOffset;
      const scrollbarWidth = getScrollbarWidth();
      const style = {
        overflow: "hidden",
        position: "fixed",
        top: -scrollTop + "px",
        width: `calc(100% - ${scrollbarWidth}px)`,
      };
      const prevStyle = setHtmlStyle(style);
      return () => {
        setHtmlStyle(prevStyle);
        window.scroll(0, scrollTop);
      };
    }
  }, [bool]);
}

function setHtmlStyle(style) {
  const html = document.documentElement;
  return Object.entries(style).reduce((a, [k, v]) => {
    a[k] = html.style[k];
    html.style[k] = v;
    return a;
  }, {});
}

let scrollbarWidth;
function getScrollbarWidth() {
  if (scrollbarWidth !== void 0) return scrollbarWidth;
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.top = "-9999px";
  el.style.overflow = "scroll";
  document.body.appendChild(el);
  const width = el.offsetWidth;
  document.body.removeChild(el);
  scrollbarWidth = width;
  return width;
}
