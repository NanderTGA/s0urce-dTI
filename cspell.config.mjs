import { defineConfig } from "cspell";

export default defineConfig({
    version: "0.2",
    dictionaryDefinitions: [
        {
            name: "projectWords",
            path: "./projectWords.txt",
            addWords: true,
        },
    ],
    dictionaries: [ "projectWords" ],
    ignorePaths: [
        "node_modules",
        "pnpm-lock.yaml",
        "/projectWords.txt"
    ],
});