import React from 'react';
import { MEGA_DROPDOWN_CONFIG } from './megaDropdown.data';

interface Props {
  visible: boolean;
}

const MegaDropdown: React.FC<Props> = ({ visible }) => {
  return (
    <div className={`absolute top-[52px] left-0 right-0 bg-white/95 backdrop-blur-[20px] border-b-4 border-black/10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] rounded-lg overflow-hidden z-10 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${visible ? 'h-[340px] opacity-100 visible delay-0' : 'h-0 opacity-0 invisible delay-500'}`}>
      
      {/* Cấu trúc pseudo-element thay bằng div cho gradient border bottom effect */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#0071e3] to-transparent origin-center z-10 transition-all duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${visible ? 'opacity-100 scale-x-100 delay-100' : 'opacity-0 scale-x-50'}`}></div>

      <div className="max-w-[1024px] mx-auto px-[22px] py-10 flex justify-start gap-[96px]">
        {MEGA_DROPDOWN_CONFIG.map((column, index) => (
          <div 
            key={column.title} 
            className={`transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: visible ? `${(index + 1) * 100}ms` : '0ms' }}
          >
            <h4 className="text-[11px] text-[#8b8b91] mb-5 font-semibold tracking-wider uppercase">{column.title}</h4>
            <ul className="list-none p-0 m-0">
              {column.items.map((item) => (
                <li key={item.href} className="mb-3.5">
                  <a 
                    href={item.href}
                    className="block no-underline text-[#1d1d1f] text-[20px] font-semibold tracking-normal transition-all duration-200 hover:text-apple-blue hover:translate-x-1"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaDropdown;
