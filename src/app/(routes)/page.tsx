"use client";

import {
  MovesContextProvider,
  PatternSearchForm,
} from "@components/pattern_search/exports";

export default function Home() {
  return (
    <>
      <h1>Go Pattern Search</h1>

      <MovesContextProvider>
        <PatternSearchForm />
      </MovesContextProvider>
    </>
  );
}
