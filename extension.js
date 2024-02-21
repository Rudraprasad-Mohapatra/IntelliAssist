const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

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
			vscode.ViewColumn.Six,
			{
				localResourceRoots: [
					vscode.Uri.file(path.join(context.extensionPath, "assets")),
					vscode.Uri.file(path.join(context.extensionPath, "node_modules")),
				],
				enableScripts: true,
				// @ts-ignore
				preserveFocus: true,
				webviewOptions: {
					width: 300,
				},
			}
		);

		const highlightCssPath = vscode.Uri.file(
			path.join(
				context.extensionPath,
				"node_modules",
				"highlight.js",
				"styles",
				"default.css"
			)
		);
		const highlightCssSrc = panel.webview.asWebviewUri(highlightCssPath);

		const customCssPath = vscode.Uri.file(
			path.join(context.extensionPath, "assets", "styles.css")
		);
		const customCssSrc = panel.webview.asWebviewUri(customCssPath);

		const customJSPath = vscode.Uri.file(
			path.join(context.extensionPath, "assets", "script.js")
		);
		const customJSSrc = panel.webview.asWebviewUri(customJSPath);

		panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Custom Panel</title>
			<link rel="stylesheet" href="${highlightCssSrc}">
			<link rel="stylesheet" href="${customCssSrc}">
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
			integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
			crossorigin="anonymous" referrerpolicy="no-referrer" />
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
			<script src=${customJSSrc}></script>
			<script src=${customJSSrc}></script>
		</body>
    </html>
        `;

		// Listen for the webview panel's event onDidChangeViewState
		panel.onDidChangeViewState((e) => {
			// Check if the webview is active and visible
			if (panel.visible) {
				// Trigger a layout update when the webview becomes visible
				panel.webview.postMessage({ command: "updateLayout" });
			}
		});
	});

	context.subscriptions.push(
		disposable1,
		vscode.commands.registerCommand("extension.enableMyExtension", () => {
			vscode.commands.executeCommand("extension.enableCustomPanel");
		})
	);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate,
};
