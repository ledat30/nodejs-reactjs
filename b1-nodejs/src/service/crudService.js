const bitrixService = require('./OAuthService');

// Thêm contact
async function addContact({ name, address, phone, email, website, bankName, bankAccount }) {
  const contactPayload = {
    fields: {
      NAME: name,
      ADDRESS: `${address.ward}, ${address.district}, ${address.city}`,
      PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
      EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
      WEB: [{ VALUE: website, VALUE_TYPE: 'WORK' }],
    },
  };

  const contactResult = await bitrixService.callBitrixApi('crm.contact.add', contactPayload);
  const contactId = contactResult.result;

  // Thêm thông tin ngân hàng (requisite)
  const requisitePayload = {
    fields: {
      ENTITY_TYPE_ID: 3,
      ENTITY_ID: contactId,
      TITLE: `${name}'s Bank Details`,
      RQ_BANK_NAME: bankName,
      RQ_ACC_NUM: bankAccount,
    },
  };
  await bitrixService.callBitrixApi('crm.requisite.add', requisitePayload);

  return contactId;
}

// Cập nhật contact
async function updateContact({ id, name, address, phone, email, website, bankName, bankAccount }) {
  const contactPayload = {
    id,
    fields: {
      NAME: name,
      ADDRESS: `${address.ward}, ${address.district}, ${address.city}`,
      PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
      EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
      WEB: [{ VALUE: website, VALUE_TYPE: 'WORK' }],
    },
  };
  await bitrixService.callBitrixApi('crm.contact.update', contactPayload);

  // Cập nhật requisite
  const requisiteList = await bitrixService.callBitrixApi('crm.requisite.list', {
    filter: { ENTITY_ID: id, ENTITY_TYPE_ID: 3 },
  });
  if (requisiteList.result.length > 0) {
    const requisiteId = requisiteList.result[0].ID;
    await bitrixService.callBitrixApi('crm.requisite.update', {
      id: requisiteId,
      fields: { RQ_BANK_NAME: bankName, RQ_ACC_NUM: bankAccount },
    });
  }
}

// Xóa contact
async function deleteContact(id) {
    const requisiteList = await bitrixService.callBitrixApi('crm.requisite.list', {
      filter: { ENTITY_ID: id, ENTITY_TYPE_ID: 3 },
    });
    if (requisiteList.result.length > 0) {
      await bitrixService.callBitrixApi('crm.requisite.delete', {
        id: requisiteList.result[0].ID,
      });
    }
    await bitrixService.callBitrixApi('crm.contact.delete', { id });
  }

// Lấy danh sách contact
async function getContacts() {
  const contacts = await bitrixService.callBitrixApi('crm.contact.list', {
    select: ['ID', 'NAME', 'ADDRESS', 'PHONE', 'EMAIL', 'WEB'],
  });

  const result = await Promise.all(
    contacts.result.map(async (contact) => {
      const requisites = await bitrixService.callBitrixApi('crm.requisite.list', {
        filter: { ENTITY_ID: contact.ID, ENTITY_TYPE_ID: 3 },
      });
      const bankInfo = requisites.result[0] || {};
      return {
        id: contact.ID,
        name: contact.NAME,
        address: contact.ADDRESS,
        phone: contact.PHONE?.[0]?.VALUE,
        email: contact.EMAIL?.[0]?.VALUE,
        website: contact.WEB?.[0]?.VALUE,
        bankName: bankInfo.RQ_BANK_NAME,
        bankAccount: bankInfo.RQ_ACC_NUM,
      };
    })
  );
  return result;
}

module.exports = { addContact, updateContact, deleteContact, getContacts };