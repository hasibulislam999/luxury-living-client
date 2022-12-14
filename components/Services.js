import { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";

const Services = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    fetch("https://ll-luxury-living.herokuapp.com/admin/servicing")
    
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);
  return (
    <section className="my-12 py-8" id="services">
      <SectionHeader
        name={"Services"}
        title={
          "We're an agency tailored to all clients' needs that always delivers"
        }
      />
      <div className="container mx-auto">
        <div className="py-8">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-x-4 gap-4 lg:px-0 px-4">
            {services
              .slice(services?.length - 3, services?.length)
              ?.map((service) => (
                <div
                  key={service._id}
                  className="text-center p-16 rounded-xl hover:shadow-2xl hover:bg-white transition-all duration-500"
                >
                  <picture>
                    <img
                      src={`https://ll-luxury-living.herokuapp.com/${service.avatar}`}
                      alt={service.name}
                      className="w-[100px] h-[100px] object-cover rounded-full shadow-xl mx-auto mb-4 "
                      style={{ maxWidth: "100%" }}
                    />
                  </picture>
                  <h2 className="font-bold text-lg">{service.name}</h2>
                  <h3 className="font-bold text-[#291956]">${service.price}</h3>
                  <p className="text-gray-500">{service.description}</p>
                </div>
              ))
              .reverse()}
          </div>
        </div>
        {/* <div className="text-center mt-4">
          <button className="btn rounded px-12 bg-[#251D58]">
            Explore more
          </button>
        </div> */}
      </div>
    </section>
  );
};
export default Services;
