import {CabinetCardIdentifier, CabinetNode, MarkdownOption} from 'cabinet-node';
import * as vscode from 'vscode';
import {getPreviewHtmlTemplate} from '../utils/get-preview-html-template';
import {insertText} from '../utils/insert-text';
import {InsertOption} from '../types/insert-option';
import {openCardSourceFile} from '../utils/open-source-file';
import {getAllCardPlaces} from '../utils/get-current_cards';
import {goToLine} from '../commands/go-to-line-command';
import {cabinetNodeInstance} from '../../extension';
import {writingPlanInstance} from '../../writing-plan/writing-plan-instance';
import {setWebViewDocumentUri} from '../../panels/panel-utils.ts/set-document';
import {OutlinePreviewPanel} from "../../panels/outlinePreviewPanel";
import {CabinetCommandToWebView, CabinetContentType, CardPlace} from "../../shared-types";

export const showPreviewCommand = (cabinetInstance: CabinetNode) => vscode.commands.registerCommand('cabinetplugin.showPreview', async () => {

    if (!cabinetInstance) {
        await vscode.commands.executeCommand('cabinetplugin.startCabinet');
    }

    const editor = vscode.window.activeTextEditor;
    if (editor) {

        // Get the document text
        const documentType = editor.document.languageId;
        if (documentType === 'markdown') {
            let documentText = editor.document.getText();

            const collapsablePreview = (vscode.workspace.getConfiguration('cabinetplugin').get('collapsablePreview') ?? true) as boolean;
            const previewInBlockquote = (vscode.workspace.getConfiguration('cabinetplugin').get('previewInBlockquote') ?? true) as boolean;

            // check if writing plan is enabled
            const plan = writingPlanInstance.getCurrentPlan();
            if (plan) {
                documentText = plan.outPutMarkdown();
            }


            const previewHtml = cabinetInstance.getFullHtmlDraft(documentText, new MarkdownOption({ collapsable: collapsablePreview, blockQuote: previewInBlockquote }));

            const fileNameOnly = editor.document.fileName.split(/[\/\\]/).pop() ?? editor.document.fileName;


            try {
                showPreview(previewHtml, fileNameOnly);

            } catch (e) {
                console.error(e);
            }
        } else {

            vscode.window.showInformationMessage('[Cabinet] Only markdown files are supported for preview.');
        }

        // DO SOMETHING WITH `documentText`
    }
    // showPreview(previewHtml);

});

export let cabinetPreviewPanel: vscode.WebviewPanel | undefined = undefined;
export const showPreview = async (html: string, documentTitle: string): Promise<void> => {
    const ifSyncPreviewWithEditor = await vscode.workspace.getConfiguration('cabinetplugin').get('syncPreviewWithEditor') ?? true;

    if (!ifSyncPreviewWithEditor) {
        return;
    }


    if (!cabinetPreviewPanel) {
        cabinetPreviewPanel = vscode.window.createWebviewPanel(
            'cabinetPreview',
            documentTitle,
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                enableFindWidget: true,
                enableCommandUris: true,
            }
        );

        cabinetPreviewPanel.onDidDispose(
            () => {
                // When the panel is closed, cancel any future updates to the webview content
                cabinetPreviewPanel = undefined;
            },
            null,
        );

        cabinetPreviewPanel.webview.onDidReceiveMessage(
            async message => {
                if (message.command.startsWith('add')) {
                    await freezePreviewSync();
                }

                switch (message.command) {
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
                        const cardId = JSON.parse(message.text) as CabinetCardIdentifier;
                        openCardSourceFile(cardId.id);
                        return;
                    case 'jumpToLineByCard':
                        const { line, documentUri } = JSON.parse(message.cardPlace) as CardPlace;
                        goToLine(line, documentUri);
                        return;
                    case 'jumpToLine':
                        // parse received message uri
                        if (message.line) {
                            goToLine(message.line, message.uri);
                        }
                        return;
                    case 'requestDocumentUri':
                        console.log('received request for DocumentUri', message);
                        if (cabinetPreviewPanel) {
                            setWebViewDocumentUri(cabinetPreviewPanel.webview);
                        } else {
                            console.log('requestDocumentUri', 'no preview panel');
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
                }
            },
            undefined,
        );

    } else {

        cabinetPreviewPanel.title = documentTitle;

    }

    // And set its HTML content
    cabinetPreviewPanel.webview.html = getPreviewHtmlTemplate(html, documentTitle);
    // cabinetPreviewPanel.webview.html = ;

    return;
};

