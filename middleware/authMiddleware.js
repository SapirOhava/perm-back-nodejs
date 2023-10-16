//so now that we have our session this middleware make sure that a user that wants to create/update/delete
// posts he has to be logged in. the way we can accomplish it is with express middlewares.
// this middleware checks that the session object has a user property attached to it
// if there is it will forward the request to the controller, and if it doesn't it will return an error

const protect = (req, res, next) => {
  const { user } = req.session;
  if (!user) {
    return res.status(401).json({ status: 'fail', message: 'unauthorized' });
  }

  req.user = user; // its just instead of using req.session.user
  next(); //call the next middleware in my case the controller in the stack
};

module.exports = protect;
