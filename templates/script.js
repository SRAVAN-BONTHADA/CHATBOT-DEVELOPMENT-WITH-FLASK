// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Select DOM elements
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const messageContainer = document.getElementById("messages");

    // Function to send a message
    function sendMessage() {
        const userMessage = userInput.value;
        if (userMessage.trim() === "") return;

        // Create and display the user's message
        const userMessageElement = document.createElement("div");
        userMessageElement.className = "message user";
        userMessageElement.textContent = userMessage;
        messageContainer.appendChild(userMessageElement);
        
        // Scroll to the bottom of the chat
        messageContainer.scrollTop = messageContainer.scrollHeight;

        // Clear the input field
        userInput.value = "";

        // Send the user's message to the Flask server
        fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            // Create and display the bot's response
            const botMessageElement = document.createElement("div");
            botMessageElement.className = "message bot";
            botMessageElement.textContent = data.response || data.error;
            messageContainer.appendChild(botMessageElement);
            
            // Scroll to the bottom of the chat
            messageContainer.scrollTop = messageContainer.scrollHeight;
        })
        .catch(error => console.error("Error:", error));
    }

    // Add event listener for the send button
    sendButton.addEventListener("click", sendMessage);

    // Optional: Allow sending messages with the Enter key
    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
