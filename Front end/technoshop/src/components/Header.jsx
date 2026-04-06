import React from 'react';
import { Link } from 'react-router-dom';

function Header(props) {
    return (
        <div>
            <section
                className="py-20 relative"
                style={{
                    backgroundImage: "url('https://www.apple.com/v/macbook-pro/aw/images/meta/macbook-pro__difvbgz1plsi_og.png?202603050127')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="max-w-xl mx-auto text-center px-4 relative z-10">
                    <h2 className="text-7xl font-bold text-white mb-3"> {props.data} </h2>
                    <p className="text-gray-200 mb-8"><Link to="/">Home</Link> {'>'} {props.data} </p>
                </div>
            </section>
        </div>
    );
}

export default Header;