// React
import { useState, useEffect } from 'react';

// React Bootstrap Components
import { Image } from 'react-bootstrap';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectUserLinks } from '../redux/userSlice';

// Utilities
import { generateBackgroundColor, getPlatformIcon } from '../utils/helper';

// Classnames
import classNames from 'classnames';

const DynamicSvg = () => {
    const user = useSelector(selectCurrentUser);
    const links = useSelector(selectUserLinks);
    const initialYPositions = Array.from({ length: 5 }, (_, index) => 278 + index * 64);
    const [rectangles, setRectangles] = useState(initialYPositions);
    const [svgHeight, setSvgHeight] = useState(632);

    useEffect(() => {
        if (links?.length > 5) {
            // Calculate new rectangle positions based on the length of links
            const newRectangles = Array.from({ length: links.length }, (_, index) => 278 + index * 64);
            setRectangles(newRectangles);

            // Adjust SVG height if needed
            if (newRectangles.length > 0) {
                const lastY = newRectangles[newRectangles.length - 1];
                if (lastY > 590) {
                    // Adjust SVG height if needed
                    setSvgHeight(lastY + 98);
                } else {
                    // Reset to initial height if rectangles fit within it
                    setSvgHeight(632);
                }
            }
        }
    }, [links])

    // Adjusted path data based on svgHeight
    const pathD = `M1 54.5C1 24.953 24.953 1 54.5 1h199C283.047 1 307 24.953 307 54.5v${svgHeight - 109}c0 29.547-23.953 53.5-53.5 53.5h-199C24.953 ${svgHeight - 1} 1 ${svgHeight - 24.953} 1 ${svgHeight - 54.5}v-523Z`;
    const pathFillD = `M12 55.5C12 30.923 31.923 11 56.5 11h24C86.851 11 92 16.149 92 22.5c0 8.008 6.492 14.5 14.5 14.5h95c8.008 0 14.5-6.492 14.5-14.5 0-6.351 5.149-11.5 11.5-11.5h24c24.577 0 44.5 19.923 44.5 44.5v${svgHeight - 111}c0 24.577-19.923 44.5-44.5 44.5h-195C31.923 ${svgHeight - 11} 12 ${svgHeight - 30.923} 12 ${svgHeight - 55.5}v-521Z`;

    return <div className='position-relative'>
        <svg className='z-n1 position-absolute top-50px start-50 translate-x-50' xmlns="http://www.w3.org/2000/svg" width="308" height={svgHeight} fill="none" viewBox={`0 0 308 ${svgHeight}`}>
            <path stroke="#737373" d={pathD}></path>
            <path fill="#fff" stroke="#737373" d={pathFillD}></path>
            <circle cx="153.5" cy="112" r="48" fill="#EEE"></circle>
            <rect width="160" height="16" x="73.5" y="185" fill="#EEE" rx="8"></rect>
            <rect width="72" height="8" x="117.5" y="219" fill="#EEE" rx="4"></rect>
            {/* Render rectangles dynamically based on state */}
            {rectangles.map((y, index) => (
                <rect key={index} width="268" height="44" x="20" y={y} fill="#EEE" rx="8"></rect>
            ))}
        </svg>
        <section className="preview-section">
            <div className="user-info">
                {user?.profileImg ?
                    <Image
                        role="button"
                        className='object-fit-cover'
                        src={user?.profileImg}
                        roundedCircle
                        width={112}
                        height={112}
                        alt="Profile"
                    />
                    :
                    <div className="_img_placeholder_bare_qya4t_57">
                        <svg className='opacity-0' xmlns="http://www.w3.org/2000/svg" width="40" height="112" viewBox="0 0 40 40">
                            <path d="M33.75 6.25H6.25a2.5 2.5 0 0 0-2.5 2.5v22.5a2.5 2.5 0 0 0 2.5 2.5h27.5a2.5 2.5 0 0 0 2.5-2.5V8.75a2.5 2.5 0 0 0-2.5-2.5Zm0 2.5v16.055l-4.073-4.072a2.5 2.5 0 0 0-3.536 0l-3.125 3.125-6.875-6.875a2.5 2.5 0 0 0-3.535 0L6.25 23.339V8.75h27.5ZM6.25 26.875l8.125-8.125 12.5 12.5H6.25v-4.375Zm27.5 4.375h-3.34l-5.624-5.625L27.91 22.5l5.839 5.84v2.91ZM22.5 15.625a1.875 1.875 0 1 1 3.75 0 1.875 1.875 0 0 1-3.75 0Z"></path>
                        </svg>
                    </div>
                }
                <div className='d-grid'>
                    <h2 className='text-truncate' data-transparent={user?.firstName || user?.lastName ? true : false}>{user ? `${user?.firstName || ''} ${user?.lastName || ''}` : ''}</h2>
                </div>
                <div className='d-grid'>
                    <p className='text-truncate' data-transparent={user?.email ? true : false}>{user ? user?.email : ''}</p>
                </div>
            </div>
            <div className="link-list">
                {links?.length > 0 && links.map((linkObj, index) => {
                    // Check if the platform and link are valid
                    if (linkObj.platform && linkObj.link) {
                        return (
                            <a key={index} className='w-100 text-decoration-none' href={linkObj.link} target="_blank" rel="noopener noreferrer">
                                <button className={classNames("w-100 rounded d-flex justify-content-between align-items-center", {
                                    "text-white": linkObj.platform.value !== "Frontend Mentor",
                                    "text-dark": linkObj.platform.value === "Frontend Mentor"
                                })} style={{
                                    backgroundColor: generateBackgroundColor(linkObj.platform.value),
                                    border: linkObj.platform.value === "Frontend Mentor" ? '1px solid' : 'none',
                                    height: '44px'
                                }}>
                                    <div className='d-flex align-items-center'>
                                        {linkObj.platform.value === "Frontend Mentor" ? getPlatformIcon(linkObj.platform.value, 'me-2') : getPlatformIcon(linkObj.platform.value, "me-2", "currentColor")}
                                        <span>{linkObj.platform.label}</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                        <path fill="#fff" d="M2.667 7.333v1.334h8L7 12.333l.947.947L13.227 8l-5.28-5.28L7 3.667l3.667 3.666h-8Z"></path>
                                    </svg>
                                </button>
                            </a>
                        );
                    }
                    return null;
                })}
            </div>
        </section>
    </div>
};

export default DynamicSvg;
