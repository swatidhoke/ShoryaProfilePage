document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const sendBtn = document.getElementById('send-btn');
  const chatToggle = document.getElementById('chat-toggle');
  const chatWidget = document.getElementById('chatbot-widget');
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input');

  if (!sendBtn || !chatToggle || !chatWidget || !chatBody || !chatInput) {
    console.warn('Chat elements not found — chat will not initialize.');
    return;
  }

  let faqData = {};
  let awaitingFreeText = false;

  async function loadFAQ() {
    try {
      const res = await fetch('faq.json');
      if (!res.ok) throw new Error('faq.json not found');
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error('faq.json did not return JSON. Response starts: ' + text.slice(0, 120));
      }
      faqData = await res.json();
    } catch (err) {
      console.warn('Could not load faq.json — using fallback data.', err);
      faqData = {
        basic_info: { name: 'Shorya', age: '8 years', location: 'Cupertino, CA' },
        physical_details: { height: '4 ft 1 in', clothing_size: 'Kids Medium (8)', shoe_size: 'Kids 2' },
        portfolio: { portfolio_link: '#' },
        booking_info: { contact_name: 'Swati', email: 'swatisalukhe185@gmail.com' },
        experience: { modeling_experience: 'Beginner (Portfolio Ready)', skills: ['Soccer', 'Swimming'] }
      };
    }

    showMainMenu();
  }

  function addMessage(text, sender = 'bot', options = []) {
    const msg = document.createElement('div');
    msg.className = sender === 'user' ? 'user-msg' : 'bot-msg';
    msg.textContent = text;
    chatBody.appendChild(msg);

    if (options && options.length) {
      const optionContainer = document.createElement('div');
      optionContainer.style.margin = '8px 0';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = opt;
        btn.style.margin = '3px';
        btn.style.padding = '6px 10px';
        btn.style.border = '1px solid #007bff';
        btn.style.background = '#fff';
        btn.style.color = '#007bff';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', () => handleOption(opt));
        optionContainer.appendChild(btn);
      });
      chatBody.appendChild(optionContainer);
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showMainMenu() {
    const mainOptions = [
      'Basic Info',
      'Portfolio Photos',
      'Check Availability',
      'Booking / Contact',
      'Other Questions'
    ];
    addMessage('Hi! How can I help you today?', 'bot', mainOptions);
  }

  function handleOption(option) {
    addMessage(option, 'user');
    awaitingFreeText = false;

    switch (option) {
      case 'Basic Info':
        addMessage(
          `Name: ${faqData.basic_info.name}\nAge: ${faqData.basic_info.age}\nLocation: ${faqData.basic_info.location}\nHeight: ${faqData.physical_details.height}\nClothing Size: ${faqData.physical_details.clothing_size}\nShoe Size: ${faqData.physical_details.shoe_size}`,
          'bot',
          ['Portfolio Photos', 'Check Availability', 'Booking / Contact', 'Other Questions']
        );
        break;
      case 'Portfolio Photos':
        addMessage(
          `You can see the full portfolio here: ${faqData.portfolio.portfolio_link}`,
          'bot',
          ['Basic Info', 'Check Availability', 'Booking / Contact', 'Other Questions']
        );
        break;
      case 'Check Availability':
        addMessage(
          `Availability: After 4 PM on weekdays, fully available on weekends. Travel within Bay Area preferred.`,
          'bot',
          ['Basic Info', 'Portfolio Photos', 'Booking / Contact', 'Other Questions']
        );
        break;
      case 'Booking / Contact':
        addMessage(
          `Contact ${faqData.booking_info.contact_name} at ${faqData.booking_info.email} to book a shoot.`,
          'bot',
          ['Basic Info', 'Portfolio Photos', 'Check Availability', 'Other Questions']
        );
        break;
      case 'Other Questions':
        addMessage('Please type your question below.', 'bot');
        awaitingFreeText = true;
        break;
    }
  }

  function handleFreeText(question) {
    const q = question.toLowerCase();
    let answer = "I'm not sure about that, please contact us directly!";
    let relatedOptions = ['Basic Info', 'Portfolio Photos', 'Check Availability', 'Booking / Contact'];

    if (q.includes('name')) answer = `His name is ${faqData.basic_info.name}.`;
    else if (q.includes('age')) answer = faqData.basic_info.age;
    else if (q.includes('height')) answer = faqData.physical_details.height;
    else if (q.includes('clothing')) answer = faqData.physical_details.clothing_size;
    else if (q.includes('shoe')) answer = faqData.physical_details.shoe_size;
    else if (q.includes('portfolio')) answer = faqData.portfolio.portfolio_link;
    else if (q.includes('experience')) answer = faqData.experience.modeling_experience;
    else if (q.includes('skills')) answer = (faqData.experience.skills || []).join(', ');
    else if (q.includes('available')) answer = 'After 4 PM on weekdays, fully available on weekends. Travel within Bay Area preferred.';
    else if (q.includes('rate')) answer = 'Rates are discussed upon request.';
    else if (q.includes('contact')) answer = `Contact ${faqData.booking_info.contact_name} at ${faqData.booking_info.email}.`;

    addMessage(answer, 'bot', relatedOptions);
  }

  // Event handlers
  sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';

    if (awaitingFreeText) {
      awaitingFreeText = false;
      handleFreeText(text);
    }
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendBtn.click();
    }
  });

  chatToggle.addEventListener('click', () => {
    const isOpen = chatWidget.style.display === 'flex';
    if (isOpen) {
      chatWidget.style.display = 'none';
      chatWidget.setAttribute('aria-hidden', 'true');
      chatToggle.setAttribute('aria-expanded', 'false');
    } else {
      chatWidget.style.display = 'flex';
      chatWidget.setAttribute('aria-hidden', 'false');
      chatToggle.setAttribute('aria-expanded', 'true');
      chatInput.focus();
    }
  });

  // Initialize
  loadFAQ();
});

