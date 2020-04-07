import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "./Spinner/Spinner";
import BookingList from "./Bookings/BookingList/BookingList";
import BookingsChart from "./Bookings/BookingChart/BookingsChart";
import BookingsControl from "./Bookings/BookingsContols/BookingsControls";
import "./Booking.css";

class BookingsPage extends Component {
  state = {
    bookings: [],
    isLoading: false,
    outputType: "list"
  };

  static contextType = AuthContext;
  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    let requestBody = {
      query: `
             query{
                    bookings{
                        _id
                        createdAt
                        event{
                            _id
                            title
                            date
                            price
                        }
                          }
                      }`
    };

    const token = this.context.token;

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        this.setState({
          bookings: bookings,
          isLoading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  deleteBookingHandler = bookingId => {
    this.setState({ isLoading: true });
    let requestBody = {
      query: `
             mutation CancelBooking($id:ID!){
                    cancelBooking(bookingId:$id){
                        _id
                        title

                          }
                      }`,
      variables: { id: bookingId }
    };

    const token = this.context.token;

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        const updatedBookings = this.state.bookings.filter(booking => {
          return booking._id !== bookingId;
        });

        this.setState({
          bookings: updatedBookings,
          isLoading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  changeOutputTypeHandler = outputType => {
    if (outputType === "list") {
      this.setState({ outputType: "list" });
    } else {
      this.setState({ outputType: "chart" });
    }
  };
  render() {
    //let output = null;

    let content = <Spinner />;

    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingsControl
            activeOutputType={this.state.outputType}
            onChange={this.changeOutputTypeHandler}
          />
          <div>
            {this.state.outputType === "list" ? (
              <BookingList
                bookings={this.state.bookings}
                onDelete={this.deleteBookingHandler}
              />
            ) : (
              <BookingsChart bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    }

    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default BookingsPage;
