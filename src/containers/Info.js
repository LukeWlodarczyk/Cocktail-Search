import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Distance from '../components/Distance';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    loading: state.info.loading,
    error: state.info.error,
    weather: state.info.weather,
    distance: state.info.distance,
  }
}

class InfoPlaces extends Component {

  render() {
      // console.log(this.props.weather);
      // console.log(this.props.distance.rows);
      // console.log(this.props.loading);
      // console.log(this.props.error);
      const { loading, error, weather, distance } = this.props;

    return (
      <div>
        <Distance loading={loading.distance} error={error.distance} data={distance} />
      </div>
    )
  }
}

const Info = connect(mapStateToProps)(InfoPlaces);

export default Info;
