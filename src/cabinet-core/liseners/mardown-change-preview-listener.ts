import * as vscode from 'vscode';
import { OutlinePreviewPanel } from '../../panels/outlinePreviewPanel';
import { provideMarkdownPoints } from '../../panels/panel-commands-to-webview/provide-markdownpoints';

let changeTimeout: NodeJS.Timeout | null;
export const markdownChangePreviewListener = (event: vscode.TextDocumentChangeEvent) => {
    // if the cabinet preview panel is not visible, do not update it.
    if (!OutlinePreviewPanel) {
        return;
    }

    if (changeTimeout != null)
        clearTimeout(changeTimeout);

    changeTimeout = setInterval(async function () {
        if (changeTimeout !== null) {

            clearTimeout(changeTimeout);
            changeTimeout = null;
            // if the current document is a markdown file, update the preview;
            if (event.document.languageId === 'markdown') {
                // get document and uri from TextDocumentChangeEvent
                const document = event.document.getText();
                const uri = event.document.uri;
                await provideMarkdownPoints(document, uri);
            }

        }
    }, 1000);
}

export const stopChangePreviewListener = () => {
    if (changeTimeout !== null) {
        clearInterval(changeTimeout);
        
    }
};