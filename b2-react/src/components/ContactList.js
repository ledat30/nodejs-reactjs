import React from 'react';

const ContactList = ({ contacts, onEdit, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Website</th>
          <th>Bank Name</th>
          <th>Bank Account</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id}>
            <td>{contact.id}</td>
            <td>{contact.name}</td>
            <td>{contact.address}</td>
            <td>{contact.phone || ''}</td>
            <td>{contact.email || ''}</td>
            <td>{contact.website || ''}</td>
            <td>{contact.bankName || ''}</td>
            <td>{contact.bankAccount || ''}</td>
            <td>
              <button onClick={() => onEdit(contact)}>Edit</button>
              <button onClick={() => onDelete(contact.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactList;