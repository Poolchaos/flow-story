import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import FileUpload from '../components/FileUpload';
import ColumnMapper from '../components/ColumnMapper';
import DataValidation from '../components/DataValidation';

type Step = 'upload' | 'configure' | 'preview';

export default function Create() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const { parsedData, columnMapping } = useDataStore();

  const hasData = parsedData !== null && parsedData.rows.length > 0;
  const hasMapping = Boolean(columnMapping.x && columnMapping.y && columnMapping.z);

  // Auto-advance logic
  useEffect(() => {
    if (currentStep === 'upload' && hasData) {
      setCurrentStep('configure');
    }
  }, [hasData, currentStep]);

  useEffect(() => {
    if (currentStep === 'configure' && hasMapping) {
      setCurrentStep('preview');
    }
  }, [hasMapping, currentStep]);

  const steps = [
    { id: 'upload' as Step, label: 'Upload', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> },
    { id: 'configure' as Step, label: 'Configure', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: 'preview' as Step, label: 'Preview', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create Your 3D Story
          </h1>
          <p className="text-xl text-gray-600">
            Follow the steps to transform your data
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (idx === 0) setCurrentStep('upload');
                    if (idx === 1 && hasData) setCurrentStep('configure');
                    if (idx === 2 && hasMapping) setCurrentStep('preview');
                  }}
                  disabled={
                    (idx === 1 && !hasData) || (idx === 2 && !hasMapping)
                  }
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-lg transition-all
                    ${
                      currentStepIndex === idx
                        ? 'bg-cyan-600 text-white shadow-lg scale-105'
                        : currentStepIndex > idx
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {step.icon}
                  <span>{step.label}</span>
                </button>

                {idx < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      currentStepIndex > idx ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {currentStep === 'upload' && <FileUpload />}
          {currentStep === 'configure' && <ColumnMapper />}
          {currentStep === 'preview' && <DataValidation />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              if (currentStep === 'configure') setCurrentStep('upload');
              if (currentStep === 'preview') setCurrentStep('configure');
            }}
            disabled={currentStep === 'upload'}
            className="px-8 py-3 rounded-lg font-semibold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>

          {currentStep === 'preview' && hasMapping ? (
            <button
              onClick={() => navigate('/visualize')}
              className="px-8 py-3 rounded-lg font-semibold text-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors shadow-lg flex items-center gap-2"
            >
              <span>View in 3D</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => {
                if (currentStep === 'upload' && hasData) setCurrentStep('configure');
                if (currentStep === 'configure' && hasMapping) setCurrentStep('preview');
              }}
              disabled={
                (currentStep === 'upload' && !hasData) ||
                (currentStep === 'configure' && !hasMapping)
              }
              className="px-8 py-3 rounded-lg font-semibold text-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
