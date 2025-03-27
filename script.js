document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Voice Recognition
document.getElementById('voice-btn').addEventListener('click', function () {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
        let transcript = event.results[0][0].transcript;
        document.getElementById('user-input').value = transcript;
        sendMessage();
    };

    recognition.start();
});

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();

    if (userMessage === '') return;

    // Append user's message to the chat
    appendMessage(userMessage, 'user-message');

    // Clear input field
    userInput.value = '';

    // Send message to Gemini API
    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA_4q4UP9SDtb24IorkmBo-ev8BxVLG-S8', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }]
        })
    })
    .then(response => response.json())
    .then(data => {
        const botResponse = data.candidates[0].content.parts[0].text;
        appendMessage(botResponse, 'bot-message');
        speakResponse(botResponse);
    })
    .catch(error => {
        console.error('Error:', error);
        appendMessage('Sorry, there was an error processing your request.', 'bot-message');
    });
}

function appendMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Text-to-Speech
function speakResponse(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}
