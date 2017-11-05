/**
 * Insert an individual goal into the database
 */
exports.setIndividualGoal = ((goal, driver) => {
  /**
   * 1 = fam
   * 2 = ind
   */
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO goal (idgoaltype, customer_id, start_date, end_date, goal_description) VALUES(?, ?, ?, ?, ?)`;
    driver.query({
      sql: sqlQuery,
      values: [2, goal.customer_id, goal.start_date, goal.end_date, goal.goal_description]
    }, ((err, results) => {
      if (err) {
        reject(new Error(`Database error: ${err.stack}`));
      }
      else {
        resolve();
      }
    }));
  });
});
module.exports = exports;
