import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import ButtonGroup from "../components/buttonGroup";
import { socket } from "../sockets/socket";
import Votes from "../components/votes";
import { toggleShowVotes } from "../redux/voteSlice";
import Event from "../sockets/event";

const EstimateRoom = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.timeout(5000).emit(Event.USER_LEAVE_ROOM, user);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch, user]);

  useEffect(() => {
    const onShowVotes = () => dispatch(toggleShowVotes());

    socket.on(Event.SHOW_VOTES, onShowVotes);

    return () => {
      socket.off(Event.SHOW_VOTES, onShowVotes);
    };
  }, [dispatch, user]);

  const handleOnClickReveal = () => {
    socket.timeout(5000).emit(Event.SHOW_VOTES, user.roomId);
    dispatch(toggleShowVotes());
  };

  return (
    <>
      <div>Room: {user.roomId}</div>
      {!user.isObserver && (
        <div>
          <ButtonGroup buttons={[0, 1, 2, 3, 5, 8, 13, 21, 34]} />
        </div>
      )}
      <button onClick={handleOnClickReveal}>Reveal</button>
      <Votes />
    </>
  );
};

export default EstimateRoom;
