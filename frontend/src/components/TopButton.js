import { useState, useEffect } from "react";
import { FaRegArrowAltCircleUp } from "react-icons/fa";

const TopButton = () => {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button className="back-to-top" onClick={scrollTop}>
      <FaRegArrowAltCircleUp />
    </button>
  )
}

export default TopButton;