const express = require("express");

const ProjectModel = require("../helpers/ProjectModel.js");

const router = express.Router();

// endpoints; root is /api/projects/
// helper methods: get([id]), insert({project}), update(id, {project}), remove(id), getProjectActions(id)

// GET "/" returns all projects
router.get("/", (req, res) => {
    ProjectModel.get()
    .then(projects => {
        res.json(projects);
    })
    .catch(err => {
        res.status(500).json({ message: "Error retrieving projects." });
    })
})

// GET "/:id" returns project with id
router.get("/:id", validateProjectId, (req, res) => {
    res.json(req.project);
})

// GET "/:id/actions" returns actions associated with project
router.get("/:id/actions", validateProjectId, (req, res) => {
    ProjectModel.getProjectActions(req.params.id)
    .then( actions => {
        if (actions) {
            res.json(actions);
        } else {
            res.status(404).json({ message: "No actions found for this project." });
        }
    })
    .catch( err => {
        res.status(500).json({ message: "Error retrieving actions." });
    })
})

// POST "/" adds project

// POST "/:id/actions" adds action to project

// DELETE "/:id" deletes a project

// PUT "/:id" updates a project

// middleware

function validateProjectId(req, res, next) {
    if (req.params.id) {
        ProjectModel.get(req.params.id)
        .then(thisProject => {
            if (thisProject) {
                req.project = thisProject;
                next();
            } else {
                res.status(404).json({ message: "Project not found." });
            }
        })
    } else {
        res.status(400).json({ message: "Project ID required." });
    }
}

// project requires name, description
function validateProject(req, res, next) {
    if (req.body) {
        if (req.body.name) {
            if (req.body.description) {
                next();
            } else {
                res.status(400).json({ message: "Project description required." });
            }
        } else {
            res.status(400).json({ message: "Project name required." });
        }
    } else {
        res.status(400).json({ message: "Project name and description required." });
    }
}

// action requires project_id, description (max 128 char), notes
function validateAction(req, res, next) {
    if (req.body) {
        if (req.body.project_id){
            if (req.body.description){
                if (req.body.description.length <= 128) {
                    if (req.body.notes) {
                        next();
                    } else {
                        res.status(400).json({ message: "Action notes required." });
                    }
                } else {
                    res.status(400).json({ message: "Description must be 128 characters max." });
                }
            } else {
                res.status(400).json({ message: "Action description required." });
            }
        } else {
            res.status(400).json({ message: "Action project_id required." });
        }
    } else {
        res.status(400).json({ message: "Action info required." });
    }
}

module.exports = router;