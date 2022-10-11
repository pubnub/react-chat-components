declare const _default: ({
    name: string;
    description: string;
    func: () => Promise<void>;
} | {
    name: string;
    description: string;
    func: (_: string[], ctx: import("@react-native-community/cli-types").Config, args: {
        simulator?: string | undefined;
        configuration: string;
        scheme?: string | undefined;
        projectPath: string;
        device?: string | true | undefined;
        udid?: string | undefined;
        packager: boolean;
        verbose: boolean;
        port: number;
        terminal: string | undefined;
    }) => void | Promise<void>;
    examples: {
        desc: string;
        cmd: string;
    }[];
    options: ({
        name: string;
        description: string;
        default: string;
        parse?: undefined;
    } | {
        name: string;
        description: string;
        default?: undefined;
        parse?: undefined;
    } | {
        name: string;
        default: string | number;
        parse: NumberConstructor;
        description?: undefined;
    } | {
        name: string;
        description: string;
        default: () => string | undefined;
        parse?: undefined;
    })[];
})[];
export default _default;
//# sourceMappingURL=index.d.ts.map