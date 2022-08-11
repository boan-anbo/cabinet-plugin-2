import { MarkdownPoint } from "cabinet-node";
export enum CabinetCommandToVsCode {

    updateUsedCardsInPreview = "updateUsedCardsInPreview",
    addCCI = "addCCI",
    addPoint = "addPoint",
    openFile = "openFile",
    jumpToLineByCard = "jumpToLineByCard",
    /**
     * message.line: line number to jump to
     * message.uri: uri of the document to jump to
     */
    jumpToLine = "jumpToLine",
    requestDocumentUri = "requestDocumentUri",
    insertLatex = "insertLatex",
    hello = "hello",
    requestCurrentMarkdown = "requestCurrentMarkdown",
    /**
     * message.uri: uri of the document to jump to
     * message.payload: {MoveInstruction}
     */
    movePoints = "movePoints",
}

export enum CabinetCommandToWebView {
    setDocumentUri = "setDocumentUri",
    test = "test",
    updateUsedCards = "updateUsedCards",
    goToLine = "goToLine",

    /**
     * Message.text: tested command sent from Webview to Vscode
     * Message.payload: the entire message received by VsCode
     */
    provideTestReport = "provideTestReport",

    preview = "preview",
    /**
     * message.payload: {@link MarkdownProviderPayload}
     * 
     * message.uri: document uri
     */
    provideCurrentMarkdownPoints = "provideCurrentMarkdownPoints",
}

/**
 * Describe the content (should be) contained in the CabinetMessage, so the consumer knows content to check.
 */
export enum CabinetContentType {
    payload = "payload",
    text = "text",
    lineNumber = "lineNumber",
    uri = "uri",

    none = "none",
}

export class CabinetMessageToVsCode<T> {
    command: CabinetCommandToVsCode;
    contentTypes: CabinetContentType[] = [];
    contentNote? = "";
    isTest? = false;
    payload?: T;
    text?: string;
    lineNumber?: number;
    uri?: string;

    constructor(command: CabinetCommandToVsCode, contentType: CabinetContentType, content?: {
        payload?: T,
        text?: string,
        line?: number,
        uri?: string,
    }) {
        this.command = command;

        // if content type is not none, then check if content is provided in the third argument
        if (contentType !== CabinetContentType.none) {
            if (content) {
                this.payload = content.payload;
                this.text = content.text;
                this.lineNumber = content.line;
                this.uri = content.uri;
            } else {
                throw new Error("Content is required for content type " + contentType);
            }
        }
    }
}

export class CabinetMessageToWebView<T> {
    command: CabinetCommandToWebView;
    contentTypes: CabinetContentType[] = [];
    isTest? = false;
    payload?: T;
    text?: string;
    lineNumber?: number;
    uri?: string;

    constructor(command: CabinetCommandToWebView, contentType: CabinetContentType, content?: {
        payload?: T,
        text?: string,
        line?: number,
        uri?: string,
    }) {
        this.command = command;

        // if content type is not none, then check if content is provided in the third argument
        if (contentType !== CabinetContentType.none) {
            if (content) {
                this.payload = content.payload;
                this.text = content.text;
                this.lineNumber = content.line;
                this.uri = content.uri;
            } else {
                throw new Error("Content is required for content type " + contentType);
            }
        }
    }
}

import { Card } from "cabinet-node";

export interface CardPlace {
    card?: Card;
    id: string;
    line: number;
    column: number;
    lineText: string;
    documentUri: string;
}


export interface MarkdownProviderOptions {
    /**
     * Whether the Webview should unfreeze the preview when receiving this option.
     */
    forceRefresh?: boolean;
}

export interface MarkdownProviderPayload {
    options: MarkdownProviderOptions;
    markdownPoints: MarkdownPoint[];
    markdownText: string;
}