import Home from '../views/home/home.js'; 
import DailyBudget from '../views/daily-budget/daily-budget.js'; 
import Friends from '../views/friends/friends.js'; 
import Progress from '../views/progress/progress.js'; 

export default {
    home: {
        title: 'Home',
        Page: Home,
    },
    dailyBudget: {
        title: 'Daily Budget',
        Page: DailyBudget,
    },
    friends: {
        title: 'Friends',
        Page: Friends,
    },
    progress: {
        title: 'Progress',
        Page: Progress,
    }
}
