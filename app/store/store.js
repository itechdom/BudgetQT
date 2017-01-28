import {observable, computed} from 'mobx';

export class User {
    id;
    name;
    email;
    @observable dailyBudget;
    constructor(id,name,email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

export class Expense {
    @observable categoryList = [];
    expenseDate;
    amount;
}

export class Category {
    title;
    icon;
}

export class Reward {
    amount;
    rewardDate;
}

