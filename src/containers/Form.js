import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getInfo } from "../actions/index.js";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';


const mapStateToProps = state => {
  return {
      info: state.info
   };
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place: '',
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { getInfo } = this.props;
    geocodeByAddress(this.state.place)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => getInfo({ lat, lng }))
      .catch( e => console.log(e))

    // getInfo(this.state.place);
  }

  handleChange = (place) => {
    this.setState({ place })
  }

  handleSelect = (place) => {
    this.setState({ place })
  }

  handleEnter = (place) => {
    this.setState({ place })
    const { getInfo } = this.props;
    getInfo(place);
  }


  displayForecast = () => {
    const { weather } = this.props.info;
      return (!!weather) ? <p>{weather.forecast}</p> : null;
  };

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

  shouldFetchSuggestions = ({ value }) => value.length > 0

  render() {
    const { weather } = this.props.info;
    if(this.props.info.isLoading) {
      console.log(this.props.info);
      return 'Loading'
    }

    const inputProps = {
      value: this.state.place,
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

const Form1 = connect(mapStateToProps, { getInfo })(Form);

Form1.propTypes = {

};

export default Form1;
