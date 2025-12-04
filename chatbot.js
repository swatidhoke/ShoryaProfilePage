let faqData = {};

async function loadFAQ() {
    const response = await fetch("faq.json");
    faqData = await response.json();
}

function addMessage(text, sender = "bot") {
    const chatBody = document.getElementById("chat-body");
    const msg = document.createElement("div");
    msg.classList.add("message");

    if (sender === "user") msg.classList.add("user-msg");
    else msg.classList.add("bot-msg");

    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function findAnswer(question) {
    const q = question.toLowerCase();
    let answer = null;

    const flatten = JSON.stringify(faqData).toLowerCase();

    if (flatten.includes("name") && q.includes("name")) 
        return `His name is ${faqData.basic_info.name}.`;

    if (q.includes("age")) return faqData.basic_info.age;
    if (q.includes("height")) return faqData.physical_details.height;
    if (q.includes("weight")) return faqData.physical_details.weight;
    if (q.includes("clothing")) return faqData.physical_details.clothing_size;
    if (q.includes("shoe")) return faqData.physical_details.shoe_size;
    if (q.includes("location")) return faqData.basic_info.location;
    if (q.includes("portfolio")) return faqData.portfolio.portfolio_link;
    if (q.includes("experience")) return faqData.experience.modeling_experience;
    if (q.includes("skills")) return faqData.experience.skills.join(", ");
    if (q.includes("available")) return "He is available after 4 PM on weekdays and fully on weekends.";
    if (q.includes("rate") || q.includes("price")) return "Rates are discussed upon request.";
    if (q.includes("contact")) return `Please contact ${faqData.booking_info.contact_name} at ${faqData.booking_info.email}.`;

    return "I'm not sure about that, but you can contact us directly!";
}

document.getElementById("send-btn").addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    setTimeout(() => {
        const reply = findAnswer(text);
        addMessage(reply, "bot");
    }, 300);
});

document.getElementById("chat-toggle").addEventListener("click", () => {
    const bot = document.getElementById("chatbot-widget");
    bot.style.display = bot.style.display === "flex" ? "none" : "flex";
});

loadFAQ();
