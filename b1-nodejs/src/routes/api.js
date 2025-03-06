const express = require("express");
const authController = require("../controller/auth.controller");

const router = express.Router();

/**
 * Khởi tạo API router
 * @param {*} app Express app
 */
const initApiRouter = (app) => {
  // OAuth routes
  router.get('/auth/callback', oauthController.handleAuthCallback);
  router.post('/install', oauthController.handleInstallEvent);

  // CRUD routes
  router.get('/contacts', crudController.getContacts);
  router.post('/contacts', crudController.addContact);
  router.put('/contacts', crudController.updateContact);
  router.delete('/contacts/:id', crudController.deleteContact);

  app.use("/api", router);
};

module.exports = initApiRouter;