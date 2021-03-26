Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: jest.fn().mockReturnValue({
    observe: jest.fn().mockReturnValue(null),
    unobserve: jest.fn().mockReturnValue(null),
    disconnect: jest.fn().mockReturnValue(null),
  }),
});
