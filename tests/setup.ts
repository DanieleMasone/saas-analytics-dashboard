import "@testing-library/jest-dom/vitest";
import {afterEach, beforeEach, vi} from "vitest";

import {cleanup} from "@testing-library/react";

class ResizeObserverMock {
  observe() {
  }

  unobserve() {
  }

  disconnect() {
  }
}

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  });

  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

afterEach(() => {
  cleanup();
  document.documentElement.className = "";
  delete document.documentElement.dataset.dashboardTheme;
  window.localStorage.clear();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
