import React, { Component } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
  state = {
    email: "",
    password: "",
    isLogin: true
  };

  static contextType = AuthContext;

  handleChange = event => {
    //console.log(event.target.type);

    switch (event.target.type) {
      case "email":
        //console.log(event.target.value)
        this.setState({ email: event.target.value });

        break;
      case "password":
        //console.log(event.target.value);

        this.setState({ password: event.target.value });
        break;
      default:
    }
  };

  switchModeHandler = () => {
    this.setState({ isLogin: !this.state.isLogin });
  };

  submitHandler = e => {
    e.preventDefault();
    const email = this.state.email;
    const password = this.state.password;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
          query Login($email: String!, $password: String!){
              login(email: $email, password: $password){
                  userId
                  token
                  tokenExpiration
              }
          }`,
      variables: {
        email: email,
        password: password
      }
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
                mutation CreateUser($email: String!, $password:String!){
                    createUser(userInput: {email:$email, password:$password}){
                        _id
                        email
                    }
                } `,
        variables: {
          email: email,
          password: password
        }
      };
    }

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        switch (this.state.isLogin) {
          case true:
            if (resData.data.login.token) {
              this.context.login(
                resData.data.login.token,
                resData.data.login.userId,
                resData.data.login.tokenExpiration
              );
            }
            break;
          case false:
            console.log('State isLogin false');
            break;
          default:
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <h2 className="header">Login</h2>

        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            // value={this.state.email}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            // value={this.state.password}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
