"use client";

import Header from "@/components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { LeaderBoard, Options, getLeaderboard, getBestPlayers, play, listenEvent } from "../../Web3Services";


function Game() {
  const [message, setMessage] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderBoard>();

  useEffect(() => {
    getLeaderboard()
      .then((leaderboard) => setLeaderboard(leaderboard))
      .catch((error: Error) => setMessage(error.message));
  
    listenEvent((result: string) => {
      getBestPlayers()
        .then((players) => setLeaderboard({ players, result } as LeaderBoard))
        .catch((err: Error) => setMessage(err.message));
    });
  }, []);
  
  

  function onPlay(option: Options){
    setLeaderboard({...leaderboard, result: "Sending your choice..."});
    play(option)
      .catch((error:Error) => setMessage(error.message));
  }

  return (
    <div>
      <Header />
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto mb-4"
            src="rock-paper-scissor.jpg"
            alt="jokenpo"
            width={72}
          />
          <h2>Administrative Panel</h2>
          <p className="lead">
            Check the beste players scores and play the game.
          </p>
          <p className="lead text-danger">{message}</p>
        </div>
        <div className="col-md-8 col-lg-12">
          <div className="row">
            <div className="col-sm-6">
              <h4 className="mb-3">Best Players</h4>
              <div className="card card-body border-0 shadow table-wrapper table-responsive">
                <table className="table tabble-hover">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard &&
                      leaderboard.players && leaderboard.players.length ? leaderboard.players.map((player) => (
                        <tr key={player.wallet}>
                          <td>{player.wallet}</td>
                          <td>{player.wins}</td>
                        </tr>
                      )) : <tr><td colSpan={2}>Loading...</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-sm-6">
              <h4 className="mb-3"> Games </h4>
              <div className="card card-body border-0 shadow">
                <h5 className="mb-3 tex-primary">Current Status:</h5>
                <div className="alert alert-sucess">
                  {leaderboard && leaderboard.result
                    ? leaderboard.result
                    : "Loading..."}
                </div>
                <h5 className="mb-3 tex-primary">
                  {(leaderboard && leaderboard.result?.indexOf("wow") !== -1) ||
                  leaderboard?.result
                    ? "Start a new game:"
                    : "Play this game:"}
                </h5>
                <div className="d-flex">
                    <div className="alert alert-info me-3 play-button" onClick={()=>onPlay(Options.PAPER)}>
                        <img src="/assets/paper2.jpg" alt="paper" width={100} />
                    </div>
                </div>
                <div className="d-flex">
                    <div className="alert alert-info play-button" onClick={()=>onPlay(Options.ROCK)}>
                        <img src="/assets/rock.png" alt="rock" width={100} />
                    </div>
                </div>
                <div className="d-flex">
                    <div className="alert alert-info ms-3 play-button" onClick={()=>onPlay(Options.SCISSOR)}>
                        <img src="/assets/scissor.jpg" alt="scissor" width={100} />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Game;
