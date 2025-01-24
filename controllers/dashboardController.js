// get || dashboard page
exports.dashboard = async (req, res) => {
  const locals = {
    title: "Dashboard",
    dscription: "Node application"
  }
  res.render('dashboard/index', {
    locals,
    layout: '../views/layouts/dashboard'
  });
}