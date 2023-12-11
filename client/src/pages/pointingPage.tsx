import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import ButtonGroup from "../components/buttonGroup";
import { setBroadcastSelection } from "../redux/pointSlice";
import { listenPointSelectionBroadcast } from "../webSocket";

const PointingPage = () => {
  const dispatch = useAppDispatch();
  const { userSelection, broadcastSelection } = useAppSelector(
    (state: RootState) => state.point
  );

  useEffect(() => {
    const listen = async () => {
      const point = (await listenPointSelectionBroadcast()) as number;
      dispatch(setBroadcastSelection(point));
    };
    listen();
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

export default PointingPage;
