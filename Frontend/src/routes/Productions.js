import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default class Productions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productions: [],
      filteredProductions: [],
      startDate: "",
      endDate: "",
      totalProductions: 0,
      error: null,
    };
  }

  componentDidMount() {
    this.retrieveProductions();
  }

  retrieveProductions() {
    axios
      .get("http://localhost:7000/productions")
      .then((res) => {
        if (res.data.success) {
          const productions = res.data.existingProductions.map((production) => {
            // Convert date to a string without the time part
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(production.date));
            return { ...production, date: formattedDate };
          });

          this.setState(
            {
              productions,
              filteredProductions: productions,
            },
            () => this.calculateTotalProductions()
          );
        }
      })
      .catch((error) => {
        this.setState({ error: "Internal Server Error" });
      });
  }

  onDelete = (id) => {
    axios
      .delete(`http://localhost:7000/production/delete/${id}`)
      .then((res) => {
        alert("Deleted Successfully");
        this.retrieveProductions();
      });
  };

  filterByDateRange = () => {
    const { productions, startDate, endDate } = this.state;
    const result = productions.filter((production) => {
      const productionDate = new Date(production.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return productionDate >= startDateObj && productionDate <= endDateObj;
    });

    this.setState({ filteredProductions: result }, () =>
      this.calculateTotalProductions()
    );
  };

  calculateTotalProductions() {
    const totalProductions = this.state.filteredProductions.reduce(
      (total, production) => total + parseInt(production.quantity),
      0
    );
    this.setState({ totalProductions });
  }

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
    const { filteredProductions, totalProductions } = this.state;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const content = [
      { text: " Productions Data", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "*"],
          body: [
            ["#", "Recording Officer", "Date", "Productions Bought"],
            ...filteredProductions.map((production, index) => [
              index + 1,
              production.worker,
              production.date,
              production.quantity,
            ]),
            ["Total", "", "", totalProductions],
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
    pdfDoc.download("filtered_production_data.pdf"); // This triggers the download
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <br></br>
          <br></br>
          <div className="productions-record h2 text-center mb-3">
            Productions' Records
          </div>
          <div className="col-lg-3 mt-2 mb-2">
            <button className="btn btn-success">
              <Link
                to="/createproductions"
                style={{ textDecoration: "none", color: "white" }}
              >
                Enter Eggs Produced
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

            <div className="col-lg-3  mt-4 mb-1">
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
                <th scope="col">Eggs Produced</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {this.state.filteredProductions.map((production, index) => (
                <tr key={production._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{production.worker}</td>
                  <td>{production.date}</td>
                  <td>{production.quantity}</td>
                  <td>
                    {/* <Link
                      className="btn btn-warning"
                      to={`/edit/${production._id}`}
                    >
                      <i className="fas fa-edit"></i>&nbsp;Edit
                    </Link> */}

                    <button
                      className="btn btn-danger mx-1"
                      onClick={() => this.onDelete(production._id)}
                    >
                      {/* <FontAwesomeIcon icon={faTrash} /> */}
                      &nbsp;Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan="1"></td>
                <td className="fw-bold">Total</td>
                <td></td>
                <td className="fw-bold">{this.state.totalProductions}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  }
}
