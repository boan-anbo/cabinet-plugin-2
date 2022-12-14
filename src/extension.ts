// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { CabinetNode } from 'cabinet-node';
import * as vscode from 'vscode';

import { cardLookupProvider } from './cabinet-core/card-lookup';
import { searchCardsCommand } from './cabinet-core/commands/search-cards-command';
import {
    sendUpdateCardRequestToPreviewPanelCommand,
    showPreviewCommand,
    togglePreviewSyncCommand
} from './cabinet-core/webviews/preview-panel';
import { CabinetNodeApi } from './api/cabinet-node-api';
import path = require('path');
import fs = require('fs');
import {
    markdownChangePreviewListener,
    stopChangePreviewListener
} from './cabinet-core/liseners/mardown-change-preview-listener';
import { CabinetApi } from 'cabinet-node/build/main/lib/card-client';
import { fetchCardsFromApiCommand } from './cabinet-core/commands/fetch-cci-cards-from-api';
import {
    cabinetStatusBarOff,
    registerStatusBar,
    removeStatusBarItem,
    updateStatusBarText
} from './cabinet-core/status-bars/cabinet-status-bar';
import {
    pullMarkdownCodeLensProvider,
    pullMarkdownCommand
} from './cabinet-core/code-lenses/pull-markdown-codelens-provider';
import { openSourceCodeLensProvider } from './cabinet-core/code-lenses/open-source-codelens-provider';
import { CabinetNotesProvider } from './treeviews/cabinetnotes-provider';
import { goToLine } from './cabinet-core/commands/go-to-line-command';
import { outputPreviewHtml } from './cabinet-core/commands/outputPreviewHtml';
import { cardTitleCodeLensProvider, clickCardTitleCommand } from './cabinet-core/code-lenses/card-title-provider';
import { copyLatexCodeLensProvider, copyLatexCommand } from './cabinet-core/code-lenses/copy-latex';
import { updateDefaultSettings } from './cabinet-core/utils/update-default-setting';
import { openCardSourceFile } from './cabinet-core/utils/open-source-file';
import { commands, ExtensionContext } from 'vscode';
import { extractPdfCards as extractPdfCards } from './cabinet-core/quickactions/card-actions';
import { quickOpen } from './cabinet-core/quickactions/quick-open-file';
import { cabinetInstanceActions as cabinetActions } from './cabinet-core/quickactions/cabinet-actions';
import { registerWritingPlan } from './writing-plan/register-writing-plan';
import { cabinetCursorChangeListener } from './cabinet-core/liseners/cursor-change-listener';
import { toggleWritingPlan } from './cabinet-core/commands/toggle-writing-plan';
import { zoteroActions } from './cabinet-core/quickactions/zotero-actions';
import { outputCsvFromDocumentCards } from './cabinet-core/commands/output-csv-from-document-cards';
import { setWebViewDocumentUri } from "./panels/panel-utils.ts/set-document";
import { loadOutlinePreviewCommands } from "./loadOutlinePreview";
import { OutlinePreviewPanel } from './panels/outlinePreviewPanel';


export let cabinetNodeInstance: CabinetNode | undefined;

async function loadCabinetNode() {


    const workspaces = vscode.workspace.workspaceFolders;
    if (!workspaces) {
        vscode.window.showErrorMessage('No workspace folder is opened.');
        return;
    }
    const workspaceRootFilePath = workspaces[0].uri.fsPath;

    const defaultCabinetFileName = 'cabinet.json';


    const filePathToCreate = path.join(workspaceRootFilePath, defaultCabinetFileName);

    if (!fs.existsSync(filePathToCreate)) {

        const result = await vscode.window
            .showInformationMessage(
                `${filePathToCreate} does not exist. Do you want to create it?`,
                ...["Yes", "No"]
            );

        if (result === "Yes") {
            cabinetNodeInstance = new CabinetNode(workspaceRootFilePath, defaultCabinetFileName);

            return cabinetNodeInstance;
        } else {
            vscode.window.showInformationMessage('No cabinet.json file found. Cabinet is not started.');
            return;
        }
    } else {
        cabinetNodeInstance = new CabinetNode(workspaceRootFilePath, defaultCabinetFileName);

        return cabinetNodeInstance;
    }


}

