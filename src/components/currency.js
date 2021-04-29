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
      currencies: []
    };
    console.log("axios");
  }
  componentDidMount() {
    axios
      .get("http://localhost:4200/rates")
      .then(response => {
        const currencyAr = ["EUR"];
        for (const key in response.data.rates) {
          currencyAr.push(key);
        }
        this.setState({ currencies: currencyAr });
      })
      .catch(err => {
        console.log("oppps", err);
      });
  }
  convertHandler = () => {
    if (this.state.fromCurrency !== this.state.toCurrency) {
      var details ={
        fromCurrency : this.state.fromCurrency,
        toCurrency : this.state.toCurrency
      }
      axios
        .post("http://localhost:4200/base",details)
        .then(response => {
          const result =
            this.state.amount * response.data.rates[this.state.toCurrency];
          this.setState({ result: result.toFixed(5) });
        })
        .catch(error => {
          console.log("Opps", error.message);
        });
    } else {
      this.setState({ result: "You cant convert the same currency!" });
    }
  };
  selectHandler = event => {
    if (event.target.name === "from") {
      this.setState({ fromCurrency: event.target.value });
    } else {
      if (event.target.name === "to") {
        this.setState({ toCurrency: event.target.value });
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
          From : 
          <select
            name="from"
            onChange={event => this.selectHandler(event)}
            value={this.state.fromCurrency}
          >
            {this.state.currencies.map(cur => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
          To :
          <select
            name="to"
            onChange={event => this.selectHandler(event)}
            value={this.state.toCurrency}
          >
            {this.state.currencies.map(cur => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
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
