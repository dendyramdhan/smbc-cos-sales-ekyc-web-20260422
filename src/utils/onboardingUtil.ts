import { OnboardingData } from '@/types/onboarding';
import { CustomerInfoData } from '@/types/onboarding/customerInfo';

export const getCustomerInfo = (onboardingData: OnboardingData): CustomerInfoData => {
  return {
    customerType: onboardingData.customerType,
    checklistStatus: onboardingData.checklistStatus,
    checklistStage: onboardingData.checklistStage,
    capId: onboardingData.capId,
    besReferenceNo: onboardingData.besReferenceNo,
    cifNo: onboardingData.cifNo,
    customerName: onboardingData.customerName,
    formerlyKnownAs: onboardingData.formerlyKnownAs,
    businessNameAlsoKnownAs: onboardingData.businessNameAlsoKnownAs,
    dateOfEstablishment: onboardingData.dateOfEstablishment,
    legalEntityType: onboardingData.legalEntityType,
    legalEntityCharacteristic: onboardingData.legalEntityCharacteristic,
    lineOfBusiness: onboardingData.lineOfBusiness,
    registerAddressCountry: onboardingData.registerAddressCountry,
    correspondenceAddressCountry: onboardingData.correspondenceAddressCountry,
    rmRoName: onboardingData.rmRoName,
    rmRoCode: onboardingData.rmRoCode,
    department: onboardingData.department,
    finalRiskRating: onboardingData.finalRiskRating,
    riskScore: onboardingData.riskScore,
    creationDate: onboardingData.creationDate,
    approvalDate: onboardingData.approvalDate,
    previousChecklistId: onboardingData.previousChecklistId,
    previousRiskRating: onboardingData.previousRiskRating,
    nextReviewDueDate: onboardingData.nextReviewDueDate,
    reviewedTo: onboardingData.reviewedTo,
    generalChecking: onboardingData.generalChecking,
  };
};