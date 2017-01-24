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

    var number = this.props.number;
    if (this.props.amount === 'hour') {
      if (number === 0) {
        number = 12;
      }
      else if (number > 12) {
        number -= 12;
      }
    }

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
        {number}
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

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.clockOpen
      && !nextState.clockOpen
      && typeof nextProps.onBlur === 'function'
    ) {
      nextProps.onBlur();
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
          amount="second"
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
        amount="second"
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
          amount="minute"
          setTimeValue={(number, amount) => {
            this.props.onTimeValueChange(number, amount);
            this.setState(state => {
              if (this.props.showSeconds) {
                state.currentPane = 'seconds';
              }
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
        amount="minute"
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
    var startHour = 0;
    if (currentTime !== null && currentTime.hours() >= 12) {
      startHour = 12;
    }
    for (var hour = startHour; hour < startHour + 12; hour += 1) {
      var active = (currentTime !== null && currentTime.hours() == hour);
      var margin = CLOCK_1_RING_MARGIN;
      hours.push(
        <Item
          key={`hour-${hour}`}
          angle={hour / 12}
          margin={margin}
          number={hour}
          amount="hour"
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

    var am = (this.props.timeValue === null || moment(this.props.timeValue, 'x').hours() < 12);
    var meridiem = (
      <div className="meridiem">
        <a
          href="#"
          className={classNames({'active': am})}
          onClick={(event) => {
            event.preventDefault();
            if (this.props.timeValue === null) {
              this.props.onTimeValueChange(0, 'hour');
            }
            else {
              var currentTime = moment(this.props.timeValue, 'x');
              if (currentTime.hours() >= 12) {
                this.props.onTimeValueChange(currentTime.hours() - 12, 'hour');
              }
            }
          }}
        >
          AM
        </a>
        <a
          href="#"
          className={classNames({'active': !am})}
          onClick={(event) => {
            event.preventDefault();
            if (this.props.timeValue === null) {
              this.props.onTimeValueChange(12, 'hour');
            }
            else {
              var currentTime = moment(this.props.timeValue, 'x');
              if (currentTime.hours() < 12) {
                this.props.onTimeValueChange(currentTime.hours() + 12, 'hour');
              }
            }
          }}
        >
          PM
        </a>
      </div>
    );

    return (<div style={style}>
      {hours}
      {meridiem}
    </div>);
  }
  renderClock() {
    if (!this.state.clockOpen) {
      return null;
    }

    var secondsTab, secondsFace;
    if (this.props.showSeconds) {
      secondsTab = (
        <div
          onClick={() => {this.setState({currentPane: 'seconds',});}}
          className={classNames({
            selected: (this.state.currentPane === 'seconds'),
          })}
        >
          Sec
        </div>
      );
      secondsFace = this.renderSecondsFace();
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
          {secondsTab}
        </div>
        <div className="face">
          {this.renderHoursFace()}
          {this.renderMinutesFace()}
          {secondsFace}
        </div>
      </div>
    );
  }
  render() {
    return (
      <div
        className="rendered-react-second-input"
        ref="widget"
        tabIndex="-1"
        onBlur={(event) => {
          var currentTarget = event.currentTarget;
          setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
              this.hideClock();
            }
          }, 0);
        }}
      >
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
SecondInput.defaultProps = {
  showSeconds: false,
};

export default SecondInput
