import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default class EditBirds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      worker: "",
      date: "",
      quantity: "",
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    /////////////
    const id = this.props.match.params.id;
    /////////////////

    const { worker, date, quantity } = this.state;

    const data = {
      worker: worker,
      date: date,
      quantity: quantity,
    };

    console.log(data);
    axios
      .put(`http://localhost:7000/bir/edit/update/${id}`, data)
      .then((res) => {
        if (res.data.success) {
          alert("Post Updated Successfully");
          this.setState({
            worker: "",
            date: "",
            quantity: "",
          });
        }
      });
  };

  componentDidMount() {
    const id = this.props.match.params.id;

    axios.get(`http://localhost:7000/bir/edit/${id}`).then((res) => {
      if (res.data.success) {
        this.setState({
          ///////
          worker: res.data.edit.worker,
          date: res.data.edit.date,
          quantity: res.data.edit.quantity,
        });

        console.log(this.state.edit);
      }
    });
  }

  render() {
    return (
      <div>
        <button className="btn btn-success">
          <Link
            to="/"
            class="nav-link"
            style={{ textDecoration: "none", color: "white" }}
          >
            Back
          </Link>
        </button>

        {/* <h1>Edit</h1> */}
        <form>
          <div className="form-group">
            <label>Worker</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Worker"
              name="worker"
              id="worker"
              value={this.state.worker}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              class="form-control"
              placeholder="Enter Date"
              name="date"
              id="date"
              value={this.state.date}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              class="form-control"
              placeholder="Enter Quantity"
              name="quantity"
              id="quantity"
              value={this.state.quantity}
              onChange={this.handleInputChange}
            />
          </div>
          <button
            className="btn btn-success"
            type="submit"
            onClick={this.onSubmit}
          >
            Update
          </button>
        </form>
      </div>
    );
  }
}
