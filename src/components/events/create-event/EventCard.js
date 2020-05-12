import React from "react";
import moment from "moment";
import { connect } from "react-redux";

export const EventCard = ({ values }) => {
  function convertTime(time24) {
    let ts = time24;
    let H = +ts.substr(0, 2);
    let h = H % 12 || 12;
    h = h < 10 ? "0" + h : h;
    let ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "2px solid #F3F3F3",
        boxShadow: "0px 4px 15px rgba(179, 179, 179, 0.1)",
        borderRadius: "25px",
        marginTop: "40px",
      }}
    >
      <div style={{ display: "flex", width: "100%" }}>
        <img
          style={{
            width: "40%",
            border: "8px solid #58D473",
            borderRadius: "25px",
          }}
          src="https://images.pexels.com/photos/1309067/pexels-photo-1309067.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
          alt="bbq"
        />

        <div
          style={{
            marginLeft: "30px",
            textAlign: "left",
            width: "50%",
            fontSize: "1.6rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.8rem",
              fontWeight: "500",
              color: "#1A0F2C",
            }}
          >
            {/* {values.title} */}
            BBQ
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p style={{ color: "rgba(0, 0, 0, 0.35)" }}>
              {/* {values.date && moment(Number(values.date)).format("MMM Do YYYY")} */}
              May 22, 2020 .&nbsp;
            </p>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  color: "#82DF96",
                  fontWeight: "500",
                }}
              >
                {/* {convertTime(values.startTime)}&nbsp;  */}
                5:30pm
              </p>

              {/* {values.endTime && (
                <>
                  <p style={{ color: "rgba(0, 0, 0, 0.5)" }}>to&nbsp;</p>
                  <p
                    style={{
                      color: "#ea6565",
                      fontWeight: "500",
                    }}
                  >
                    {convertTime(values.endTime)}
                    9:30pm
                  </p>
                </>
              )} */}
            </div>
          </div>
          {/* <p style={{ color: "rgba(0, 0, 0, 0.5)" }}>{values.address}</p> */}
          <p>123 ABC St</p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    values: state.newEvent,
  };
};

export default connect(mapStateToProps, null)(EventCard);
