const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

function addMessage(content, sender = "bot") {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const query = userInput.value.trim();
  if (!query) return;

  addMessage(query, "user");
  userInput.value = "";

  try {
    const response = await fetch("https://dr-chitti-ai.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.error) {
      addMessage("⚠️ " + data.message);
    } else if (data.results) {
      data.results.forEach((item, index) => {
        let resultText = `🦠 ${item.disease}\n📝 Symptoms: ${item.symptoms.join(', ')}\n💊 Medicines: ${item.medicine.join(', ')}\n🧪 Treatments: ${item.treatment.join(', ')}`;
        addMessage(resultText);
      });
    } else {
      addMessage("🤖 No result found. Try using different keywords.");
    }
  } catch (err) {
    addMessage("❌ Error connecting to the server. Please try again.");
    console.error(err);
  }
}
