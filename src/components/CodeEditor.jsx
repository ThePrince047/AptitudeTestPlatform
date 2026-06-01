import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";

export default function CodeEditor({ value, onChange, language }) {
  const extensions = React.useMemo(() => {
    switch (language) {
      case "python":
        return [python()];
      case "cpp":
      case "c":
        return [cpp()];
      case "java":
        return [java()];
      case "javascript":
        return [javascript()];
      default:
        return [];
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
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
}
