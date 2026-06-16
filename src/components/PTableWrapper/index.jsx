import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { symbols, names } from "mc-periodic-table";

export function PTableWrapper({
  noInteractArray = [],
  noHighlightArray = [],
  onChange,
  zoomLevel = 1550,
  stateCount = 2,
  symbol = [{ slot: "center", minWidth: 0 }],
  number = [{ slot: "topCenter", minWidth: 625 }],
  name = [{ slot: "bottom", minWidth: 1500 }],
  singleMode = false,
}) {
  const ptRef = useRef(null);
  const wrapperRef = useRef(null);
  const activeFieldsRef = useRef(null);

  // -----------------------------
  // interaction + highlight modes
  // -----------------------------
  useEffect(() => {
    const pt = ptRef.current;
    if (!pt) return;

    const interactIds = new Set(noInteractArray);
    const highlightIds = new Set(noHighlightArray);
    const allIds = new Set([...interactIds, ...highlightIds]);

    for (const id of allIds) {
      if (interactIds.has(id)) {
        pt.setCellInteraction([id], "noInteractive");
      } else if (highlightIds.has(id)) {
        pt.setCellInteraction([id], "noHighlight");
      } else {
        pt.setCellInteraction([id], "normal");
      }
    }
  }, [noInteractArray, noHighlightArray]);

  // -----------------------------
  // Set single mode
  // -----------------------------
  useEffect(() => {
    const pt = ptRef.current;
    if (!pt) return;

    pt.singleSelect = !!singleMode;
  }, [singleMode]);

  // -----------------------------
  // Set number of states
  // -----------------------------
  useEffect(() => {
    const pt = ptRef.current;
    if (!pt || stateCount == null) return;

    pt._stateCount = stateCount;
  }, [stateCount]);

  // -----------------------------
  // change handler
  // -----------------------------
  useEffect(() => {
    const pt = ptRef.current;
    if (!pt) return;

    const handleChange = (e) => {
      onChange?.(e.detail);
    };

    pt.addEventListener("change", handleChange);
    return () => pt.removeEventListener("change", handleChange);
  }, [onChange]);

  // -----------------------------
  // responsive + slot resolution
  // -----------------------------
  useEffect(() => {
    const el = wrapperRef.current;
    const pt = ptRef.current;
    if (!el || !pt) return;

    const resolveFields = (width) => {
      const rules = [
        ...symbol.map((r) => ({ ...r, getter: (a) => symbols[a] })),
        ...number.map((r) => ({ ...r, getter: (a) => a })),
        ...name.map((r) => ({ ...r, getter: (a) => names[a] })),
      ];

      const fields = {};

      for (const rule of rules) {
        if (width >= rule.minWidth) {
          fields[rule.slot] = rule.getter;
        }
      }

      return fields;
    };

    const update = () => {
      const width = el.clientWidth;

      // scaling
      let scale = width / zoomLevel;
      scale = Math.max(0.1, Math.min(1.5, scale));

      pt.style.setProperty("--font-size", `${17.5 * scale}px`);
      pt.style.setProperty("--cell-size", `${54 * scale}px`);
      pt.style.setProperty("--font-scale-bottom", 0.45);

      pt.style.setProperty("--gap", `${4 * scale}px`);
      pt.style.setProperty("--f-offset", `${18 * scale}px`);

      // resolve responsive fields
      const fields = resolveFields(width);

      const prev = activeFieldsRef.current;
      const same =
        prev &&
        Object.keys(fields).length === Object.keys(prev).length &&
        Object.keys(fields).every((k) => fields[k] === prev[k]);

      if (!same) {
        activeFieldsRef.current = fields;
        pt.fields = fields;
      }
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);

    update();

    return () => ro.disconnect();
  }, [symbol, number, name]);

  // -----------------------------
  // render
  // -----------------------------
  return (
    <div
      ref={wrapperRef}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingBottom: "40px",
      }}
    >
      <periodic-table ref={ptRef} />
    </div>
  );
}
