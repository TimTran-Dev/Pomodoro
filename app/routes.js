module.exports = function(app, passport, db, mongoose) {
  app.get("/", function(req, res) {
    res.render("index.ejs");
  });

  app.get("/profile", isLoggedIn, function(req, res) {
    db.collection("pomodoro")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          userTime: result
        });
      });
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.post("/profile", (req, res) => {
    console.log(req.body);
    db.collection("pomodoro").save(
      { hour: req.body.hour, minute: req.body.minute, second: req.body.second },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });

  app.put("/profile", (req, res) => {
    console.log(req.body);
    db.collection("pomodoro").findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.body._id) },
      {
        $set: {
          hour: req.body.hour,
          minute: req.body.minute,
          second: req.body.second
        }
      },
      { new: true, upsert: true },
      (err, result) => {
        if (err) {
          console.log("err", err);
          return res.send(err);
        }
        console.log("res", result);
        res.send(result);
      }
    );
  });

  app.delete("/profile", (req, res) => {
    console.log(req.body);
    db.collection("pomodoro").findOneAndDelete(
      { hour: req.body.hour, minute: req.body.minute, second: req.body.second },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  app.get("/login", function(req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/",
      failureFlash: true
    })
  );

  app.get("/signup", function(req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/signup",
      failureFlash: true
    })
  );

  app.get("/unlink/local", isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect("/profile");
    });
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
