import React, { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}/contacts`);
      setContacts(response.data);
    } catch (error) {
      toast.error('Error fetching contacts: ' + error.message);
    }
  };

  const handleSave = async (contact) => {
    try {
      if (editingContact) {
        await axios.put(`${API_URL}/contacts`, { ...contact, id: editingContact.id });
        toast.success('Contact updated successfully!');
      } else {
        await axios.post(`${API_URL}/contacts`, contact);
        toast.success('Contact added successfully!');
      }
      fetchContacts();
      setEditingContact(null);
    } catch (error) {
      toast.error('Error saving contact: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/contacts/${id}`);
      toast.success('Contact deleted successfully!');
      fetchContacts();
    } catch (error) {
      toast.error('Error deleting contact: ' + error.message);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
  };

  return (
    <div className="App">
      <h1>Contact Management</h1>
      <ContactForm onSave={handleSave} editingContact={editingContact} />
      <ContactList contacts={contacts} onEdit={handleEdit} onDelete={handleDelete} />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;