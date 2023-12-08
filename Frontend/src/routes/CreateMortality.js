import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default class CreateMortality extends Component {
  constructor(props) {
    super(props);
    this.state = {
      worker: "",
      date: "",
      quantity: "",
      errors: {
        worker: "",
        date: "",
        quantity: "",
      },
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  validateForm = () => {
    const { worker, date, quantity } = this.state;
    const errors = {
      worker: "",
      date: "",
      quantity: "",
    };
    let isValid = true;

    if (!worker) {
      errors.worker = "Worker name is required.";
      isValid = false;
    }

    if (!date) {
      errors.date = "Date is required.";
      isValid = false;
    }

    if (!quantity) {
      errors.quantity = "Quantity is required.";
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  };

  onSubmit = (e) => {
    e.preventDefault();

    if (this.validateForm()) {
      const { worker, date, quantity } = this.state;
      const data = {
        worker: worker,
        date: date,
        quantity: quantity,
      };

      console.log(data);

      axios.post("http://localhost:7000/mortalit/save", data).then((res) => {
        if (res.data.success) {
          this.setState({
            worker: "",
            date: "",
            quantity: "",
          });
        }
      });
    }
  };

  render() {
    const { errors } = this.state;
    const today = new Date().toISOString().split("T")[0];
    return (
      <div className="mx-5 my-3">
        <button className="btn btn-success mb-3">
          <Link
            to="/mortality"
            className="nav-link"
            style={{ textDecoration: "none", color: "white" }}
          >
            Back
          </Link>
        </button>

        <form>
          <div className="form-group">
            <label>Recording Officer</label>
            <input
              type="text"
              className={`form-control ${errors.worker && "is-invalid"}`}
              placeholder="Enter Name"
              name="worker"
              value={this.state.worker}
              onChange={this.handleInputChange}
            />
            {errors.worker && (
              <div className="invalid-feedback">{errors.worker}</div>
            )}
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className={`form-control ${errors.date && "is-invalid"}`}
              name="date"
              value={this.state.date}
              max={today}
              onChange={this.handleInputChange}
            />
            {errors.date && (
              <div className="invalid-feedback">{errors.date}</div>
            )}
          </div>
          <div className="form-group">
            <label>Birds Died</label>
            <input
              type="number"
              className={`form-control ${errors.quantity && "is-invalid"}`}
              placeholder="Enter number"
              name="quantity"
              value={this.state.quantity}
              onChange={this.handleInputChange}
            />
            {errors.quantity && (
              <div className="invalid-feedback">{errors.quantity}</div>
            )}
          </div>
          <button
            className="btn btn-success mt-3"
            type="submit"
            onClick={this.onSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}
