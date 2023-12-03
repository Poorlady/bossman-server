const express = require('express');
const apiRouter = express.Router();
const {
    createMeeting,
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
    deleteAllFromDatabase
} = require('./db');
const checkMillionDollarIdea = require("./checkMillionDollarIdea");
// GET /api/minions to get an array of all minions.
// POST /api/minions to create a new minion and save it to the database.
// GET /api/minions/:minionId to get a single minion by id.
// PUT /api/minions/:minionId to update a single minion by id.
// DELETE /api/minions/:minionId to delete a single minion by id.

apiRouter.route('/minions')
    .get((req, res, next) => {
        res.json(getAllFromDatabase('minions'));
    })
    .post((req, res, next) => {
        // console.log(req.body);
        if (!req.body.name || !req.body.title || !req.body.title || !req.body.salary) {
            const error = new Error('Please fill all the needed data!');
            error.status = 409;
            next(error);
        }
        const result = addToDatabase('minions', { ...req.body });
        res.status(201).send(result);
    });

apiRouter.route('/minions/:minionId')
    .get((req, res, next) => {
        const id = req.params.minionId;
        const data = getFromDatabaseById('minions', id);
        if (!data || Number(id) === NaN) res.sendStatus(404);
        res.json(data);
    })
    .put((req, res, next) => {
        const id = req.params.minionId;
        let data = getFromDatabaseById('minions', id);
        if (!data)
            res.sendStatus(404).json({ message: "Not Found" });
        // console.log(data);
        data = { ...data, ...req.body };
        // console.log(data);
        const result = updateInstanceInDatabase('minions', data);
        res.json(result);
    })
    .delete((req, res, next) => {
        const id = req.params.minionId;
        const isDeleted = deleteFromDatabasebyId('minions', id);
        if (!isDeleted)
            res.sendStatus(404).json("Id is not valid");
        res.status(204).json("data has been deleted");
    });

// GET /api/ideas to get an array of all ideas.
// POST /api/ideas to create a new idea and save it to the database.
// GET /api/ideas/:ideaId to get a single idea by id.
// PUT /api/ideas/:ideaId to update a single idea by id.
// DELETE /api/ideas/:ideaId to delete a single idea by id.

apiRouter.route('/ideas')
    .get((req, res, next) => {
        res.json(getAllFromDatabase('ideas'));
    })
    .post(checkMillionDollarIdea, (req, res, next) => {
        const body = req.body;
        const { name, description, numWeeks, weeklyRevenue } = body;
        if (!name || !description || !numWeeks || !weeklyRevenue) {
            const err = new Error("please fill all the required data!");
            err.status = 409;
            next(err);
        }
        const result = addToDatabase('ideas', { ...req.body });
        res.status(201).json(result);
    });
apiRouter.route('/ideas/:ideaId')
    .get((req, res, next) => {
        const id = req.params.ideaId;
        const data = getFromDatabaseById('ideas', id);
        if (!data || Number(id) === NaN) res.sendStatus(404);
        res.json(data);
    })
    .put(checkMillionDollarIdea, (req, res, next) => {
        const id = req.params.ideaId;
        let data = getFromDatabaseById('ideas', id);
        if (!data)
            res.sendStatus(404).json({ message: "Not Found" });
        // console.log(data);
        data = { ...data, ...req.body };
        // console.log(data);
        const result = updateInstanceInDatabase('ideas', data);
        res.status(200).json(result);
    })
    .delete((req, res, next) => {
        const id = req.params.ideaId;
        const result = deleteFromDatabasebyId('ideas', id);
        if (!result)
            res.sendStatus(404).json("Not Found");
        res.status(204).json('data has been deleted');
    });

// /api/meetings
// GET /api/meetings to get an array of all meetings.
// POST /api/meetings to create a new meeting and save it to the database.
// DELETE /api/meetings to delete all meetings from the database.
apiRouter.route('/meetings')
    .get((req, res, next) => {
        res.json(getAllFromDatabase('meetings'));
    })
    .post((req, res, next) => {
        const result = createMeeting();
        addToDatabase("meetings", result);
        res.status(201).json(result);
    })
    .delete((req, res, next) => {
        const result = deleteAllFromDatabase('meetings');
        res.status(204).json(result);
    });

module.exports = apiRouter;
