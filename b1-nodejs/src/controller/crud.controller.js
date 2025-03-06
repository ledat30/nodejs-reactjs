const contactService = require('../service/crudService');

// Thêm contact
const addContact = async (req, res) => {
  try {
    const { name, address, phone, email, website, bankName, bankAccount } = req.body;
    const contactId = await contactService.addContact({
      name,
      address,
      phone,
      email,
      website,
      bankName,
      bankAccount,
    });
    res.json({ message: 'Contact added successfully', contactId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật contact
const updateContact = async (req, res) => {
  try {
    const { id, name, address, phone, email, website, bankName, bankAccount } = req.body;
    await contactService.updateContact({
      id,
      name,
      address,
      phone,
      email,
      website,
      bankName,
      bankAccount,
    });
    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa contact
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await contactService.deleteContact(id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách contact
const getContacts = async (req, res) => {
  try {
    const contacts = await contactService.getContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addContact, updateContact, deleteContact, getContacts };