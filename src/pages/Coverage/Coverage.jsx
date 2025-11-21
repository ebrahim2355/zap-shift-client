import React, { useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { useLoaderData } from 'react-router';

const Coverage = () => {
    const position = [23.6850, 90.3563];
    const serviceCenters = useLoaderData();
    const mapRef = useRef(null);
    // console.log(serviceCenters);

    const handleSearch = e => {
        e.preventDefault();
        const location = e.target.location.value;
        const district = serviceCenters.find(c => c.district.toLowerCase().includes(location.toLowerCase()));
        if(district){
            const coord = [district.latitude, district.longitude];
            console.log(district, coord);

            mapRef.current.flyTo(coord, 14);
        }
    }

    return (
        <div>
            <h2 className='text-5xl font-bold my-12'>We are available in 64 districts</h2>
            <div>
                <form className='flex justify-center mb-12' onSubmit={handleSearch}>
                    <label className="flex items-center outline pl-6 rounded-xl">
                        <svg className="h-[1em] opacity-50 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input type="search" className="outline-0 py-2" placeholder="Search" name='location' />
                        <input type="submit" value="Enter" className='bg-primary h-full px-3 cursor-pointer rounded-r-xl hover:text-lg transition-all duration-300'/>
                    </label>
                </form>
            </div>
            <div className='w-full h-[800px] mb-20'>
                <MapContainer
                    center={position}
                    zoom={8}
                    scrollWheelZoom={false}
                    className='h-[800px]'
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {
                        serviceCenters.map((center, i) =>
                            <Marker key={i} position={[center.latitude, center.longitude]}>
                                <Popup>
                                    <strong>{center.district}</strong> <br /> Service Area: {center.covered_area.join(", ")}.
                                </Popup>
                            </Marker>
                        )
                    }

                </MapContainer>
            </div>
        </div>
    );
};

export default Coverage;