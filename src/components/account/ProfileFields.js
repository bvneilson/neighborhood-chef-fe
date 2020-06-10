import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Field } from "formik";
import { Button } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import ReactMapGL, { Marker } from "react-map-gl";
import Geocoder from "react-mapbox-gl-geocoder";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { buttonStyles, textBoxStyles } from "../../styles";
import { changePage } from "../../utilities/actions";
import Typography from "@material-ui/core/Typography";
import EventImageUpload from "../events/create-event/EventImageUpload";
import MapIcon from "@material-ui/icons/Map";
import IconButton from "@material-ui/core/IconButton";
import RoomIcon from "@material-ui/icons/Room";

const ProfileFields = (props) => {
  const textBoxClass = textBoxStyles();
  const dispatch = useDispatch();
  const classes = buttonStyles();
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  let inputField;
  const [focusAddress, setFocusAddress] = useState(false);
  const addressLabel = useRef();
  const geoInput = useRef();

  const moveFocus = (e) => {
    e.preventDefault();
    setFocusAddress(true);
    addressLabel.current.focus();
  };

  const changePhoto = (photo) => {
    setPhoto(photo);
    props.setFieldValue("photo", photo);
  };
  const mapAccess = {
    mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  };
  const mapStyle = {
    width: "40vw",
    height: "70vh",
  };
  const queryParams = {
    country: "us",
  };
  const [viewport, setViewport] = useState(Window.innerWidth);
  const [longLat, setLongLat] = useState("");

  const handleChange = (e) => {
    setGender(e.target.value);
    props.setFieldValue("gender", e.target.value);
  };

  const onSelected = (viewport, item) => {
    setMapOpen(true);
    setLongLat({ longitude: viewport.longitude, latitude: viewport.latitude });
    setViewport(viewport);
    props.setFieldValue("location", {
      address: item.place_name,
      latitude: item.center[1],
      longitude: item.center[0],
    });
  };

  useEffect(() => {
    let inputList = document.getElementsByTagName("input");
    // geoInput.current = inputList[2];
    geoInput.current = inputList[2];

    geoInput.current.classList.add(textBoxClass.addressInput);
    geoInput.current.addEventListener("focusin", () => {
      setFocusAddress(true);
    });
    geoInput.current.addEventListener("focusout", () => {
      setFocusAddress(false);
    });
    addressLabel.current = geoInput.current;
  }, []);

  useEffect(() => {
    return () => {
      dispatch(changePage(1));
    };
  }, [dispatch]);

  return (
    <>
      <Field
        style={{ marginTop: "10px" }}
        component={TextField}
        type="name"
        name="firstName"
        className="firstName"
        label="First Name"
        required
      />
      <Field
        style={{ marginTop: "10px" }}
        component={TextField}
        type="name"
        name="lastName"
        className="lastName"
        label="Last Name"
        required
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "-12%",
        }}
      >
        <label
          className={
            textBoxStyles({
              isFocus: focusAddress,
              addressValue: geoInput.current ? geoInput.current.value : null,
            }).addressLabel
          }
          onClick={moveFocus}
        >
          <Typography
            variant={
              focusAddress || (geoInput.current && geoInput.current.value)
                ? "body2"
                : "h6"
            }
          >
            Address*
          </Typography>
        </label>
        <IconButton
          className={
            textBoxStyles({
              isFocus: focusAddress,
              addressValue: geoInput.current ? geoInput.current.value : null,
            }).icon
          }
          aria-label="toggle show map"
          onClick={() => setMapOpen(!mapOpen)}
        >
          <MapIcon />
        </IconButton>
      </div>

      <div className="geocoder-container">
        <Geocoder
          {...mapAccess}
          name="location"
          onSelected={onSelected}
          limit={2}
          viewport={viewport}
          hideOnSelect={true}
          queryParams={queryParams}
          updateInputOnSelect={true}
        />
      </div>

      <ReactMapGL
        className={mapOpen ? "" : "hidden"}
        style={{ position: "absolute", right: 50, top: 120 }}
        {...mapAccess}
        {...viewport}
        {...mapStyle}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={(newViewport) => setViewport(newViewport)}
      >
        {longLat && mapOpen && (
          <Marker {...longLat} offsetLeft={-15} offsetTop={-15}>
            <RoomIcon fontSize="large" />
          </Marker>
        )}
      </ReactMapGL>
      <Field
        style={{ marginTop: "10px", marginBottom: "10px" }}
        component={FormControl}
        required
      >
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          value={gender}
          onChange={handleChange}
          label="Gender"
          name="gender"
        >
          <MenuItem value={"male"}>Male</MenuItem>
          <MenuItem value={"female"}>Female</MenuItem>
          <MenuItem value={"other"}>Other</MenuItem>
        </Select>
      </Field>
      <EventImageUpload
        photo={photo}
        setPhoto={changePhoto}
        title="Upload a picture for your avatar (optional)"
      />

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          className={`${classes.root} ${classes.notActive}`}
          onClick={() => dispatch(changePage(1))}
        >
          <Typography variant="h5">Back</Typography>
        </Button>
        <Button
          className={`${classes.root} ${classes.active}`}
          variant="contained"
          color="primary"
          type="submit"
          disabled={props.submitting}
        >
          <Typography variant="h5">
            {props.submitting ? (
              <CircularProgress style={{ color: "white" }} />
            ) : (
              "Submit"
            )}
          </Typography>
        </Button>
      </div>
    </>
  );
};

export default ProfileFields;
