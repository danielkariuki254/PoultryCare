import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default class Employees extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: [],
      filteredEmployees: [],
      startDate: "",
      endDate: "",
      error: null,
    };
  }

  componentDidMount() {
    this.retrieveEmployees();
  }

  retrieveEmployees() {
    axios
      .get("http://localhost:7000/employees")
      .then((res) => {
        if (res.data.success) {
          const employees = res.data.existingEmployees.map((employee) => {
            // Convert date to a string without the time part
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(employee.date));
            return { ...employee, date: formattedDate };
          });

          this.setState(
            {
              employees,
              filteredEmployees: employees,
            }
            // () => this.calculateTotalEmployees()
          );
        }
      })
      .catch((error) => {
        this.setState({ error: "Internal Server Error" });
      });
  }
  onDelete = (id) => {
    axios.delete(`http://localhost:7000/employee/delete/${id}`).then((res) => {
      alert("Deleted Successfully");
      this.retrieveEmployees();
    });
  };

  filterByDateRange = () => {
    const { employees, startDate, endDate } = this.state;
    const result = employees.filter((employee) => {
      const employeeDate = new Date(employee.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return employeeDate >= startDateObj && employeeDate <= endDateObj;
    });

    this.setState({ filteredEmployees: result });
  };

  handleStartDateChange = (e) => {
    this.setState({ startDate: e.target.value });
  };

  handleEndDateChange = (e) => {
    this.setState({ endDate: e.target.value });
  };

  handleFilterButtonClick = () => {
    this.filterByDateRange();
  };
  generatePDF = () => {
    const { filteredEmployees } = this.state;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const content = [
      { text: "EMPLOYEE ON DUTY", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [15, "*", 50, "*", "*"], // Adjust widths as needed
          body: [
            ["#", "Recording Officer", "Date", "Employee On Duty", "Phone"],
            ...filteredEmployees.map((employee, index) => [
              index + 1,
              employee.worker,
              employee.date,
              employee.workerOD,
              employee.phone,
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },
    ];

    const docDefinition = {
      content: content,
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download("EMPLOYEE ON DUTY.pdf"); // This triggers the download
  };
  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <br></br>
          <br></br>
          <div className="emploees-record h2 text-center mb-3">
            Employees' Records
          </div>
          <div className="col-lg-3 mt-2 mb-2">
            <button className="btn btn-success">
              <Link
                to="/createemployees"
                style={{ textDecoration: "none", color: "white" }}
              >
                Enter Employee
              </Link>
            </button>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6 col-6 mt-2 mb-2">
              <label className="fw-bold">FROM:</label>
              <input
                className="form-control"
                type="date"
                placeholder="Start Date"
                name="startDate"
                onChange={this.handleStartDateChange}
              />
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-6 mt-2 mb-2">
              <label className="fw-bold">TO:</label>
              <input
                className="form-control"
                type="date"
                placeholder="End Date"
                name="endDate"
                onChange={this.handleEndDateChange}
              />
            </div>

            <div className="col-lg-3 mt-4 mb-1">
              <button
                className="btn btn-primary"
                onClick={this.handleFilterButtonClick}
              >
                Generate
              </button>
              <button
                className="btn btn-secondary mx-3"
                onClick={this.generatePDF}
              >
                Print PDF
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive mx-3 mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Recording Officer</th>
                <th scope="col">Date</th>
                <th scope="col">Employee On Duty</th>
                <th scope="col">Phone No.</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {this.state.filteredEmployees.map((employee, index) => (
                <tr key={employee._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{employee.worker}</td>
                  <td>{employee.date}</td>
                  <td>{employee.workerOD}</td>
                  <td>{employee.phone}</td>
                  <td>
                    {/* <Link
                      className="btn btn-warning"
                      to={`/edit/${employee._id}`}
                    >
                      <i className="fas fa-edit"></i>&nbsp;Edit
                    </Link> */}

                    <button
                      className="btn btn-danger mx-1"
                      onClick={() => this.onDelete(employee._id)}
                    >
                      {/* <FontAwesomeIcon icon={faTrash} /> */}
                      &nbsp;Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