let disposables: vscode.Disposable[] = [];

let cabinetNodeApi: CabinetNodeApi;


async function initCabinetNodeApi(cabinetNode: CabinetNode | undefined) {
    if (!cabinetNode) {
        vscode.window.showErrorMessage('Api needs Cabinet instance first.');
        return;
    }

    cabinetNodeApi = new CabinetNodeApi(cabinetNode);
}


export async function activate(context: vscode.ExtensionContext) {

    // others

    // context.subscriptions.push(registerStatusBar());
    // I'm not pushing it into subscriptions otherwise it will be disposed when Cabinet is turned off.
    registerStatusBar();


    registerWritingPlan(context);



    vscode.commands.registerCommand("cabinetplugin.enableCodeLens", () => {
        vscode.workspace.getConfiguration("cabinetplugin").update("enableCodeLens", true, true);
    });

    vscode.commands.registerCommand("cabinetplugin.disableCodeLens", () => {
        vscode.workspace.getConfiguration("cabinetplugin").update("enableCodeLens", false, true);
    });

    vscode.commands.registerCommand("cabinetplugin.codelensAction", (args: any) => {
        vscode.window.showInformationMessage(`CodeLens action clicked with args=${args}`);
    });

    stopCabinet();


    vscode.commands.registerCommand('cabinetplugin.stopCabinet', async () => {
        stopCabinet();
    });


    // update all default settings, otherwise some global settings will keep the state when Cabinet restarts, such as preview sync with editor;
    updateDefaultSettings();

    // register writing plan commands
    context.subscriptions.push(vscode.commands.registerCommand('cabinetplugin.writing-plan.toggle', toggleWritingPlan));

    // context.subscriptions.push(stopCabinetCmd);

    vscode.commands.registerCommand('cabinetplugin.startCabinet', () => {
        // vscode.window.showInformationMessage('Hello World from Cabinet!');
        if (cabinetNodeInstance !== undefined) {
            vscode.window.showInformationMessage('Cabinet is already running!');
            return;
        }


        loadCabinetNode();


        if (cabinetNodeInstance !== undefined) {

            // cabinet outline;
            const cabinetNodeOutlineProvider = new CabinetNotesProvider();
            vscode.window.createTreeView('cabinetOutline', {
                treeDataProvider: cabinetNodeOutlineProvider
            });

            const goToLineCommandSub = vscode.commands.registerCommand("cabinetOutline.goToLine", goToLine);
            context.subscriptions.push(goToLineCommandSub);


            context.subscriptions.push(vscode.commands.registerCommand('cabinetOutline.refresh', () => cabinetNodeOutlineProvider.refresh()));

            // const outlineRefreshListener = vscode.workspace.onDidChangeTextDocument(() => {
            // 	vscode.commands.executeCommand('cabinetOutline.refresh');
            // });
            // context.subscriptions.push(outlineRefreshListener);

            // register extract pdf actions
            context.subscriptions.push(vscode.commands.registerCommand('cabinetplugin.extractPdfCards', async () => {
                extractPdfCards(context);
            }));

            // register zotero actions

            context.subscriptions.push(vscode.commands.registerCommand('cabinetplugin.zoteroActions', async () => {
                zoteroActions(context);
            }));


            // register cabinet actions
            context.subscriptions.push(vscode.commands.registerCommand('cabinetplugin.cabinetActions', async () => {
                cabinetActions(context);
            }));

            // register codelens providers.

            context.subscriptions.push(vscode.commands.registerCommand("cabinetplugin.clickCardTitle", clickCardTitleCommand));

            context.subscriptions.push(vscode.languages.registerCodeLensProvider("*", pullMarkdownCodeLensProvider));

            context.subscriptions.push(vscode.commands.registerCommand("cabinetplugin.pullMarkdown", pullMarkdownCommand));

            context.subscriptions.push(vscode.languages.registerCodeLensProvider("*", openSourceCodeLensProvider));

            context.subscriptions.push(vscode.commands.registerCommand("cabinetplugin.openSource", openCardSourceFile));

            context.subscriptions.push(vscode.languages.registerCodeLensProvider("*", cardTitleCodeLensProvider));

            context.subscriptions.push(vscode.commands.registerCommand("cabinetplugin.copyLatex", copyLatexCommand));

            context.subscriptions.push(vscode.languages.registerCodeLensProvider("*", copyLatexCodeLensProvider));


            (cabinetNodeInstance as CabinetNode).onCabinetFileChangeLoaded = updateCurrentCards;

            console.log('Starting cabinet...');

            initCabinetNodeApi(cabinetNodeInstance);

            context.subscriptions.push(
                vscode.commands.registerCommand("cabinetplugin.exportCsv", outputCsvFromDocumentCards(cabinetNodeInstance)));

            /**
             * Register writing plan refresh preview
             */

            /**
             * Load Outline Preview Commands
             */
            loadOutlinePreviewCommands(context);

            context.subscriptions.push(commands.registerCommand("writing-plan.refresh-preview", () => {
                // get editor text
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showErrorMessage('No editor is active.');
                    return;
                }
                const text = editor.document.getText();

                const parseMdStructure = cabinetNodeInstance?.parseMdStructure(text);

                // write to a json file
                const jsonFile = path.join(context.extensionPath, 'src', 'md-structure.json');
                fs.writeFileSync(jsonFile, JSON.stringify(parseMdStructure, null, 2));
                console.log('parseMdStructure', parseMdStructure);

                if (parseMdStructure) {
                    OutlinePreviewPanel.currentPanel?.preview(parseMdStructure);
                } else {
                    vscode.window.showErrorMessage('Open the panel first');
                }
            }));


            // search cards command
            context.subscriptions.push(
                vscode.commands.registerCommand('cabinetplugin.searchCards', searchCardsCommand(cabinetNodeInstance))
            );

            context.subscriptions.push(cardLookupProvider(cabinetNodeInstance));

            context.subscriptions.push(showPreviewCommand(cabinetNodeInstance));

            context.subscriptions.push(
                vscode.commands.registerCommand('cabinetplugin.togglePreviewSync', togglePreviewSyncCommand())
            );

            // write html preview to file command
            context.subscriptions.push(outputPreviewHtml(cabinetNodeInstance));

            context.subscriptions.push(
                vscode.commands.registerCommand('cabinetplugin.fetchCardsFromApi', fetchCardsFromApiCommand(cabinetNodeInstance))
            );

            // register update cards in preview command
            context.subscriptions.push(sendUpdateCardRequestToPreviewPanelCommand(cabinetNodeInstance));

            vscode.workspace.onDidChangeTextDocument(markdownChangePreviewListener);

            // register preview cursor listener
            context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(cabinetCursorChangeListener));

            const cabinetJsonFile = (cabinetNodeInstance as CabinetNode).ccjFilename;
            const cardCount = (cabinetNodeInstance as CabinetNode).cardCount;
            vscode.window.showInformationMessage(`Started: ${cardCount} cards loaded from ${cabinetJsonFile}.`);


            updateCurrentCards();


            disposables = context.subscriptions;

        }

    });
    // context.subscriptions.push(startCabinet);


}

// standard cabinet node.
export const updateCurrentCards = (cardsNum?: string, filePath?: string) => {
    if (!cardsNum && cabinetNodeInstance) {
        cardsNum = cabinetNodeInstance?.cardCount.toString();
    }

    if (cardsNum) {
        updateStatusBarText(`${cardsNum} cards.`);
    }
}

// this method is called when your extension is deactivated
export async function deactivate() {


    disposables.forEach(disposable => disposable.dispose());

    disposables = [];
}


export const stopCabinet = async () => {
    await deactivate();
    if (cabinetNodeInstance) {
        cabinetNodeInstance = undefined;
        await cabinetNodeApi.stopServer();
        vscode.window.showInformationMessage('Cabinet stopped.');
        await stopChangePreviewListener();
        cabinetStatusBarOff();
        // await removeStatusBarItem();

    }
}
