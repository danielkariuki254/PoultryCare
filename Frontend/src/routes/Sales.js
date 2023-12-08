import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default class Sales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sales: [],
      filteredSales: [],
      startDate: "",
      endDate: "",
      totalQuantity: 0,
      totalSales: 0, // Add a new state variable for total sales
      error: null,
    };
  }

  componentDidMount() {
    this.retrieveSales();
  }

  retrieveSales() {
    axios
      .get("http://localhost:7000/sales")
      .then((res) => {
        if (res.data.success) {
          const sales = res.data.existingSales.map((sale) => {
            // Convert date to a string without the time part
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(sale.date));
            return { ...sale, date: formattedDate };
          });

          this.setState(
            {
              sales,
              filteredSales: sales,
            },
            () => {
              this.calculateTotalQuantity();
              this.calculateTotalSales();
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ error: "Internal Server Error" });
      });
  }

  onDelete = (id) => {
    axios.delete(`http://localhost:7000/sale/delete/${id}`).then((res) => {
      MySwal.fire({
        icon: "success",
        title: "Sales",
        text: "Deleted Successfuly .",
      });
      this.retrieveSales();
    });
  };

  filterByDateRange = () => {
    const { sales, startDate, endDate } = this.state;
    const result = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return saleDate >= startDateObj && saleDate <= endDateObj;
    });

    this.setState({ filteredSales: result }, () => {
      this.calculateTotalQuantity();
      this.calculateTotalSales(); // Calculate total sales after updating state
    });
  };

  calculateTotalQuantity() {
    const totalQuantity = this.state.filteredSales.reduce(
      (total, sale) => total + parseInt(sale.quantity),
      0
    );
    this.setState({ totalQuantity });
  }

  calculateTotalSales() {
    const totalSales = this.state.filteredSales.reduce(
      (total, sale) =>
        total + parseFloat(sale.quantity) * parseFloat(sale.price),
      0
    );
    this.setState({ totalSales });
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
    const { filteredSales, totalQuantity, totalSales } = this.state;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const content = [
      { text: " SALES DATA", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "*", "*", "*"],
          body: [
            ["#", "Recording Officer", "Date", "Category", "Rate", "Quantity"],
            ...filteredSales.map((sale, index) => [
              index + 1,
              sale.worker,
              sale.date,
              sale.category,
              sale.price,
              sale.quantity,
            ]),
            ["", "TOTAL QUANTITY SOLD", "", "", "", totalQuantity],
            ["", "TOTAL SALES", "", "", "", totalSales],
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
    pdfDoc.download("filtered_sales_data.pdf"); // This triggers the download
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <br></br>
          <br></br>
          <div className="sales-record h2 text-center mb-3">Sales' Records</div>
          <div className="col-lg-3 mt-2 mb-2">
            <button className="btn btn-success">
              <Link
                to="/createsales"
                style={{ textDecoration: "none", color: "white" }}
              >
                Enter Sales
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
                <th scope="col">Category</th>
                <th scope="col">Rate</th>
                <th scope="col">Quantity Sold</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {this.state.filteredSales.map((sale, index) => (
                <tr key={sale._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{sale.worker}</td>
                  <td>{sale.date}</td>
                  <td>{sale.category}</td>
                  <td>{sale.price}</td>
                  <td>{sale.quantity}</td>
                  <td>
                    {/* <Link className="btn btn-warning" to={`/edit/${sale._id}`}>
                      <i className="fas fa-edit"></i>&nbsp;Edit
                    </Link> */}

                    <button
                      className="btn btn-danger mx-1"
                      onClick={() => this.onDelete(sale._id)}
                    >
                      {/* <FontAwesomeIcon icon={faTrash} className="" /> */}
                      &nbsp;Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan="1"></td>
                <td className="fw-bold">Total Quantity Sold</td>
                <td></td>
                <td></td>
                <td></td>
                <td className="fw-bold">{this.state.totalQuantity}</td>
              </tr>
              <tr>
                <td colSpan="1"></td>
                <td className="fw-bold">Total Sales</td>
                <td></td>
                <td></td>
                <td></td>
                <td className="fw-bold">{this.state.totalSales}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  }
}
