import React from 'react';

const Footer = () => {
    return (
        <div className="bg-gray-800 text-white py-2 sticky bottom-0">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                     Created by <a href="https://www.linkedin.com/in/prem-kumar-935aa0195/" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">Prem kumar
                    </a>. &copy;{new Date().getFullYear()} TrainTix
                </p>
                <p className="text-sm">
                    For more information, visit our
                    <a href="https://github.com/premiitr/react-projects/tree/main/fastfood" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                        GitHub Repository
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Footer;