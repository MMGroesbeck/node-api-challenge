const express = require("express");

const ActionModel = require("../helpers/actionModel.js");

const router = express.Router();

// endpoints; root is /api/actions/

// GET "/" returns all actions

// GET "/:id" returns action with id

// DELETE "/:id" deletes an action

// PUT "/:id" updates an action

// middleware

function validateActionId(req, res, next) {
    if (req.params.id) {
        ActionModel.get(req.params.id)
        .then(thisAction => {
            if (thisAction) {
                req.action = thisAction;
                next();
            } else {
                res.status(404).json({ message: "Action not found." });
            }
        })
    } else {
        res.status(400).json({ message: "Action ID required." });
    }
}

module.exports = router;