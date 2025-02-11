export interface StepCopmonentProps {
  onNext: () => void;
  onPrev?: () => void;
  onClose?: () => void;
  onCompletedStep?: (stepNumber: number) => void;
  stepNumber: number;
  isOrganization?: boolean;
  
}
