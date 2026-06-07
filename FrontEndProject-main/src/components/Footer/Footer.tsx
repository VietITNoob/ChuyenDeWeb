import {
  FOOTER_COLUMNS,
  FOOTER_NOTES,
  FOOTER_LEGAL_LINKS,
} from './footer.data';

const Footer = () => {
  return (
    <footer className="bg-apple-lightbg pt-8 pb-5 font-sans border-t border-apple-border mt-10 text-apple-gray">
      <div className="max-w-[1024px] mx-auto px-[22px]">

        {/* NOTES */}
        <div className="text-[12px] leading-tight pb-4 border-b border-apple-border mb-5">
          {FOOTER_NOTES.map((note, index) => (
            <p key={index} className="m-0 mb-2.5 last:mb-0">{note}</p>
          ))}
        </div>

        {/* LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 pb-5">
          {FOOTER_COLUMNS.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-6">
              {col.sections.map((section) => (
                <div key={section.title} className="flex flex-col">
                  <span className="text-[12px] font-semibold text-apple-dark mb-2">{section.title}</span>
                  <ul className="list-none p-0 m-0">
                    {section.links.map((link) => (
                      <li key={link.href} className="mb-1.5">
                        <a 
                          href={link.href} 
                          className="text-[12px] text-apple-gray no-underline hover:text-apple-dark hover:underline transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 border-t border-apple-border gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8">
            <div className="text-[12px]">
              Bản quyền © 2024 CodeStore Inc. Bảo lưu mọi quyền.
            </div>
            <ul className="list-none p-0 m-0 flex flex-wrap gap-2 md:gap-3 items-center">
              {FOOTER_LEGAL_LINKS.map((item, index) => (
                <li key={item.href} className="flex items-center gap-2 md:gap-3 text-[12px]">
                  <a href={item.href} className="text-apple-dark no-underline hover:underline">
                    {item.label}
                  </a>
                  {index < FOOTER_LEGAL_LINKS.length - 1 && <span className="text-[#d2d2d7]">|</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-apple-dark whitespace-nowrap">
            <span>Việt Nam</span>
            <span className="text-[#d2d2d7]">|</span>
            <span>Tiếng Việt</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
