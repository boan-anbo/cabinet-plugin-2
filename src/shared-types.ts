export enum CabinetCommandToVsCode {

    preview = "preview",
    updateUsedCardsInPreview = "updateUsedCardsInPreview",
    addCCI = "addCCI",
    addPoint = "addPoint",
    openFile = "openFile",
    jumpToLineByCard = "jumpToLineByCard",
    jumpToLine = "jumpToLine",
    requestDocumentUri = "requestDocumentUri",
    insertLatex = "insertLatex",
    hello = "hello",
}

export enum CabinetCommandToWebView {
    setDocumentUri = "setDocumentUri",
    test = "test",
    updateUsedCards = "updateUsedCards",
    goToLine = "goToLine"
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
