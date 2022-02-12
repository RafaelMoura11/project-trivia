import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveToken } from '../services/token';
import { addEmail } from '../actions';
import trivia from '../images/trivia.png';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      disabled: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.disabled = this.disabled.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange({ target }) {
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    }, this.disabled);
  }

  disabled() {
    const { username, email } = this.state;
    if (email.includes('@' && '.com') && username.length > 0) {
      this.setState({
        disabled: false,
      });
    }
  }

  async handleClick() {
    const { history, saveUser } = this.props;
    const { username: name, email: gravatarEmail } = this.state;
    console.log(name);

    await fetch('https://opentdb.com/api_token.php?command=request')
      .then((response) => response.json())
      .then((response) => saveToken(response.token));

    saveUser(this.state);

    const player = {
      name,
      assertions: 0,
      score: 0,
      gravatarEmail,
    };
    localStorage.setItem('state', JSON.stringify({ player }));

    history.push('/main');
  }

  render() {
    const { disabled } = this.state;
    return (
      <div>
        <img src={ trivia } alt="logo" className="trivia" />
        <div className="login">
          <form>
            <label htmlFor="login">
              Usuário:
              <input
                type="text"
                name="username"
                id="login"
                onChange={ this.handleChange }
                data-testid="input-player-name"
              />
            </label>
            <label htmlFor="input-gravatar-email" className="email">
              E-mail:
              <input
                type="email"
                name="email"
                onChange={ this.handleChange }
                data-testid="input-gravatar-email"
              />
            </label>
            <div className="buttons">
              <button
                type="button"
                name="disabled"
                disabled={ disabled }
                data-testid="btn-play"
                onClick={ this.handleClick }
              >
                Jogar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  saveUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  saveUser: (state) => dispatch(addEmail(state)),
});

export default connect(null, mapDispatchToProps)(Login);
