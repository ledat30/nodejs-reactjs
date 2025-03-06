import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ContactForm = ({ onSave, editingContact }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: { ward: '', district: '', city: '' },
    phone: '',
    email: '',
    website: '',
    bankName: '',
    bankAccount: '',
  });

  useEffect(() => {
    if (editingContact) {
      const [ward, district, city] = editingContact.address
        ? editingContact.address.split(', ')
        : ['', '', ''];
      setFormData({
        name: editingContact.name || '',
        address: { ward, district, city },
        phone: editingContact.phone || '',
        email: editingContact.email || '',
        website: editingContact.website || '',
        bankName: editingContact.bankName || '',
        bankAccount: editingContact.bankAccount || '',
      });
    }
  }, [editingContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const { name, address, phone, email } = formData;
    if (!name) {
      toast.error('Name is required!');
      return false;
    }
    if (!address.ward || !address.district || !address.city) {
      toast.error('All address fields (ward, district, city) are required!');
      return false;
    }
    if (!phone) {
      toast.error('Phone is required!');
      return false;
    }
    if (!email) {
      toast.error('Email is required!');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format!');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave(formData);
    setFormData({
      name: '',
      address: { ward: '', district: '', city: '' },
      phone: '',
      email: '',
      website: '',
      bankName: '',
      bankAccount: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Ward:</label>
        <input
          type="text"
          name="address.ward"
          value={formData.address.ward}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>District:</label>
        <input
          type="text"
          name="address.district"
          value={formData.address.district}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          name="address.city"
          value={formData.address.city}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Website:</label>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Bank Name:</label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Bank Account:</label>
        <input
          type="text"
          name="bankAccount"
          value={formData.bankAccount}
          onChange={handleChange}
        />
      </div>
      <button type="submit">{editingContact ? 'Update' : 'Add'} Contact</button>
      {editingContact && (
        <button
          type="button"
          onClick={() =>
            setFormData({
              name: '',
              address: { ward: '', district: '', city: '' },
              phone: '',
              email: '',
              website: '',
              bankName: '',
              bankAccount: '',
            })
          }
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default ContactForm;