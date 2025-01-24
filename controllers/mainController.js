// get || home page
exports.homepage = async (req, res) => {
  const locals = {
    title: "Nodejs",
    dscription: "Node application"
  }
  res.render('index', {
    locals,
    layouts: '../views/layouts/front-page'
  });
}

// get || about page
exports.about = async (req, res) => {
  const locals = {
    title: "About",
    dscription: "About Nodejs application"
  }
  res.render('about', locals);
}