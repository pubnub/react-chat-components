declare const window: {
    document: {
        title: string;
    };
    location: URL;
    history: {
        readonly state: any;
        pushState(state: any, _: string, path: string): void;
        replaceState(state: any, _: string, path: string): void;
        go(n: number): void;
        back(): void;
        forward(): void;
    };
    addEventListener: (type: 'popstate', listener: () => void) => void;
    removeEventListener: (type: 'popstate', listener: () => void) => void;
    readonly window: any;
};
export default window;
