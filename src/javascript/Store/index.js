import {observable, computed, autorun, action, reaction} from 'mobx';
import uuidV4 from 'uuid/v4';
import superagent from 'superagent';
import {HOST} from  "../.config.js";

export class User {
  name;
  email;
  page = 1;
  itemsPerPage=10;
  originalExpenseList = [];
  filterList = [];
  monthOptions = [
    "jan","feb","march","april","may","june","july","aug","sept","october","nov","december"
  ];
  @observable selectedFilter;
  @observable dailyBudget;
  @observable dailyBudgetEditable = false;
  @observable expenseList = [];
  @observable expenseEditable=false;
  @observable deletedExpense = {};
  @observable editedExpense = {};
  @observable categoryList=[];
  @observable selectedRoute = 0;
  @observable selectedDate = new Date();
  @observable filesAccepted = [];
  pendingRequestCount = 0;
  constructor(name,email,dailyBudget,dailyBudgetEditable,expenseEditable,categoryList,selectedRoute,selectedDate,filesAccepted) {
    this.name = name;
    this.email = email;
    this.dailyBudget = dailyBudget;
    this.dailyBudgetEditable = dailyBudgetEditable;
    this.expenseEditable = expenseEditable;
    this.categoryList = categoryList;
    this.selectedRoute = selectedRoute;
    this.selectedDate = selectedDate;
    this.filesAccepted = filesAccepted;
    this.page=1;
    this.expensePage=1;
    this.deletedExpense = {};
    this.selectedFilter = "All";
    this.filterList = [
      'All',
      'Dining',
      'Taxes'
    ]
  }

  @computed get filterByDate(){
    return this.expenseList.filter(
      expense =>  expense.date === this.selectedDate
    );
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

  @action filterExpenses(filter){
    let nextArr = [];
    this.expensePage = 1;
    this.selectedFilter = filter;
    nextArr = this.filterExpensesByTag(this.getNextExpenses(1),this.selectedFilter);
    this.expenseList.clear();
    return this.expenseList.push(...nextArr);
  }
  
  @action filterExpensesByMonth(month){
    let nextArr = [];
    this.selectedDate = new Date(`1/${month}/${new Date().getYear()}`);
    this.expensePage = 1;
    nextArr = this.filterArrayByMonth(this.getNextExpenses(1),month);
    this.expenseList.clear();
    return this.expenseList.push(...nextArr);
  }

  @action getExpensesByPage(){
    this.expensePage++;
    let nextArr = this.getNextExpenses(this.expensePage);
    let filteredExpenses = this.filterExpensesByTag(nextArr,this.selectedFilter);
    this.expenseList.clear();
    this.expenseList.push(...filteredExpenses);
  }

  getNextExpenses(page){
    let currentPage = this.expensePage * this.itemsPerPage;
    let nextArr = this.originalExpenseList.slice(0,currentPage);
    return nextArr;
  }

  filterExpensesByTag(arr,filter){
    if(filter !== "All"){
      let nextArr = arr.filter((expense)=>{
        return expense.tags.indexOf(filter) !== -1;
      });
      return nextArr;
    }
    return arr;
  }
  
  filterArrayByMonth(arr,month){
    let nextArr = arr.filter((expense)=>{
      return (new Date(expense.date).getMonth()+1) === month;
    })
    return nextArr;
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
