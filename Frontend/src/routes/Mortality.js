import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
export default class Mortality extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mortality: [],
      filteredMortality: [],
      startDate: "",
      endDate: "",
      totalMortality: 0,
      error: null,
    };
  }

  componentDidMount() {
    this.retrieveMortality();
  }

  retrieveMortality() {
    axios
      .get("http://localhost:7000/mortality")
      .then((res) => {
        if (res.data.success) {
          const mortality = res.data.existingMortality.map((mortalit) => {
            // Convert date to a string without the time part
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(mortalit.date));
            return { ...mortalit, date: formattedDate };
          });

          this.setState(
            {
              mortality,
              filteredMortality: mortality,
            },
            () => this.calculateTotalMortality()
          );
        }
      })
      .catch((error) => {
        this.setState({ error: "Internal Server Error" });
      });
  }
  onDelete = (id) => {
    axios.delete(`http://localhost:7000/mortalit/delete/${id}`).then((res) => {
      alert("Deleted Successfully");
      this.retrieveMortality();
    });
  };

  filterByDateRange = () => {
    const { mortality, startDate, endDate } = this.state;
    const result = mortality.filter((mortalit) => {
      const mortalitDate = new Date(mortalit.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return mortalitDate >= startDateObj && mortalitDate <= endDateObj;
    });

    this.setState({ filteredMortality: result }, () =>
      this.calculateTotalMortality()
    );
  };

  calculateTotalMortality() {
    const totalMortality = this.state.filteredMortality.reduce(
      (total, mortalit) => total + parseInt(mortalit.quantity),
      0
    );
    this.setState({ totalMortality });
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
    const { filteredMortality, totalMortality } = this.state;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const content = [
      { text: " MORTALITY DATA", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "*"],
          body: [
            ["#", "Recording Officer", "Date", "Birds Died"],
            ...filteredMortality.map((mortalit, index) => [
              index + 1,
              mortalit.worker,
              mortalit.date,
              mortalit.quantity,
            ]),
            ["Total", "", "", totalMortality],
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
    pdfDoc.download("filtered_birds_died_data.pdf"); // This triggers the download
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <br></br>
          <br></br>
          <div className="mortality-record h2 text-center mb-3">
            Mortality Records
          </div>
          <div className="col-lg-3 mt-2 mb-2">
            <button className="btn btn-success">
              <Link
                to="/createmortality"
                style={{ textDecoration: "none", color: "white" }}
              >
                Enter Birds Died
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
                <th scope="col">Birds Died</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {this.state.filteredMortality.map((mortalit, index) => (
                <tr key={mortalit._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{mortalit.worker}</td>
                  <td>{mortalit.date}</td>
                  <td>{mortalit.quantity}</td>
                  <td>
                    {/* <Link
                      className="btn btn-warning"
                      to={`/edit/${mortalit._id}`}
                    >
                      <i className="fas fa-edit"></i>&nbsp;Edit
                    </Link> */}

                    <button
                      className="btn btn-danger mx-1"
                      onClick={() => this.onDelete(mortalit._id)}
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
                <td className="fw-bold">{this.state.totalMortality}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  }
}
