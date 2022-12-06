import * as Router from "find-my-way";

type RouteHandler = (
  req: {
    method: string;
    body?: any;
    headers: Record<string, any>;
    url: { path: string; query: Record<string, string> };
  },
  params?: Record<string, any>
) =>
  | Promise<{
      status: number;
      headers?: Record<string, any>;
      body?: any;
    }>
  | {
      status: number;
      headers?: Record<string, any>;
      body?: any;
    };

type Routes = {
  [k: string]: RouteHandler;
};

export function router(expect: any, routes: Routes) {
  const router = Router();

  for (const [key, handler] of Object.entries(routes)) {
    const [method, path] = key.split(" ");

    router.on(method.toUpperCase() as Router.HTTPMethod, path, handler as any);
  }

  return async function () {
    while (true) {
      const request = await expect({
        description: "any request",
        validations: [],
      });

      const route = router.find(
        request.method.toUpperCase() as Router.HTTPMethod,
        request.url.path
      );

      if (!route) {
        await request.respond({ status: 404 });
      } else {
        const response = await (route.handler as RouteHandler)(request, route.params);

        await request.respond({
          status: response?.status,
          headers: response?.headers,
          body: response?.body,
        });
      }
    }
  };
}
