/* eslint-disable react/prop-types */

const Stepper = ({ currentStep }) => {
    const steps = ["Create Team", "Create Project", "Add Members"];

    return (
        <div className="flex items-center mb-8 space-x-4">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                    <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${currentStep === index + 1
                            ? "bg-gray-900"
                            : currentStep > index + 1
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                    >
                        {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                        <div className="w-8 h-1 bg-gray-300 mx-2">
                            {currentStep > index + 1 && <div className="w-full h-full bg-green-500"></div>}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Stepper;
