const DemoInstructions = () => {
    return (
        <div className="demo-instructions">
            <h3>
                Click any of the links on the top, or read on for a little description.
            </h3>
            <h3>
                Please have your browser window as large as possible and zoom level set to
                100%.
            </h3>
            <h4>
                Accuracy on WebKit browsers (Safari, and any browser on iOS) is
                significantly reduced, as the canvas inputs are rendered differently.
            </h4>
            <p>
                (Local) versions download and run the models directly in your browser,
                while (Server) versions call the Node backend.
            </p>
            <p>
                <b>Warning:</b> clicking Doodle (local) will download a 90 MB file every
                time. The Character model however is only 1.5 MB.
            </p>
            <p>
                Doodle was trained on the Quick, Draw! dataset, specifically the
                preprocessed, 28x28 grayscale and centered Numpy bitmaps, and the model I
                use is PyTorch's implementation of EfficientNetV2 S.
            </p>
            <p>
                Characters were trained on the EMNIST balanced dataset, which means some
                letters only have uppercase versions (if the lowercase looks similar), and
                I use a simple convolutional neural network.
            </p>
            <p>
                On the left of each page are the available classes. In the center is the
                drawing canvas, and on the right is the downscaled and centered input to
                the model (black and white are also flipped).
            </p>
        </div>
    );
};

export default DemoInstructions;
