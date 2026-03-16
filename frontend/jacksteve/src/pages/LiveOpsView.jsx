import React from "react";

const LiveOpsView = ({ fleet }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral/40 italic">
          Active Fleet Telemetry
        </h3>
        <span className="text-[10px] font-black uppercase text-primary animate-pulse italic">
          ● Sat-Link Active
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {fleet.length > 0 ? (
          fleet.map((truck) => (
            <div
              key={truck.truckId}
              className="group card lg:card-side bg-white shadow-xl hover:shadow-2xl transition-all border border-base-200 overflow-hidden rounded-[2rem]"
            >
              {/* LEFT: TRUCK UNIT ID & ICON */}
              <div className="bg-neutral p-6 text-white flex flex-col justify-center items-center w-full lg:w-48 text-center transition-colors group-hover:bg-primary">
                <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">
                  {truck.truckId}
                </span>
                <div className="text-5xl my-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  🚛
                </div>
                <span className="text-[10px] font-black uppercase italic tracking-tighter text-secondary group-hover:text-white">
                  {truck.model}
                </span>
              </div>

              {/* CENTER: LIVE DATA GRID */}
              <div className="card-body p-8 flex-row items-center justify-between">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-grow">
                  {/* Status Badge */}
                  <div>
                    <p className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest leading-none">
                      Operational Status
                    </p>
                    <div className="badge badge-primary font-black italic text-[9px] p-3 uppercase tracking-tighter">
                      {truck.status}
                    </div>
                  </div>

                  {/* Current Cargo */}
                  <div>
                    <p className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest leading-none">
                      Current Cargo
                    </p>
                    <p className="font-black text-neutral uppercase italic text-xs tracking-tighter">
                      {truck.activeMission?.cargoType || "UNLOADED"}
                    </p>
                  </div>

                  {/* Live Location */}
                  <div>
                    <p className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest leading-none">
                      GPS Positioning
                    </p>
                    <p className="font-black text-neutral text-xs flex items-center gap-1 uppercase italic tracking-tighter">
                      <span className="w-2 h-2 bg-success rounded-full animate-ping"></span>{" "}
                      {truck.location?.name || "EN ROUTE"}
                    </p>
                  </div>

                  {/* Fuel Telemetry */}
                  <div className="hidden md:block">
                    <p className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest leading-none">
                      Fuel Reserve
                    </p>
                    <div className="flex items-center gap-3">
                      <progress
                        className="progress progress-primary w-20 h-1.5 bg-base-200"
                        value={truck.telemetry?.fuelLevel}
                        max="100"
                      ></progress>
                      <span className="text-[10px] font-black italic">
                        {truck.telemetry?.fuelLevel}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: TACTICAL ACTION */}
                <div className="hidden lg:flex items-center ml-4">
                   <button className="btn btn-circle btn-ghost hover:bg-neutral hover:text-white transition-all border-none shadow-sm">
                      <svg xmlns="http://www.w3.org" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border-4 border-dashed border-base-200">
             <p className="text-xl font-black italic text-neutral/20 uppercase tracking-[0.4em]">No Active Units Found In Deployment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveOpsView;
