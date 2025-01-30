const Note = require('../model/Note');
const mongoose = require('mongoose');
// get || dashboard page
exports.dashboard = async (req, res) => {
  // console.log(req.user);
  // async function insertDummyData() {
  //   try {
  //     await Note.insertMany([
  //       { user: req.user._id, title: 'First Note', content: 'This is my first note', createdAt: new Date() },
  //       { user: req.user._id, title: 'Second Note', content: 'This is my second note', createdAt: new Date() }
  //     ]);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // insertDummyData();
  let perPage = 5;
  let page = req.params.page || 1;

  const locals = {
    title: "Dashboard",
    dscription: "Node application"
  };
  try {
    // const notes = await Note.find({ user: req.user._id })
    const notes = await Note.aggregate([
      // { $sort: { createdAt: -1 } },
      { $match: { user: req.user._id } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          content: { $substr: ["$content", 0, 100] },
        },
      }
    ])
      // .skip(perPage * page - perPage)
      // .limit(perPage)
      .exec();
    // const count = await Note.countDocuments();    
    res.render('dashboard/index', {
      userName: req.user.displayName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
    });

    // Mongoose "^7.0.0 Update
    // const notes = await Note.aggregate([
    //   { $sort: { createdAt: -1 } },
    //   { $match: { user: req.user._id } },
    //   {
    //     $project: {
    //       title: { $substr: ["$title", 0, 30] },
    //       content: { $substr: ["$content", 0, 100] },
    //     },
    //   }
    // ])
    //   .skip(perPage * page - perPage)
    //   .limit(perPage)
    //   .exec();

    // const count = await Note.countDocuments();

    // res.render('dashboard/index', {
    //   userName: req.user.displayName,
    //   locals,
    //   notes,
    //   layout: "../views/layouts/dashboard",
    //   current: page,
    //   pages: Math.ceil(count / perPage)
    // });

  } catch (error) {
    console.log(error);
  }
};

// view
exports.item = async (req, res) => {
  const locals = {
    title: "Dashboard",
    dscription: "Node application"
  };
  const note = await Note.findById({ _id: req.params.id }).where({ _id: req.params.id }).lean();
  if (note) {
    res.render('dashboard/view_note', {
      noteID: req.params.id,
      locals,
      note,
      layout: "../views/layouts/dashboard"
    });
  } else {
    res.redirect('/dashboard');
  }
}

exports.updateItem = async (req, res) => {
  try {
    await Note.findByIdAndUpdate({ _id: req.params.id }, req.body).where({
      user: req.user.id
    });
    res.redirect(`/dashboard/item/${req.params.id}`);

    // { title: req.body.title, content: req.body.content }
  } catch (error) {
    console.log(error);
  }
};