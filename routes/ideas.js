const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
    ensureAuthenticated
} = require('../helpers/auth');


//Load Idea Model
require("../models/Ideas");
const Idea = mongoose.model("ideas");


// Idea Index Page
router.get("/", ensureAuthenticated, (req, res) => {
    Idea.find({})
        .lean()
        .sort({
            date: "desc",
        })
        .then(ideas => {
            res.render("ideas/index", {
                ideas: ideas,
            });
        });
});

// Add Idea Form Route
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("ideas/add");
});


//Edit Idea form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id,
    }).then(idea => {
        const {
            _id: id,
            title,
            details
        } = idea;
        console.log(title);

        res.render("ideas/edit", {
            idea: {
                id,
                title,
                details
            },
        });
    });
});

// Update Idea
router.post("/update/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    const {
        title,
        details
    } = req.body;
    let errors = [];

    if (!title) {
        errors.push({
            text: "Please add a title",
        });
    }
    if (!details) {
        errors.push({
            text: "Please add some details",
        });
    }

    if (errors.length > 0) {
        res.render(`/edit/${id}`, {
            errors: errors,
            title: title,
            details: details,
        });
    } else {
        Idea.findByIdAndUpdate({
                _id: id
            }, {
                title,
                details
            })
            .then(() => {
                req.flash('success_msg', 'Idea updated');
                res.redirect("/ideas");
            })
            .catch(err => {
                console.log(err);
            });
    }
});

// Process Form
router.post("/", ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({
            text: "Please add a title",
        });
    }
    if (!req.body.details) {
        errors.push({
            text: "Please add some details",
        });
    }

    if (errors.length > 0) {
        res.render("/add", {
            errors: errors,
            title: req.body.title,
            details: req.body.details,
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
        };
        new Idea(newUser).save().then(idea => {
            req.flash('success_msg', 'Idea added');
            res.redirect("/ideas");
        });
    }
});

//Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    //res.send('Delete');
    Idea.remove({
            _id: req.params.id
        })
        .then(() => {
            req.flash('success_msg', 'Idea removed');
            res.redirect("/ideas");
        });

});

module.exports = router;