import React, { useState, useRef, useEffect } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import { modalStyles } from "../../styles";
import { axiosWithAuth } from "../../utilities/axiosWithAuth";
import { print } from "graphql";
import { REMOVE_INVITATION } from "../../graphql/events/event-mutations";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteInvitationSuccess,
  forceUpdate,
  makeActive,
  startEventEdit,
} from "../../utilities/actions";
import { useLocation } from "react-router-dom";
import { convertTimeAndDate } from "../../utilities/functions";

import WarnRemoveModal from "./WarnRemoveModal";

const EventButtonModal = ({ eventId, userId }) => {
  const location = useLocation();
  const thisURL = location.pathname.split("/");
  const dispatch = useDispatch();
  const history = useHistory();
  const me = JSON.parse(sessionStorage.getItem("user"));
  const currentEvent = useSelector((state) => state.currentEvent);
  const modalClasses = modalStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };
  const removeInvitation = () => {
    const removeInvite = {
      event_id: Number(eventId),
      user_id: Number(userId),
    };

    axiosWithAuth()
      .post(`${process.env.REACT_APP_BASE_URL}/graphql`, {
        query: print(REMOVE_INVITATION),
        variables: { input: removeInvite },
      })
      .then((res) => {
        dispatch(deleteInvitationSuccess(res.data.data.removeInvitation.users));
        dispatch(forceUpdate());
      })
      .catch((err) => console.log(err));
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <div className={modalClasses.root}>
        <div>
          <IconButton
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <MoreVertIcon />
          </IconButton>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="menu-list-grow"
                      onKeyDown={handleListKeyDown}
                    >
                      {thisURL.length > 2 ? (
                        `${me.id}` === `${currentEvent.user_id}` && (
                          <MenuItem
                            onClick={() => {
                              /* had to add date to eventToEdit object and convert start/end times here for editing 
                                mode to allow moment functions to finish converting before the form rendered */
                              const convertForEdit = convertTimeAndDate(
                                currentEvent
                              );
                              currentEvent.date = convertForEdit.date;
                              currentEvent.startTime = convertForEdit.startTime;
                              currentEvent.endTime = convertForEdit.endTime;
                              dispatch(startEventEdit(currentEvent));
                              history.push("/create-event");
                            }}
                          >
                            Edit Event
                          </MenuItem>
                        )
                      ) : (
                        <MenuItem
                          onClick={() => {
                            dispatch(makeActive(eventId));
                            history.push(`/events/${eventId}`);
                          }}
                        >
                          Open Event
                        </MenuItem>
                      )}
                      <MenuItem>
                        <WarnRemoveModal removeInvitation={removeInvitation} />
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </>
  );
};
export default EventButtonModal;
