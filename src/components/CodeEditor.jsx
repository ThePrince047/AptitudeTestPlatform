import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";

// ── Language-specific snippet completions ──────────────────────────────────
const pythonCompletions = [
  { label: "print",      type: "function",  apply: "print()",                 detail: "print to stdout" },
  { label: "def",        type: "keyword",   apply: "def name(args):\n    ",    detail: "define a function" },
  { label: "class",      type: "keyword",   apply: "class Name:\n    ",        detail: "define a class" },
  { label: "if",         type: "keyword",   apply: "if condition:\n    ",       detail: "if statement" },
  { label: "elif",       type: "keyword",   apply: "elif condition:\n    ",     detail: "else-if branch" },
  { label: "else",       type: "keyword",   apply: "else:\n    ",               detail: "else branch" },
  { label: "for",        type: "keyword",   apply: "for i in range():\n    ",   detail: "for loop" },
  { label: "while",      type: "keyword",   apply: "while condition:\n    ",    detail: "while loop" },
  { label: "return",     type: "keyword",   apply: "return ",                  detail: "return value" },
  { label: "import",     type: "keyword",   apply: "import ",                  detail: "import module" },
  { label: "from",       type: "keyword",   apply: "from  import ",            detail: "from import" },
  { label: "try",        type: "keyword",   apply: "try:\n    \nexcept Exception as e:\n    ", detail: "try/except" },
  { label: "lambda",     type: "keyword",   apply: "lambda x: ",              detail: "lambda function" },
  { label: "len",        type: "function",  apply: "len()",                   detail: "get length" },
  { label: "range",      type: "function",  apply: "range()",                 detail: "range generator" },
  { label: "enumerate",  type: "function",  apply: "enumerate()",             detail: "enumerate iterator" },
  { label: "zip",        type: "function",  apply: "zip()",                   detail: "zip iterables" },
  { label: "map",        type: "function",  apply: "map(func, iterable)",     detail: "map function" },
  { label: "filter",     type: "function",  apply: "filter(func, iterable)",  detail: "filter function" },
  { label: "sorted",     type: "function",  apply: "sorted()",                detail: "sort iterable" },
  { label: "int",        type: "type",      apply: "int()",                   detail: "int cast" },
  { label: "str",        type: "type",      apply: "str()",                   detail: "str cast" },
  { label: "list",       type: "type",      apply: "list()",                  detail: "list cast" },
  { label: "dict",       type: "type",      apply: "dict()",                  detail: "dict constructor" },
  { label: "set",        type: "type",      apply: "set()",                   detail: "set constructor" },
  { label: "input",      type: "function",  apply: "input()",                 detail: "read stdin" },
  { label: "open",       type: "function",  apply: "open()",                  detail: "open file" },
  { label: "split",      type: "method",    apply: "split()",                 detail: "split string" },
  { label: "strip",      type: "method",    apply: "strip()",                 detail: "strip whitespace" },
  { label: "append",     type: "method",    apply: "append()",                detail: "append to list" },
  { label: "True",       type: "constant",  apply: "True",                    detail: "boolean true" },
  { label: "False",      type: "constant",  apply: "False",                   detail: "boolean false" },
  { label: "None",       type: "constant",  apply: "None",                    detail: "null value" },
];

const cppCompletions = [
  { label: "cout",        type: "function",  apply: 'cout << "";',                       detail: "print to stdout" },
  { label: "cin",         type: "function",  apply: "cin >> var;",                        detail: "read from stdin" },
  { label: "endl",        type: "constant",  apply: "endl",                               detail: "end line" },
  { label: "int main",    type: "function",  apply: "int main() {\n    \n    return 0;\n}", detail: "main function" },
  { label: "include",     type: "keyword",   apply: '#include <iostream>',                detail: "include header" },
  { label: "using namespace std", type: "keyword", apply: "using namespace std;",        detail: "std namespace" },
  { label: "vector",      type: "type",      apply: "vector<int> v;",                    detail: "dynamic array" },
  { label: "string",      type: "type",      apply: "string s;",                         detail: "string type" },
  { label: "auto",        type: "keyword",   apply: "auto ",                             detail: "auto type" },
  { label: "for",         type: "keyword",   apply: "for (int i = 0; i < n; i++) {\n    \n}", detail: "for loop" },
  { label: "while",       type: "keyword",   apply: "while (condition) {\n    \n}",       detail: "while loop" },
  { label: "if",          type: "keyword",   apply: "if (condition) {\n    \n}",          detail: "if statement" },
  { label: "return",      type: "keyword",   apply: "return ",                            detail: "return value" },
  { label: "struct",      type: "keyword",   apply: "struct Name {\n    \n};",            detail: "struct" },
  { label: "class",       type: "keyword",   apply: "class Name {\npublic:\n    \n};",    detail: "class" },
  { label: "nullptr",     type: "constant",  apply: "nullptr",                           detail: "null pointer" },
  { label: "push_back",   type: "method",    apply: "push_back()",                       detail: "append to vector" },
  { label: "size",        type: "method",    apply: "size()",                             detail: "get size" },
  { label: "sort",        type: "function",  apply: "sort(v.begin(), v.end());",         detail: "sort vector" },
];

