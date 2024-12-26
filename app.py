from flask import Flask, render_template, request, jsonify
from huggingface_hub import InferenceClient

# Initialize Flask app
app = Flask(__name__)

# Initialize Hugging Face Inference Client with your API key
client = InferenceClient(api_key="hf_XXXX")

# Function to get chatbot response from Hugging Face model
def chatbot_response(message):
    try:
        response = ""
        # Make a request to Hugging Face Inference API
        for msg in client.chat_completion(
            model="microsoft/Phi-3.5-mini-instruct",
            messages=[{"role": "user", "content": message}],
            max_tokens=500,
            stream=True,
        ):
            response += msg.choices[0].delta.content
        return response
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    
    if not user_message:
        return jsonify({'error': 'No message received'}), 400
    
    # Get the chatbot's response from the Hugging Face model
    bot_response = chatbot_response(user_message)
    return jsonify({'response': bot_response}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)  # Change to '0.0.0.0' for external access
