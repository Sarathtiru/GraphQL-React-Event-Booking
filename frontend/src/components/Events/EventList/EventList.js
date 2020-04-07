import React from "react";
import EventItem from "./EventItem/EventItem";
import "./EventList.css";

const eventList = props => {
    const events = props.events;
    
    // const test = (eve) => {
    //     console.log(eve,'sarath eve');
    // }

  return (
    <ul className="event__list">
      {events.map(item => (
        <EventItem
          key={item._id}
          eventId={item._id}
          title={item.title}
          price={item.price}
          date={item.date}
          userId={props.authUserId}
          creatorId={item.creator._id}
       onDetail={props.onViewDetail}
        // onDetail={test.bind()}
        />
      ))}
    </ul>
  );
};

export default eventList;
