const FleetGallery = () => {
  const fleet = [
    {
      id: 'JS-001',
      name: 'Maize Master',
      image: '/truck1.jpg',
      status: 'Sourcing',
      currentCargo: '12 Tons',
      type: 'Truck',
      capacity: '15 Tons'
    },
    {
      id: 'JS-002',
      name: 'Backhaul Builder',
      image: '/truck2.jpg',
      status: 'Backhaul',
      currentCargo: '8 Tons',
      type: 'Truck',
      capacity: '10 Tons'
    }
  ];


  return (
    <section className="py-24 bg-base-100 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-primary">
              Our <span className="text-secondary">Fleet</span>
            </h2>
            <p className="text-neutral/60 mt-4 max-w-lg font-medium">
              4+ Heavy-duty trucks optimized for the agricultural-to-industrial supply chain. 
              Reliable, tracked, and always on the move.
            </p>
          </div>
          <div className="stats shadow bg-primary text-primary-content rounded-2xl hidden md:inline-flex">
            <div className="stat px-8">
              <div className="stat-title text-primary-content/70">Total Capacity</div>
              <div className="stat-value text-3xl">120+ Tons</div>
              <div className="stat-desc text-primary-content/60">Across entire fleet</div>
            </div>
          </div>
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fleet.map((truck) => (
            <div key={truck.id} className="group relative overflow-hidden rounded-3xl bg-neutral shadow-2xl h-[450px]">
              
              {/* Truck Image */}
              <img 
                src={truck.image} 
                alt={truck.name} 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral via-transparent to-transparent flex flex-col justify-end p-8">
                <div className="flex justify-between items-start mb-2">
                  <span className={`badge ${truck.status === 'Sourcing' ? 'badge-primary' : 'badge-secondary'} font-bold border-none uppercase text-xs py-3 px-3 shadow-lg`}>
                    {truck.status === 'Sourcing' ? '🌽 Maize Trip' : '🏗️ Backhaul'}
                  </span>
                  <span className="text-white/50 font-mono text-xs">{truck.id}</span>
                </div>

                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-2">
                  {truck.name}
                </h3>
                
                <div className="space-y-1 mb-4">
                  <p className="text-white/80 text-sm font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 
                    Cargo: {truck.currentCargo}
                  </p>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest italic">
                    {truck.type} • {truck.capacity}
                  </p>
                </div>

                <button className="btn btn-sm btn-outline text-white border-white/20 group-hover:bg-white group-hover:text-neutral group-hover:border-white rounded-full transition-all">
                  Track Delivery
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Operational Banner */}
        <div className="mt-12 bg-base-200 border-2 border-dashed border-base-300 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
              <svg xmlns="http://www.w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-black text-neutral uppercase italic">Efficiency Guarantee</h4>
              <p className="text-sm text-neutral/50">Our backhaul system reduces CO2 and costs by 40%.</p>
            </div>
          </div>
          <button className="btn btn-primary rounded-full px-8">Inquire for Bulk Transport</button>
        </div>

      </div>
    </section>
  );
};

export default FleetGallery;
