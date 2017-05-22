import {observable, computed, autorun, action, reaction} from 'mobx';
import uuidV4 from 'uuid/v4';
import superagent from 'superagent';
import {HOST} from  "../.config.js";

export class BudgetQT {
  name;
  email;
  page = 1;
  itemsPerPage=10;
  originalExpenseList = [];
  monthOptions = [
    "jan","feb","march","april","may","june","july","aug","sept","october","nov","december"
  ];
  pendingRequestCount = 0;
  @observable expenseList = [];
  @observable expenseEditable=false;
  @observable deletedExpense = {};
  @observable editedExpense = {};
  @observable selectedRoute = 0;
  @observable filesAccepted = [];
  constructor(name,email) {
    this.name = name;
    this.email = email;
    this.expenseEditable = false;
    this.categoryList = [
      'All',
      'Dining',
      'Taxes'
    ];
    this.route = 0;
    this.filesAccepted = [];
    this.page=1;
    this.deletedExpense = {};
  }

  @computed get filterByDate(){
    return this.expenseList.filter(
      expense =>  expense.date === this.selectedDate
    );
  }

  @computed get filteredExpenses(){
    console.log(this.page);
    return 1;
  }

  @action uploadCSV() {
    this.pendingRequestCount++;
    let req = superagent.post(`${HOST}/api/v1/expenses/upload/csv`);
    this.filesAccepted.map((file) => {
      req.attach(file.name, file);
    });
    req.end(action("uploadCSV-callback", (error, results) => {
      if (error)
      console.error(error);
      else {
        const data = JSON.parse(results.text);
        console.log(data);
        this.pendingRequestCount--;
      }
    }));
  }

  @action exportExpensesCSV(){
    window.open(`${HOST}/api/v1/expenses/export/csv`,'_blank');
  }

  @action getExpenses(){
    this.pendingRequestCount++;
    let req = superagent.get(`${HOST}/api/v1/expenses`);
    req.end(action("getExpenses-callback",(err,res)=>{
      if(err){
        console.log("err: ",err);
      }
      let newExpenses = JSON.parse(res.text);
      this.originalExpenseList = newExpenses;
      this.expenseList.push(...newExpenses.slice(0,10));
    }));
  }

  @action updateExpense(expense) {
    this.pendingRequestCount++;
    let req = superagent.put(`${HOST}/api/v1/expenses`)
    .send(expense);
    req.end(action("updateExpense-callback", (error, results) => {
      if (error){
        console.error(error);
      }
      else {
        console.log(results);
        this.pendingRequestCount--;
      }
    }));
  }

  @action deleteExpense(expense) {
    this.pendingRequestCount++;
    let req = superagent.delete(`${HOST}/api/v1/expenses`)
    .send(expense);
    let removed = this.expenseList.remove(expense);
    req.end(action("deleteExpense-callback", (error, results) => {
      if (error){
        console.error(error);
        this.expenseList.push(expense);
      }
      else {
        console.log(results);
        this.pendingRequestCount--;
      }
    }));
  }

  @action getExpensesByPage(expenses,page){
    let currentPage = page * this.itemsPerPage;
    return expenses.slice(0,currentPage);
  }

  @action filterExpensesByTag(expenses,filter){
    if(filter !== "All"){
      return expenses.filter((expense)=>{
        return expense.tags.indexOf(filter) !== -1;
      });
    }
    return expenses;
  }

  @action filterExpensesByMonth(expenses,month){
    return expenses.filter((expense)=>{
      return (new Date(expense.date).getMonth()) === month;
    })
  }

}

export class Expense {
  id;
  date;
  title;
  amount;
  category;
  @observable tags;
  constructor(date,amount,category,title){
    this.id = uuidV4();
    this.date = date;
    this.amount = amount;
    this.category = category;
    this.title = title;
  }
}

export class Category {
  title;
  icon;
  constructor(title,icon){
    this.title = title;
    this.icon = icon;
  }
}

export class Reward {
  amount;
  rewardDate;
}
