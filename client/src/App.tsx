import "./App.css";
import { useEffect } from "react";
import ButtonGroup from "./components/buttonGroup";
import { RootState, useAppDispatch, useAppSelector } from "./redux/store";
import { setBroadcastSelection } from "./redux/pointSlice";
import socket from "./webSocket";

const App = () => {
  const { userSelection, broadcastSelection } = useAppSelector(
    (state: RootState) => state.point
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on("receive_point", (data) => {
      dispatch(setBroadcastSelection(data.point));
    });
  }, [broadcastSelection, dispatch]);

  return (
    <>
      <div className="App"></div>
      <div>
        <ButtonGroup buttons={[0, 1, 2, 3, 5, 8, 13, 21, 34]} />
      </div>
      <div>My Selection: {userSelection}</div>
      <div>Others Selection: {broadcastSelection}</div>
    </>
  );
};

export default App;
