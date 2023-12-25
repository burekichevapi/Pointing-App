import { useCallback, useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import ButtonGroup from "../components/buttonGroup";
import { SOCKET } from "../webSocket";
import User from "../models/user";
import { upsertVote } from "../redux/voteSlice";

const VoteForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);
  const { votes } = useAppSelector((state: RootState) => state.votes);
  const [revealVotes, setRevealVotes] = useState(false);

  const listenForVotes = useCallback(async () => {
    SOCKET.on("update_votes", (users: User[]) => {
      dispatch(upsertVote(users));
    });
  }, [dispatch]);

  const listenForShowVotes = useCallback(async () => {
    SOCKET.on("show_votes", () => setRevealVotes(true));
  }, []);

  useEffect(() => {
    listenForVotes();
    listenForShowVotes();
    SOCKET.emit("on_load", user.roomId);
  }, [dispatch, listenForShowVotes, listenForVotes, user.roomId, votes]);

  const handleOnClickReveal = () => {
    SOCKET.emit("reveal_votes", user.roomId);
    setRevealVotes(true);
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
      <div>
        <label>
          {user.username}: {user.point}
        </label>
      </div>
      <div>
        <div>
          {Array.from(votes).map((voter, index) => {
            return (
              user.username !== voter.username && (
                <div key={index}>
                  <label>
                    {voter.username}: {revealVotes && voter.point}
                  </label>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
};

export default VoteForm;
