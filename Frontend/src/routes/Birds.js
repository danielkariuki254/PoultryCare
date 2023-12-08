import React, { Component } from "react";
import EditBirds from "../routes/EditBirds";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Navbar from "../components/Navbar";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// import { FaTrash } from "react-icons/fa";

export default class Birds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      birds: [],
      filteredBirds: [],
      startDate: "",
      endDate: "",
      totalBirds: 0,
      error: null,
    };
  }

  componentDidMount() {
    this.retrieveBirds();
  }

  retrieveBirds() {
    axios
      .get("http://localhost:7000/birds")
      .then((res) => {
        if (res.data.success) {
          const birds = res.data.existingBirds.map((bird) => {
            // Convert date to a string without the time part
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(bird.date));
            return { ...bird, date: formattedDate };
          });

          this.setState(
            {
              birds,
              filteredBirds: birds,
            },
            () => this.calculateTotalBirds()
          );
        }
      })
      .catch((error) => {
        this.setState({ error: "Internal Server Error" });
      });
  }

  onDelete = (id) => {
    axios.delete(`http://localhost:7000/bird/delete/${id}`).then((res) => {
      // alert("Deleted Successfully");
      MySwal.fire({
        icon: "success",
        title: "Deleted",
        text: "Deleted Successfully.",
      });
      this.retrieveBirds();
    });
  };

  filterByDateRange = () => {
    const { birds, startDate, endDate } = this.state;
    const result = birds.filter((bird) => {
      const birdDate = new Date(bird.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return birdDate >= startDateObj && birdDate <= endDateObj;
    });

    this.setState({ filteredBirds: result }, () => this.calculateTotalBirds());
  };

  calculateTotalBirds() {
    const totalBirds = this.state.filteredBirds.reduce(
      (total, bird) => total + parseInt(bird.quantity),
      0
    );
    this.setState({ totalBirds });
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
    const { filteredBirds, totalBirds } = this.state;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const content = [
      { text: " BIRDS DATA", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "*"],
          body: [
            ["#", "Recording Officer", "Date", "Birds Bought"],
            ...filteredBirds.map((bird, index) => [
              index + 1,
              bird.worker,
              bird.date,
              bird.quantity,
            ]),
            ["", "TOTAL", "", totalBirds],
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
    pdfDoc.download("filtered_bird_data.pdf"); // This triggers the download
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <br></br>
          <br></br>
          <div className="birds-record h2 text-center mb-3">Birds' Records</div>
          <div className="col-lg-3 mt-2 mb-2">
            <button className="btn btn-success">
              <Link
                to="/createbirds"
                style={{ textDecoration: "none", color: "white" }}
              >
                Enter Birds Bought
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
                <th scope="col">Birds Bought</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {this.state.filteredBirds.map((bird, index) => (
                <tr key={bird._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{bird.worker}</td>
                  <td>{bird.date}</td>
                  <td>{bird.quantity}</td>
                  <td>
                    {/* <Link className="btn btn-warning" to={`/edit/${bird._id}`}>
                      <i className="fas fa-edit"></i>&nbsp;Edit
                    </Link> */}

                    <button
                      className="btn btn-danger mx-1"
                      onClick={() => this.onDelete(bird._id)}
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
                <td className="fw-bold">{this.state.totalBirds}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  }
}
