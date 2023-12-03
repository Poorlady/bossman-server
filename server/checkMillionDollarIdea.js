const checkMillionDollarIdea = (req, res, next) => {
    const { numWeeks, weeklyRevenue } = req.body;
    if ((typeof numWeeks === 'string' || typeof weeklyRevenue === 'string') || (!numWeeks || !weeklyRevenue) || numWeeks * weeklyRevenue < 1000000) res.sendStatus(400);
    if (numWeeks * weeklyRevenue >= 1000000) {
        console.log("Million Dollar Idea");
        res.status(null);
        next();
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
