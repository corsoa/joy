/**
 * An "Objective" is the combination of a (individual) goal and n (individual) budgets, which will be saved via a single API call.
 */
const Joi = require('joi');
const budgetController = require('./budget');
const Promise = require('bluebird');
const goalController = require('./goal');

exports.setObjective = ((req, res) => {
  const schema = Joi.object().keys({
    goal: Joi.object().required(),
    budgets: Joi.array()
  });
  Joi.validate(req.body, schema, ((err, result) => {
    if (err) {
      res.status(500).send(`Schema validation error: ${err}`);
    }
    else {
      let allPromises = [];
      req.body.budgets.forEach((budget) => {
        //set the customer_id onto each subobject
        budget.customer_id = req.params.customer_id;
        allPromises.push(budgetController.setBudgetStandalone(budget, req.driver));
      });
      req.body.goal.customer_id = req.params.customer_id;
      allPromises.push(goalController.setIndividualGoal(req.body.goal, req.driver));
      Promise.all(allPromises).then(() => {
        res.sendStatus(200);
      }).catch((err) => {
        console.error(err);
        res.status(500).send(`Aggregate error: ${err}`);
      });
    }
  }));
});
module.exports = exports;
