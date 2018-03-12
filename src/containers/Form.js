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
      destination: '',
    }
  }

  displayForecast = () => {
    const { weather } = this.props.info;
      return (!!weather) ? <p>{weather.forecast}</p> : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { destination } = this.state;
    this.props.getGeocode(destination)
    this.setState({
      destination: '',
    });
  }

  handleChange = (destination) => {
    this.setState({ destination })
  }

  handleSelect = (destination) => {
    this.setState({ destination })
  }

  handleEnter = (destination) => {
    this.setState({ destination })
    this.props.getGeocode(this.state.destination)
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

    const destinationProps = {
      value: this.state.destination,
      name: 'destination',
      onChange: this.handleChange,
      type: 'search',
      placeholder: 'Search Places...',
      autoFocus: true,
    }

    const userLocationProps = {
      value: this.state.userLocation,
      name: 'userLocation',
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
              inputProps={destinationProps}
              renderSuggestion={this.renderSuggestion}
              shouldFetchSuggestions={this.shouldFetchSuggestions}
              onFocus={this.onFocus}
              onSelect={this.handleSelect}
              onEnterKeyDown={this.handleEnter}
              onError={this.onError}
              options={options}
            />
            <PlacesAutocomplete
              inputProps={userLocationProps}
              renderSuggestion={this.renderSuggestion}
              shouldFetchSuggestions={this.shouldFetchSuggestions}
              onFocus={this.onFocus}
              onSelect={this.handleSelect}
              onEnterKeyDown={this.handleEnter}
              onError={this.onError}
              options={options}
            />
            <input type='submit' value='Search'/>
          </form>

      )
  }
}

const Form1 = connect(mapStateToProps, { getGeocode })(Form);

Form1.propTypes = {

};

export default Form1;
