document.addEventListener("DOMContentLoaded", () => {
  const commandInput = document.getElementById("command-input");
  const sendCommandButton = document.getElementById("send-command");
  const chatBox = document.getElementById("chat-box");

  sendCommandButton.addEventListener("click", async () => {
    const command = commandInput.value.trim();
    if (command) {
      chatBox.value += `> ${command}\n`;
      const { data } = await axios.get("/api/event", {
        params: {
          body: command,
        },
      });
      if (!data.fail) {
        chatBox.value += `${data.message}\n\n`;
      }
      commandInput.value = "";
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

  commandInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendCommandButton.click();
    }
  });
});
