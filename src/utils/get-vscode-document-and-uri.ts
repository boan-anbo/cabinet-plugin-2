import * as vscode from 'vscode';


export const getCurrentEditorDocumentAndUri = (): {
    documentText: string,
    documentUri: vscode.Uri,
} => {
    const currentEditor = vscode.window.activeTextEditor;
    if (!currentEditor) {
        throw new Error("No active editor");
    }
    const documentText = currentEditor.document.getText();
    const documentUri = currentEditor.document.uri;
    return {
        documentText,
        documentUri,
    };
};