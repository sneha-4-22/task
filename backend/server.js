// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/contactsdb';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Contact Model
const Contact = mongoose.model('Contact', contactSchema);

// Routes

// ROOT - Welcome message
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Contact API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      getAllContacts: 'GET /api/contacts',
      createContact: 'POST /api/contacts',
      deleteContact: 'DELETE /api/contacts/:id'
    },
    documentation: 'Visit /api/health to check server status'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// GET - Fetch all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contacts', message: error.message });
  }
});

// POST - Create new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      message: message || ''
    });

    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Validation error', message: error.message });
    } else {
      res.status(500).json({ error: 'Error creating contact', message: error.message });
    }
  }
});

// DELETE - Delete contact by ID
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully', deletedContact });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact', message: error.message });
  }
});

// 404 handler - Must be last (Express 5 syntax)
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/contacts',
      'POST /api/contacts',
      'DELETE /api/contacts/:id'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});