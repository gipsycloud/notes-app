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
  let perPage = 8;
  let page = req.params.page || 1;

  const locals = {
    title: "Dashboard",
    dscription: "Node application"
  };
  try {
    const notes = await Note.aggregate([
      { $sort: { createdAt: -1 } },
      { $match: { user: req.user._id } },
      {
        $project: {
          title: { $substrCP: ["$title", 0, 30] },     //  This operator is used instead of $substr to handle UTF-8 characters correctly.
          content: { $substrCP: ["$content", 0, 100] },
          createdAt: 1
        }
      }
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Note.countDocuments({ user: req.user._id });
    res.render('dashboard/index', {
      userName: req.user.displayName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage)
    });
  } catch (error) {
    console.log(error);
  }
};

// view
exports.item = async (req, res) => {
  const locals = {
    title: "Dashboard",
    dscription: "Note application"
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

// add
exports.addItem = async (req, res) => {
  const locals = {
    title: "Dashboard",
    dscription: "Node application"
  }
  res.render('dashboard/add_note', {
    layout: "../views/layouts/dashboard",
    locals,
  });
}

exports.submitItem = async (req, res) => {
  try {
    // req.body.user = req.user.id;
    // await Note.create(req.body);
    const note = new Note({
      user: req.user.id,
      title: req.body.title,
      content: req.body.content,
    });
    await note.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
};

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

exports.deleteItem = async (req, res) => {
  try {
    await Note.findByIdAndDelete({ _id: req.params.id }).where({
      user: req.user.id
    });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
};

// search || get
exports.search = async (req, res) => {
  try {
    res.render('/dashboard/search', {
      layout: "../views/layouts/dashboard",
      search: req.query.search
    });
  } catch (error) {
    console.log(error);

  }
};

// search || post
exports.searchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm.trim();
    console.log(searchTerm);

    const searchSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchSpecialChars, 'i') } },
        { content: { $regex: new RegExp(searchSpecialChars, 'i') } },
      ]
    }).where({ user: req.user.id }).lean();

    const highlightcontent = (searchResults, searchTerm) => {
      searchResults.forEach((result) => {
        result.title = result.title.replace(new RegExp(searchTerm, 'gi'), (match) => `<span class="highlight">${match}</span>`);
        result.content = result.content.replace(new RegExp(searchTerm, 'gi'), (match) => `<span class="highlight">${match}</span>`);
        // console.log(result.content);
      });
      return searchResults;
    }

    res.render('dashboard/search', {
      layout: "../views/layouts/dashboard",
      search: highlightcontent(searchResults, searchTerm),
      searchTerm
    });
  } catch (error) {
    console.log(error);

  }
};
const getClassNames = (controllerName) => {
  return `${controllerName}-controller`;
};