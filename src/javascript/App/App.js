import React from 'react';
import ReactDOM from 'react-dom';
import {
  observer
}
from "mobx-react";
import Dropzone from 'react-dropzone';
import {
  User,
  Expense,
  Category
}
from '../Store';
import {
  IntlProvider,
  FormattedDate
}
from 'react-intl';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  fade
}
from 'material-ui/utils/colorManipulator';
import * as colors from 'material-ui/styles/colors';

import {
  BrowserRouter as Router,
  Route,
  Link
}
from 'react-router-dom'

import {
  Tabs,
  Tab
}
from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
}
from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import {
  BottomNavigation,
  BottomNavigationItem
}
from 'material-ui/BottomNavigation';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
}
from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Stats from '../Stats';

import DevTools from 'mobx-react-devtools';

import injectTapEventPlugin from 'react-tap-event-plugin';

import 'normalize.css';
import '../Style/main.scss';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto,sans-serif',
  palette: {
    primary1Color: colors.grey900,
    primary2Color: colors.teal500,
    primary3Color: colors.grey400,
    accent1Color: colors.pinkA200,
    accent2Color: colors.grey100,
    accent3Color: colors.grey500,
    textColor: colors.darkBlack,
    alternateTextColor: colors.white,
    canvasColor: colors.white,
    borderColor: colors.grey300,
    disabledColor: fade(colors.darkBlack, 0.3),
    pickerHeaderColor: colors.cyan500,
    shadowColor: colors.fullBlack
  },
  appBar: {
    height: 'auto'
  },
  tabs: {
    backgroundColor: colors.grey700
  }
});

const styles = {
  title: {
    margin: '1em 0'
  },
  subTitle: {
    fontFamily: 'Roboto Slab',
    margin: '0 0 1em 0'
  },
  ctaButton: {
    width: '200px'
  },
  channels: {
    color: colors.deepPurple900
  }
};

@observer class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      deleteExpenseDialogOpen:false,
      editExpenseDialogOpen:false,
      selectedMonth:0
    }
  }
renderHome() {
  if (this.props.userStore.selectedRoute === 0) {
    let months = ["jan","feb","mar","april","may","june","july","august","september","october","november","december"];
    return <div style={{marginTop:10}}>
      <DropDownMenu value={this.state.selectedMonth} onChange={(event,index,value)=>{this.setState({selectedMonth:index});console.log(index,value)}}>
        {
          months.map((month,index)=>{
            return <MenuItem value={index} primaryText={month} />
          })
        }
      </DropDownMenu>
      <Expenses
        categoryList={this.props.userStore.categoryList}
        expenseList={this.props.userStore.expenseList}
        filterList={this.props.userStore.filterList}
        onFilter={(filter)=>{this.props.userStore.filterExpenses(filter);}}
        selectedDate={this.props.userStore.selectedDate}
        monthOptions={this.props.userStore.monthOptions}
        handleDateChange={(month)=>this.props.userStore.filterExpensesByMonth(month)}
        expenseEditable={this.props.userStore.expenseEditable}
        onExpenseOpen={(event)=>this.props.userStore.expenseEditable=true}
        onExpenseClose={(event)=>this.props.userStore.expenseEditable=false}
        onExpenseDelete={(expense)=>{console.log("EXPENSE:",expense);this.props.userStore.deleteExpense(expense);}}
        onExpenseEdit = {(expense)=>{console.log("EXPENSE EDITED:",expense);this.props.userStore.updateExpense(expense)}}
        onExpenseDownload = {()=>{this.props.userStore.exportExpensesCSV()}}
        newExpense={new Expense()}
        totalExpenses={this.props.userStore.totalExpenses}
        onNextPage={(event)=>{
          this.props.userStore.getExpensesByPage();
        }}
      />
      <DeleteExpenseDialog
        open={this.state.deleteExpenseDialogOpen}
        onAgree={()=>{this.props.userStore.deleteExpense();this.setState({deleteExpenseDialogOpen:false})}}
        onCancel={()=>this.setState({deleteExpenseDialogOpen:false})}
        expense={this.props.userStore.deletedExpense}
      />
      <ImportExpenses
        filesAccepted = {this.props.userStore.filesAccepted}
        onFileAccepted={((acceptedFiles)=>{
          this.props.userStore.filesAccepted.push(
            acceptedFiles[acceptedFiles.length - 1]
          );
        })}
        onFileUpload={(()=>{
          this.props.userStore.uploadCSV();
        })}
        onFileDelete={((file)=>{
          this.props.userStore.filesAccepted.remove(file);
        })
      }
    />
  </div>
}
}

