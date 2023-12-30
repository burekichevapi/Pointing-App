import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { socket } from "../sockets/socket";
import User from "../models/user";
import { upsertVote } from "../redux/voteSlice";
import Event from "../sockets/event";

const Votes = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);
  const { votes, revealVotes } = useAppSelector(
    (state: RootState) => state.votes
  );

  useEffect(() => {
    socket.on(Event.UPDATE_VOTES, (updatedVotes: User[]) => {
      if (JSON.stringify(updatedVotes) !== JSON.stringify(votes))
        dispatch(upsertVote(updatedVotes));
    });
    socket.timeout(5000).emit(Event.PAGE_LOAD, user.roomId);

    return () => {
      socket.off(Event.UPDATE_VOTES);
    };
  }, [dispatch, user.roomId, votes]);

  return (
    <div>
      <div>
        <label>
          {user.username}: {user.point}
        </label>
      </div>
      {Array.from(votes).map((voter, index) => {
        return (
          user.id !== voter.id && (
            <div key={index}>
              <label>
                {voter.username}: {revealVotes && voter.point}
              </label>
            </div>
          )
        );
      })}
    </div>
  );
};

export default Votes;
