import React from 'react'
import moment from 'moment'
import classNames from 'classnames'

const CLOCK_1_RING_MARGIN = 25;
const CLOCK_2_RING_OUTER_MARGIN = 20;
const CLOCK_2_RING_INNER_MARGIN = 45;

class Item extends React.Component {
  handleClick() {
    if (typeof this.props.setTimeValue !== 'function') {
      return;
    }
    this.props.setTimeValue(this.props.number, this.props.amount);
  }

  render() {
    var angle = this.props.angle;
    var margin = this.props.margin;

    return (
      <div
        className={classNames('item', {
          active: this.props.active,
        })}
        style={{
          top: `${50 - (Math.cos(angle * 2 * Math.PI) * (50 - (margin / 2)))}%`,
          left: `${50 + (Math.sin(angle * 2 * Math.PI) * (50 - (margin / 2)))}%`,
        }}
        onClick={this.handleClick.bind(this)}
      >
        {this.props.number}
      </div>
    );
  }
}

class SecondInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,

      clockOpen: false,
      currentPane: 'hours',
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handlePageClick.bind(this));
    this.refs.textValue.addEventListener('blur', this.handleBlur.bind(this));
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handlePageClick.bind(this));
    this.refs.textValue.removeEventListener('blur', this.handleBlur.bind(this));
  }
  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.clockOpen
      && !nextState.clockOpen
      && typeof nextProps.onBlur === 'function'
    ) {
      nextProps.onBlur();
    }
  }

  handlePageClick() {
    if (
      this.refs.widget
      && this.state.clockOpen
      && !(this.refs.widget !== event.target && this.refs.widget.contains(event.target))
    ) {
      this.hideClock();
    }
  }
  handleBlur(event) {
    if (this.state.clockOpen && event.relatedTarget !== null) {
      this.hideClock();
    }
  }

  showClock() {
    this.setState({clockOpen: true,});
  }
  hideClock() {
    this.setState({clockOpen: false,});
  }

  renderSecondsFace() {
    var currentTime = null;
    if (this.props.timeValue !== null) {
      currentTime = moment(this.props.timeValue, 'x');
    }

    var activeFound = false;
    var seconds = [];
    for (var second = 0; second < 60; second += 5) {
      var active = (currentTime !== null && currentTime.seconds() == second);
      if (active) {
        activeFound = true;
      }
      seconds.push(
        <Item
          key={`second-${second}`}
          angle={second / 60}
          margin={CLOCK_1_RING_MARGIN}
          number={second}
          amount="seconds"
          setTimeValue={(number, amount) => {
            this.props.onTimeValueChange(number, amount);
          }}
          active={active}
        />
      );
    }
    if (!activeFound && currentTime !== null) {
      var second = currentTime.seconds();
      seconds.push(<Item
        key={`second-${second}`}
        angle={second / 60}
        margin={CLOCK_1_RING_MARGIN}
        number={second}
        amount="seconds"
        active={true}
      />);
    }
    var style = {};
    if (this.state.currentPane !== 'seconds') {
      style.display = 'none';
    }
    return (<div style={style}>
      {seconds}
    </div>);
  }
  renderMinutesFace() {
    var currentTime = null;
    if (this.props.timeValue !== null) {
      currentTime = moment(this.props.timeValue, 'x');
    }

    var activeFound = false;
    var minutes = [];
    for (var minute = 0; minute < 60; minute += 5) {
      var active = (currentTime !== null && currentTime.minutes() == minute);
      if (active) {
        activeFound = true;
      }
      minutes.push(
        <Item
          key={`min-${minute}`}
          angle={minute / 60}
          margin={CLOCK_1_RING_MARGIN}
          number={minute}
          amount="minutes"
          setTimeValue={(number, amount) => {
            this.props.onTimeValueChange(number, amount);
            this.setState(state => {
              state.currentPane = 'seconds';
              return state;
            });
          }}
          active={active}
        />
      );
    }
    if (!activeFound && currentTime !== null) {
      var minute = currentTime.minutes();
      minutes.push(<Item
        key={`minute-${minute}`}
        angle={minute / 60}
        margin={CLOCK_1_RING_MARGIN}
        number={minute}
        amount="minutes"
        active={true}
      />);
    }
    var style = {};
    if (this.state.currentPane !== 'minutes') {
      style.display = 'none';
    }
    return (<div style={style}>
      {minutes}
    </div>);
  }
  renderHoursFace() {
    var currentTime = null;
    if (this.props.timeValue !== null) {
      currentTime = moment(this.props.timeValue, 'x');
    }

    var hours = [];
    for (var hour = 0; hour < 24; hour += 1) {
      var active = (currentTime !== null && currentTime.hours() == hour);
      var margin;
      if (hour < 12) {
        margin = CLOCK_2_RING_INNER_MARGIN;
      }
      else {
        margin = CLOCK_2_RING_OUTER_MARGIN;
      }
      hours.push(
        <Item
          key={`hour-${hour}`}
          angle={hour / 12}
          margin={margin}
          number={hour}
          amount="hours"
          setTimeValue={(number, amount) => {
            this.props.onTimeValueChange(number, amount);
            this.setState(state => {
              state.currentPane = 'minutes';
              return state;
            });
          }}
          active={active}
        />
      );
    }
    var style = {};
    if (this.state.currentPane !== 'hours') {
      style.display = 'none';
    }
    return (<div style={style}>
      {hours}
    </div>);
  }
  renderClock() {
    if (!this.state.clockOpen) {
      return null;
    }

    return (
      <div className="clock">
        <div className="header">
          <div
            onClick={() => {this.setState({currentPane: 'hours',});}}
            className={classNames({
              selected: (this.state.currentPane === 'hours'),
            })}
          >
            Hrs
          </div>
          <div
            onClick={() => {this.setState({currentPane: 'minutes',});}}
            className={classNames({
              selected: (this.state.currentPane === 'minutes'),
            })}
          >
            Min
          </div>
          <div
            onClick={() => {this.setState({currentPane: 'seconds',});}}
            className={classNames({
              selected: (this.state.currentPane === 'seconds'),
            })}
          >
            Sec
          </div>
        </div>
        <div className="face">
          {this.renderHoursFace()}
          {this.renderMinutesFace()}
          {this.renderSecondsFace()}
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="rendered-react-second-input" ref="widget">
        <input
          ref="textValue"
          type="text"
          value={this.props.textValue}
          className="form-control"
          onFocus={this.showClock.bind(this)}
          onChange={() => {this.props.onTextChange(this.refs.textValue.value);}}
          placeholder={this.props.placeholder}
        />
        {this.renderClock()}
      </div>
    );
  }
}

export default SecondInput
