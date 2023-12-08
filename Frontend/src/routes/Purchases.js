import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default class Purchases extends Component {
  constructor(props) {
    super(props);

    this.state = {
      purchases: [],
      filteredPurchases: [],
      startDate: "",
      endDate: "",
      totalPurchases: 0,
      error: null,
    };
  }

  componentDidMount() {
    this.retrievePurchases();
  }

  retrievePurchases() {
    axios
      .get("http://localhost:7000/purchases")
      .then((res) => {
        if (res.data.success) {
          const purchases = res.data.existingPurchases.map((purchase) => {
            // Convert date to a string without the time part
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(purchase.date));
            return { ...purchase, date: formattedDate };
          });

          this.setState(
            {
              purchases,
              filteredPurchases: purchases,
            },
            () => this.calculateTotalPurchases()
          );
        }
      })
      .catch((error) => {
        this.setState({ error: "Internal Server Error" });
      });
  }

  onDelete = (id) => {
    axios.delete(`http://localhost:7000/purchase/delete/${id}`).then((res) => {
      alert("Deleted Successfully");
      this.retrievePurchases();
    });
  };

  filterByDateRange = () => {
    const { purchases, startDate, endDate } = this.state;
    const result = purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return purchaseDate >= startDateObj && purchaseDate <= endDateObj;
    });

    this.setState({ filteredPurchases: result }, () =>
      this.calculateTotalPurchases()
    );
  };

  calculateTotalPurchases() {
    const totalPurchases = this.state.filteredPurchases.reduce(
      (total, purchase) => total + parseInt(purchase.amount),
      0
    );
    this.setState({ totalPurchases });
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
    const { filteredPurchases, totalPurchases } = this.state;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const content = [
      { text: "EXPENSES DATA", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "*", "*", "*"],
          body: [
            [
              "#",
              "Recording Officer",
              "Date",
              "Category",
              "Quantity",
              "Amount",
            ],
            ...filteredPurchases.map((purchase, index) => [
              index + 1,
              purchase.worker,
              purchase.date,
              purchase.category,
              purchase.quantity,
              purchase.amount,
            ]),
            ["", "TOTAL", "", "", "", totalPurchases],
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

    // Create the PDF document and trigger the download
    pdfMake.createPdf(docDefinition).download("filtered_expenses_data.pdf");
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <br></br>
          <br></br>
          <div className="expenses-record h2 text-center mb-3">
            Expenses' Records
          </div>
          <div className="col-lg-3 mt-2 mb-2">
            <button className="btn btn-success">
              <Link
                to="/createpurchases"
                style={{ textDecoration: "none", color: "white" }}
              >
                Enter Purchases
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
                <th scope="col">Category</th>
                <th scope="col">Quantity</th>
                <th scope="col">Amount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {this.state.filteredPurchases.map((purchase, index) => (
                <tr key={purchase._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{purchase.worker}</td>
                  <td>{purchase.date}</td>
                  <td>{purchase.category}</td>
                  <td>{purchase.quantity}</td>
                  <td>{purchase.amount}</td>
                  <td>
                    {/* <Link
                      className="btn btn-warning"
                      to={`/edit/${purchase._id}`}
                    >
                      <i className="fas fa-edit"></i>&nbsp;Edit
                    </Link> */}

                    <button
                      className="btn btn-danger mx-1"
                      onClick={() => this.onDelete(purchase._id)}
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
                <td colSpan=""></td>
                <td className="fw-bold">Total</td>
                <td></td>
                <td></td>
                <td></td>

                <td className="fw-bold">{this.state.totalPurchases}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  }
}
