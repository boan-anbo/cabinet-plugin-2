import {MoveInstruction} from "cabinet-node";
import * as vscode from "vscode";
import { provideMarkdownPoints } from "../../panels/panel-commands-to-webview/provide-markdownpoints";

export const movePointsInText = async (moveInstruction: MoveInstruction, uri: vscode.Uri): Promise<void> => {
    // open uri in vscode editor
    await vscode.commands.executeCommand( "workbench.action.focusActiveEditorGroup" ) 
    // get editor with uri
    const editor =  vscode.window.visibleTextEditors.find( editor => editor.document.uri.toString() === uri.toString());
    if (editor === undefined) {
        vscode.window.showErrorMessage("No active editor found");
        return;
    }
    // get editor document
    const document = editor.document;
    // cut lines and paste into a new range location in the editor
    editor.edit(editBuilder => {
        // use whole lines
        const startLine = moveInstruction.fromLineStart ;
        const endLine = moveInstruction.fromLineEnd;
        // use the first character of the line
        const startCharacter = 0;
        // use the last character of the line
        const endCharacter = document.lineAt(endLine).text.length;
        // get the text of the range
        const text = document.getText(new vscode.Range(startLine, startCharacter, endLine, endCharacter));
        // remove the range from the editor
        editBuilder.delete(new vscode.Range(startLine, startCharacter, endLine, endCharacter));
        // insert the text at the new range location in moveInstruction.toLineStart
        // before toLineStart, with empty line before it
        editBuilder.insert(new vscode.Position(moveInstruction.toLineStart, 0), `${text}${'\n'.repeat(moveInstruction.emptyLinesBeforeToLineStart + 1)}`);
    });

    const latestDocumentText = document.getText();
    // update the preview
    await provideMarkdownPoints(latestDocumentText, uri);

    console.log('Finished moving according to moveInstruction: ', moveInstruction);
}
