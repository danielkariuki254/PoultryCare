import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default class CreatePurchases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      worker: "",
      date: "",
      category: "",
      quantity: "",
      amount: "",
      errors: {
        worker: "",
        date: "",
        category: "",
        quantity: "",
        amount: "",
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
    const { worker, date, category, quantity, amount } = this.state;
    const errors = {
      worker: "",
      date: "",
      category: "",
      quantity: "",
      amount: "",
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

    if (!category) {
      errors.category = "Category is required.";
      isValid = false;
    }

    if (!quantity) {
      errors.quantity = "Quantity is required.";
      isValid = false;
    }

    if (!amount) {
      errors.amount = "Amount is required.";
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  };

  onSubmit = (e) => {
    e.preventDefault();

    if (this.validateForm()) {
      const { worker, date, category, quantity, amount } = this.state;
      const data = {
        worker: worker,
        date: date,
        category: category,
        quantity: quantity,
        amount: amount,
      };

      console.log(data);

      axios.post("http://localhost:7000/purchase/save", data).then((res) => {
        if (res.data.success) {
          this.setState({
            worker: "",
            date: "",
            category: "",
            quantity: "",
            amount: "",
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
            to="/purchases"
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
            <label>Category of Expense</label>
            <input
              type="text"
              className={`form-control ${errors.category && "is-invalid"}`}
              placeholder="Enter category"
              name="category"
              value={this.state.category}
              onChange={this.handleInputChange}
            />
            {errors.category && (
              <div className="invalid-feedback">{errors.category}</div>
            )}
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="text"
              className={`form-control ${errors.quantity && "is-invalid"}`}
              placeholder="Enter quantity"
              name="quantity"
              value={this.state.quantity}
              onChange={this.handleInputChange}
            />
            {errors.quantity && (
              <div className="invalid-feedback">{errors.quantity}</div>
            )}
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              className={`form-control ${errors.amount && "is-invalid"}`}
              placeholder="Enter amount"
              name="amount"
              value={this.state.amount}
              onChange={this.handleInputChange}
            />
            {errors.amount && (
              <div className="invalid-feedback">{errors.amount}</div>
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
