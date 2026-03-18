import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  DragOverlay, 
  PointerSensor, 
  useSensor, 
  useSensors
} from '@dnd-kit/core';
import axios from 'axios';
const API_BASE_URL = "https://jacksteve.onrender.com";


// --- 🏗️ DRAGGABLE REQUEST CARD ---
const DraggableRequest = ({ task, isOverlay }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: { task }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging && !isOverlay ? 0.3 : 1,
  };

  return (
    <div 
      ref={setNodeRef} style={style} {...listeners} {...attributes}
      className={`p-5 bg-white/5 border border-white/10 rounded-2xl cursor-grab active:cursor-grabbing mb-3 transition-all 
        ${isOverlay ? 'border-primary shadow-2xl bg-neutral scale-105 rotate-2' : 'hover:bg-white/10'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Signal Detected</span>
        <span className="text-[9px] opacity-20 font-black italic text-white">#{task._id.slice(-4)}</span>
      </div>
      <p className="font-black italic text-sm text-white uppercase truncate">{task.location || task.dropOffLocation}</p>
      <p className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">
        {task.maizeQuantity || task.quantity} Units • {task.commodityType || 'MAIZE'}
      </p>
    </div>
  );
};

// --- 🚛 DROPPABLE TRUCK CARD ---
const DroppableTruck = ({ truck, activeId }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: truck.truckId,
    data: { truck }
  });

  // Pulse effect when any drag starts to show this is a drop target
  const dragActive = !!activeId;

  return (
    <div 
      ref={setNodeRef}
      className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden
        ${isOver ? 'bg-primary/20 border-primary scale-105 shadow-2xl shadow-primary/40' : 
          dragActive ? 'bg-white border-primary/30 border-dashed animate-pulse' : 'bg-white border-slate-100 shadow-xl'}`}
    >
      {isOver && (
        <div className="absolute inset-0 bg-primary/10 animate-pulse pointer-events-none" />
      )}
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <span className={`text-4xl transition-transform duration-500 ${isOver ? 'scale-125 rotate-12' : ''}`}>🚛</span>
        <div className={`badge font-black italic text-[9px] border-none py-3 px-4 ${isOver ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
          {isOver ? 'LINK ESTABLISHED' : 'READY FOR SYNC'}
        </div>
      </div>

      <h3 className="font-black italic text-2xl uppercase text-neutral leading-none mb-1 tracking-tighter">{truck.truckId}</h3>
      <p className="text-[10px] font-black text-secondary uppercase italic tracking-widest">{truck.model}</p>
      
      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        <div>
          <p className="text-[8px] font-black uppercase opacity-30 leading-none mb-1">Assigned Pilot</p>
          <p className="text-[11px] font-black uppercase text-neutral/80">{truck.currentDriver}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black uppercase opacity-30 leading-none mb-1">Fuel</p>
          <p className="text-[11px] font-black italic text-primary">{truck.telemetry?.fuelLevel || 100}%</p>
        </div>
      </div>
    </div>
  );
};

const AdminDispatchControl = () => {
  const [requests, setRequests] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [activeTask, setActiveTask] = useState(null); // For DragOverlay

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // Prevents accidental drags when clicking
    })
  );

  const fetchDispatchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [reqRes, truckRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/farmers`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/fleet/status`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setRequests(reqRes.data.data.filter(r => r.status === 'PENDING_PICKUP' || r.status === 'PENDING_DISPATCH'));
      setTrucks(truckRes.data.data.filter(t => t.status === 'IDLE'));
    } catch (err) {
      console.error("Fetch Failed", err);
    }
  };

  useEffect(() => {
    Promise.resolve().then(fetchDispatchData);
  }, []);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(requests.find(r => r._id === active.id));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (over && active) {
      const requestId = active.id;
      const truckId = over.id;
      
      try {
        const token = localStorage.getItem("token");
        await axios.post("/api/fleet/assign", { truckId, harvestId: requestId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Optimistic UI Update
        setRequests(prev => prev.filter(r => r._id !== requestId));
        setTrucks(prev => prev.filter(t => t.truckId !== truckId));
        
        // Trigger a subtle toast/alert
        console.log(`🛰️ Unit ${truckId} Engaged.`);
      } catch {
        alert("❌ Sync Failure: Deployment aborted.");
      }
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 lg:p-12 bg-slate-50 min-h-screen">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl lg:text-7xl font-black italic text-neutral uppercase tracking-tighter leading-none">
              TACTICAL <span className="text-primary text-shadow-glow">DISPATCH</span>
            </h1>
            <p className="text-neutral/40 font-bold uppercase tracking-widest text-[10px] mt-3 italic">
              Satellite Asset Allocation Terminal
            </p>
          </div>
          <button 
            onClick={fetchDispatchData}
            className="btn btn-circle btn-ghost opacity-20 hover:opacity-100 hover:rotate-180 transition-all duration-700"
          >
            🔄
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          {/* SUPPLY RADAR */}
          <div className="lg:col-span-1 bg-neutral p-8 rounded-[3rem] shadow-2xl border-t-8 border-primary h-[75vh] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
            <h3 className="text-xl font-black italic text-white uppercase border-b border-white/10 pb-6 mb-6 flex justify-between">
              Radar Feed <span className="text-primary">{requests.length}</span>
            </h3>
            
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {requests.map(task => (
                <DraggableRequest key={task._id} task={task} isOverlay={false} />
              ))}
              {requests.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-20 italic">
                  <span className="text-4xl mb-4">📡</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Sector Clear</p>
                </div>
              )}
            </div>
          </div>

          {/* ASSET FLEET */}
          <div className="lg:col-span-3">
             <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {trucks.map(truck => (
                  <DroppableTruck key={truck.truckId} truck={truck} activeId={activeTask?._id} />
                ))}
             </div>
             
             {trucks.length === 0 && (
                <div className="h-[60vh] flex flex-col items-center justify-center p-20 border-4 border-dashed border-slate-200 rounded-[4rem] bg-white/50">
                   <p className="text-3xl font-black italic text-neutral/10 uppercase tracking-[0.5em] text-center">
                    All Units Deployed
                   </p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* The Ghost Card that follows the mouse */}
      <DragOverlay dropAnimation={{
        duration: 300,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeTask ? (
          <DraggableRequest task={activeTask} isOverlay={true} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default AdminDispatchControl;
