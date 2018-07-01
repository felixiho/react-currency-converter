import React, { Component } from 'react';
import Select from 'react-select';
import update from 'immutability-helper';
import { Input, Row, Col } from 'antd';

class Converter extends Component {
    constructor(props) {
        super(props);
        this.amountToChange = this.amountToChange.bind(this);
        this.amountFromChange = this.amountFromChange.bind(this);
        this.convert = this.convert.bind(this);
        this.handleFromCurrencyChange = this.handleFromCurrencyChange.bind(this);
        this.handleToCurrencyChange = this.handleToCurrencyChange.bind(this);
        this.fetchCurrencies = this.fetchCurrencies.bind(this);
        this.state = {
            multipliers: [],
            from: '',// Currency type
            to: '', // currency type
            fromAmount: '',
            toAmount: '',
            toCurrency: '',
            currencies: [],
        };

    }

    fetchCurrencies() {
        const currencyList = [];
        fetch('https://free.currencyconverterapi.com/api/v5/currencies')
        .then(results=>  results.json())
        .then(currency=> {
            const countries = currency.results;
            Object.values(countries).map((currencies) => {
                let item = { value: currencies.id, label: currencies.currencyName };
                currencyList.push(item);    
            });
            this.setState({currencies: currencyList}); 

            // Set default to value to USD
            if (!this.state.to){
                this.setState(function(prevState){
                return {to: prevState.currencies[8]}
                });
            }
            // Set default from value to USD
            if (!this.state.from){
                this.setState(function(prevState){
                    return {from: prevState.currencies[72]}
                });
            }
            
            //Set initial amounts
            !this.state.toAmount && this.setState({toAmount: 1});
            // this.state.toAmount && this.convert(this.state.from.value, this.state.to.value, 'toAmount');
            let amountType = 'fromAmount';
            this.convert(this.state.to.value, this.state.from.value, amountType);
        });
        
        
    }
    
    componentDidMount() {
        // Fetch list of currencies and save to state
        this.fetchCurrencies();
    }

    amountToChange(e) {
        // Set state for new value and convert
        this.setState({toAmount: e.target.value});
        let amountType = 'fromAmount';
        this.convert(this.state.to.value, this.state.from.value, amountType);
    }

    amountFromChange(e) {
        // Set state for new value and convert
        this.setState({fromAmount: e.target.value});
        let amountType = 'toAmount';
        this.convert(this.state.from.value, this.state.to.value, amountType);

    }

    //Set state for from
    handleFromCurrencyChange(e) {
        this.setState({to: e});
        this.fetchCurrencies();
    }

    handleToCurrencyChange(e) {
        this.setState({from: e});
        this.fetchCurrencies();
    }
    // create exception for no currency is supplied.
    // sets  multiplier
    convert(fromCurrency , toCurrency, amountType) {
        const rates = []; //array of rates
        const queryfrom = fromCurrency + '_' + toCurrency;
        const queryto = toCurrency + '_' + fromCurrency;
        fetch('https://free.currencyconverterapi.com/api/v5/convert?q='
        + queryfrom + ',' + queryto + ' ')
        .then(results => results.json())
        .then(results => {
            const converter = results.results;
            for (let i in converter){
                rates.push(converter[i].val);
                
            }
            // set multipliers state
            let multipliers = update(this.state.multipliers, {$set: [rates[0], rates[1]]});
            this.setState({multipliers});
            const rate = this.state.multipliers[0];
            if (amountType === 'toAmount'){
                const newToValue = rate * this.state.fromAmount;
                this.setState({toAmount: newToValue});
            }
            if (amountType === 'fromAmount'){
                const newFromValue = rate * this.state.toAmount;
                this.setState({fromAmount: newFromValue});
            }
            
        });
        
    }

    render() {
        return (
            <div> 
                <Row>
                    <Col span={12} offset={6}>
                        <Input
                            placeholder="Amount" 
                            onChange={ this.amountToChange }
                            value={this.state.toAmount}
                            
                        />
                        <Select 
                            className="basic-single"
                            classNamePrefix="select"
                            value={this.state.to}
                            isClearable={true}
                            isSearchable={true}
                            name="Currencies"
                            onChange={this.handleFromCurrencyChange}
                            options={ this.state.currencies }
                        /> 
                    </Col>
                </Row>

                <h2>
                    ||
                </h2>

                <Row>
                    <Col span={12} offset={6}>
                        <Input
                            placeholder="Amount"
                            onChange={this.amountFromChange}
                            value={this.state.fromAmount}
                        />
                        <Select 
                            className="basic-single"
                            classNamePrefix="select"
                            value={this.state.from}
                            isClearable={true}
                            isSearchable={true}
                            name="Currencies"
                            onChange={ this.handleToCurrencyChange }
                            options={ this.state.currencies }
                        /> 
                    </Col>
                </Row>
                
            </div>
        )
    }
}


export default Converter;