/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docs: [
    {
      type: "category",
      label: "Overview",
      items: ["main/features", "main/right-for-me", "main/getting-started"],
    },
    {
      type: "category",
      label: "Basic Info",
      items: [
        "main/discord",
        "main/what-is-isaacscript-doing",
        "main/directory-structure",
      ],
    },
    {
      type: "category",
      label: "Tutorials",
      items: [
        "main/javascript-tutorial",
        "main/example-mod",
        "main/refactoring-mod",
        "main/converting-lua-code",
        "main/updating-isaacscript",
        "main/using-get-data",
      ],
    },
    {
      type: "category",
      label: "Other Info",
      items: [
        "main/custom-stages",
        "main/publishing-to-the-workshop",
        "main/gotchas",
      ],
    },
    "main/change-log",
    {
      type: "link",
      label: "IsaacScript Standard Library",
      href: "/isaacscript-common",
    },
  ],

  isaacTypeScriptDefinitions: [
    {
      type: "autogenerated",
      dirName: "isaac-typescript-definitions",
    },
  ],

  isaacScriptCommon: [
    {
      type: "doc",
      id: "isaacscript-common/README",
    },
    {
      type: "category",
      label: "Core",
      items: [
        {
          type: "autogenerated",
          dirName: "isaacscript-common/Core",
        },
      ],
    },
    {
      type: "doc",
      id: "main/extra-callbacks",
    },
    {
      type: "category",
      label: "Extra Features",
      items: [
        {
          type: "autogenerated",
          dirName: "isaacscript-common/Features",
        },
      ],
    },
    {
      type: "category",
      label: "Helper Functions by Category",
      items: [
        {
          type: "autogenerated",
          dirName: "isaacscript-common/Functions",
        },
      ],
    },
    {
      type: "category",
      label: "Other Miscellaneous Exports",
      items: [
        {
          type: "category",
          label: "Classes",
          items: [
            {
              type: "autogenerated",
              dirName: "isaacscript-common/Classes",
            },
          ],
        },
        {
          type: "category",
          label: "Enums",
          items: [
            {
              type: "autogenerated",
              dirName: "isaacscript-common/Enums",
            },
          ],
        },
        {
          type: "category",
          label: "Interfaces",
          items: [
            {
              type: "autogenerated",
              dirName: "isaacscript-common/Interfaces",
            },
          ],
        },
        {
          type: "category",
          label: "Maps",
          items: [
            {
              type: "autogenerated",
              dirName: "isaacscript-common/Maps",
            },
          ],
        },
        {
          type: "category",
          label: "Objects",
          items: [
            {
              type: "autogenerated",
              dirName: "isaacscript-common/Objects",
            },
          ],
        },
        {
          type: "category",
          label: "Types",
          items: [
            {
              type: "autogenerated",
              dirName: "isaacscript-common/Types",
            },
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
