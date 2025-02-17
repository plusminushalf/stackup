// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Stackup Dev",
  tagline: "Open source tools for building Web3 apps with account abstraction.",
  url: "https://docs.stackup.sh",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "stackupfinance", // Usually your GitHub org/user name.
  projectName: "stackup", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Stackup Dev",
        logo: {
          alt: "Stackup Developer documentation",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "/category/introduction",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://stackup.sh",
            label: "Website",
            position: "right",
          },
          {
            href: "https://github.com/stackupfinance/stackup",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://eips.ethereum.org/EIPS/eip-4337",
            label: "EIP-4337",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Get Started",
                to: "/docs/category/introduction",
              },
              {
                label: "Client SDK",
                to: "/docs/category/client-sdk",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/stackup_fi",
              },
              {
                label: "Discord",
                href: "https://discord.gg/FpXmvKrNed",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Website",
                href: "https://stackup.sh",
              },
              {
                label: "GitHub",
                href: "https://github.com/stackupfinance/stackup",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Stackup.`,
      },
      colorMode: {
        defaultMode: "dark",
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["solidity"],
      },
    }),
};

module.exports = config;
