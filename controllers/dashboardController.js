const Note = require('../model/Note');
const mongoose = require('mongoose');
// get || dashboard page
exports.dashboard = async (req, res) => {
  console.log(req.user);
  async function insertDummyData() {
    try {
      await Note.insertMany([
        { user: req.user._id, title: 'First Note', content: 'This is my first note', createdAt: new Date() },
        { user: req.user._id, title: 'Second Note', content: 'This is my second note', createdAt: new Date() }
      ]);
    } catch (error) {
      console.log(error);
    }
  }
  insertDummyData();
  const locals = {
    title: "Dashboard",
    dscription: "Node application"
  };
  try {
    const notes = await Note.find({ user: req.user._id });
    res.render('dashboard/index', {
      userName: req.user.displayName,
      locals,
      layout: '../views/layouts/dashboard',
      notes
    });
  } catch (error) {
    console.log(error);
    res.render('dashboard');
  }
};

