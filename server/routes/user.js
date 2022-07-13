var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', async function(req, res, next) {
	try {
        let ret = [];
		const users = await User.find();
        for (let o of users) {
            ret.push([o._id, o.username]);
        }
        return res.send(ret);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.post('/create/', async function(req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        bcrypt.hash(password, 10, function(err, hash) {
            User.findOne({username: username}, function(err, obj) {
                if (obj == null) {
                    const user = new User({username: username, hash: hash});
                    user.save((err) => {
                        if (err) return res.status(500).send('Error saving user.');
                        return res.send('User successfully created!');
                    });
                } else {
                    return res.status(500).send('This username already exists.');
                }
            })
        })
    } catch (err) {
        return res.status(500).send(err);
    }
})

router.post('/login/', async function(req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        User.findOne({username: username}, function(err, obj) {
            if (obj == null) {
                return res.status(500).send('Error with login credentials');
            }
            let hash = obj.hash;
            bcrypt.compare(password, hash, function(err, result) {
                if (result) {
                    return res.send(obj._id);
                } else {
                    return res.status(500).send('Error with login credentials.');
                }
            })
        })
    } catch (err) {
        return res.status(500).send(err);
    }
})

module.exports = router;