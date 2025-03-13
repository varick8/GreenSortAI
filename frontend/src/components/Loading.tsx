import { motion } from "framer-motion";

const Loading = () => {
    return (
        <motion.div 
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-white z-[99999]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
        </motion.div>
    );
};

export default Loading;
