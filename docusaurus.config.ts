import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "dockerdocs",
  tagline: "docker docs",
  favicon: "img/docker-favicon.ico",

  // Set the production url of your site here
  url: "https://docker.mogumogu.dev/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "mogumogu", // Usually your GitHub org/user name.
  projectName: "dockerdocs", // Usually your repo name.

  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "ignore",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "ko",
    locales: ["ko"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "light",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "",
      logo: {
        alt: "Docker Logo",
        src: "img/docker-logo-white.svg",
        srcDark: "img/docker-logo-white.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "getStarted",
          position: "left",
          label: "시작하기",
        },
        {
          type: "docSidebar",
          sidebarId: "manual",
          position: "left",
          label: "매뉴얼",
        },
        {
          type: "docSidebar",
          sidebarId: "reference",
          position: "left",
          label: "참고자료",
        },
      ],
    },
    plugins: [
      async function myPlugin() {
        return {
          name: "custom-mdx-components",
          configureWebpack() {
            return {
              resolve: {
                alias: {
                  "@theme/MDXComponents": require.resolve(
                    "./src/theme/MDXComponents"
                  ),
                },
              },
            };
          },
        };
      },
    ],
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/KnSwYaWwBG",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              href: "https://mogumogu.dev",
            },
            {
              label: "Docs",
              href: "https://docs.mogumogu.dev",
            },
            {
              label: "GitHub",
              href: "https://github.com/foreverfl/docker-translated",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Docker Inc. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "bash",
        "git",
        "diff",
        "docker",
        "yaml",
        "toml",
        "json",
        "java",
        "javascript",
        "python",
      ],
    },
    mermaid: {
      theme: { light: "neutral", dark: "forest" },
    },
  } satisfies Preset.ThemeConfig,
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
};

export default config;
