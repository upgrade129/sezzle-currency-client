import React ,{Component} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import './currency.css';

export default class Currency extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      fromCurrency: "USD",
      toCurrency: "GBP",
      amount: 1,
      currencies: [],
      fromId : "ALL",
      toId : "ALL"
    };
    console.log("axios");
  }
  componentDidMount() {
    axios
      .get("http://localhost:4200/rates")
      .then(response => {
        console.log(response.data.results)
        console.log(typeof(response.data.results))
        // const currencyAr = [];
        // for (const key in response.data.results) {
        //   currencyAr.push(key)
        // }
        this.setState({ currencies: response.data.results });
      })
      .catch(err => {
        console.log("oppps", err);
      });

  }
  convertHandler = () => {
    if (this.state.fromCurrency !== this.state.toCurrency) {
      var details ={
        fromCurrency : this.state.fromCurrency,
        toCurrency : this.state.toCurrency,
        amount : this.state.amount,
        fromId : this.state.fromId,
        toId : this.state.toId
      }
      axios
        .post("http://localhost:4200/base",details)
        .then(response => {
          console.log("base",response.data)
          const result =response.data[Object.keys(response.data)[0]];
          var res = [result]
          var final = (res[0].val)*this.state.amount
          console.log(final)
          this.setState({ result: final});
        })
        .catch(error => {
          console.log("error on base", error.message);
        });
    } else {
      this.setState({ result: "You cant convert the same currency!" });
    }
  };
  selectHandler = event => {
    if (event.target.name === "from") {
      this.setState({ fromCurrency: event.target.value });
      {Object.keys(this.state.currencies).map(i => {
        if(this.state.currencies[i].currencyName == event.target.value){
          console.log("from",this.state.currencies[i].id)
          return this.setState({fromId : this.state.currencies[i].id})
        }
      })}
    } else {
      if (event.target.name === "to") {
        this.setState({ toCurrency: event.target.value });
        {Object.keys(this.state.currencies).map(i => {
          if(this.state.currencies[i].currencyName == event.target.value){
            console.log("to",this.state.currencies[i].id)
            return this.setState({toId : this.state.currencies[i].id})
          }
        })}
      }
    }
  };
  render() {
    return(
    <Container component="main" maxWidth="xs">
      <div className="box">
        <Typography component="h1" variant="h5">
          Currency Converter
        </Typography>
        <form>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Amount"
            name="amount"
            value={this.state.amount}
            onChange={event => this.setState({ amount: event.target.value })}
            
          />
          <div>
          From : 
          <br/>
          <select
            name="from"
            onChange={event => this.selectHandler(event)}
            value={this.state.fromCurrency}
          >
            {Object.keys(this.state.currencies).map(i => (
              <option key={this.state.currencies[i].id}>{this.state.currencies[i].currencyName}</option>
            ))}
          </select>
          </div>
          <div>
          To :
          <br/>
          <select
            name="to"
            onChange={event => this.selectHandler(event)}
            value={this.state.toCurrency}
          >
            {Object.keys(this.state.currencies).map(i => (
              <option key={this.state.currencies[i].id}>{this.state.currencies[i].currencyName}</option>
            ))}
          </select>
          </div>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.convertHandler}
          >
            Convert
          </Button>
          <Typography component="h1" variant="h5">
          {this.state.result && <h3>{this.state.toCurrency}  {this.state.result}</h3>}
        </Typography>
        </form>
      </div>
    </Container>     
      )  }
}
