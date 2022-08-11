import { commands } from "vscode";
import { OutlinePreviewPanel } from "./panels/outlinePreviewPanel";
import * as vscode from "vscode";
import { provideMarkdownPoints } from "./panels/panel-commands-to-webview/provide-markdownpoints";
import { getCurrentEditorDocumentAndUri } from "./utils/get-vscode-document-and-uri";
import { MarkdownProviderOptions } from "./shared-types";

let previewPanel: OutlinePreviewPanel | undefined = undefined;

export function loadOutlinePreviewCommands(context: vscode.ExtensionContext) {
    /**
     * Load CabinetNode Angular
     */
    const showHelloWorldCommand = commands.registerCommand("outlinePreview.open", () => {

        const isWebViewShown = OutlinePreviewPanel.currentPanel;

        const option: MarkdownProviderOptions = {
            forceRefresh: false,
        }

        if (!isWebViewShown) {
            previewPanel = OutlinePreviewPanel.render(context.extensionUri);
            // get current document text and uri
        }  else {
            /**
             * If already exists, pressing the preview button will force refresh the webview
             */
            option.forceRefresh = true;
        }

        const { documentText, documentUri } = getCurrentEditorDocumentAndUri();
        if (documentText && documentUri) {

            provideMarkdownPoints(documentText, documentUri, option);
        } else {
            vscode.window.showErrorMessage("No active editor to load outline preview");
        }

    });

    // Add command to the extension context
    context.subscriptions.push(showHelloWorldCommand);

    context.subscriptions.push(commands.registerCommand("writing-plan.test", () => {
        previewPanel?.sendTestMessage();
        previewPanel?.setWebViewDocumentUri();
    }));
}