const javaCompletions = [
  { label: "System.out.println", type: "function",  apply: 'System.out.println("");',     detail: "print line" },
  { label: "System.out.print",   type: "function",  apply: 'System.out.print("");',        detail: "print" },
  { label: "public static void main", type: "function", apply: "public static void main(String[] args) {\n    \n}", detail: "main method" },
  { label: "public class",       type: "keyword",   apply: "public class Name {\n    \n}", detail: "public class" },
  { label: "int",                type: "type",      apply: "int ",                         detail: "int type" },
  { label: "String",             type: "type",      apply: "String ",                      detail: "String type" },
  { label: "boolean",            type: "type",      apply: "boolean ",                     detail: "boolean type" },
  { label: "for",                type: "keyword",   apply: "for (int i = 0; i < n; i++) {\n    \n}", detail: "for loop" },
  { label: "while",              type: "keyword",   apply: "while (condition) {\n    \n}", detail: "while loop" },
  { label: "if",                 type: "keyword",   apply: "if (condition) {\n    \n}",    detail: "if statement" },
  { label: "return",             type: "keyword",   apply: "return ",                      detail: "return value" },
  { label: "ArrayList",          type: "type",      apply: "ArrayList<> list = new ArrayList<>();", detail: "ArrayList" },
  { label: "HashMap",            type: "type",      apply: "HashMap<> map = new HashMap<>();",      detail: "HashMap" },
  { label: "import",             type: "keyword",   apply: "import ",                      detail: "import" },
  { label: "new",                type: "keyword",   apply: "new ",                         detail: "new instance" },
  { label: "null",               type: "constant",  apply: "null",                         detail: "null value" },
  { label: "true",               type: "constant",  apply: "true",                         detail: "boolean true" },
  { label: "false",              type: "constant",  apply: "false",                        detail: "boolean false" },
];

const jsCompletions = [
  { label: "console.log",    type: "function",  apply: "console.log();",                  detail: "log to console" },
  { label: "console.error",  type: "function",  apply: "console.error();",                detail: "log error" },
  { label: "function",       type: "keyword",   apply: "function name() {\n    \n}",       detail: "function" },
  { label: "const",          type: "keyword",   apply: "const ",                           detail: "constant" },
  { label: "let",            type: "keyword",   apply: "let ",                             detail: "variable" },
  { label: "var",            type: "keyword",   apply: "var ",                             detail: "var (legacy)" },
  { label: "return",         type: "keyword",   apply: "return ",                          detail: "return value" },
  { label: "if",             type: "keyword",   apply: "if (condition) {\n    \n}",        detail: "if statement" },
  { label: "for",            type: "keyword",   apply: "for (let i = 0; i < n; i++) {\n    \n}", detail: "for loop" },
  { label: "forEach",        type: "method",    apply: "forEach((item) => {\n    \n});",  detail: "array iteration" },
  { label: "map",            type: "method",    apply: "map((item) => )",                 detail: "array map" },
  { label: "filter",         type: "method",    apply: "filter((item) => )",              detail: "array filter" },
  { label: "reduce",         type: "method",    apply: "reduce((acc, cur) => acc, 0)",    detail: "array reduce" },
  { label: "async",          type: "keyword",   apply: "async function name() {\n    \n}", detail: "async function" },
  { label: "await",          type: "keyword",   apply: "await ",                           detail: "await promise" },
  { label: "Promise",        type: "type",      apply: "new Promise((resolve, reject) => {\n    \n})", detail: "Promise" },
  { label: "null",           type: "constant",  apply: "null",                             detail: "null" },
  { label: "undefined",      type: "constant",  apply: "undefined",                       detail: "undefined" },
  { label: "true",           type: "constant",  apply: "true",                             detail: "boolean true" },
  { label: "false",          type: "constant",  apply: "false",                            detail: "boolean false" },
];

function makeCompletions(completionList) {
  return autocompletion({
    override: [
      (context) => {
        const word = context.matchBefore(/\w+/);
        if (!word || (word.from === word.to && !context.explicit)) return null;
        const filtered = completionList.filter((c) =>
          c.label.toLowerCase().startsWith(word.text.toLowerCase())
        );
        if (!filtered.length) return null;
        return {
          from: word.from,
          options: filtered,
          validFor: /^\w*$/,
        };
      },
    ],
    activateOnTyping: true,
    maxRenderedOptions: 12,
  });
}

export default function CodeEditor({ value, onChange, language }) {
  const extensions = React.useMemo(() => {
    const base = [
      closeBrackets(),
      keymap.of([...closeBracketsKeymap, ...completionKeymap]),
    ];
    switch (language) {
      case "python":
        return [...base, python(), makeCompletions(pythonCompletions)];
      case "cpp":
      case "c":
        return [...base, cpp(), makeCompletions(cppCompletions)];
      case "java":
        return [...base, java(), makeCompletions(javaCompletions)];
      case "javascript":
        return [...base, javascript({ jsx: true }), makeCompletions(jsCompletions)];
      default:
        return base;
    }
  }, [language]);

  return (
    <div className="code-editor-container">
      <CodeMirror
        value={value}
        height="100%"
        minHeight="350px"
        extensions={extensions}
        theme="dark"
        onChange={(val) => onChange(val)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: false,       // handled manually above
          autocompletion: false,      // handled manually above
          rectangularSelection: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: false,    // handled manually above
          lintKeymap: true,
        }}
      />
    </div>
  );
}
