// This ESLint config only contains rules from `@typescript-eslint/eslint-plugin`:
// https://typescript-eslint.io/rules/

// Rules are separated into categories:
// 1) Supported Rules
// 2) Extension Rules

/** @type {import("eslint").Linter.RulesRecord} */
const SUPPORTED_RULES = {
  "@typescript-eslint/adjacent-overload-signatures": "error",

  /**
   * The default value is `array`. We choose `array-simple` because it makes complicated arrays
   * easier to understand. This is worth the cost of deviating from the base rule configuration.
   */
  "@typescript-eslint/array-type": [
    "error",
    {
      default: "array-simple",
    },
  ],

  "@typescript-eslint/await-thenable": "error",
  "@typescript-eslint/ban-ts-comment": "error",
  "@typescript-eslint/ban-tslint-comment": "error",
  "@typescript-eslint/ban-types": "error",
  "@typescript-eslint/class-literal-property-style": "error",
  "@typescript-eslint/consistent-generic-constructors": "error",
  "@typescript-eslint/consistent-indexed-object-style": "error",
  "@typescript-eslint/consistent-type-assertions": "error",
  "@typescript-eslint/consistent-type-definitions": "error",
  "@typescript-eslint/consistent-type-exports": "error",
  "@typescript-eslint/consistent-type-imports": "error",

  /**
   * Disabled since it would be to cumbersome to require return types for non-exported functions.
   * (It is more reasonable to require it for exported functions only, since it speeds up the
   * type-checker in large codebases.)
   */
  "@typescript-eslint/explicit-function-return-type": "off",

  /**
   * Disabled since many programs may have internal-only classes that would not benefit from an
   * explicit public/private distinction.
   */
  "@typescript-eslint/explicit-member-accessibility": "off",

  "@typescript-eslint/explicit-module-boundary-types": "error",
  "@typescript-eslint/member-delimiter-style": "off", // eslint-config-prettier

  /** Disabled since prescribed class ordering is too project-specific. */
  "@typescript-eslint/member-ordering": "off",

  "@typescript-eslint/method-signature-style": "error",

  /**
   * The options are [copied from
   * Airbnb](https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js).
   * We also allow a leading underscore, which signifies that the element is temporarily not being
   * used.
   */
  "@typescript-eslint/naming-convention": [
    "error",
    // Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables
    // (23.10).
    {
      selector: "variable",
      format: ["camelCase", "PascalCase", "UPPER_CASE"],
      leadingUnderscore: "allow",

      // Polyfilling "__dirname" in ESM files is a common pattern.
      filter: {
        regex: "^__dirname$",
        match: false,
      },
    },
    // Allow camelCase functions (23.2), and PascalCase functions (23.8).
    {
      selector: "function",
      format: ["camelCase", "PascalCase"],
      leadingUnderscore: "allow",
    },
    // Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript
    // recommendations, we are assuming this rule would similarly apply to anything "type like",
    // including interfaces, type aliases, and enums.
    {
      selector: "typeLike",
      format: ["PascalCase"],
      leadingUnderscore: "allow",
    },
  ],

  "@typescript-eslint/no-base-to-string": "error",
  "@typescript-eslint/no-confusing-non-null-assertion": "error",
  "@typescript-eslint/no-confusing-void-expression": "error",
  "@typescript-eslint/no-duplicate-enum-values": "error",
  "@typescript-eslint/no-duplicate-type-constituents": "error",
  "@typescript-eslint/no-dynamic-delete": "error",
  "@typescript-eslint/no-empty-interface": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-extra-non-null-assertion": "error",
  "@typescript-eslint/no-extraneous-class": "error",
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-for-in-array": "error",
  "@typescript-eslint/no-import-type-side-effects": "error",
  "@typescript-eslint/no-inferrable-types": "error",
  "@typescript-eslint/no-invalid-void-type": "error",
  "@typescript-eslint/no-meaningless-void-operator": "error",
  "@typescript-eslint/no-misused-new": "error",
  "@typescript-eslint/no-misused-promises": "error",
  "@typescript-eslint/no-mixed-enums": "error",
  "@typescript-eslint/no-namespace": "error",
  "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
  "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
  "@typescript-eslint/no-non-null-assertion": "error",
  "@typescript-eslint/no-redundant-type-constituents": "error",
  "@typescript-eslint/no-require-imports": "error",
  "@typescript-eslint/no-this-alias": "error",

  /** Disabled because this rule is deprecated. */
  "@typescript-eslint/no-type-alias": "off",

  "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
  "@typescript-eslint/no-unnecessary-condition": "error",
  "@typescript-eslint/no-unnecessary-qualifier": "error",
  "@typescript-eslint/no-unnecessary-type-arguments": "error",
  "@typescript-eslint/no-unnecessary-type-assertion": "error",
  "@typescript-eslint/no-unnecessary-type-constraint": "error",
  "@typescript-eslint/no-unsafe-argument": "error",
  "@typescript-eslint/no-unsafe-assignment": "error",
  "@typescript-eslint/no-unsafe-call": "error",
  "@typescript-eslint/no-unsafe-declaration-merging": "error",
  "@typescript-eslint/no-unsafe-enum-comparison": "error",
  "@typescript-eslint/no-unsafe-member-access": "error",
  "@typescript-eslint/no-unsafe-return": "error",
  "@typescript-eslint/no-useless-empty-export": "error",
  "@typescript-eslint/no-var-requires": "error",
  "@typescript-eslint/non-nullable-type-assertion-style": "error",
  "@typescript-eslint/parameter-properties": "error",
  "@typescript-eslint/prefer-as-const": "error",
  "@typescript-eslint/prefer-enum-initializers": "error",
  "@typescript-eslint/prefer-for-of": "error",
  "@typescript-eslint/prefer-function-type": "error",
  "@typescript-eslint/prefer-includes": "error",
  "@typescript-eslint/prefer-literal-enum-member": "error",
  "@typescript-eslint/prefer-namespace-keyword": "error",
  "@typescript-eslint/prefer-nullish-coalescing": "error",

  /**
   * Disabled because it can modify the type of `boolean` declarations, which is [undesired in some
   * circumstances](https://github.com/typescript-eslint/typescript-eslint/issues/5269).
   */
  "@typescript-eslint/prefer-optional-chain": "off",

  "@typescript-eslint/prefer-readonly": "error",

  /** Disabled since it can obfuscate the intended input types of a function. */
  "@typescript-eslint/prefer-readonly-parameter-types": "off",

  "@typescript-eslint/prefer-reduce-type-parameter": "error",

  /** Disabled since using the `String.match` form might make code easier to read. */
  "@typescript-eslint/prefer-regexp-exec": "off",

  "@typescript-eslint/prefer-return-this-type": "error",
  "@typescript-eslint/prefer-string-starts-ends-with": "error",
  "@typescript-eslint/prefer-ts-expect-error": "error",
  "@typescript-eslint/promise-function-async": "error",
  "@typescript-eslint/require-array-sort-compare": "error",
  "@typescript-eslint/restrict-plus-operands": "error",

  /** Disabled since a common use-case of template strings is to coerce everything to a string. */
  "@typescript-eslint/restrict-template-expressions": "off",

  /** Disabled since in it does not make sense to sort a union alphabetically in many cases. */
  "@typescript-eslint/sort-type-constituents": "off",

  /** The `allowString` and `allowNumber` options are disabled to make the rule stricter. */
  "@typescript-eslint/strict-boolean-expressions": [
    "error",
    {
      allowString: false,
      allowNumber: false,
      allowNullableObject: true,
      allowNullableBoolean: false,
      allowNullableString: false,
      allowNullableNumber: false,
      allowNullableEnum: false,
      allowAny: false,
      allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
    },
  ],

  "@typescript-eslint/switch-exhaustiveness-check": "error",
  "@typescript-eslint/triple-slash-reference": "error",
  "@typescript-eslint/type-annotation-spacing": "off", // eslint-config-prettier

  /**
   * Disabled since it is not recommended by the `typescript-eslint` team. (They recommend using the
   * `noImplicitAny` and `strictPropertyInitialization` TypeScript compiler options instead.)
   */
  "@typescript-eslint/typedef": "off",

  "@typescript-eslint/unbound-method": "error",
  "@typescript-eslint/unified-signatures": "error",
};

