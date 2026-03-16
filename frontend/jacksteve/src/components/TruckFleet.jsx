const TruckFleet = () => {
  const fleetCategories = [
    {
      title: "Long-Haul Grain Carriers",
      desc: "Heavy-duty 30-ton trucks optimized for cross-county maize transport.",
      count: "12 Vehicles",
      icon: "🚛"
    },
    {
      title: "Distribution Rigids",
      desc: "Agile 10-15 ton trucks for direct delivery to millers and feed plants.",
      count: "8 Vehicles",
      icon: "🚚"
    },
    {
      title: "Field Collection Units",
      desc: "Off-road capable trucks for direct farm-gate collection.",
      count: "4 Vehicles",
      icon: "🚜"
    }
  ];

  return (
    <section className="py-20 bg-js-dark text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-js-orange font-bold uppercase tracking-widest block mb-2">The Power Behind the Mission</span>
            <h2 className="text-4xl md:text-5xl font-black italic">
              OUR <span className="text-js-green">FLEET</span>
            </h2>
            <p className="text-gray-400 mt-4 text-lg">
              Equipped with modern tracking and climate-controlled storage, the Jacksteve fleet ensures every grain of maize arrives in peak condition.
            </p>
          </div>
          <div className="stats bg-transparent border border-gray-700">
            <div className="stat">
              <div className="stat-title text-gray-400">Total Capacity</div>
              <div className="stat-value text-js-orange">500T+</div>
              <div className="stat-desc text-js-green">Daily Movement</div>
            </div>
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fleetCategories.map((item, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-3xl bg-gray-800/50 border border-gray-700 hover:border-js-green transition-all duration-500"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 mb-6">{item.desc}</p>
              <div className="badge bg-js-green/10 text-js-green border-js-green/20 px-4 py-3 font-bold">
                {item.count}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Bar */}
        <div className="mt-16 p-8 rounded-3xl bg-linear-to-r from-js-green to-js-orange flex flex-col md:flex-row items-center justify-between gap-6">
          <h3 className="text-2xl font-black text-white italic">NEED RELIABLE TRANSPORT FOR YOUR HARVEST?</h3>
          <button className="btn btn-lg bg-js-dark text-white border-none rounded-full hover:scale-105 transition-transform px-10">
            Book a Truck
          </button>
        </div>
      </div>
    </section>
  );
};

export default TruckFleet;
