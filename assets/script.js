let count = 0;

const messageContainer = document.getElementById("message_container");

const apiCall = function (e) {
    console.log("Clicked")
    document.getElementById("message").style.height = "60px";
    let userMessage = `${document.querySelector("#message").value.trim()}`;

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
            const rawResponse = await fetch('https://5850-34-127-121-254.ngrok-free.app/askme', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "prompt": userMessage
                })
            })

            let botMessage = await rawResponse.text();


            let botFormatMessage = `<div class="assistant message">
                                        <div class="identity">
                                            <i class="gpt user-icon">G</i>
                                        </div>
                                        <div class="content">
                                            <div style="margin-bottom: 5px;">
                                                <i class="fa fa-bolt"></i> <B>bourntec-copilot</B>
                                            </div>
                                            <div class="assistantContentValue">
                                                ${marked(botMessage)}
                                            </div>
                                        </div>
                                    </div>`;

            // let 

            submitButtonContent.innerHTML = '';
            submitButtonContent.appendChild(successIcon);
            sendButton.disabled = false;
            sendButton.style.cursor = "pointer";
            sendButton.style.backGroundColor = "color-gpt3";

            let tempBotDiv = document.createElement('div');
            tempBotDiv.innerHTML = botFormatMessage;

            messageContainer.appendChild(tempBotDiv);


            console.log(botMessage);

            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });

            // Add copy-to-clipboard functionality
            document.querySelectorAll(".hljs").forEach((codeBlock) => {
                let copyButton = document.createElement('button');
                copyButton.className = 'copy-button';
                copyButton.textContent = 'Copy';
                copyButton.addEventListener('click', () => {
                    const code = codeBlock.textContent;
                    navigator.clipboard.writeText(code)
                        .then(() => {
                            copyButton.textContent = 'Copied';
                            setTimeout(() => {
                                copyButton.textContent = 'Copy';
                            }, 3000);
                        }).catch((err) => {
                            console.error("Unable to copy code to clipboard", err);
                        });
                });

                codeBlock.parentNode.insertBefore(copyButton, codeBlock.nextElementSibling)
            })

            document.body.getElementsByTagName("main")[0].scrollTop = document.body.getElementsByTagName("main")[0].scrollHeight;

            // remove the typewriter effect and logo
            if (count == 0) {
                document.getElementsByClassName("typewriter")[0].style.display = "none";
                document.querySelector("body > main > div.view.new-chat-view > div.model-selector > img").style.display = "none";
            }
            count++;





        })();

    }
}

// hide_sidebar.addEventListener( "click", function() {
//     sidebar.classList.toggle( "hidden" );
// } );

const user_menu = document.querySelector(".user-menu ul");
const show_user_menu = document.querySelector(".user-menu button");

// show_user_menu.addEventListener( "click", function() {
//     if( user_menu.classList.contains("show") ) {
//         user_menu.classList.toggle( "show" );
//         setTimeout( function() {
//             user_menu.classList.toggle( "show-animate" );
//         }, 200 );
//     } else {
//         user_menu.classList.toggle( "show-animate" );
//         setTimeout( function() {
//             user_menu.classList.toggle( "show" );
//         }, 50 );
//     }
// } );

const models = document.querySelectorAll(".model-selector button");

for (const model of models) {
    model.addEventListener("click", function () {
        document.querySelector(".model-selector button.selected")?.classList.remove("selected");
        model.classList.add("selected");
    });
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

function show_view(view_selector) {
    document.querySelectorAll(".view").forEach(view => {
        view.style.display = "none";
    });

    document.querySelector(view_selector).style.display = "flex";
}

// new_chat_button.addEventListener("click", function() {
//     show_view( ".new-chat-view" );
// });

document.querySelectorAll(".conversation-button").forEach(button => {
    button.addEventListener("click", function () {
        show_view(".conversation-view");
    })
});



