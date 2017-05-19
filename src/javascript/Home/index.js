const Home = ({
  dailyBudget,
  dailyBudgetEditable,
  onEditChange,
  onDailyBudgetChange
}) => (
  <section>
    <div className="list text-center top-1">
      <p>
        Your Daily Budget is: $
        {dailyBudgetEditable?<TextField onChange={onDailyBudgetChange} type="number" hintText="Enter your daily budget"/>:<span>{dailyBudget}</span>}
        <FlatButton
          label="Edit"
          primary={true}
          onClick={onEditChange}
        />
      </p>
      <p>{`That's ${4 * dailyBudget} per week`}</p>
      <p>And ${30 * dailyBudget} per month </p>
    </div>
  </section>
);

export default Home;