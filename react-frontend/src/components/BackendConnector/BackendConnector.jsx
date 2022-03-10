import React from "react";
import "./BackendConnector.scss";
import axios from "axios";

function BackendConnector() {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target.elements[0].name);
    }

    return (
        <div className="formsContainer">
            <form className="inputForm" onSubmit={handleSubmit}>
                <label for="comment">Comment:</label><br />
                <input type="text" name="comment" id="comment" />
                <input type="submit" />
            </form>
            <br />
            <form className="inputForm" onSubmit={handleSubmit}>
                <label for="image">Image File:</label><br />
                <input type="file" name="image" id="image" accept="image/png,image/jpeg" />
                <input type="submit" />
            </form>
            <br />
            <form className="inputForm" onSubmit={handleSubmit}>
                <label for="video">Video File:</label><br />
                <input type="file" name="video" id="video" accept="video/mp4,video/x-m4v,video/*" />
                <input type="submit" />
            </form>
        </div>
    )
}

export default BackendConnector