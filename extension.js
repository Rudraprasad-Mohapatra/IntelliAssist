const vscode = require("vscode");
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "intelliassist" is now active!');

	let disposable1 = vscode.commands.registerCommand(
		"intelliassist.helloWorld",
		function () {
			vscode.window.showInformationMessage("Hello World from IntelliAssist!");
		}
	);

	vscode.commands.registerCommand("extension.enableCustomPanel", () => {
		let panel = vscode.window.createWebviewPanel(
			"customPanel",
			"Custom Panel",
			vscode.ViewColumn.Beside,
			{
				// @ts-ignore
				enableScripts: true,
				// @ts-ignore
				preserveFocus: true,
				webviewOptions: {
					// Set the initial width of the panel to 300px
					width: 300
				}
			}
		);

		const highlightCssPath = vscode.Uri.file(path.join(context.extensionPath, 'node_modules', 'highlight.js', 'styles', 'default.css'));
		const highlightCssUri = highlightCssPath.with({ scheme: 'vscode-webview-resource' });

		const customCssPath = vscode.Uri.file(path.join(context.extensionPath, 'assets', 'styles.css'));
		const customCssUri = customCssPath.with({ scheme: 'vscode-webview-resource' });

		panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link rel="stylesheet" href="${highlightCssUri.toString()}">
			<link rel="stylesheet" href="${customCssUri.toString()}">
			<title>Custom Panel</title>
		</head>
		<body>
			<main>
				<div class="view new-chat-view" style="margin: 0 10vw">
					<div class="model-selector">

					</div>
					<div class="typewriter" style="height:60px">
						Ask me anything !
					</div>
				</div>

				<div id="message_container" class="view conversation-view">

				</div>
			</main>

			<div id="message-form">
				<div class="message-wrapper">
					<textarea name="message" id="message" rows="1" placeholder="Ask Co-Pilot ..."
						style="height:60px; max-height:170px; font-size:medium"></textarea>
					<button onclick="apiCall()" type="submit" class="send-button">
						<span id="submitButtonContent">
							<i id="success-icon" class="fa fa-paper-plane"></i>
						</span>
					</button>
					<i id="loading-image" class="fa fa-spinner" style="display: none;"></i>
					<i id="success-icon" class="fa fa-paper-plane" style="display: none;"></i>
				</div>
			</div>
		</body>
    </html>
        `;
	});

	context.subscriptions.push(disposable1, vscode.commands.registerCommand('extension.enableMyExtension', () => {
		vscode.commands.executeCommand('extension.enableCustomPanel');
	}));
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
