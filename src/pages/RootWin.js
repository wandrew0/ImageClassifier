import '../css/styles.css';
import DemoInstructions from "./DemoInstructions";
const RootWin = () => {
    return (
    <div>
        <h1 className="blueHeader">
            Welcome to Image Classifier Demo </h1>
        <DemoInstructions/>

    </div>
    )
}
export default RootWin;