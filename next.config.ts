import type {NextConfig} from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(1);

function normalizeBasePath(value?: string) {
  if (!value || value === "/") return "";
  return value.startsWith("/") ? value : `/${value}`;
}

const basePath = isGithubPages
    ? normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? repositoryName)
    : "";

const nextConfig: NextConfig = {
  assetPrefix: basePath ? `${basePath}/` : undefined,
  basePath: basePath || undefined,
  images: {
    unoptimized: isGithubPages,
  },
  output: isGithubPages ? "export" : undefined,
  reactStrictMode: true,
  trailingSlash: isGithubPages ? true : undefined,
};

export default nextConfig;
