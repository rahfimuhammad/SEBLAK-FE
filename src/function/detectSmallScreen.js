import { useEffect, useState } from "react"

export const IsSmallScreen = () => {
    const [isSmall, setIsSmall] = useState(null)

    useEffect(() => {
        const detectOrientation = () => {
            
            window.innerHeight > window.innerWidth?
                
            setIsSmall(true) : setIsSmall(false)
            window.addEventListener('resize', detectOrientation)
            }
            detectOrientation()
        }, []);

    return isSmall     
    };