import { useNavigate } from 'react-router-dom';

const useNavigateToSection = () => {
  const navigate = useNavigate();

  const navigateToSection = ({ sectionId }) => {
    navigate('/'); // Navigate to home
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error(`Element with ID '${sectionId}' not found.`);
      }
    }, 0);
  };

  return navigateToSection;
};

export default useNavigateToSection;
