import { useEffect } from 'react';

const ChatbotWidget = () => {
    useEffect(() => {
        // Create a script element
        const script = document.createElement('script');
        script.src = "//code.tidio.co/mxdb0n8hjltdgvun5e09twcgzsit2hbf.js"
        script.async = true;
        document.body.appendChild(script);

        // Cleanup function to remove the script when the component is unmounted
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null; // This component doesn't render any JSX
};

export default ChatbotWidget;
