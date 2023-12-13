import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import ButtonGroup from "../components/buttonGroup";
import { listenPointSelectionBroadcast } from "../webSocket";
import User from "../models/user";
import { upsertVote } from "../redux/voteSlice";

const VoteSection = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);
  const { votes } = useAppSelector((state: RootState) => state.votes);

  useEffect(() => {
    const listen = async () => {
      const users = (await listenPointSelectionBroadcast()) as User[];
      dispatch(upsertVote(users));
      console.log("Updated users are:", users);
    };
    listen();
  }, [dispatch, votes]);

  return (
    <>
      <div className="App"></div>
      {!user.isObserver && (
        <div>
          <ButtonGroup buttons={[0, 1, 2, 3, 5, 8, 13, 21, 34]} />
        </div>
      )}
      <div>
        <label>
          {user.username}: {user.point}
        </label>
      </div>
      <div>
        <label>
          {Array.from(votes).map((voter, index) => {
            return (
              user.username !== voter.username && (
                <div key={index}>
                  <label>
                    {voter.username}: {voter.point}
                  </label>
                </div>
              )
            );
          })}
        </label>
      </div>
    </>
  );
};

export default VoteSection;
