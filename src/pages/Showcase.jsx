import "./Showcase.css";
import World2D from "../projects/World2D";
// import World3D from "../projects/World3D"; 
// import Games from "../projects/Games";

function Showcase() {
    return (
        <div className="showcase">
            <h1>Showcase</h1>

            {/* Her kategori ayrı bir dosyadan geliyor */}
            <World2D />

            {/* İleride bunları da açarsın:
            <World3D />
            <Games /> 
            */}

        </div>
    );
}

export default Showcase;