export const togglePreviewSyncCommand = function (): () => Promise<void> {

    return async () => {
        await togglePreviewSync();

    };

};

export const freezePreviewSync = async () => {
    const syncPreviewWithEditor = await vscode.workspace.getConfiguration('cabinetplugin').get('syncPreviewWithEditor') ?? true;

    if (!syncPreviewWithEditor) {
        return;
    }

    await vscode.workspace.getConfiguration('cabinetplugin').update('syncPreviewWithEditor', false, true);

    // show message
    vscode.window.showInformationMessage(`Preview sync is now ${false ? 'enabled' : 'disabled'}`);

    if (cabinetPreviewPanel) {
        cabinetPreviewPanel.title = '[Freeze] ' + cabinetPreviewPanel.title;
    }

}

export const postMessageToPreviewPanel = async (message: any) => {
    await cabinetPreviewPanel?.webview.postMessage(message);
}

export const scrollToLineInPreview = (line: number, uri?: string) => {

    OutlinePreviewPanel.currentPanel?.postMessageToWebview(
        {
            command: CabinetCommandToWebView.goToLine,
            contentTypes: [CabinetContentType.lineNumber, CabinetContentType.uri]
            ,
            lineNumber: line,
            uri: uri
        }
    )

};

export const sendUpdateCardRequestToPreviewPanelCommand = (cabinetNode: CabinetNode): vscode.Disposable => {
    // add a vscode command
    const updatePreviewUsedCardsCommand = vscode.commands.registerCommand('cabinetplugin.updateUsedCardsInPreview', updateUsedCardsInPreview);

    return updatePreviewUsedCardsCommand;

};

export const updateUsedCardsInPreview = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    console.log('asking webview to update used cards');
    const allCardPlaces = getAllCardPlaces();
    postMessageToPreviewPanel({
        command: 'updateUsedCards',
        text: JSON.stringify(allCardPlaces),
    });

    // get current editor document title file Name only

    const currentDocumentTitle = vscode.window.activeTextEditor?.document.fileName.split(/[\/\\]/).pop();
    if (cabinetPreviewPanel) {
        const cleanTitle = cabinetPreviewPanel?.title.split('| Used in')[0].trim();
        cabinetPreviewPanel.title = cleanTitle + ` | Used in | ${currentDocumentTitle}`;
    }
}

export const togglePreviewSync = async () => {
    const syncPreviewWithEditor = await vscode.workspace.getConfiguration('cabinetplugin').get('syncPreviewWithEditor') ?? true;
    // toggle sync preview with editor
    await vscode.workspace.getConfiguration('cabinetplugin').update('syncPreviewWithEditor', !syncPreviewWithEditor, true);

    const currentSyncPreviewWithEditorValue = !syncPreviewWithEditor;

    // show message
    vscode.window.showInformationMessage(`Preview sync is now ${currentSyncPreviewWithEditorValue ? 'enabled' : 'disabled'}`);

    if (cabinetPreviewPanel) {
        if (currentSyncPreviewWithEditorValue) {
            cabinetPreviewPanel.title = cabinetPreviewPanel.title.replace('[Freeze] ', '');
            // execute preview command
            vscode.commands.executeCommand('cabinetplugin.showPreview');
        } else {
            cabinetPreviewPanel.title = '[Freeze] ' + cabinetPreviewPanel.title;
        }
    }
}


