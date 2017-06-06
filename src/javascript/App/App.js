import React from 'react';
import ReactDOM from 'react-dom';
import {
  observer
}
from "mobx-react";
import {
  BudgetQT,
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
import ImportExpenses from '../Expenses/ImportExpenses.js';

import DevTools from 'mobx-react-devtools';

import injectTapEventPlugin from 'react-tap-event-plugin';

import 'normalize.css';
import '../Style/main.scss';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto,sans-serif',
  palette: {
    primary1Color: colors.blue500,
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
    if (this.props.store.route === 0) {
      return <div style={{marginTop:10}}>
        <Expenses
          expenseList={this.props.store.expenseList}
          total={this.props.store.total}
          tagList={this.props.store.tagList}
          onTagChange={(tag)=>{this.props.store.tag=tag;this.props.store.filterExpenses();}}
          page={this.props.store.page}
          onFilter={(filter)=>{this.props.store.filterExpenses();}}
          monthOptions={this.props.store.monthOptions}
          handleDateChange={(month)=>{this.props.store.month = month;this.props.store.filterExpenses();}}
          expenseEditable={this.props.store.expenseEditable}
          onExpenseOpen={(event)=>this.props.store.expenseEditable=true}
          onExpenseClose={(event)=>this.props.store.expenseEditable=false}
          onExpenseDelete={(expense)=>{console.log("EXPENSE:",expense);this.props.store.deleteExpense(expense);}}
          onExpenseEdit = {(expense)=>{console.log("EXPENSE EDITED:",expense);this.props.store.updateExpense(expense)}}
          onExpenseDownload = {()=>{this.props.store.exportExpensesCSV()}}
          newExpense={new Expense()}
          totalExpenses={this.props.store.totalExpenses}
          onNextPage={(event)=>{
            this.props.store.page++;
            this.props.store.filterExpenses();
          }}
          onPrevPage={(event)=>{
            this.props.store.page--;
            this.props.store.filterExpenses();
          }}
        />
        <DeleteExpenseDialog
          open={this.state.deleteExpenseDialogOpen}
          onAgree={()=>{this.props.store.deleteExpense();this.setState({deleteExpenseDialogOpen:false})}}
          onCancel={()=>this.setState({deleteExpenseDialogOpen:false})}
          expense={this.props.store.deletedExpense}
        />

      </div>
    }
  }

  renderStats(){
    if(this.props.store.route === 1){
      return <Stats />
    }
  }

  renderImport(){
    if(this.props.store.route === 2){
      return <ImportExpenses
        filesAccepted = {this.props.store.filesAccepted}
        onFileAccepted={((acceptedFiles)=>{
          this.props.store.filesAccepted.push(
            acceptedFiles[acceptedFiles.length - 1]
          );
        })}
        onFileUpload={(()=>{
          this.props.store.uploadCSV();
        })}
        onFileDelete={((file)=>{
          this.props.store.filesAccepted.remove(file);
        })
      }
    />
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
            <h2>Welcome {this.props.store.name}!</h2>
          </div>}
        />
        <Menu
          selectedRoute={this.props.store.route}
          changeRoute={(index)=>this.props.store.route = index}
        />
        {this.renderHome()}
        {this.renderStats()}
        {this.renderImport()}
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
        {this.props.total}
        <RaisedButton
          label="CSV"
          onClick={this.props.onExpenseDownload}
          icon={<FontIcon className="material-icons">file_download</FontIcon>}
        />
        <RaisedButton
          label={`<`}
          onClick={this.props.onPrevPage}
        />
        {this.props.page}
        <RaisedButton
          label={`>`}
          onClick={this.props.onNextPage}
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
            this.props.tagList.map((filter)=>{
              return <Tab
                label={filter}
                onClick={(event)=>{this.props.onTagChange(filter)}}
              />
            })
          }
        </Tabs>
        <Table
          height={'500px'}
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
              icon={<FontIcon className="material-icons">trending_up</FontIcon>}
              label="Stats"
              data-route="/portfolio"
              onTouchTap={() => changeRoute(1)}
            />
            <BottomNavigationItem
              icon={<FontIcon className="material-icons">backup</FontIcon>}
              label="Import"
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


      let BudgetQTStore = new BudgetQT("Sam", "osamah.net.m@gmail.com");
      BudgetQTStore.getExpenses();

      ReactDOM.render(
        <IntlProvider locale="en">
          <App store={BudgetQTStore} />
        </IntlProvider>,
        document.getElementById('app')
      );
