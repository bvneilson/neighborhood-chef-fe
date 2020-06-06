import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { print } from "graphql";
import { axiosWithAuth } from "../../../utilities/axiosWithAuth";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../../utilities/actions";

// redux action imports
import {
  createEventSuccess,
  updateEventSuccess,
  cancelEdit,
} from "../../../utilities/actions/index.js";

// graphql query imports
import {
  ADD_EVENT,
  UPDATE_EVENT,
} from "../../../graphql/events/event-mutations.js";

// component and helper function imports
import FormPageOne from "./FormPageOne.js";
import FormPageTwo from "./FormPageTwo.js";
import FormPageThree from "./FormPageThree.js";
import FormPageFour from "./FormPageFour.js";
import { modifierData } from "./FormPageTwo.js";

import { restoreSavedModifiers } from "../../../utilities/functions";

const initialState = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  category_id: "",
  address: "",
  latitude: "",
  longitude: "",
};

const FormContainer = () => {
  const me = JSON.parse(sessionStorage.getItem("user"));
  const page = useSelector((state) => state.page);
  // const [page, setPage] = useState(1);
  const [hashtags, setHashtags] = useState([]);
  const [modifiers, setModifiers] = useState([]);
  const [photo, setPhoto] = useState(null);
  const eventToEdit = useSelector((state) => state.eventToEdit);
  const isEditing = useSelector((state) => state.isEditing);
  const dispatch = useDispatch();

  const resetModifiers = () => {
    return modifierData.map((mod) => (mod.active = false));
  };

  const modifiersWithoutIcon = () => {
    return modifiers.map((mod) => {
      return {
        id: mod.id,
        title: mod.title,
        active: mod.active,
      };
    });
  };

  useEffect(() => {
    if (isEditing) {
      const savedHashtags = eventToEdit.hashtags;
      const savedModifiers = eventToEdit.modifiers;
      if (Object.keys(savedModifiers).length !== 0) {
        restoreSavedModifiers(
          modifierData,
          savedModifiers.modifiers,
          setModifiers
        );
      }
      if (Object.keys(savedHashtags).length !== 0) {
        setHashtags(savedHashtags.hashtags);
      }
      if (eventToEdit.photo !== "null") {
        setPhoto(eventToEdit.photo);
      }
    }
  }, [isEditing, eventToEdit, dispatch]);

  // cleanup
  useEffect(() => {
    return () => {
      resetModifiers();
      dispatch(cancelEdit());
      dispatch(setPage(1));
    };
  }, [dispatch]);

  return (
    <>
      <Formik
        initialValues={isEditing ? eventToEdit : initialState}
        onSubmit={(values, { resetForm }) => {
          let startTime = new Date(`${values.date} ${values.startTime}`);
          let endTime;
          if (values.endTime) {
            endTime = new Date(`${values.date} ${values.endTime}`);
          }
          const event = {
            title: values.title,
            description: values.description,
            category_id: values.category_id,
            address: values.address,
            startTime: startTime.toISOString(),
            endTime: values.endTime ? endTime.toISOString() : null,
            hashtags: JSON.stringify({ hashtags: [...hashtags] }),
            modifiers: JSON.stringify({
              modifiers: [...modifiersWithoutIcon()],
            }),
            longitude: values.longitude,
            latitude: values.latitude,
            photo: photo ? photo : null,
            // replace with variable
            user_id: parseInt(me.id),
          };
          if (isEditing) {
            axiosWithAuth()
              .post(`${process.env.REACT_APP_BASE_URL}/graphql`, {
                query: print(UPDATE_EVENT),
                variables: {
                  id: Number(eventToEdit.id),
                  input: event,
                },
              })
              .then((res) => {
                dispatch(updateEventSuccess(res.data.data.updateEvent));
                setHashtags([]);
                resetForm(initialState);
                resetModifiers();
                setModifiers([]);
                dispatch(setPage(4));
              })
              .catch((err) => console.log(err));
          } else {
            axiosWithAuth()
              .post(`${process.env.REACT_APP_BASE_URL}/graphql`, {
                query: print(ADD_EVENT),
                variables: { input: event },
              })
              .then((res) => {
                dispatch(createEventSuccess(res.data.data.addEvent));
                setHashtags([]);
                resetForm(initialState);
                resetModifiers();
                setModifiers([]);
                dispatch(setPage(4));
              })
              .catch((err) => console.log(err.message));
          }
        }}
      >
        {({ handleSubmit, handleChange, values, setFieldValue }) => (
          <div className="createEventContainer">
            <Form className="createForm" onSubmit={handleSubmit}>
              {page === 1 && (
                <>
                  <FormPageOne
                    values={values}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                </>
              )}

              {page === 2 && (
                <>
                  <FormPageTwo
                    handleChange={handleChange}
                    hashtags={hashtags}
                    setHashtags={setHashtags}
                    modifiers={modifiers}
                    setModifiers={setModifiers}
                    photo={photo}
                    setPhoto={setPhoto}
                  />
                </>
              )}

              {page === 3 && (
                <>
                  <FormPageThree
                    hashtags={hashtags}
                    setHashtags={setHashtags}
                    values={values}
                    handleSubmit={handleSubmit}
                    modifiers={modifiers}
                    setModifiers={setModifiers}
                    photo={photo}
                  />
                </>
              )}
            </Form>
            {page === 4 && (
              <>
                <FormPageFour />
              </>
            )}
          </div>
        )}
      </Formik>
    </>
  );
};

export default FormContainer;
