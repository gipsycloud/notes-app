const Note = require('../model/Note');
const mongoose = require('mongoose');
// get || dashboard page
exports.dashboard = async (req, res) => {
  console.log(req.user);
  let perPage = 5;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    dscription: "Node application"
  };
  try {
    // Mongoose 7.0.0 Update "
    const notes = await Note.aggregate([
      { $sort: { createdAt: -1, } },
      { $match: { user: req.user._id } },
      {
        $project: {
          title: { $substr: ['$title', 0, 30] },
          content: { $substr: ['$content', 0, 100] },
          // createdAt: 1,
          // _id: 0
        }
      }
    ]).skip(perPage * page - perPage)
      .limit(perPage)
      .exec();


    const count = await Note.find({ user: req.user._id });

    res.render('dashboard', {
      notes,
      userName: req.user.firstName,
      current: page,
      pages: Math.ceil(count.length / perPage),
      layout: "../views/layouts/dashboard",
    });

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
    // insertDummyData();
  } catch (error) {
    console.log(error);
    res.render('dashboard');
  }
};

