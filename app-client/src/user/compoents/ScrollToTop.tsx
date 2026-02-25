import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // bỏ nếu không thích animation
        });
    }, [pathname, search]);

    return null;
};

export default ScrollToTop;
