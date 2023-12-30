import "./button.css";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { socket } from "../sockets/socket";
import { setPoint } from "../redux/userSlice";
import User from "../models/user";
import Event from "../sockets/communicate";

interface ButtonGroupProps {
  buttons: Array<number>;
}

const ButtonGroup = ({ buttons }: ButtonGroupProps) => {
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const handleButtonClick = (point: number) => {
    dispatch(setPoint(point));
    socket.timeout(5000).emit(Event.SEND_VOTE, { ...user, point } as User);
  };

  return (
    <div>
      <h2>Point Options</h2>
      <div>
        {buttons.map((btn, index) => (
          <button
            key={index}
            value={btn}
            onClick={() => handleButtonClick(btn)}
            className={btn === user.point ? "selected" : ""}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGroup;
