const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user");

const API_KEY = process.env.SENDGRID_API_KEY;
const VERIFIED_EMAIL = process.env.SENDGRID_VERIFIED_EMAIL;

sgMail.setApiKey(API_KEY);

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    errorMessage: req.flash("error")[0],
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    errorMessage: req.flash("error")[0],
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid Email or Password!");
      return res.redirect("/login");
    }
    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (passwordCorrect) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save((err) => {
        console.log(err);
        return res.redirect("/");
      });
    }
    if (!passwordCorrect) {
      req.flash("error", "Invalid Email or Password!");
      return res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password !== confirmPassword) {
      req.flash("error", "Passwords Do Not Match!");
      return res.redirect("/signup");
    }

    let userCreated;
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      req.flash("error", "User Already Exists!");
      return res.redirect("/signup");
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      userCreated = await user.save();
    }

    if (userCreated) {
      const msg = {
        to: email, // Change to your recipient
        from: VERIFIED_EMAIL, // Change to your verified sender
        subject: "Sign Up Successful",
        text: "Congratulations on signing up! ",
        html: "<h1>Sign Up was successful!</h1>",
      };
      const messageSent = await sgMail.send(msg);
      console.log(messageSent);
      res.redirect("/login");
    }
  } catch (err) {
    console.log("***ERROR*** controllers/auth.js -> postSignup");
    console.log(err);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    docTitle: "Reset Password",
    errorMessage: req.flash("error")[0],
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      req.flash("error", "Something went wrong!");
      console.log(err);
      return res.redirect("/reset");
    }
    try {
      const token = buffer.toString("hex");
      const user = await User.findOne({ email: req.body.email });
      let userResetTokenSaved;

      if (!user) {
        req.flash("error", "User with this email does not exist!");
        return res.redirect("/reset");
      }
      if (user) {
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        userResetTokenSaved = await user.save();
      }

      if (userResetTokenSaved) {
        const msg = {
          to: user.email, // Change to your recipient
          from: "lukas.ring@gmail.com", // Change to your verified sender
          subject: "Password Reset",
          html: `
            <p>You have requested to reset your password</p>
            <p><a href="http://localhost:3000/reset/${token}">Click Here</a> to reset your password</p>
          `,
        };
        const messageSent = await sgMail.send(msg);
        console.log(messageSent);
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetToken: { $gt: Date.now() },
    });

    if (user) {
      res.render("auth/new-password", {
        path: "/new-password",
        docTitle: "New Password",
        userId: user._id.toString(),
        passwordToken: token,
        errorMessage: req.flash("error")[0],
      });
    }
    if (!user) {
      req.flash("error", "User does not exist or reset token expired!");
      return res.redirect("/reset");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const confirmNewPassword = req.body.confirmPassword;
  const token = req.body.passwordToken;
  const userId = req.body.userId;
  let passwordReset;

  if (newPassword !== confirmNewPassword) {
    req.flash("error", "Passwords must match!");
    return res.redirect(`/reset/${token}`);
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetToken: { $gt: Date.now() },
      _id: userId,
    });

    if (!user) {
      req.flash("error", "Could not find matching user!");
      return res.redirect(`/reset/${token}`);
    }

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      passwordReset = await user.save();
    }
    if (user && passwordReset) {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
};
