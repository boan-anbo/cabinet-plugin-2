import * as vscode from 'vscode';
export const setWebViewDocumentUri = (webView: vscode.Webview) => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const documentUri = activeEditor.document.uri.toString();
        webView.postMessage({ command: 'setDocumentUri', documentUri });
        console.log(`setWebViewDocumentUri: ${documentUri}`);
        
    }

}