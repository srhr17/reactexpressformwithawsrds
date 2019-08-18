import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <form action="http://localhost:8001/login" method="POST">
          <h3>Name : </h3>
          <input type="text" name="name" placeholder="Name" />
          <h3>Password : </h3>
          <input type="password" name="password" placeholder="Password" />
          <h3>Age : </h3>
          <input type="number" name="age" placeholder="Age" />
          <br />
          <br />
          <input type="submit" />
        </form>
        <br />
        <br />
        <a href="http://localhost:8001/login">Display</a>
      </div>
    );
  }
}

export default App;
