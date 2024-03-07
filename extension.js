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

        // const highlightCssPath = vscode.Uri.file(
        //     path.join(
        //         context.extensionPath,
        //         "node_modules",
        //         "highlight.js",
        //         "styles",
        //         "default.css"
        //     )
        // );
        // const highlightCssSrc = panel.webview.asWebviewUri(highlightCssPath);

        const customCssPath = vscode.Uri.file(
            path.join(context.extensionPath, "assets", "styles.css")
        );
        const customCssSrc = panel.webview.asWebviewUri(customCssPath);

        // const customJSPath = vscode.Uri.file(
        //     path.join(context.extensionPath, "assets", "script.js")
        // );
        // const customJSSrc = panel.webview.asWebviewUri(customJSPath);

        panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Custom Panel</title>
			<link rel="stylesheet" href="${customCssSrc}">
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
			integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
			crossorigin="anonymous" referrerpolicy="no-referrer" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">

            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
            <script>hljs.highlightAll();</script>
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
            <script>
                let count = 0;
                const messageContainer = document.getElementById("message_container");

                const apiCall = function (e) {
                    console.log("Clicked")
                    document.getElementById("message").style.height = "60px";
                    userMessage = document.querySelector("#message").value.trim() + "";
                
                    if (/^\s*$/.test(userMessage)) {
                        return; // Do nothing if the textarea is empty or contains only spaces/tabs
                    }
                
                    // Creating userFormatMessage
                    const userFormatMessage = document.createElement("div");
                    userFormatMessage.className = "user message";
                
                    // Create the "identity" div with class "identity"
                    const identityDiv = document.createElement("div");
                    identityDiv.className = "identity";
                
                    // create the user-icon element
                    const userIconElement = document.createElement("i");
                    userIconElement.className = "user-icon";
                    userIconElement.style.marginRight = "5px";
                    userIconElement.innerText = "u";
                
                    // Append the "user-icon" to the "identity" div
                    identityDiv.appendChild(userIconElement)
                
                    // Create the "content" div with class "content"
                    const contentDiv = document.createElement("div");
                    contentDiv.className = "content";
                
                    // Create the inner div with the user information
                    const userInfoDiv = document.createElement("div");
                
                    // Create the "fa-user" icon
                    const userIcon = document.createElement("i");
                    userIcon.className = "fa fa-user";
                
                    // create the "b" element for the bold text
                    const boldElement = document.createElement("b");
                    boldElement.textContent = "you";
                    boldElement.style.marginLeft = "5px";
                
                    // Append the "fa-user" and "b" elements to the inner div
                    userInfoDiv.appendChild(userIcon);
                    userInfoDiv.appendChild(boldElement);
                
                    // Create the "userContentValue" div with white-space: pre-line;
                    const userContentValueDiv = document.createElement("div");
                    userContentValueDiv.className = "userContentValue";
                    userContentValueDiv.style.whiteSpace = "pre-line";
                
                    userContentValueDiv.innerText = userMessage;
                
                    // Append the inner divs to the "content" div
                    contentDiv.appendChild(userInfoDiv);
                    contentDiv.appendChild(userContentValueDiv);
                
                    // Append the "identity" and "content" divs to the main div
                    userFormatMessage.appendChild(identityDiv);
                    userFormatMessage.appendChild(contentDiv);
                
                
                    document.querySelector("#message").value = "";
                    // let tempUserDiv = document.createElement('div');
                    // tempUserDiv.innerHTML = userFormatMessage;
                    // console.log("tempUserDiv", tempUserDiv)
                    // let newMessageDiv = tempUserDiv.firstChild;
                
                    messageContainer.appendChild(userFormatMessage);
                
                    // For showing the loader effect
                
                    let sendButton = document.querySelector('.send-button');
                    let submitButtonContent = document.getElementById('submitButtonContent');
                
                    let loadingImage = document.getElementById('loading-image').cloneNode(true);
                    let successIcon = document.getElementById('success-icon').cloneNode(true);

                    
                    submitButtonContent.innerHTML = '';
                    loadingImage.style.display = "inline-block";
                    submitButtonContent.appendChild(loadingImage);
                    console.log(loadingImage);
                    sendButton.disabled = true;
                    sendButton.style.cursor = "context-menu";
                    sendButton.style.backGroundColor = "color-gpt4";
                
                    if (userMessage) {
                        document.body.getElementsByTagName("main")[0].scrollTop = document.body.getElementsByTagName("main")[0].scrollHeight;

                        (async () => {
                            const rawResponse = await fetch('https://5b3c-34-32-157-169.ngrok-free.app/askme', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "prompt": userMessage
                                })
                            })();
                
                            let botMessage = await rawResponse.text();
                            console.log("I am botMessage", botMessage);

                            // Create the main div with class "assistant message"
                            const botFormatMessage = document.createElement("div");
                            botFormatMessage.classList.add("assistant", "message");

                            // Create the identity div with class "identity"
                            const identityDiv = document.createElement("div");
                            identityDiv.classList.add("identity");

                            // Create the user-icon element
                            const userIconElement = document.createElement("i");
                            userIconElement.classList.add("gpt", "user-icon");
                            userIconElement.textContent = "G";

                            // Append the user-icon to the identity div
                            identityDiv.appendChild(userIconElement);

                            // Create the content div with class "content"
                            const contentDiv = document.createElement("div");
                            contentDiv.classList.add("content");

                            // Create the div for the margin-bottom style
                            const marginBottomDiv = document.createElement("div");
                            marginBottomDiv.style.marginBottom = "5px";

                            // Create the bolt icon
                            const boltIcon = document.createElement("i");
                            boltIcon.classList.add("fa", "fa-bolt");

                            // Create the bold element for "bourntec-copilot"
                            const boldElement = document.createElement("b");
                            boldElement.textContent = "bourntec-copilot";

                            // Append the bolt icon and bold element to the margin-bottom div
                            marginBottomDiv.appendChild(boltIcon);
                            marginBottomDiv.appendChild(boldElement);

                            // Create the assistantContentValue div
                            const assistantContentValueDiv = document.createElement("div");
                            assistantContentValueDiv.classList.add("assistantContentValue");
                            
                            assistantContentValueDiv.textContent = marked.parse(botMessage); // Assuming marked function is defined elsewhere
                            assistantContentValueDiv.textContent += "Hii Bro"; // Assuming marked function is defined elsewhere

                            // Append the margin-bottom div and assistantContentValue div to the content div
                            contentDiv.appendChild(marginBottomDiv);
                            contentDiv.appendChild(assistantContentValueDiv);

                            // Append the identity div and content div to the botFormatMessage div
                            botFormatMessage.appendChild(identityDiv);
                            botFormatMessage.appendChild(contentDiv);

                            submitButtonContent.innerHTML = '';
                            submitButtonContent.appendChild(successIcon);
                            sendButton.disabled = false;
                            sendButton.style.cursor = "pointer";
                            sendButton.style.backGroundColor = "color- gpt3";

                            let tempBotDiv = document.createElement('div');
                            tempBotDiv.innerHTML = botFormatMessage;

                            messageContainer.appendChild(tempBotDiv);
                            console.log(botMessage);

                            document.querySelectorAll('pre code').forEach((block) => {
                                hljs.highlightBlock(block);
                            });

                        })();
                
                    }
                }

                const message_box = document.querySelector("#message");

                message_box.addEventListener("keyup", function () {
                message_box.style.height = "auto";
                let height = message_box.scrollHeight + 2;
                if (height > 200) {
                    height = 200;
                }
                message_box.style.height = height + "px";
});

            </script>

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
