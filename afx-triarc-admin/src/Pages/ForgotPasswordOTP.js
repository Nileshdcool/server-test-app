import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import Header from './Header';
import { forgotPassword, sendOTP } from '../Utils/authentication';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import './forgotPass.css';
toast.configure();
class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      // email: "",
      isLoading: false,
      // invalidEmail: false,
      newpassword: '',
      ConfirmPassword: '',
      otp: '',
      invalidConfirmPassword: false,
      invalidPassword: false,
      errors: {
        // emailError: null,
        newpasswordError: null,
        ConfirmPasswordError: null,
        otpError: null,
      },
    };
  }

  restrictAlphabets = (e) => {
    const regx = '^[0-9]*$';
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });

    const { errors, newpassword, ConfirmPassword } = this.state;
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

    if (name === 'ConfirmPassword') {
      if (value && value !== newpassword) {
        this.setState({
          invalidConfirmPassword: true,
        });
      } else {
        this.setState({
          invalidConfirmPassword: false,
        });
      }
    }

    if (name === 'newpassword') {
      let passwordRegx =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[#?!@$%^&*-.]).{8,}$/;
      if (value && value !== ConfirmPassword) {
        this.setState({
          invalidConfirmPassword: true,
        });
      } else {
        this.setState({
          invalidConfirmPassword: false,
        });
      }

      if (value && !value.match(passwordRegx)) {
        this.setState({
          invalidPassword: true,
        });
      } else {
        this.setState({
          invalidPassword: false,
        });
      }
    }
  };

  handleValidate = (e) => {
    const { errors, newpassword, ConfirmPassword } = this.state;
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

    if (name === 'ConfirmPassword') {
      if (value && value !== newpassword) {
        this.setState({
          invalidConfirmPassword: true,
        });
      } else {
        this.setState({
          invalidConfirmPassword: false,
        });
      }
    }

    if (name === 'newpassword') {
      if (value && value !== ConfirmPassword) {
        this.setState({
          invalidConfirmPassword: true,
        });
      } else {
        this.setState({
          invalidConfirmPassword: false,
        });
      }
    }
  };

  resendOtp = () => {
    const { errors, invalidEmail, email } = this.state;
    this.setState({ otp: '', newpassword: '', ConfirmPassword: '' });
    let userName = localStorage.getItem('userEmail');
    let isSuccess = true;
    let obj = { userName: userName };
    if (isSuccess) {
      this.setState({ isLoading: true });
      sendOTP(obj).then((response) => {
        this.setState({ isLoading: false });
        // this.props.history.push(`/forgotpassword`);
        if (response.data && response.data.error === false) {
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            autoClose: 3000,
          });
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

  handleSubmit = () => {
    const { errors, invalidEmail, email, newpassword, otp } = this.state;
    let userName = localStorage.getItem('userEmail');
    let newPassword = newpassword;
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
    let obj = { userName: userName, password: newPassword, otp: otp };
    if (isSuccess) {
      this.setState({ isLoading: true });
      forgotPassword(obj).then((response) => {
        this.setState({ isLoading: false });
        if (response.data && response.data.error === false) {
          toast.success(response.data.message, {
            type: toast.TYPE.SUCCESS,
            autoClose: 3000,
          });
          let forgotPass = Cookies.get('forgotPass');
          if (forgotPass === 'true') {
            Cookies.set('forgotPass', false, { expires: 365 });
            setTimeout(() => {
              window.location.replace('https://rockett.club/log-in');
            }, 1000);
            localStorage.removeItem('userEmail');
          } else {
            setTimeout(() => {
              window.location.replace('https://rockett.club/admin/login/');
            }, 1000);
          }
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

  resendOtpFunc() {
    if (localStorage.getItem('userEmail')) {
      return (
        <>
          <div
            style={{
              color: 'blue',
              textAlign: 'right',
              cursor: 'pointer',
            }}
            onClick={this.resendOtp}
          >
            Resend OTP
          </div>
        </>
      );
    } else {
      return (
        <>
          <div
            style={{ color: 'grey', textAlign: 'right', border: '1px solid' }}
          >
            Resend OTP
          </div>
        </>
      );
    }
  }

  render() {
    const {
      email,
      invalidEmail,
      errors,
      newpassword,
      ConfirmPassword,
      invalidConfirmPassword,
      invalidPassword,
      otp,
    } = this.state;

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
                disabled
                type='email'
                className='form-input'
                name='email'
                value={localStorage.getItem('userEmail')}
                onChange={this.handleChange}
                placeholder='Enter Email'
                autocomplete='off'
              />
            </div>
            <div className='form-group'>
              <input
                type='otp'
                className='form-input'
                name='otp'
                value={otp}
                onChange={this.handleChange}
                placeholder='Enter OTP'
                onKeyPress={this.restrictAlphabets}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {errors.otpError ? (
                  <span className='errorMsg' style={{ fontSize: '0.9rem' }}>
                    Please enter OTP
                  </span>
                ) : (
                  <div></div>
                )}
                {this.resendOtpFunc()}
              </div>
            </div>
            <div className='form-group'>
              <input
                type='password'
                className='form-input'
                name='newpassword'
                value={newpassword}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                placeholder='New Password'
              />
              {errors.newpasswordError && (
                <span className='errorMsg' style={{ fontSize: '0.8rem' }}>
                  Please enter New Password
                </span>
              )}
              {invalidPassword && (
                <span className='errorMsg' style={{ fontSize: '0.8rem' }}>
                  Password must contain at least 8 characters, including
                  uppercase, lowercase, number and special characters
                </span>
              )}
            </div>
            <div className='form-group'>
              <input
                type='password'
                className='form-input'
                name='ConfirmPassword'
                value={ConfirmPassword}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                placeholder='Confirm Password'
              />
              {(invalidConfirmPassword || errors.ConfirmPasswordError) && (
                <span className='errorMsg' style={{ fontSize: '0.8rem' }}>
                  Please Enter Correct Confirm Password
                </span>
              )}
            </div>
            <div className='form-group '>
              <button
                onClick={this.handleSubmit}
                className='form-submit btn btn-primary'
                disabled={invalidConfirmPassword || invalidPassword}
              >
                Submit
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
