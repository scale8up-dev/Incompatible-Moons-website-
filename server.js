const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3456;
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Ensure data directory and messages file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Simple Email Validation Regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contact submission endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, budget, message } = req.body;

  // Input Validation
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Transmission failed: validation errors.',
      errors
    });
  }

  const newTransmission = {
    id: `signal_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: (subject && typeof subject === 'string') ? subject.trim() : 'General Inquiry',
    budget: (budget && typeof budget === 'string') ? budget.trim() : 'Unspecified',
    message: message.trim(),
    receivedAt: new Date().toISOString()
  };

  try {
    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      const fileData = fs.readFileSync(MESSAGES_FILE, 'utf8');
      messages = fileData ? JSON.parse(fileData) : [];
    }

    messages.unshift(newTransmission); // latest first
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');

    console.log(`[ORBIT INBOX] New signal received from ${newTransmission.name} (${newTransmission.email}) - ID: ${newTransmission.id}`);

    return res.status(201).json({
      success: true,
      message: 'Your signal has entered orbit. Our team will establish communication shortly.',
      transmissionId: newTransmission.id
    });
  } catch (err) {
    console.error('Failed to save message:', err);
    return res.status(500).json({
      success: false,
      message: 'Orbital interference: could not record transmission. Please try again.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Incompatible Moons Core',
    timestamp: new Date().toISOString()
  });
});

// Catch-all route to serve index.html for client-side navigation
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌕 Incompatible Moons Server running!`);
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`📩 Transmissions saved to: ${MESSAGES_FILE}\n`);
});
