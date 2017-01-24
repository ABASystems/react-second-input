import React from 'react'
import Moment from 'moment'

import SecondInput from './second-input.jsx'

class StrictSecondInput extends React.Component {
  constructor(props) {
    super(props);

    this.updateValue = this.updateValue.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      ...this.state,
      text: '',
    };
    if (typeof this.props.value === 'undefined') {
      this.state.time = null;
    }
    else {
      this.state.time = this.props.value;
      if (this.state.time !== null) {
        this.state.text = Moment(this.props.value, 'x').format(this.props.format);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      if (typeof nextProps.value === 'undefined') {
        this.setState({
          time: null,
        });
      }
      else {
        if (nextProps.value === null) {
          this.setState({
            time: null,
            text: '',
          });
        }
        else {
          if (nextProps.value !== this.state.time) {
            this.setState({
              time: nextProps.value,
              text: Moment(nextProps.value, 'x').format(this.props.format),
            });
          }
        }
      }
    }
  }

  updateValue() {
    if (this.state.time !== null) {
      this.props.onChange(this.state.time);
    }
    else {
      this.props.onChange(this.state.text === '' ? null : undefined)
    }
  }

  handleTextChange(newText) {
    var parsedTime = Moment(newText, this.props.format);
    if (parsedTime.isValid()) {
      this.setState({
        time: parsedTime.format('x'),
        text: newText,
      }, this.updateValue);
    }
    else {
      this.setState({
        time: null,
        text: newText,
      }, this.updateValue);
    }
  }
  handleTimeChange(value, amount) {
    var newTime;
    if (this.state.time === null) {
      newTime = Moment().startOf('day');
    }
    else {
      newTime = Moment(this.state.time, 'x');
    }
    newTime.set(amount, value);
    this.setState({
      time: newTime.format('x'),
      text: newTime.format(this.props.format),
    }, this.updateValue);
  }
  handleBlur() {
    var parsedTime = Moment(this.state.text, this.props.format);
    if (parsedTime.isValid()) {
      this.setState({
        time: parsedTime.format('x'),
        text: parsedTime.format(this.props.format),
      }, this.updateValue);
    }
    else {
      this.setState({
        time: null,
        text: '',
      }, this.updateValue);
    }
  }

  render() {
    return (
      <SecondInput
        {...this.props}
        textValue={this.state.text}
        timeValue={this.state.time}
        onTextChange={this.handleTextChange}
        onTimeValueChange={this.handleTimeChange}
        onBlur={this.handleBlur}
      />
    );
  }
}
StrictSecondInput.defaultProps = {
  format: 'h:mm a',
};

export default StrictSecondInput