renderStats(){
  if(this.props.userStore.selectedRoute === 1){
    return <Stats />
  }
}

render() {
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        <AppBar
          iconElementLeft={<span></span>}
          style={{textAlign:"center"}}
          title={
            <div style={styles.title}><h1 className="title">BudgetQT</h1>
            <h2>Welcome {this.props.userStore.name}!</h2>
          </div>}
        />
        <Menu
          selectedRoute={this.props.userStore.selectedRoute}
          changeRoute={(index)=>this.props.userStore.selectedRoute = index}
        />
        {this.renderHome()}
        {this.renderStats()}
        <DevTools />
        <Footer/>
      </div>
    </MuiThemeProvider>
  );
}
};

@observer class Expenses extends React.Component{

  state = {
    open: false,
    editOpen:false,
    importedExpense:{},
    editedExpense:{},
    selectedDate:new Date().getMonth()
  };
  
  constructor(props){
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };
  
  handleDateChange(event,index,value){
    this.props.handleDateChange(value);
    this.setState({selectedDate:value})
  }

  render(){
    return <section className="list text-center">
              <FormattedDate
        value={Date.now()}
        year='numeric'
        month='long'
        day='numeric'
        weekday='long'
      />
    <div className="grid center">
      <RaisedButton
        label="CSV"
        onClick={this.props.onExpenseDownload}
        icon={<FontIcon className="material-icons">file_download</FontIcon>}
      />
      <DropDownMenu
        onChange={this.handleDateChange}
        value={this.state.selectedDate}
      >
        {
          this.props.monthOptions.map((month,index)=>{
            return <MenuItem 
              value={index}
              primaryText={month}
            />
          })
        }
      </DropDownMenu>
    </div>

      <Tabs>
        {
          this.props.filterList.map((filter)=>{
            return <Tab
              label={filter}
              onClick={(event)=>{this.props.onFilter(filter)}}
            />
          })
        }
      </Tabs>
      <Table
        multiSelectable={true}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>Amount</TableHeaderColumn>
              <TableHeaderColumn>Title</TableHeaderColumn>
              <TableHeaderColumn>Tags</TableHeaderColumn>
              <TableHeaderColumn>Edit?</TableHeaderColumn>
              <TableHeaderColumn>Delete?</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            className="top-1"
            stripedRows={true}
            >
              {
                this.props.expenseList.map((expense,index) => (
                  <TableRow onMouseDown={()=>console.log("clicked")}>
                    <TableRowColumn>
                      <FormattedDate
                        value={expense.date}
                        year='numeric'
                        month='long'
                        day='numeric'
                      />
                    </TableRowColumn>
                    <TableRowColumn>{expense.amount}</TableRowColumn>
                    <TableRowColumn>{expense.title}</TableRowColumn>
                    <TableRowColumn>{expense.tags.map(tag=><Chip >{tag}</Chip>)}</TableRowColumn>
                    <TableRowColumn>
                      <RaisedButton
                        label={"edit"}
                        primary={true}
                        onClick={(event)=>{
                          this.setState({editOpen:true});
                          this.setState({editedExpense:expense});
                        }
                      }
                    />
                  </TableRowColumn>
                  <TableRowColumn>
                    <RaisedButton
                      label={"delete"}
                      secondary={true}
                      onClick={(event)=>{
                        this.setState({open:true});
                        this.setState({importedExpense:expense});
                      }
                    }
                  />
                </TableRowColumn>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <RaisedButton
        label={`load more ...`}
        onClick={this.props.onNextPage}
      />
      <EditExpenseDialog
        open={this.state.editOpen}
        handleSubmit={(event)=>{this.setState({editOpen:false});this.props.onExpenseEdit(this.state.editedExpense)}}
        handleClose={(event)=>{this.setState({editOpen:false})}}
        handleTagAdd={(expense,tag)=>{expense.tags.push(tag)}}
        expense={this.state.editedExpense}
      />
      <DeleteExpenseDialog
        open={this.state.open}
        onAgree={()=>{this.props.onExpenseDelete(this.state.importedExpense);this.setState({open:false})}}
        onCancel={()=>this.setState({open:false})}
        expense={this.state.importedExpense}
      />
    </section>
  }
}

const EditExpenseDialog = observer(({
  handleClose,
  open,
  handleSubmit,
  handleTagAdd,
  expense
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
      <Dialog
        title="Edit Expense"
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={handleClose}
        >
          <TextField onChange={(event,newValue)=>{expense.title = newValue}} type="text" required="true" hintText="Expense Title" defaultValue={expense.title}/>
          <TextField onChange={(event,newValue)=>{expense.amount = newValue}} type="number" required="true" hintText="Expense Amount" defaultValue={expense.amount}/>
          {
            expense.tags?expense.tags.map(tag => {
              return <TextField onChange={(event,newValue)=>{expense.tags[expense.tags.indexOf(tag)] = newValue}} type="text" required="true" hintText="Expense Tags" defaultValue={tag}/>
            }):<div>No Expense</div>
          }
          <FlatButton
            label="Add Tag"
            primary={true}
            onClick={(event)=>{handleTagAdd(expense,"")}}
          />
        </Dialog>
      </div>
    );
  });
  
    const ImportExpenses = observer(({
      onFileAccepted,
      onFileDelete,
      onFileUpload,
      filesAccepted
    }) => {
      return (
        <div>
          <Dropzone onDrop={((acceptedFiles,rejectedFiles)=>onFileAccepted(acceptedFiles))}>
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <RaisedButton onClick={onFileUpload} label="Import Files" primary={true}/>
          <div>Files Accepted:
            <ul>
              {
                filesAccepted.map(file =>{
                  return <li>{file.name}<RaisedButton label="Delete" secondary={true} onClick={()=>{onFileDelete(file)}} /></li>
                }
              )
            }
          </ul>
        </div>
      </div>
    );
  });

  const DeleteExpenseDialog = ({
    open,
    onAgree,
    onCancel,
    expense
  }) => {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={onCancel}
      />,
      <FlatButton
        label="Agree"
        primary={true}
        onClick={onAgree}
      />,
    ];
    return <Dialog
      title={`Are you sure you want to Delete ?`}
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={onCancel}
      >
        {expense.tags?expense.tags.join('-'):"no expense yet"}
      </Dialog>
    };

    const Rewards = () => (
      <div>Rewards</div>
    );

    const Friends = () => (
      <div>Friends</div>
    );

    const Footer = () => (
      <footer style={{marginTop:'4em', padding:'2em',textAlign:'center',backgroundColor:colors.grey300}}>
        <p>budgetqt</p>
      </footer>
    );

    const Menu = ({
      changeRoute,
      selectedRoute
    }) => (
      <Paper zDepth={1}>
        <BottomNavigation
          selectedIndex={selectedRoute}
          >
            <BottomNavigationItem
              icon={<FontIcon className="material-icons">home</FontIcon>}
              label="Home"
              data-route="/"
              onTouchTap={() => changeRoute(0)}
            />
            <BottomNavigationItem
              icon={<FontIcon className="material-icons">favorite</FontIcon>}
              label="Stats"
              data-route="/portfolio"
              onTouchTap={() => changeRoute(1)}
            />
            <BottomNavigationItem
              icon={<FontIcon className="material-icons">info</FontIcon>}
              label="Rewards"
              data-route="/progress"
              onTouchTap={() => changeRoute(2)}
            />
            <BottomNavigationItem
              icon={<MapsPersonPin />}
              label="Friends"
              data-route="/contact"
              onTouchTap={() => changeRoute(3)}
            />
          </BottomNavigation>
        </Paper>
      );


      //====================
      //-------------------
      // POPULATE STORE WITH INITIAL DATA
      //-------------------
      //===================

      let categoryList = [
        [new Category("gas", "gas")],
        [new Category("coffee", "coffee")],
        [new Category("groceries", "cart")],
        [new Category("food", "food")],
        [new Category("friends and family", "gift")],
        [new Category("dog", "dog")],
        [new Category("donation", "donation")],
        [new Category("medical", "ambulance")],
        [new Category("electronics", "electronic")],
        [new Category("online subscriptions", "electronic")],
        [new Category("utilities", "phone")],
        [new Category("vacation and travel", "beach")],
        [new Category("office supplies", "office")]
      ];

      let userStore = new User("Sam", "osamah.net.m@gmail.com", 13, false, false, categoryList, 0, Date.now(), []);
      userStore.getExpenses();

      ReactDOM.render(
        <IntlProvider locale="en">
          <App userStore={userStore} />
        </IntlProvider>,
        document.getElementById('app')
      );
