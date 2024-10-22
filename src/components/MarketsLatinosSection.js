import React from 'react';

const MarketsLatinosSection = () => {
  return (
    <section className="flex flex-col items-center my-2.5 font-[Poppins]">
      <div className="flex items-center gap-1.5 w-[100%] mb-1.5">
        <h3 className="font-extrabold m-0">
          MARKETS <span className="text-[#f7bb17]">LATINOS</span>
        </h3>
        <p className="m-0">en San Jose</p>
        <svg
          id="Layer_1"
          height="10"
          viewBox="0 0 512 512"
          width="10"
          xmlns="http://www.w3.org/2000/svg"
          fill="#f7bb17"
        >
          <g>
            <path d="m229.001 40.03c-15.494-15.497-36.094-24.03-58.005-24.03s-42.51 8.532-58.007 24.025c-15.492 15.495-24.024 36.094-24.024 58.007 0 21.911 8.532 42.512 24.025 58.004l99.748 99.75-100.536 100.538c-15.885 15.885-24.412 37.004-24.013 59.469.399 22.458 9.687 43.271 26.153 58.606 14.955 13.929 34.593 21.601 55.293 21.601 22.186 0 43.924-9.015 59.644-24.735l179.783-179.783c19.682-19.682 19.682-51.709 0-71.391zm153.29 224.68-179.783 179.783c-8.672 8.672-20.653 13.646-32.872 13.646-11.092 0-21.565-4.066-29.489-11.446-8.88-8.27-13.887-19.482-14.102-31.572-.216-12.1 4.377-23.472 12.93-32.025l109.463-109.464c9.836-9.84 9.836-25.851-.002-35.693l-108.675-108.675c-8.341-8.342-12.935-19.433-12.935-31.232s4.594-22.893 12.935-31.235c8.344-8.342 19.436-12.936 31.235-12.936 11.798 0 22.89 4.595 31.233 12.939l180.062 180.062c4.921 4.921 4.921 12.927 0 17.848z" />
          </g>
        </svg>
      </div>

      <div className="flex justify-around mb-1.5 gap-1.5 w-[100%]">
        <div className="text-center relative">
          <span className="absolute top-0 left-0 mt-1 ml-1 w-[35px] h-[35px] rounded-full bg-cover bg-center bg-no-repeat shadow-[inset_0_1px_2px_0_rgba(60,64,67,0.3),inset_0_2px_6px_2px_rgba(60,64,67,0.15)]" style={{backgroundImage: "url('https://findout.store/wp-content/uploads/2024/05/logoChaparrito-1.png')"}}></span>
          <a href="#" className="no-underline">
            <img
              src="https://findout.store/wp-content/uploads/2024/05/marketsLatinos2-1.png"
              alt="El Chaparral Market"
              className="w-full h-auto rounded-lg shadow-[0px_3px_4px_0px_rgba(0,0,0,0.25)]"
            />
            <p className="font-semibold mt-1.5 text-xs mb-0 leading-[14px]">EL CHAPARRAL MARKET</p>
          </a>
        </div>

        <div className="text-center relative">
          <span className="absolute top-0 left-0 mt-1 ml-1 w-[35px] h-[35px] rounded-full bg-cover bg-center bg-no-repeat shadow-[inset_0_1px_2px_0_rgba(60,64,67,0.3),inset_0_2px_6px_2px_rgba(60,64,67,0.15)]" style={{backgroundImage: "url('https://findout.store/wp-content/uploads/2024/05/chevereLogo.jpg')"}}></span>
          <a href="#" className="no-underline">
            <img
              src="https://findout.store/wp-content/uploads/2024/05/markets1-2.png"
              alt="Chevere Latin Market"
              className="w-full h-auto rounded-lg shadow-[0px_3px_4px_0px_rgba(0,0,0,0.25)]"
            />
            <p className="font-semibold mt-1.5 text-xs mb-0 leading-[14px]">CHEVERE LATIN MARKET</p>
          </a>
        </div>

        <div className="text-center">
          <a href="#" className="no-underline">
            <img
              src="https://findout.store/wp-content/uploads/2024/05/CONOCEmasLugaresAqui.png"
              alt="Conoce más lugares aquí"
              className="w-full h-auto rounded-lg shadow-[0px_3px_4px_0px_rgba(0,0,0,0.25)]"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default MarketsLatinosSection;