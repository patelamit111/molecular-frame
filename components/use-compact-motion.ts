"use client";

import { useSyncExternalStore } from "react";

const compactMotionQuery = "(max-width: 900px), (pointer: coarse)";

function subscribe(onStoreChange: () => void) {
  const query = window.matchMedia(compactMotionQuery);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(compactMotionQuery).matches;
}

function getServerSnapshot() {
  return true;
}

export function useCompactMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
