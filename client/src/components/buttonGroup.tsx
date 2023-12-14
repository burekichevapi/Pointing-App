import "./button.css";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { SOCKET } from "../webSocket";
import { setPoint } from "../redux/userSlice";
import { useEffect } from "react";

interface ButtonGroupProps {
  buttons: Array<number>;
}

const ButtonGroup = ({ buttons }: ButtonGroupProps) => {
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.point! <= 0) return;
    SOCKET.emit("send_point", user);
  }, [user, user.point]);

  const handleButtonClick = (point: number) => dispatch(setPoint(point));

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
