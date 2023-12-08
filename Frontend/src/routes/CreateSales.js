import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default class CreateSales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      worker: "",
      date: "",
      category: "",
      price: "",
      quantity: "",
      errors: {
        worker: "",
        date: "",
        price: "",
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
    const { worker, date, price, quantity } = this.state;
    const errors = {
      worker: "",
      date: "",
      price: "",
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

    if (!price) {
      errors.price = "Price is required.";
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
      const { worker, date, category, price, quantity } = this.state;
      const data = {
        worker: worker,
        date: date,
        category: category,
        price: price,
        quantity: quantity,
      };

      // Make an API request to fetch the unsold eggs data
      axios.get("http://localhost:7000/profit").then((res) => {
        if (res.data.unsoldEggs >= quantity) {
          // There are enough unsold eggs, so proceed with the sale
          axios.post("http://localhost:7000/sale/save", data).then((res) => {
            if (res.data.success) {
              this.setState({
                worker: "",
                date: "",
                category: "",
                price: "",
                quantity: "",
              });
              MySwal.fire({
                icon: "success",
                title: "Sales",
                text: "Sales Submitted Successfuly .",
              });
            }
          });
        } else {
          MySwal.fire({
            icon: "error",
            title: "No Enough Eggs",
            text: "There is No Enough Eggs for Sale.",
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
            to="/sales"
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
            <label>Category</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Category"
              name="category"
              value={this.state.category}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Rate</label>
            <input
              type="number"
              className={`form-control ${errors.price && "is-invalid"}`}
              placeholder="Enter Price"
              name="price"
              value={this.state.price}
              onChange={this.handleInputChange}
            />
            {errors.price && (
              <div className="invalid-feedback">{errors.price}</div>
            )}
          </div>
          <div className="form-group">
            <label>Quantity Sold</label>
            <input
              type="number"
              className={`form-control ${errors.quantity && "is-invalid"}`}
              placeholder="Enter Quantity"
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
