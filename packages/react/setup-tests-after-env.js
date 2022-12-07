beforeEach(() => {
  const intersectionObserverMock = jest.fn().mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
  const resizeObserverMock = jest.fn().mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });

  window.IntersectionObserver = intersectionObserverMock;
  window.ResizeObserver = resizeObserverMock;
});
