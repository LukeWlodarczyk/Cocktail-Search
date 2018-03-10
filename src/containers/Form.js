import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getGeocode } from "../actions/index.js";
import PlacesAutocomplete from 'react-places-autocomplete';


const mapStateToProps = state => {
  return {
      info: state.info
   };
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    }
  }

  displayForecast = () => {
    const { weather } = this.props.info;
      return (!!weather) ? <p>{weather.forecast}</p> : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name } = this.state;
    this.props.getGeocode(name)
    this.setState({
      name: '',
    })
  }

  handleChange = (name) => {
    this.setState({ name })
  }

  handleSelect = (name) => {
    this.setState({ name })
  }

  handleEnter = (name) => {
    this.setState({ name })
    this.props.getGeocode(this.state.name)
  }

  renderSuggestion = ({ formattedSuggestion }) => (
    <div>
      <strong>{ formattedSuggestion.mainText }</strong>{' '}
      <small>{ formattedSuggestion.secondaryText }</small>
    </div>
  )

  onError = (status, clearSuggestions) => {
    console.log('Google Maps API returned error with status: ', status)
    clearSuggestions()
  }

  onFocus = () => {
    console.log('focus');
  }

  shouldFetchSuggestions = ({ value }) => value.length > 0

  render() {
    const { weather } = this.props.info;
    if(this.props.info.isLoading) {
      console.log(this.props.info);
      return 'Loading'
    }

    const inputProps = {
      value: this.state.name,
      onChange: this.handleChange,
      type: 'search',
      placeholder: 'Search Places...',
      autoFocus: true,
    }


    // const options = {
    //   location: new google.maps.LatLng(-34, 151),
    //   radius: 2000,
    //   types: ['address']
    // }

    const options = {
      types: ['(cities)'],
      // componentRestrictions: {country: "pl"}
    }

    return (

          <form onSubmit={this.handleSubmit}>
            <PlacesAutocomplete
              inputProps={inputProps}
              renderSuggestion={this.renderSuggestion}
              shouldFetchSuggestions={this.shouldFetchSuggestions}
              onFocus={this.onFocus}
              onSelect={this.handleSelect}
              onEnterKeyDown={this.handleEnter}
              onError={this.onError}
              options={options}
            />
            <input type='submit' value='Search'/>
            {this.displayForecast() ||  <p>Loading</p>}
          </form>

      )
  }
}

const Form1 = connect(mapStateToProps, { getGeocode })(Form);

Form1.propTypes = {

};

export default Form1;
