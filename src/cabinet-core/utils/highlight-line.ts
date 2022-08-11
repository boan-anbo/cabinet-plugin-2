import * as vscode from "vscode";

let outlinePreviewHighlighLine:  vscode.TextEditorDecorationType | undefined = undefined;
export const highlightLine = async (line: number, documentUri: string) => {

    let editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === documentUri);
    if (!editor) {

        // open document in a new editor
        const doc = await vscode.workspace.openTextDocument(documentUri);
        // show the editor with the doc
        editor = await vscode.window.showTextDocument(doc);
    }
    // clear previous highlight
    if (outlinePreviewHighlighLine) {
        outlinePreviewHighlighLine.dispose();
    }
    if (editor) {
        outlinePreviewHighlighLine = vscode.window.createTextEditorDecorationType({
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
        });
        editor.setDecorations(outlinePreviewHighlighLine, [new vscode.Range(line, 0, line, 100)]);
    }


}
