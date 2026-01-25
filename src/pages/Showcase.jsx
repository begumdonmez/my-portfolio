import "./Showcase.css";
import MagicText from "../components/MagicText";
import World2D from "../projects/World2D";
// import World3D from "../projects/World3D"; 
import Games from "../projects/Games";

function Showcase() {
    return (
        <div className="showcase">
                <h1>My Showcase</h1>
            
            <World2D />

            {/* İleride bunları da açarsın:
            <World3D />
            */}
            <Games /> 
            

        </div>
    );
}

export default Showcase;