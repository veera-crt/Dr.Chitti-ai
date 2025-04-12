/*document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const typingIndicator = document.getElementById('typing-indicator');
    const quickSuggestions = document.getElementById('quick-suggestions');
    
    // Initial bot message
    const initialMessage = {
      sender: 'Dr. Chitti',
      text: 'Hello! I\'m Dr. Chitti, your AI medical assistant. You can ask me about diseases, symptoms, or medications. How can I help you today?',
      timestamp: new Date()
    };
    
    // Add message to chat
    function addMessage({ sender, text, timestamp, isUser = false }) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
      
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      
      if (!isUser) {
        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';
        senderDiv.textContent = sender;
        messageContent.appendChild(senderDiv);
      }
      
      const textNode = document.createElement('p');
      textNode.innerHTML = text.replace(/\n/g, '<br>');
      messageContent.appendChild(textNode);
      
      const timeDiv = document.createElement('div');
      timeDiv.className = 'message-time';
      timeDiv.textContent = formatTime(timestamp);
      
      messageDiv.appendChild(messageContent);
      messageDiv.appendChild(timeDiv);
      
      chatMessages.appendChild(messageDiv);
      scrollToBottom();
    }
    
    // Format time
    function formatTime(date) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Show typing indicator
    function showTyping() {
      typingIndicator.style.display = 'block';
      scrollToBottom();
    }
    
    // Hide typing indicator
    function hideTyping() {
      typingIndicator.style.display = 'none';
    }
    
    // Scroll to bottom of chat
    function scrollToBottom() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Handle quick suggestions
    function setupQuickSuggestions() {
      const suggestionButtons = quickSuggestions.querySelectorAll('.suggestion-btn');
      suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
          userInput.value = button.textContent;
          userInput.focus();
        });
      });
    }
    
    // Handle form submission
    async function handleSubmit(e) {
      e.preventDefault();
      const query = userInput.value.trim();
      if (!query) return;
      
      // Add user message
      addMessage({
        sender: 'You',
        text: query,
        timestamp: new Date(),
        isUser: true
      });
      
      userInput.value = '';
      showTyping();
      
      try {
        // Simulate API call (replace with actual fetch to your backend)
        const response = await mockApiCall(query);
        
        // Add bot response
        addMessage({
          sender: 'Dr. Chitti',
          text: response,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error:', error);
        addMessage({
          sender: 'Dr. Chitti',
          text: "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.",
          timestamp: new Date()
        });
      } finally {
        hideTyping();
      }
    }
    
    // Mock API call (replace with actual fetch to your backend)
    async function mockApiCall(query) {
      return new Promise(resolve => {
        setTimeout(() => {
          // This would be replaced with actual API call
          const responses = [
            `Based on your query about "${query}", I found that it's important to consult with a healthcare professional for accurate diagnosis. Common symptoms may include...`,
            `Regarding "${query}", typical treatments include... Always follow your doctor's advice.`,
            `For "${query}", common medications are... but dosage should be determined by a physician.`
          ];
          resolve(responses[Math.floor(Math.random() * responses.length)]);
        }, 1500); // Simulate network delay
      });
    }
    
    // Event listeners
    chatForm.addEventListener('submit', handleSubmit);
    
    // Initialize
    addMessage(initialMessage);
    setupQuickSuggestions();
    
    // Focus input on load
    userInput.focus();
  });*/
