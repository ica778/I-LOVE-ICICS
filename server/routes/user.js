var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Sentence = require('../models/sentence');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let ret = [];
    const users = await User.find();
    for (let o of users) {
      ret.push({ _id: o._id, username: o.username, password: o.password });
    }
    return res.send(ret);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// search users
// INPUT: :id = username
router.get('/:id', async function (req, res, next) {
  try {
    let ret = [];
    const users = await User.find({ username: { $regex: req.params.id } });
    for (let o of users) {
      ret.push({ _id: o._id, username: o.username, password: o.password });
    }
    console.log(JSON.stringify(ret));
    return res.send(ret);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/:id/username', async function (req, res, next) {
  try {
    const data = await User.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'No user found' });
    return res.json(data.username);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/:id/sentences', async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(500).send('User does not exist.');
    await (
      await user.populate('submittedSentences', 'text comments')
    ).populate('savedSentences', 'text comments');
    return res.send({
      submittedSentences: user.submittedSentences,
      savedSentences: user.savedSentences,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.put('/:id/save/:sentenceid', async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    const sentence = await Sentence.findById(req.params.sentenceid);

    user.savedSentences.push(sentence._id);
    console.log(`pushed ${sentence._id} to user ${user._id}`);
    await user.save();
    return res.send(sentence);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/create/', async function (req, res, next) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    bcrypt.hash(password, 10, function (err, hash) {
      User.findOne({ username: username }, function (err, obj) {
        if (obj == null) {
          const user = new User({ username: username, hash: hash });
          user.save(err => {
            if (err) return res.status(500).send('Error saving user.');
            return res.send(user._id);
          });
        } else {
          return res.status(500).send('This username already exists.');
        }
      });
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/login/', async function (req, res, next) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    User.findOne({ username: username }, function (err, obj) {
      if (!obj) {
        return res.status(500).send('Error with login credentials');
      }
      let hash = obj.hash;
      bcrypt.compare(password, hash, function (err, result) {
        if (result) {
          return res.send(obj._id);
        } else {
          return res.status(500).send('Error with login credentials.');
        }
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

// TODO: make update by _id instead of username, currently use _id because User.updateOne doesn't work with _id
router.put('/update/', async function (req, res, next) {
  try {
    if (req.body.username) {
      const user = await User.updateOne(
        { username: req.body.id },
        { $set: { username: req.body.username } }
      );
      return res.send(user);
    } else if (req.body.password) {
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const user = await User.updateOne(
        { username: req.body.id },
        { $set: { hash: hashedPass } }
      );
      return res.send(user);
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
