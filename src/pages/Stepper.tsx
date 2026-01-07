import React from "react";

interface StepperProps {
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = ["Send OTP", "Verify OTP", "Update"];

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={label} className="flex items-center w-full">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-[#E42128] text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
            >
              {step}
            </div>

            <span
              className={`ml-2 text-sm font-medium ${
                isActive ? "text-[#E42128]" : "text-gray-500"
              }`}
            >
              {label}
            </span>

            {step !== steps.length && (
              <div
                className={`flex-1 h-[2px] mx-4 ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
