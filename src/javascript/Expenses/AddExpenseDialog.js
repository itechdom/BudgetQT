  const AddExpenseDialog = ({
    handleClose,
    handleOpen,
    open,
    handleSubmit,
    newExpense,
    categoryList
  }) => {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={handleSubmit}
      />,
    ];
    return (
      <div>
        <RaisedButton label="Add Expense" onClick={handleOpen} />
        <Dialog
          title="Add Expense"
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={handleClose}
          >
            <TextField onChange={(event,newValue)=>{newExpense.title = newValue}} type="text" required="true" hintText="Expense Title"/>
            <TextField onChange={(event,newValue)=>{newExpense.amount = newValue}} type="number" required="true" hintText="Expense Amount"/>
            <AutoComplete
              hintText="Expense Category"
              required="true"
              dataSource={categoryList.map(cat => cat.title)}
              onNewRequest={(chosenRequest,index)=>newExpense.category = categoryList[index]}
            />
          </Dialog>
        </div>
      );
    };
export default AddExpenseDialog;