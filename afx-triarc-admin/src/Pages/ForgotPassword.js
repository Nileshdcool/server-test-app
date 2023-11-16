import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import Header from './Header';
import { sendOTP } from '../Utils/authentication';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import './forgotPass.css';
toast.configure();
class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      isLoading: false,
      invalidEmail: false,
      errors: {
        emailError: null,
      },
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });

    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (value === '' || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name + 'Error']: true } });
    } else {
      this.setState({ errors: { ...errors, [name + 'Error']: false } });
    }
    if (name === 'email') {
      let emailRegx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (value && !value.match(emailRegx)) {
        this.setState({
          invalidEmail: true,
        });
      } else {
        this.setState({
          invalidEmail: false,
        });
      }
    }
  };

  handleValidate = (e) => {
    const { errors } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (value === '' || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name + 'Error']: true } });
    } else {
      this.setState({ errors: { ...errors, [name + 'Error']: false } });
    }
    if (name === 'email') {
      let emailRegx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (value && !value.match(emailRegx)) {
        this.setState({
          invalidEmail: true,
        });
      } else {
        this.setState({
          invalidEmail: false,
        });
      }
    }
  };

  componentDidMount() {
    localStorage.removeItem('userEmail');
  }

  handleSubmit = () => {
    const { errors, invalidEmail, email } = this.state;
    let userName = email;
    let isSuccess = true;
    for (var val in errors) {
      if (errors[val] === null || errors[val]) {
        errors[val] = true;
        isSuccess = false;
      }
    }
    if (invalidEmail) {
      isSuccess = false;
    }
    localStorage.setItem('userEmail', userName);
    let obj = { userName: userName };
    if (isSuccess) {
      this.setState({ isLoading: true });
      sendOTP(obj).then((response) => {
        this.setState({ isLoading: false });
        if (response.data && response.data.error === false) {
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            autoClose: 3000,
          });
          this.props.history.push(`/forgotpasswordOtp`);
          //   let forgotPass = Cookies.get("forgotPass");
          //   if (forgotPass === "true") {
          //     Cookies.set("forgotPass", false, { expires: 365 });
          //     setTimeout(() => {
          //       window.location.replace("https://rockett.club:3000/log-in");
          //     }, 1000);
          //   } else {
          //     setTimeout(() => {
          //       window.location.replace(
          //         "https://rockett.club:5001/admin-login#"
          //       );
          //     }, 1000);
          //   }
        }

        if (response.data && response.data.error === true) {
          toast.error(response.data.message, {
            type: toast.TYPE.ERROR,
            autoClose: 3000,
          });
          return false;
        }
      });
    }
    this.setState({ errors: { ...errors } });
  };

  render() {
    const { email, invalidEmail, errors } = this.state;
    return (
      <section className='login-section'>
        <ToastContainer />

        <div className='page-container mobileContainer'>
          <div style={{ width: '400px' }} className='content '>
            <h3 className='text-center title-font mb-3 mobileFont'>
              Forgot Password
            </h3>
            <div className='form-group'>
              <input
                type='email'
                className='form-input'
                name='email'
                value={email}
                onChange={this.handleChange}
                placeholder='Enter Email'
                autofill='none'
              />
              {errors.emailError && (
                <span className='errorMsg' style={{ fontSize: '0.8rem' }}>
                  Please enter email
                </span>
              )}
              {invalidEmail && (
                <span className='errorMsg' style={{ fontSize: '0.8rem' }}>
                  Please enter valid email
                </span>
              )}
            </div>
            <div className='form-group '>
              <button
                onClick={this.handleSubmit}
                className='form-submit btn btn-primary'
              >
                SEND OTP
                {this.state.isLoading ? (
                  <i
                    class='fa fa-spinner fa-spin'
                    style={{ fontSize: '24px' }}
                  ></i>
                ) : (
                  ''
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ForgotPassword;
