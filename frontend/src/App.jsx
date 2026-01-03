import React, { useState, useEffect } from 'react';
import { Trash2, User, Mail, Phone, MessageSquare, CheckCircle, Sparkles, Heart } from 'lucide-react';

const API_URL = 'https://contact-api-rk5i.onrender.com/api';

export default function ContactManagementApp() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/contacts`);
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^\+?[\d\s\-()]{10,}$/;
    return regex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newContact = await response.json();
        setContacts(prev => [newContact, ...prev]);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(prev => prev.filter(contact => contact._id !== id));
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'email') return a.email.localeCompare(b.email);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const isFormValid = formData.name.trim() && 
                      validateEmail(formData.email) && 
                      validatePhone(formData.phone);

  return (
    <div className="min-h-screen" style={{ background: '#FFE4EF' }}>
      <div className="max-w-6xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="text-pink-500" size={28} fill="currentColor" />
            <h1 className="text-4xl font-black" style={{ color: '#F875AA' }}>
              Contact Hub
            </h1>
            <Sparkles className="text-yellow-400" size={28} />
          </div>
          <p className="text-pink-600 font-semibold">vibe check your contacts ✨</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 rounded-2xl p-4 flex items-center justify-center gap-3 max-w-2xl mx-auto shadow-lg" 
               style={{ background: '#FEEAC9', border: '2px solid #F875AA' }}>
            <CheckCircle style={{ color: '#F875AA' }} size={28} />
            <span className="font-black text-lg" style={{ color: '#F875AA' }}>
              slay! contact added 💅
            </span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact Form */}
          <div className="rounded-2xl p-6 shadow-xl" style={{ background: '#FDEDED' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F875AA' }}>
                <User className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-black" style={{ color: '#F875AA' }}>
                new bestie?
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 font-bold mb-2 text-sm uppercase tracking-wide" style={{ color: '#F29AAE' }}>
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: '#F875AA' }}>
                    <User className="text-white" size={12} />
                  </div>
                  name <span style={{ color: '#F875AA' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all text-gray-800 font-medium ${
                    errors.name ? 'bg-pink-50' : 'bg-white'
                  }`}
                  style={{ 
                    borderColor: errors.name ? '#F875AA' : '#FFE4EF',
                    focusBorderColor: '#F875AA'
                  }}
                  placeholder="name here"
                />
                {errors.name && <p className="text-sm mt-1 font-bold flex items-center gap-1" style={{ color: '#F875AA' }}>⚠️ {errors.name}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 font-bold mb-2 text-sm uppercase tracking-wide" style={{ color: '#F29AAE' }}>
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: '#F875AA' }}>
                    <Mail className="text-white" size={12} />
                  </div>
                  email <span style={{ color: '#F875AA' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all text-gray-800 font-medium ${
                    errors.email ? 'bg-pink-50' : 'bg-white'
                  }`}
                  style={{ 
                    borderColor: errors.email ? '#F875AA' : '#FFE4EF'
                  }}
                  placeholder="bestie@email.com"
                />
                {errors.email && <p className="text-sm mt-1 font-bold flex items-center gap-1" style={{ color: '#F875AA' }}>⚠️ {errors.email}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 font-bold mb-2 text-sm uppercase tracking-wide" style={{ color: '#F29AAE' }}>
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: '#F875AA' }}>
                    <Phone className="text-white" size={12} />
                  </div>
                  phone <span style={{ color: '#F875AA' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all text-gray-800 font-medium ${
                    errors.phone ? 'bg-pink-50' : 'bg-white'
                  }`}
                  style={{ 
                    borderColor: errors.phone ? '#F875AA' : '#FFE4EF'
                  }}
                  placeholder="9876543210"
                />
                {errors.phone && <p className="text-sm mt-1 font-bold flex items-center gap-1" style={{ color: '#F875AA' }}>⚠️ {errors.phone}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 font-bold mb-2 text-sm uppercase tracking-wide" style={{ color: '#F29AAE' }}>
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: '#F875AA' }}>
                    <MessageSquare className="text-white" size={12} />
                  </div>
                  message (optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 rounded-xl outline-none resize-none transition-all bg-white text-gray-800 font-medium"
                  style={{ borderColor: '#FFE4EF' }}
                  placeholder="spill the tea..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                className="w-full py-4 rounded-xl font-black text-xl transition-all"
                style={isFormValid && !loading ? {
                  background: 'linear-gradient(135deg, #F875AA 0%, #F29AAE 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 10px 25px rgba(248, 117, 170, 0.5)',
                  cursor: 'pointer',
                  border: 'none',
                  transform: 'scale(1)'
                } : {
                  background: '#F875AA',
                  color: '#ffffffff',
                  cursor: 'not-allowed',
                  border: 'none',
                  boxShadow: 'none'
                }}
                onMouseEnter={(e) => {
                  if (isFormValid && !loading) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(248, 117, 170, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFormValid && !loading) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(248, 117, 170, 0.5)';
                  }
                }}
              >
                {loading ? 'adding...' : ' add contact'}
              </button>
            </div>
          </div>

          {/* Contacts List */}
          <div className="rounded-2xl p-6 shadow-xl" style={{ background: '#FDEDED' }}>
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F875AA' }}>
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-black" style={{ color: '#F875AA' }}>
                    ur circle
                  </h2>
                  <p className="text-sm font-semibold" style={{ color: '#F29AAE' }}>{contacts.length} contacts</p>
                </div>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border-2 rounded-xl outline-none font-bold text-sm bg-white"
                style={{ borderColor: '#FFE4EF', color: '#F875AA' }}
              >
                <option value="date">🕐 newest</option>
                <option value="name">👤 name</option>
                <option value="email">📧 email</option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {sortedContacts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#FEEAC9' }}>
                    <Sparkles size={40} style={{ color: '#F875AA' }} />
                  </div>
                  <p className="font-bold mb-1" style={{ color: '#F875AA' }}>no contacts yet!</p>
                  <p className="text-sm font-medium" style={{ color: '#F29AAE' }}>add ur first bestie ✨</p>
                </div>
              ) : (
                sortedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="border-2 rounded-xl p-4 transition-all bg-white hover:shadow-lg"
                    style={{ borderColor: '#FFE4EF' }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-black text-gray-800 text-xl mb-3">{contact.name}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#FFE4EF' }}>
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F875AA' }}>
                              <Mail size={14} className="text-white" />
                            </div>
                            <span className="font-semibold text-gray-700 text-sm break-all">{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#FFE4EF' }}>
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F875AA' }}>
                              <Phone size={14} className="text-white" />
                            </div>
                            <span className="font-semibold text-gray-700 text-sm">{contact.phone}</span>
                          </div>
                          {contact.message && (
                            <div className="flex items-start gap-2 p-3 rounded-lg border-2" style={{ background: '#FEEAC9', borderColor: '#F875AA' }}>
                              <MessageSquare size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#F875AA' }} />
                              <span className="text-gray-700 font-medium text-sm">{contact.message}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="ml-3 w-10 h-10 rounded-lg text-white transition-all transform hover:scale-110 flex items-center justify-center shadow"
                        style={{ background: '#F875AA' }}
                        title="Delete contact"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}