import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import  Video1 from "../Videos/video1.mp4";
import  Video2 from "../Videos/video2.mp4";
import  Video3 from "../Videos/video3.mp4";
import  Video4 from "../Videos/video4.mp4";
import  Video5 from "../Videos/video5.mp4";
import  Video6 from "../Videos/video6.mp4";
import  Video7 from "../Videos/video7.mp4";
import  Video8 from "../Videos/video8.mp4";
import Video9 from "../Videos/video9.mp4";

const products = [
    { id: 1, name: "Product 1", price: "$499", video: Video1, description: "The best product for your needs." },
    { id: 3, name: "Product 3", price: "$399", video: Video3, description: "An amazing product for professionals." },
    { id: 4, name: "Product 4", price: "$199", video: Video4, description: "This is a great product for your needs." },
    { id: 6, name: "Product 6", price: "$699", video: Video6, description: "The best product for your needs." },
    { id: 5, name: "Product 5", price: "$599", video: Video5, description: "The best product for your needs." },
    { id: 9, name: "Product 9", price: "$999", video: Video9, description: "The best product for your needs." },
    { id: 2, name: "Product 2", price: "$299", video: Video2, description: "This product is even better!" },
    { id: 7, name: "Product 7", price: "$799", video: Video7, description: "The best product for your needs." },
    { id: 8, name: "Product 8", price: "$899", video: Video8, description: "The best product for your needs." },
];

const Home = () => {
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isInPiP, setIsInPiP] = useState(false);
    const videoRefs = useRef([]);
    
    const handleTogglePlayPause = async (index) => {
        const video = videoRefs.current[index];

        if (isInPiP) {
            try {
                await document.exitPictureInPicture();
                setIsInPiP(false);
            } catch (error) {
                console.error("Failed to exit Picture-in-Picture", error);
            }
        }
    
        if (currentVideo && currentVideo !== video) {
            currentVideo.pause();
        }
    
        if (video.paused) {
            video.play();
            setCurrentVideo(video);
        } else {
            video.pause();
            setCurrentVideo(null);
        }
    };
    
    const handleTogglePiP = async () => {
        const video = currentVideo;
        if (video && !isInPiP) {
            try {
                await video.requestPictureInPicture();
                setIsInPiP(true);
            } catch (error) {
                console.error("Failed to enter Picture-in-Picture", error);
            }
        } else if (isInPiP) {
            try {
                await document.exitPictureInPicture();
                setIsInPiP(false);
            } catch (error) {
                console.error("Failed to exit Picture-in-Picture", error);
            }
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (currentVideo && !isInPiP && !currentVideo.paused) {
                const rect = currentVideo.getBoundingClientRect();
                const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

                if (!isVisible) {
                    currentVideo.requestPictureInPicture().then(() => setIsInPiP(true)).catch(console.error);
                }
            }
        };

        const handlePiPExit = () => setIsInPiP(false);

        document.addEventListener("leavepictureinpicture", handlePiPExit);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("leavepictureinpicture", handlePiPExit);
        };
    }, [currentVideo, isInPiP]);

    return (
        <div className="app">
            <nav className="navbar">
                <h1>Product Store</h1>
                <ul className="nav-links">
                    <li>Home</li>
                    <li>Products</li>
                    <li>Contact</li>
                </ul>
            </nav>

            <div className="content">
                <h2>Browse Our Products</h2>
                <div className="product-list">
                    {products.map((product, index) => (
                        <div className="product-card" key={product.id}>
                            <video
                                ref={(el) => (videoRefs.current[index] = el)}
                                muted
                                loop
                                className="product-video"
                            >
                                <source src={product.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <button
                                className="play-pause-btn"
                                onClick={() => handleTogglePlayPause(index)}
                            >
                                <i
                                    className={`fas ${currentVideo === videoRefs.current[index] && !videoRefs.current[index].paused
                                        ? "fa-pause"
                                        : "fa-play"
                                    }`}
                                ></i>
                            </button>

                            {currentVideo === videoRefs.current[index] && !videoRefs.current[index].paused && (
                                <button className="pip-btn" onClick={handleTogglePiP}>
                                    <i className="fas fa-tv"></i>
                                </button>
                            )}

                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p className="price">{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            <footer>
                <p>&copy; 2024 Product Store. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
