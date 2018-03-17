import React from 'react';
import PropTypes from 'prop-types';

const Distance = (props) => {

  if(props.error) {
    return 'error'
  }
  
  if(props.loading) {
    return 'loading'
  }

  return (
    <div>
      <p>{props.data.distance}</p>
      <p>{props.data.duration}</p>
    </div>
  )

}

export default Distance
