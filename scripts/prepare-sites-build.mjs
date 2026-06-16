import { copyFile, mkdir, writeFile } from "node:fs/promises";

await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });

const worker = `const notFound = () => new Response("Not found", { status: 404 });

export default {
  async fetch(request, env) {
    if (env?.ASSETS?.fetch) {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }

      const url = new URL(request.url);
      if (!url.pathname.includes(".")) {
        return env.ASSETS.fetch(new Request(new URL("/", url), request));
      }
    }

    return notFound();
  },
};
`;

await writeFile("dist/server/index.js", worker);
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
