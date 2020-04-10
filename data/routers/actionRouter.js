const express = require("express");

const ActionModel = require("../helpers/actionModel.js");

const router = express.Router();

// endpoints; root is /api/actions/

// GET "/" returns all actions
router.get("/", (req, res) => {
    ActionModel.get()
      .then((actions) => {
          if (actions) {
              res.json(actions);
          } else {
              res.status(404).json({ message: "No actions found." });
          }
      })
      .catch((err) => {
        res.status(500).json({ message: "Error retrieving actions." });
      });
  });

// GET "/:id" returns action with id
router.get("/:id", validateActionId, (req, res) => {
    res.json(req.action);
});

// DELETE "/:id" deletes an action
router.delete("/:id", validateActionId, (req, res) => {
    ActionModel.remove(req.params.id)
    .then((count) => {
      switch (count) {
        case 0:
          res.status(500).json({ message: "Error: no action deleted." });
          break;
        case 1:
          res.json({ message: "Action deleted." });
          break;
        default:
          res.status(500).json({ message: "Error: multiple actions deleted." });
          break;
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error deleting action." });
    });
  });

// PUT "/:id" updates an action
router.put("/:id", validateActionId, (req, res) => {
    ActionModel.update(req.params.id, req.body)
    .then(updatedAction => {
        if (updatedAction) {
            res.json(updatedAction);
        } else {
            res.status(404).json({ message: "Error: action not found." });
        }
    })
    .catch(err => {
        res.status(500).json({ message: "Error updating action." });
    })
})

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