/** @type {import("eslint").Linter.RulesRecord} */
const EXTENSION_RULES = {
  "@typescript-eslint/block-spacing": "off", // eslint-config-prettier
  "@typescript-eslint/brace-style": "off", // eslint-config-prettier
  "@typescript-eslint/class-methods-use-this": "error",
  "@typescript-eslint/comma-dangle": "off", // eslint-config-prettier
  "@typescript-eslint/comma-spacing": "off", // eslint-config-prettier
  "@typescript-eslint/default-param-last": "error",
  "@typescript-eslint/dot-notation": "error",
  "@typescript-eslint/func-call-spacing": "off", // eslint-config-prettier
  "@typescript-eslint/indent": "off", // eslint-config-prettier

  /**
   * Disabled since it is superfluous to require an `= undefined` during variable initialization
   * (and TypeScript will take care of the non-undefined cases).
   */
  "@typescript-eslint/init-declarations": "off",

  "@typescript-eslint/key-spacing": "off", // eslint-config-prettier
  "@typescript-eslint/keyword-spacing": "off", // eslint-config-prettier

  /**
   * Even though the `typescript-eslint` team does not recommend using formatting rules, this rule
   * is not handled by Prettier, so we must use ESLint to enforce it.
   */
  "@typescript-eslint/lines-around-comment": [
    "error",
    {
      // All of these properties default to false.
      allowBlockStart: true,
      allowObjectStart: true,
      allowArrayStart: true,
      allowClassStart: true,
      allowEnumStart: true,
      allowInterfaceStart: true,
      allowModuleStart: true,
      allowTypeStart: true,
    },
  ],

  /**
   * Even though the `typescript-eslint` team does not recommend using formatting rules, this rule
   * is not handled by Prettier, so we must use ESLint to enforce it.
   */
  "@typescript-eslint/lines-between-class-members": [
    "error",
    "always",
    {
      exceptAfterSingleLine: true,
    },
  ],

  "@typescript-eslint/no-array-constructor": "error",

  /**
   * Disabled since it is superfluous when using TypeScript according to [the ESLint
   * documentation](https://eslint.org/docs/latest/rules/no-dupe-class-members#when-not-to-use-it).
   */
  "@typescript-eslint/no-dupe-class-members": "off",

  "@typescript-eslint/no-empty-function": "error",
  "@typescript-eslint/no-extra-parens": "off", // eslint-config-prettier
  "@typescript-eslint/no-extra-semi": "off", // eslint-config-prettier
  "@typescript-eslint/no-implied-eval": "error",

  /** The `capIsConstructor` option is disabled to make the rule stricter. */
  "@typescript-eslint/no-invalid-this": [
    "error",
    {
      capIsConstructor: false,
    },
  ],

  "@typescript-eslint/no-loop-func": "error",
  "@typescript-eslint/no-loss-of-precision": "error",

  /** Disabled since it results in too many false positives. */
  "@typescript-eslint/no-magic-numbers": "off",

  /**
   * Disabled since it is handled by the combination of the TypeScript compiler and the `no-var`
   * ESLint rule.
   */
  "@typescript-eslint/no-redeclare": "off",

  /**
   * Disabled since it would only be needed in specific environments (such as forbidding Node.js
   * imports in a browser environment).
   */
  "@typescript-eslint/no-restricted-imports": "off",

  "@typescript-eslint/no-shadow": "error",
  "@typescript-eslint/no-throw-literal": "error",
  "@typescript-eslint/no-unused-expressions": "error",

  /**
   * The `args` option is set to `all` make the rule stricter. Additionally, we ignore things that
   * begin with an underscore, since this matches the behavior of the `--noUnusedLocals` TypeScript
   * compiler flag.
   */
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "all", // "after-used" is the default.
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],

  /** Disabled because it can prevent code from being structured sequentially. */
  "@typescript-eslint/no-use-before-define": "off",

  "@typescript-eslint/no-useless-constructor": "error",
  "@typescript-eslint/object-curly-spacing": "off", // eslint-config-prettier

  /**
   * Disabled since it is for inserting extra newlines between specific kinds of statements, which
   * would be project-dependant. (This kind of formatting is not handled by Prettier.)
   */
  "@typescript-eslint/padding-line-between-statements": "off",

  /**
   * We forbid unnecessary backticks by using the options specified in [the `eslint-config-prettier`
   * documentation](https://github.com/prettier/eslint-config-prettier#enforce-backticks).
   */
  "@typescript-eslint/quotes": [
    "error",
    "double",
    {
      avoidEscape: true,
      allowTemplateLiterals: false,
    },
  ],

  "@typescript-eslint/require-await": "error",

  /**
   * Even though the core rule was deprecated, the extended rule uses type information, so it is
   * much better.
   */
  "@typescript-eslint/return-await": "error",

  "@typescript-eslint/semi": "off", // eslint-config-prettier
  "@typescript-eslint/space-before-blocks": "off", // eslint-config-prettier
  "@typescript-eslint/space-before-function-paren": "off", // eslint-config-prettier
  "@typescript-eslint/space-infix-ops": "off", // eslint-config-prettier
};

/** @type {import("eslint").Linter.Config} */
const config = {
  // We need to provide some special configuration to ESLint in order for it to parse TypeScript
  // files. From:
  // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/base.ts
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",

    // Needed for `eslint-plugin-import` to work properly:
    // https://github.com/import-js/eslint-plugin-import/blob/main/config/recommended.js
    ecmaVersion: "latest",
  },
  plugins: ["@typescript-eslint"],

  rules: {
    ...SUPPORTED_RULES,
    ...EXTENSION_RULES,
  },

  overrides: [
    // We list a "blank" override for the purposes of enabling new file extensions. (ESLint adds any
    // new extensions included in `overrides` to the list of linted extensions.)
    {
      files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
    },

    // Disable some TypeScript-specific rules in JavaScript files.
    {
      files: ["*.js", "*.cjs", "*.mjs", "*.jsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
      },
    },
  ],
};

module.exports = config;
