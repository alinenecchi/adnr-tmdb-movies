import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useInfiniteScroll } from "./useInfiniteScroll";

interface MockObserver {
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  callback?: IntersectionObserverCallback;
}

const createMockEntry = (
  element: Element,
  isIntersecting: boolean
): IntersectionObserverEntry => ({
  boundingClientRect: element.getBoundingClientRect(),
  intersectionRatio: isIntersecting ? 1 : 0,
  intersectionRect: element.getBoundingClientRect(),
  isIntersecting,
  rootBounds: null,
  target: element,
  time: Date.now(),
});

describe("useInfiniteScroll", () => {
  let mockObserver: MockObserver;
  let mockIntersectionObserver: typeof IntersectionObserver;

  beforeEach(() => {
    mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      callback: undefined,
    };

    mockIntersectionObserver = vi
      .fn()
      .mockImplementation((callback: IntersectionObserverCallback) => {
        // Store callback for manual triggering
        mockObserver.callback = callback;
        return mockObserver;
      }) as typeof IntersectionObserver;

    global.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("should return a ref", () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        loading: false,
        hasMore: true,
        onLoadMore,
      })
    );

    expect(result.current).toBeDefined();
    expect(typeof result.current.current).toBe("object");
  });

  it("should observe element when ref is attached", async () => {
    const onLoadMore = vi.fn();
    const mockElement = document.createElement("div");
    document.body.appendChild(mockElement);

    const { result, rerender } = renderHook(
      ({ loading }) =>
        useInfiniteScroll({
          loading,
          hasMore: true,
          onLoadMore,
        }),
      {
        initialProps: { loading: false },
      }
    );

    // Attach element to ref
    result.current.current = mockElement;

    // Change loading to force re-render and trigger useEffect
    rerender({ loading: true });
    rerender({ loading: false });

    // Wait for effect to run
    await waitFor(
      () => {
        expect(mockIntersectionObserver).toHaveBeenCalled();
        expect(mockObserver.observe).toHaveBeenCalledWith(mockElement);
      },
      { timeout: 1000 }
    );

    document.body.removeChild(mockElement);
  });

  it("should not observe when element is null", () => {
    const onLoadMore = vi.fn();
    renderHook(() =>
      useInfiniteScroll({
        loading: false,
        hasMore: true,
        onLoadMore,
      })
    );

    // Element is null, so observe should not be called
    expect(mockObserver.observe).not.toHaveBeenCalled();
  });

  it("should call onLoadMore when element intersects", () => {
    const onLoadMore = vi.fn();
    const mockElement = document.createElement("div");

    renderHook(() =>
      useInfiniteScroll({
        loading: false,
        hasMore: true,
        onLoadMore,
      })
    );

    // Manually trigger the callback that would be set by IntersectionObserver
    const callback = mockObserver.callback;
    if (callback) {
      callback(
        [createMockEntry(mockElement, true)],
        mockObserver as unknown as IntersectionObserver
      );
      expect(onLoadMore).toHaveBeenCalled();
    }
  });

  it("should not call onLoadMore when loading", () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        loading: true,
        hasMore: true,
        onLoadMore,
      })
    );

    const mockElement = document.createElement("div");
    result.current.current = mockElement;

    const callback = mockObserver.callback;
    if (callback) {
      callback(
        [createMockEntry(mockElement, true)],
        mockObserver as unknown as IntersectionObserver
      );
    }

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("should not call onLoadMore when hasMore is false", () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        loading: false,
        hasMore: false,
        onLoadMore,
      })
    );

    const mockElement = document.createElement("div");
    result.current.current = mockElement;

    const callback = mockObserver.callback;
    if (callback) {
      callback(
        [createMockEntry(mockElement, true)],
        mockObserver as unknown as IntersectionObserver
      );
    }

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("should not call onLoadMore when not intersecting", () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        loading: false,
        hasMore: true,
        onLoadMore,
      })
    );

    const mockElement = document.createElement("div");
    result.current.current = mockElement;

    const callback = mockObserver.callback;
    if (callback) {
      callback(
        [createMockEntry(mockElement, false)],
        mockObserver as unknown as IntersectionObserver
      );
    }

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("should use custom threshold", async () => {
    const onLoadMore = vi.fn();
    const customThreshold = 0.5;
    const mockElement = document.createElement("div");
    document.body.appendChild(mockElement);

    const { result, rerender } = renderHook(
      ({ threshold }) =>
        useInfiniteScroll({
          loading: false,
          hasMore: true,
          onLoadMore,
          threshold,
        }),
      {
        initialProps: { threshold: customThreshold },
      }
    );

    // Attach element to ref
    result.current.current = mockElement;

    // Change threshold to force re-render and trigger useEffect
    rerender({ threshold: 0.8 });
    rerender({ threshold: customThreshold });

    // Check that IntersectionObserver was called with custom threshold
    await waitFor(
      () => {
        expect(mockIntersectionObserver).toHaveBeenCalledWith(
          expect.any(Function),
          { threshold: customThreshold }
        );
      },
      { timeout: 1000 }
    );

    document.body.removeChild(mockElement);
  });

  it("should disconnect observer on unmount", async () => {
    const onLoadMore = vi.fn();
    const mockElement = document.createElement("div");
    document.body.appendChild(mockElement);

    const { result, rerender, unmount } = renderHook(
      ({ loading }) =>
        useInfiniteScroll({
          loading,
          hasMore: true,
          onLoadMore,
        }),
      {
        initialProps: { loading: false },
      }
    );

    // Attach element to ref
    result.current.current = mockElement;

    // Change loading to force re-render and trigger useEffect
    rerender({ loading: true });
    rerender({ loading: false });

    // Wait for observer to be created
    await waitFor(
      () => {
        expect(mockIntersectionObserver).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    unmount();
    expect(mockObserver.disconnect).toHaveBeenCalled();

    document.body.removeChild(mockElement);
  });
});
