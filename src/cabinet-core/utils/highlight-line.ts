import * as vscode from "vscode";

let outlinePreviewHighlighLine:  vscode.TextEditorDecorationType | undefined = undefined;
export const highlighLine = (line: number) => {

// highlight a line in VS Code editor by changing its color
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor");
    }
    // clear previous highlight
    if (outlinePreviewHighlighLine) {
        outlinePreviewHighlighLine.dispose();
    }
    if (activeEditor) {
       outlinePreviewHighlighLine = vscode.window.createTextEditorDecorationType({
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
        });
        activeEditor.setDecorations(outlinePreviewHighlighLine, [new vscode.Range(line, 0, line, 0)]);
    }


}
