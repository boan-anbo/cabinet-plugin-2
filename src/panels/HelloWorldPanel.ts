import * as vscode from "vscode";
import { Disposable, Uri, ViewColumn, Webview, WebviewPanel, window } from "vscode";
import { getUri } from "../utilities/getUri";
import { CabinetCommandToVsCode, CabinetCommandToWebView, CabinetContentType, CabinetMessageToVsCode, CabinetMessageToWebView } from "../shared-types";
import { CabinetCardIdentifier, MarkdownPoint } from "cabinet-node";
import { cabinetPreviewPanel, freePreviewSync, updateUsedCardsInPreview } from "../cabinet-core/webviews/preview-panel";
import { insertText } from "../cabinet-core/utils/insert-text";
import { InsertOption } from "../cabinet-core/types/insert-option";
import { openCardSourceFile } from "../cabinet-core/utils/open-source-file";
import { goToLine } from "../cabinet-core/commands/go-to-line-command";
import { cabinetNodeInstance } from "../extension";

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class HelloWorldPanel {
    public static currentPanel: HelloWorldPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    /**
     * The HelloWorldPanel class private constructor (called only from the render method).
     *
     * @param panel A reference to the webview panel
     * @param extensionUri The URI of the directory containing the extension
     */
    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this._panel = panel;

        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(this.dispose, null, this._disposables);

        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
    }

    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    public static render(extensionUri: Uri) {
        if (HelloWorldPanel.currentPanel) {
            // If the webview panel already exists reveal it
            HelloWorldPanel.currentPanel._panel.reveal(ViewColumn.One);
        } else {
            // If a webview panel does not already exist create and show a new one
            const panel = window.createWebviewPanel(
                // Panel view type
                "showHelloWorld",
                // Panel title
                "Hello World",
                // The editor column the panel should be displayed in
                ViewColumn.One,
                // Extra panel configurations
                {
                    // Enable JavaScript in the webview
                    enableScripts: true,
                }
            );

            HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);

            return HelloWorldPanel.currentPanel;

        }
    }

    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    public dispose() {
        HelloWorldPanel.currentPanel = undefined;

        // Dispose of the current webview panel
        this._panel.dispose();

        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @remarks This is also the place where references to the Angular webview build files
     * are created and inserted into the webview HTML.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        // The CSS file from the Angular build output
        const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "styles.css"]);
        // The JS files from the Angular build output
        const runtimeUri = getUri(webview, extensionUri, ["webview-ui", "build", "runtime.js"]);
        const polyfillsUri = getUri(webview, extensionUri, ["webview-ui", "build", "polyfills.js"]);
        const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "main.js"]);

        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Hello World</title>
        </head>
        <body>
          <app-root></app-root>
          <script type="module" src="${runtimeUri}"></script>
          <script type="module" src="${polyfillsUri}"></script>
          <script type="module" src="${scriptUri}"></script>
        </body>
      </html>
    `;
    }

    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is recieved.
     *
     * @param webview A reference to the extension webview
     * @param context A reference to the extension context
     */
    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            async (message: CabinetMessageToVsCode<any>) => {
                const command = message.command;
                const text = message.text;

                if
                    (message.command.startsWith('add')) {
                    await freePreviewSync();
                }

                switch (command) {
                    case 'updateUsedCardsInPreview':
                        // if no active editor, use the last used editor.
                        if (!vscode.window.activeTextEditor) {
                            await vscode.commands.executeCommand("workbench.action.focusFirstEditorGroup");
                        }
                        updateUsedCardsInPreview();
                        // add current editor document title to the end of the preview panel title
                        return;
                    case 'addCCI':
                        await insertText(
                            `{${message.text}}`
                            , {
                                linesBefore: 2,
                                linesAfter: 2,
                                focusFirstEditorGroup: true,
                            } as InsertOption);

                        vscode.window.showInformationMessage("Card Inserted");
                        updateUsedCardsInPreview();
                        return;
                    case 'addPoint':
                        // refocus last active editor
                        await insertText(
                            `- ${message.text}`

                            , {
                                linesBefore: 1,
                                linesAfter: 1,
                                focusFirstEditorGroup: true,
                            } as InsertOption);

                        vscode.window.showInformationMessage("Point Inserted");
                        return;
                    case 'openFile':
                        if (message.text) {
                            const cardId = JSON.parse(message.text) as CabinetCardIdentifier;
                            openCardSourceFile(cardId.id);
                        }
                        return;
                    case 'jumpToLineByCard':
                        // const {line, documentUri} = JSON.parse(message.cardPlace) as CardPlace;
                        const { lineNumber, uri } = message;
                        if (lineNumber && uri) {
                            goToLine(lineNumber, uri);
                            return;
                        } else {
                            vscode.window.showErrorMessage("Cannot jump to Card location, no lineNumber or Uri provided");
                            return;
                        }
                    case 'jumpToLine':
                        // parse received message uri
                        if (message.lineNumber) {
                            goToLine(message.lineNumber, message.uri);
                        }
                        return;
                    case 'requestDocumentUri':
                        const activeEditor = vscode.window.activeTextEditor;
                        if (activeEditor) {
                            const documentUri = activeEditor.document.uri.toString();
                            cabinetPreviewPanel?.webview.postMessage({ command: 'setDocumentUri', documentUri });
                            console.log('Heard Document URI request, sending back uri', documentUri);
                        }
                        return;
                    case 'insertLatex':
                        const cci = CabinetCardIdentifier.fromJsonString(message.text);
                        if (!cci) {
                            return;
                        }
                        const card = cabinetNodeInstance?.getCardByCci(cci);
                        if (card) {
                            const cciLine = `\%{${message.text}}`;
                            await insertText(
                                [
                                    `[${card.source?.pageIndex}]{${card.source?.uniqueId}}`,
                                    cciLine,
                                    ""
                                ].join('\n')
                                , {
                                    linesBefore: 0,
                                    linesAfter: 0,
                                    focusFirstEditorGroup: true,
                                } as InsertOption);
                        }
                        return;
                    case "hello":
                        // Code that should run in response to the hello message command

                        window.showInformationMessage('I Received:' + text);
                        return;
                    // Add more switch case statements here as more webview message commands
                    // are created within the webview context (i.e. inside media/main.js)
                }
            },
            undefined,
            this._disposables
        );
    }

    /**
     * Public commands
     */

    private postMessageToWebview<T>(message: CabinetMessageToWebView<T>) {
        console.log("postMessageToWebview", message);
        this._panel.webview.postMessage(message);
    }

    /**
     * Send test message to the webview.
     */
    public sendTestMessage() {

        this.postMessageToWebview({
            command: CabinetCommandToWebView.test,
            contentType: CabinetContentType.payload,
            payload: "haha"
        });
    }

    /**
     * Ask the webview to show preview
     */

    public preview(markdownPoints: MarkdownPoint[]) {

        console.log("preview", markdownPoints);
        this.postMessageToWebview({
            command: CabinetCommandToVsCode.preview,
            contentType: CabinetContentType.payload,
            payload: markdownPoints
        });
    }

    /**
     * Pass current document Uri to the webview
     */
    setWebViewDocumentUri = () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const documentUri = activeEditor.document.uri.toString();
            console.log('Heard Document URI request, sending back uri', documentUri);
            this.postMessageToWebview({ command: CabinetCommandToWebView.setDocumentUri, contentType: CabinetContentType.uri, payload: {
                uri: documentUri
            }
            });
            console.log(`setWebViewDocumentUri: ${documentUri}`);

        }

    }
}
