"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dashboard, getDashboard, upgrade, setComission, setBid } from "@/Web3Services";

function Admin() {
  const [message, setMessage] = useState("");
  const [dashboard, setDashboard] = useState<Dashboard>({});

  useEffect(()=>{
    getDashboard()
        .then(dashboard => setDashboard(dashboard))
        .catch(err=> setMessage(err.message));
  },[])

  function onInputChange(event:React.ChangeEvent<HTMLInputElement>){
    setDashboard(previousState=> ({...previousState, [event.target.id]: event.target.value}));
  }

  function onChangeBidClick(){
    if(!dashboard.bid)
        return setMessage("Bid is required.")
    setBid(dashboard?.bid)
        .then(tx => setMessage("Sucess. tx: "+ tx))
        .catch(err => setMessage(err.message))
    }
  
  function onChangeComissionClick(){
    if(!dashboard.comission)
        return setMessage("Comission is required.")
    setComission(dashboard?.comission)
        .then(tx => setMessage("Sucess. tx: "+ tx))
        .catch(err => setMessage(err.message))
  }

  function onUpgradeClick(){
    if(!dashboard.address)
        return setMessage("Address is required.")
    upgrade(dashboard?.address)
        .then(tx => setMessage("Sucess. tx: "+ tx))
        .catch(err => setMessage(err.message))
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
            Change the players bid, your comission and upgrade the contract.{" "}
          </p>
          <p className="lead text-danger">{message}</p>
        </div>
        <div className="col-md-8 col-lg-12">
          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="bid" className="form-label">
                Bid(wei):
              </label>
              <div className="input-group">
                <input type="number" className="form-control" id="bid" value={dashboard.bid || ""} onChange={onInputChange}/>
                <span className="input-group-text bg-secondary">wei</span>
                <button type="button" className="btn btn-primary d-inline-flex align-items-center" onClick={onChangeBidClick}>Change bid</button>
              </div>
            </div>
            <div className="col-sm-6">
              <label htmlFor="comission" className="form-label">
                Comisson(%):
              </label>
              <div className="input-group">
                <input type="number" className="form-control" id="comission" value={dashboard.comission || ""} onChange={onInputChange}/>
                <span className="input-group-text bg-secondary">%</span>
                <button type="button" className="btn btn-primary d-inline-flex align-items-center" onClick={onChangeComissionClick}>Change comission</button>
              </div>
            </div>
          </div>
          <div className="row py-5">
            <div className="col-sm-12">
            <label htmlFor="address" className="form-label">
                New Contract (address):
              </label>
              <div className="input-group">
                <input type="text" className="form-control" id="address" value={dashboard.address || ""} onChange={onInputChange}/>
                <button type="button" className="btn btn-primary d-inline-flex align-items-center" onClick={onUpgradeClick}>Upgrade Contract</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin
