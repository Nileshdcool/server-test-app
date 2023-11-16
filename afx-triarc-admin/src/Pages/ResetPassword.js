import React, { Component } from 'react';
import { resetPassword } from '../Utils/authentication';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

export class ForgetPassword extends Component {
  state = {
    username: '',
    otp: '',
    newpassword: '',
    ConfirmPassword: '',
    invalidUsername: false,
    invalidConfirmPassword: false,
    invalidPassword: false,
    isLoading: false,
    errors: {
      usernameError: null,
      otpError: null,
      newpasswordError: null,
      ConfirmPasswordError: null,
    },
  };

  handleChange = (e) => {
    const { errors, newpassword, ConfirmPassword } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (value === '' || value === null || value === undefined) {
      this.setState({ errors: { ...errors, [name + 'Error']: true } });
    } else {
      this.setState({ errors: { ...errors, [name + 'Error']: false } });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });

    if (name === 'username') {
      let usernameRegx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (value && !value.match(usernameRegx)) {
        this.setState({
          invalidUsername: true,
        });
      } else {
        this.setState({
          invalidUsername: false,
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
      // let passwordRegx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
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

  restrictAlphabets = (e) => {
    const regx = '^[0-9]*$';
    if (e.key.match(regx)) {
      return true;
    } else {
      e.preventDefault();
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

    // if (name === "username") {
    //   let usernameRegx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //   if (value && !value.match(usernameRegx)) {
    //     this.setState({
    //       invalidUsername: true
    //     });
    //   } else {
    //     this.setState({
    //       invalidUsername: false
    //     });
    //   }
    // }

    // if (name === "ConfirmPassword") {
    //   if (value && value !== newpassword) {
    //     this.setState({
    //       invalidConfirmPassword: true
    //     });
    //   } else {
    //     this.setState({
    //       invalidConfirmPassword: false
    //     });
    //   }
    // }

    // if (name === "newpassword") {
    //   let passwordRegx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    //   if (value && value !== ConfirmPassword) {
    //     this.setState({
    //       invalidConfirmPassword: true
    //     });
    //   } else {
    //     this.setState({
    //       invalidConfirmPassword: false
    //     });
    //   }

    // if (value && !value.match(passwordRegx)) {
    //   this.setState({
    //     invalidPassword: true
    //   });
    // } else {
    //   this.setState({
    //     invalidPassword: false
    //   });
    // }
    // }
  };

  handleSubmit = () => {
    const { username, newpassword, otp, errors } = this.state;
    let isLogin = true;
    for (var val in errors) {
      if (errors[val] === null || errors[val]) {
        errors[val] = true;
        isLogin = false;
      }
    }

    let obj = { username, newpassword, otp };
    if (isLogin) {
      this.setState({ isLoading: true });
      resetPassword(obj).then((response) => {
        this.setState({ isLoading: false });
        if (response.data && response.data.error === false) {
          window.location.replace('https://rockett.club/log-in');
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
  };

  render() {
    const {
      username,
      otp,
      newpassword,
      ConfirmPassword,
      invalidConfirmPassword,
      invalidUsername,
      errors,
      invalidPassword,
    } = this.state;

    return (
      <div>
        <ToastContainer />
        <section className='login-section'>
          <div className='page-container'>
            <div
              style={{ width: '450px', marginTop: '140px' }}
              className='content'
            >
              <h3 className='text-center title-font mb-3'>Reset Password</h3>
              <div className='form-group'>
                <input
                  type='email'
                  pattern='\d*'
                  maxLength='50'
                  className='form-input'
                  name='username'
                  value={username}
                  onChange={this.handleChange}
                  // onBlur={this.handleValidate}
                  onKeyDown={this.handleKeyDown}
                  placeholder='Email ID'
                />
                {errors.usernameError && (
                  <span className='errorMsg' style={{ fontSize: '0.9rem' }}>
                    Please enter email
                  </span>
                )}
                {invalidUsername && (
                  <span className='errorMsg' style={{ fontSize: '0.9rem' }}>
                    Please enter valid email
                  </span>
                )}
              </div>
              <div className='form-group'>
                <input
                  type='number'
                  className='form-input'
                  name='otp'
                  value={otp}
                  onChange={this.handleChange}
                  // onBlur={this.handleValidate}
                  onKeyDown={this.handleKeyDown}
                  onKeyPress={this.restrictAlphabets}
                  placeholder='OTP'
                />
                {errors.otpError && (
                  <span className='errorMsg' style={{ fontSize: '0.9rem' }}>
                    Please enter OTP
                  </span>
                )}
              </div>
              <div className='form-group'>
                <input
                  type='password'
                  className='form-input'
                  name='newpassword'
                  value={newpassword}
                  onChange={this.handleChange}
                  // onBlur={this.handleValidate}
                  onKeyDown={this.handleKeyDown}
                  placeholder='New Password'
                />
                {errors.newpasswordError && (
                  <span className='errorMsg' style={{ fontSize: '0.9rem' }}>
                    Please enter New password
                  </span>
                )}
                {invalidPassword && (
                  <span className='errorMsg' style={{ fontSize: '0.9rem' }}>
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
                  // onBlur={this.handleValidate}
                  onKeyDown={this.handleKeyDown}
                  placeholder='Confirm Password'
                />
                {/* {errors.ConfirmPasswordError && (
                  <span className="errorMsg" style={{fontSize: "0.9rem"}}>
                    Please enter Confirm password
                  </span>
                )} */}
                {(invalidConfirmPassword || errors.ConfirmPasswordError) && (
                  <span className='errorMsg' style={{ fontSize: '0.9rem' }}>
                    Please Enter Correct Confirm Password
                  </span>
                )}
              </div>

              <div className='form-group'>
                <button
                  onClick={this.handleSubmit}
                  // disabled={invalidConfirmPassword}
                  className='form-submit'
                  disabled={invalidConfirmPassword || invalidPassword}
                >
                  {' '}
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
      </div>
    );
  }
}

export default ForgetPassword;
