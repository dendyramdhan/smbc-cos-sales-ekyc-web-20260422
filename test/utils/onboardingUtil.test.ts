import { getCustomerInfo } from '@/utils/onboardingUtil';
import { CUSTOMER_INFO_MOCK_DATA } from '@/services/__mocks__';
import type { OnboardingData } from '@/types/onboarding';

describe('getCustomerInfo', () => {
  it('should extract all 28 CustomerInfoData fields from OnboardingData', () => {
    const result = getCustomerInfo(CUSTOMER_INFO_MOCK_DATA as OnboardingData);

    expect(result).toEqual({
      customerType: CUSTOMER_INFO_MOCK_DATA.customerType,
      checklistStatus: CUSTOMER_INFO_MOCK_DATA.checklistStatus,
      checklistStage: CUSTOMER_INFO_MOCK_DATA.checklistStage,
      capId: CUSTOMER_INFO_MOCK_DATA.capId,
      besReferenceNo: CUSTOMER_INFO_MOCK_DATA.besReferenceNo,
      cifNo: CUSTOMER_INFO_MOCK_DATA.cifNo,
      customerName: CUSTOMER_INFO_MOCK_DATA.customerName,
      formerlyKnownAs: CUSTOMER_INFO_MOCK_DATA.formerlyKnownAs,
      businessNameAlsoKnownAs: CUSTOMER_INFO_MOCK_DATA.businessNameAlsoKnownAs,
      dateOfEstablishment: CUSTOMER_INFO_MOCK_DATA.dateOfEstablishment,
      legalEntityType: CUSTOMER_INFO_MOCK_DATA.legalEntityType,
      legalEntityCharacteristic: CUSTOMER_INFO_MOCK_DATA.legalEntityCharacteristic,
      lineOfBusiness: CUSTOMER_INFO_MOCK_DATA.lineOfBusiness,
      registerAddressCountry: CUSTOMER_INFO_MOCK_DATA.registerAddressCountry,
      correspondenceAddressCountry: CUSTOMER_INFO_MOCK_DATA.correspondenceAddressCountry,
      rmRoName: CUSTOMER_INFO_MOCK_DATA.rmRoName,
      rmRoCode: CUSTOMER_INFO_MOCK_DATA.rmRoCode,
      department: CUSTOMER_INFO_MOCK_DATA.department,
      finalRiskRating: CUSTOMER_INFO_MOCK_DATA.finalRiskRating,
      riskScore: CUSTOMER_INFO_MOCK_DATA.riskScore,
      creationDate: CUSTOMER_INFO_MOCK_DATA.creationDate,
      approvalDate: CUSTOMER_INFO_MOCK_DATA.approvalDate,
      previousChecklistId: CUSTOMER_INFO_MOCK_DATA.previousChecklistId,
      previousRiskRating: CUSTOMER_INFO_MOCK_DATA.previousRiskRating,
      nextReviewDueDate: CUSTOMER_INFO_MOCK_DATA.nextReviewDueDate,
      reviewedTo: CUSTOMER_INFO_MOCK_DATA.reviewedTo,
      generalChecking: CUSTOMER_INFO_MOCK_DATA.generalChecking,
    });
  });

  it('should return exactly the same number of keys as CustomerInfoData', () => {
    const result = getCustomerInfo(CUSTOMER_INFO_MOCK_DATA as OnboardingData);
    expect(Object.keys(result)).toHaveLength(27);
  });

  it('should not include extra properties beyond CustomerInfoData', () => {
    const extendedData = {
      ...CUSTOMER_INFO_MOCK_DATA,
      extraProp: 'should not appear',
    } as OnboardingData;

    const result = getCustomerInfo(extendedData);
    expect(result).not.toHaveProperty('extraProp');
  });
});
