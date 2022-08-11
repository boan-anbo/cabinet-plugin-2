import { cabinetNodeInstance } from "../../extension";
import * as vscode from "vscode";
import { writingPlanInstance } from "../../writing-plan/writing-plan-instance";
import { OutlinePreviewPanel } from "../outlinePreviewPanel";
import { CabinetCommandToWebView, CabinetContentType, MarkdownProviderOptions, MarkdownProviderPayload } from "../../shared-types";
import { MarkdownPoint } from "cabinet-node";

/**
  * Provide the parsed markdown points from the current editor's document to the webview
  */
export const provideMarkdownPoints = async (documentText: string, documentUri: vscode.Uri, option?: MarkdownProviderOptions) => {

    if (!cabinetNodeInstance) {
        throw new Error("CabinetNodeInstance is not initialized");
    }
    // check if writing plan is enabled, continue if throw error
    try {
        const plan = writingPlanInstance.getCurrentPlan();
        if (plan && plan?.hasPlan()) {
            documentText = plan.outPutMarkdown();
        }
    } catch (error) {
        console.error(error);
    }


    const markdownPoints: MarkdownPoint[] = cabinetNodeInstance.parseMdStructure(documentText);

    const currentPanel = OutlinePreviewPanel.currentPanel;
    if (!currentPanel) {
        vscode.window.showErrorMessage("No active panel");
        return;
    }

    const options: MarkdownProviderOptions = option ? option : {
        forceRefresh: false,
    };

    currentPanel.postMessageToWebview(
        {
            command: CabinetCommandToWebView.provideCurrentMarkdownPoints,
            contentTypes: [
                CabinetContentType.payload,
                CabinetContentType.uri,
            ],
            uri: documentUri.toString(),
            payload: {
                options,
                markdownPoints,
                markdownText: documentText,
            } as MarkdownProviderPayload,
        }
    )
}