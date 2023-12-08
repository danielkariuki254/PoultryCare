import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default class CreateEmployees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      worker: "",
      date: "",
      workerOD: "",
      phone: "",
      errors: {}, // State to store validation errors
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { worker, date, workerOD, phone } = this.state;
    const errors = {};

    if (!worker) {
      errors.worker = "Recording Officer is required";
    }
    if (!date) {
      errors.date = "Date is required";
    }
    if (!workerOD) {
      errors.workerOD = "Name is required";
    }
    if (!phone) {
      errors.phone = "Phone No. is required";
    }

    if (Object.keys(errors).length === 0) {
      const data = {
        worker: worker,
        date: date,
        workerOD: workerOD,
        phone: phone,
      };

      console.log(data);
      axios.post("http://localhost:7000/employee/save", data).then((res) => {
        if (res.data.success) {
          this.setState({
            worker: "",
            date: "",
            workerOD: "",
            phone: "",
            errors: {},
          });
        }
      });
    } else {
      this.setState({ errors });
    }
  };

  render() {
    const today = new Date().toISOString().split("T")[0];
    const { errors } = this.state;

    return (
      <div className="mx-5 my-3">
        <button className="btn btn-success mb-3">
          <Link
            to="/employees"
            class="nav-link"
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
              className="form-control"
              placeholder="Enter Name"
              name="worker"
              id="worker"
              value={this.state.worker}
              onChange={this.handleInputChange}
            />
            {errors.worker && (
              <div className="text-danger">{errors.worker}</div>
            )}
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
              max={today}
              onChange={this.handleInputChange}
            />
            {errors.date && <div className="text-danger">{errors.date}</div>}
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              class="form-control"
              placeholder="Enter Name"
              name="workerOD"
              id="workerOD"
              value={this.state.workerOD}
              onChange={this.handleInputChange}
            />
            {errors.workerOD && (
              <div className="text-danger">{errors.workerOD}</div>
            )}
          </div>

          <div className="form-group">
            <label>Phone No.</label>
            <input
              type="text"
              class="form-control"
              placeholder="Enter Phone No."
              name="phone"
              id="phone"
              value={this.state.phone}
              onChange={this.handleInputChange}
            />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
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
