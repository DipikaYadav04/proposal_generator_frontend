import React, { useState } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';

const TermsAndConditions = ({ selectedTerms = [], onTermsChange, serviceType = 'energy-audit' }) => {
  const [newPoint, setNewPoint] = useState('');
  
  // Use selectedTerms as extraPoints
  const extraPoints = Array.isArray(selectedTerms) ? selectedTerms : [];
  const setExtraPoints = onTermsChange;

  const addExtraPoint = () => {
    if (newPoint.trim() !== '') {
      setExtraPoints([...extraPoints, newPoint.trim()]);
      setNewPoint('');
    }
  };

  const removeExtraPoint = (index) => {
    setExtraPoints(extraPoints.filter((_, i) => i !== index));
  };

  const updateExtraPoint = (index, value) => {
    const updated = extraPoints.map((point, i) => i === index ? value : point);
    setExtraPoints(updated);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addExtraPoint();
    }
  };

  // Service-specific default terms
  const getDefaultTerms = (service) => {
    switch(service) {
      case 'energy-audit':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'This proposal is prepared based on the information provided by the client and valid for the scope of work mentioned above, any deviation from this information the charges may need to be altered accordingly.',
          'The cost towards travel, accommodation and food charges is not considered in the proposal and will be charged extra.',
          'The project cost is considered if the project is concluded within one month. In case the project timeline goes beyond one month after going through the detailed data of the project, the project cost must be apprehended as per the revised timeline.',
          'The client shall ensure that the necessary data required for the said industry is provided.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.',
          'The payments shall be billed as per the said stages and milestones of the project.'
        ];
      
      case 'water-audit':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is valid only for the indicated scope and data provided.',
          'This proposal is based on information provided by the client and valid for the mentioned scope of work; deviations may require cost changes.',
          'The cost towards travel, accommodation, and food is not included in the proposal and will be charged at actual.',
          'The client shall ensure that the necessary data required for the said industry is provided.',
          'Any delay due to data sharing will not be the responsibility of D2O.',
          'Payments will be billed as per the defined stages and milestones.'
        ];
      
      case 'fls-audit':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'The travel, boarding and lodging charges are not included in the proposal and will be charged extra as per actuals and will be part of client cost.',
          'Basis of Quotation: The quotation is valid only for the indicated scope and area of the project. Any change in area may alter the cost.',
          'This proposal is based on information provided by the client and valid for the mentioned scope of work; deviations may require cost changes.',
          'Provision of necessary manpower, tools, ladders, and safe access to equipment shall be arranged by the client.',
          'Any delay due to data sharing will not be the responsibility of D2O.',
          'The client shall ensure necessary data for the building is provided.',
          'Payments will be billed as per the defined stages and milestones.'
        ];
      
      case 'hotel-audit':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is valid only for the indicated scope and data provided.',
          'This proposal is based on information provided by the client and valid for the mentioned scope of work; deviations may require cost changes.',
          'The cost towards travel, accommodation and food charges is considered in the proposal.',
          'The client shall ensure that the necessary data required for the said industry is provided.',
          'Any delay due to data sharing will not be the responsibility of D2O.',
          'Payments will be billed as per the defined stages and milestones.'
        ];
      
      case 'mep-proposal':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'Site visits are not included in the above cost. If required, an additional charge of ₹5,000 per person per visit will apply.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'The travel, lodging and boarding charges are not included in the proposal and will be charged extra as per actuals.'
        ];

      case 'mep-third-party':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'This proposal is prepared based on the information provided by the client and valid for the scope of work mentioned above, any deviation from this information the charges may need to be altered accordingly.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.',
          'The travel, boarding, lodging and food charges are included in above cost.',
          'The client shall ensure that the necessary data required for the said building is provided.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'D2O team will only be part of reviewing the testing and commissioning conducted by the contractor and no instruments for testing and commissioning will be provided by D2O. In case the testing instruments are required from D2O team extra rental charges of the instruments have to be borne by client.',
          'D2O\'s responsibility is limited to performing the MEPF commissioning procedures and issuing reports that accurately reflect the system conditions observed at the time of commissioning. Upon completion of the commissioning process and delivery of the report, D2O\'s responsibility shall be considered fulfilled. All matters related, condition, operation, or malfunction of any MEPF equipment are the sole responsibility of the building management. D2O shall not be held liable for any future defects, operational issues, or equipment failures occurring after the commissioning period.'
        ];

      case 'igbc-new-building':
        return [
          'GST shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The registration and certification fee to be paid to IGBC council is based on built up area shared by the client and may vary after area calculation done by D2O team.',
          'Travel, lodging, Boarding, and food charges are not included in the above scope and the same will be borne by the Client.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.'
        ];

      case 'igbc-new-building-pre-final':
        return [
          'GST shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The registration and certification fees payable to the IGBC Council shall be borne directly by the client. These fees are based on the built-up area shared by the client and may vary after the final area calculations carried out by the D2O team.',
          'Travel, lodging, Boarding, and food charges are not included in the above scope and the same will be borne by the Client as per actuals.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.'
        ];

      case 'igbc-existing-building':
        return [
          'The quotation is for one-time certification.',
          'Taxes shall be applicable extra as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The registration and certification fee to be paid to IGBC is based on built up area shared by the client and may vary after area calculation done by D2O team.',
          'Travel, lodging, Boarding, and food charges are not included in the above scope and the same will be borne by the Client.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.',
          'The client shall arrange all relevant drawings such as Architectural site layout, floor plans, elevations & sections, roof plan, landscape drawings, HVAC, Lighting, plumbing drawings and others that are required for green building certification process.'
        ];
      
      case 'igbc-green-campus':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'The Project Registration and Certification fees shall be paid directly by the client to IGBC and is not included in the prices indicated above.',
          'The material concerning to the project should be first reviewed by the technical team of Design2Occupancy Services, any discrepancy from the suggested norms on the same may lead to decline of the certification level or denying of the rating.',
          'The client shall ensure that the necessary data (such as tracking sheet of materials, waste etc.) required for the said building is provided.',
          'Client has to incorporate all mandatory measures required for IGBC rating.',
          'The costing in this proposal doesn\'t include travel cost and accommodation. Both shall be provided and borne by the client at actuals.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.'
        ];
      
      case 'ecbc-a':
      case 'ecbc-bc':
      case 'ecbc-abc':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the RFP & the data provided.',
          'This proposal is prepared based on the information provided by the client and valid for the scope of work mentioned above, any deviation from this information the charges may need to be altered accordingly.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.',
          'Travelling, Boarding and Lodgings charges are borne by client and charge as per actuals.',
          'Client must need to implement mandatory requirements for ECBC compliance.'
        ];

      case 'ecbc-cto':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'This proposal is prepared based on the information provided by the client and valid for the scope of work mentioned above, any deviation from this information the charges may need to be altered accordingly.',
          'The client shall ensure that the necessary data required for the said industry is provided.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'The consultancy fee does not include any third- party testing charges and hence they shall be borne by the client as actual.',
          'Official departmental fees will be borne by the client as actual.'
        ];

      case 'ecbc-cte':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'This proposal is prepared based on the information provided by the client and valid for the scope of work mentioned above, any deviation from this information the charges may need to be altered accordingly.',
          'The client shall ensure that the necessary data required for the said industry is provided.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'The consultancy fee does not include any third- party testing charges and hence they shall be borne by the client as actual.',
          'Official departmental fees will be borne by the client as actual.'
        ];
      
      case 'igbc-green-factory':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the RFP & the data provided.',
          'This proposal is prepared based on the information provided by the client and valid for the scope of work mentioned above, any deviation from this information the charges may need to be altered accordingly.',
          'The Project Registration (paid during Project Registration) and Certification fees (paid during submissions) shall be paid directly by the client to IGBC and are not included in the prices indicated above.',
          'The client shall ensure that the necessary data (such as tracking sheet of materials, waste etc.) required for the said building is provided.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.',
          'Client must have implemented mandatory IGBC requirements on the project site.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.',
          'The travel, lodging and boarding charges are not included in the proposal and will be charged extra as per the actual.'
        ];
      
      case 'igbc-green-healthcare':
        return [
          'GST is included in the said price.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'The Project Registration and Certification fees shall be paid directly by the client to IGBC and is not included in the prices indicated above.',
          'The material concerning to the project should be first reviewed by the technical team of Design2Occupancy Services, any discrepancy from the suggested norms on the same may lead to decline of the certification level or denying of the rating.',
          'The client shall ensure that the necessary data (such as tracking sheet of materials, waste etc.) required for the said building is provided.',
          'Client have to incorporate all mandatory measures required for IGBC rating.',
          'Site visits shall be inclusive of travelling for up to five visits, and after 5 visits will be payable at actuals. Boarding and lodging will be in client scope.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.'
        ];
      
      case 'igbc-green-health-wellbeing':
        return [
          'GST shall be applicable extra as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'The Project Registration and Certification fees shall be paid directly by the client to IGBC and is not included in the prices indicated above.',
          'Travel, lodging, Boarding, and food charges are not included in the above scope and the same will be borne by the Client as per actuals.',
          'The client shall ensure that the necessary data (such as tracking sheet of materials, waste etc.) required for the said building is provided.',
          'Client must incorporate all mandatory measures required for IGBC rating.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.'
        ];
      
      case 'igbc-green-services-building':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'The Project Registration and Certification fees shall be paid directly by the client to IGBC and is not included in the prices indicated above. The cost for certification to be paid to IGBC is shown below:',
          'The certification cost is to be directly paid to IGBC, https://igbc.in/igbc/redirectHtml.htm?redVal=showGreenServiceBuildingNoSignin, the link of IGBC website should be checked for the cost. The certification cost may increase or decrease, it depends on IGBC updates.',
          'The client shall ensure that the necessary data (such as tracking sheet of materials, waste etc.) required for the said building is provided.',
          'Client must incorporate all mandatory measures required for IGBC rating.',
          'The costing in this proposal doesn\'t include travel cost and accommodation. Both shall be provided and borne by the client at actuals, if site visit happens.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.'
        ];
      
      case 'igbc-green-resort':
        return [
          'GST shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The registration, Precertification and final certification fee to be paid to IGBC council is based on built up area shared by the client and may vary after area calculation done by D2O team.',
          'ESG reporting is not included in this proposal.',
          'Traveling, Lodging & Boarding and other Incidental expenses shall be charged at actual incurred during the visit, in case of more than 4 site visits.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.'
        ];

      case 'igbc-green-hotel':
        return [
          'GST shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The registration and final certification fee to be paid to IGBC council by client is based on built up area shared by the client and may vary after area calculation done by D2O team.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.',
          'Travel, lodging, Boarding, and food charges are not included in the above scope and the same will be borne by the Client as per actuals.'
        ];

      case 'igbc-green-interiors':
        return [
          'GST shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The registration and certification fee to be paid to IGBC council is based on built up area shared by the client and may vary after area calculation done by D2O team.',
          'Travel, lodging, Boarding, and food charges are not included in the above scope and the same will be borne by the Client as per actuals.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.'
        ];
      
      case 'igbc-mrts':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the RFP & the data provided.',
          'This proposal is prepared based on the information provided by the client and valid for the scope of work mentioned above, any deviation from this information the charges may need to be altered accordingly.',
          'The Project Registration (paid during Project Registration) and Certification fees (paid during submissions) shall be paid directly by the client to IGBC and are not included in the prices indicated above.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.',
          'Client must have implemented mandatory IGBC requirements on the project site.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.',
          'Travel, boarding, and lodging charges are not included in the above fees and will be charged as per actuals, to be borne by the client.'
        ];

      case 'igbc-net-zero':
        return [
          'GST shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The Energy, Water, and Waste council fees to be paid to IGBC are based on the built-up area shared by the client and may vary after area calculation done by D2O team.',
          'Travel, lodging, boarding, and food charges are not included in the above scope and the same will be borne by the Client as per actuals.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.'
        ];

      case 'igbc-green-homes':
        return [
          'GST shall be applicable extra as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'This proposal is prepared based on the information provided by the client and valid for the scope of work mentioned above, any major deviation in project design (more than twice) which cause significant and unjustified re-work may be chargeable as extra.',
          'The Project Registration (paid during Project Registration) and Certification & Pre-Certification Fee shall be paid directly by the client to IGBC and is not included in the prices indicated above.',
          'The client shall ensure that the specification of all the materials and equipment to be installed in the building shall be verified by D2O technical team. Any deviation from the technical advice provided may result into decrement of the desired rating level and D2O shall not be liable for the same.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.',
          'Travel, lodging, Boarding, and food charges are not included in the above scope and the same will be borne by the Client.'
        ];
      
      case 'leed-hospitality':
        return [
          'GST shall be applicable extra as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'The Project Registration and Certification fees shall be paid directly by the client to USGBC/GBCI and are not included in the prices indicated above.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The client shall ensure that the necessary data required for the said building is provided.',
          'Client must incorporate all mandatory measures required for LEED certification.',
          'Travel, lodging, Boarding, and food charges are not included in the above scope and the same will be borne by the Client as per actuals.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.'
        ];
      
      case 'leed-core-shell':
        return [
          'Taxes shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'The registration, certification and Expedite fees shall be borne by the client and be paid directly to Council as applicable.',
          'LEED Commissioning is not included in this proposal.',
          'The cost towards travel, accommodation and food charges is not considered in the proposal and will be charged extra.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.'
        ];
      
      case 'leed-nc':
        return [
          'Taxes shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'The registration, precertification and certification fees shall be borne by the client and be paid directly to USGBC as applicable and are dependent on the total built up area of the project.',
          'The client shall ensure that the necessary data required for the said mentioned services is provided.',
          'The cost towards travel, accommodation and food charges is not considered in the proposal and will be charged extra.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.'
        ];

      case 'leed-new-construction':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'The client shall ensure that the necessary data required for the said mentioned services is provided.',
          'The travelling, boarding and lodging expenses is not included and will be covered by the client in actuals.',
          'The registration, certification fees shall be borne by the client and be paid directly to USGBC as applicable.'
        ];
      
      case 'leed-net-zero-carbon':
        return [
          'Taxes shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'The registration, precertification and certification fees shall be borne by the client and be paid directly to USGBC as applicable and are dependent on the total built up area of the project.',
          'The client shall ensure that the necessary data required for the said mentioned services is provided.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.'
        ];
      
      case 'leed-zero-water':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'The quotation is for one-time certification. The validity of Certification will be for 3 years.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'The certification fees shall be borne by the client and be paid directly to USGBC as applicable.',
          'The travelling and boarding charges are borne by the client at the actuals.'
        ];
      
      case 'leed-idci':
        return [
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The registration and certification fee to be paid to GBCI is based on built up area shared by the client and may vary after area calculation done by D2O team.',
          'The project duration for LEED certification will extend for an additional 2 months beyond the completion of the fit-out phase. As the submission for the project document for review cannot be done to USGBC council until and unless all HVAC system and interior fit out works have been completed on site.',
          'The cost towards travel, accommodation and food charges is not considered in the proposal and will be charged extra.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.'
        ];
      
      case 'leed-ebom':
        return [
          'Taxes shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The registration and certification fee which needs to be paid to USGBC Council to be borne by the client as per their consultation with GBCI.',
          'The travelling, boarding and lodging expenses will be covered by the client in advance.'
        ];

      case 'leed-commissioning':
        return [
          'Taxes shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The payments shall be billed as per the said stages and milestones of the project.',
          'The client shall ensure that the necessary data required for the said mentioned services is provided.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.',
          'The cost towards travel, accommodation, and food has not been included in the proposal and will be borne by the client, to be charged as per actuals.'
        ];

      case 'leed-lca':
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the area of the projects mentioned above. Any changes in area of project may lead to changes in the cost of the project.',
          'This document is prepared based on the information provided by the client and valid for the scope of work mentioned above, any deviation from this information the charges may need to be altered accordingly.',
          'Any delay on account of data sharing shall not be covered in the responsibility of D2O.',
          'Travel, Lodging & Boarding charges are not included in the consultancy fee and will be billed as per actuals and must be borne by the client.',
          'The client shall ensure that the necessary data required for the said building is provided.',
          'The payments shall be billed as per the said stages and milestones of the project.'
        ];
      
      case 'igbc-green-school':
        return [
          'GST shall be applicable extra as per government norms at the time of realization.',
          'The quotation is for one-time certification.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'A single point of contact from the client\'s team shall be appointed for coordination and exchange of project specific information seamlessly.',
          'The registration and certification fee to be paid to IGBC council is based on built up area shared by the client and may vary after area calculation done by D2O team.',
          'Travel, lodging, Boarding, and food charges are not included in the above scope and the same will be borne by the Client.',
          'The consultancy fee quoted in the proposal will be revised if the project construction time exceeds three years from the date the work order is finalized.'
        ];
      
      default:
        return [
          'GST shall be extra applicable as per government norms at the time of realization.',
          'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
          'This proposal is prepared based on the information provided by the client and valid for the scope of work mentioned above.',
          'The payments shall be billed as per the said stages and milestones of the project.'
        ];
    }
  };

  // Get default terms based on service type
  const defaultTerms = getDefaultTerms(serviceType);

  const addDefaultTerm = (term) => {
    if (!extraPoints.includes(term)) {
      setExtraPoints([...extraPoints, term]);
    }
  };

  const loadAllDefaultTerms = () => {
    const newTerms = defaultTerms.filter(term => !extraPoints.includes(term));
    setExtraPoints([...extraPoints, ...newTerms]);
  };

  return (
    <section style={{ width: '100%', maxWidth: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <FileText style={{ width: '22px', height: '22px' }} />
          Terms & Conditions
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
            {extraPoints.length} term{extraPoints.length !== 1 ? 's' : ''}
          </span>
          {extraPoints.length === 0 && (
            <button
              type="button"
              onClick={loadAllDefaultTerms}
              style={{
                fontSize: '0.9rem',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.3)';
              }}
            >
              Load Default Terms
            </button>
          )}
        </div>
      </div>

      {/* Add New Term */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          value={newPoint}
          onChange={(e) => setNewPoint(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new term or condition..."
          style={{
            flex: 1,
            padding: '14px 18px',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            outline: 'none',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3498DB';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button
          type="button"
          onClick={addExtraPoint}
          disabled={!newPoint.trim()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            background: !newPoint.trim() ? '#95a5a6' : 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: !newPoint.trim() ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            opacity: !newPoint.trim() ? 0.6 : 1,
            boxShadow: !newPoint.trim() ? 'none' : '0 2px 8px rgba(46, 204, 113, 0.3)'
          }}
          onMouseOver={(e) => {
            if (newPoint.trim()) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 204, 113, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (newPoint.trim()) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(46, 204, 113, 0.3)';
            }
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          Add
        </button>
      </div>

      {/* Default Terms Suggestions */}
      {extraPoints.length < defaultTerms.length && (
        <div style={{
          marginBottom: '25px',
          padding: '20px',
          background: 'rgba(52, 152, 219, 0.05)',
          borderRadius: '12px',
          border: '2px solid rgba(52, 152, 219, 0.2)'
        }}>
          <h4 style={{
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '15px',
            marginTop: 0
          }}>
            Quick Add - Standard Terms & Conditions:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {defaultTerms.filter(term => !extraPoints.includes(term)).slice(0, 4).map((term, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addDefaultTerm(term)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '0.9rem',
                  background: 'white',
                  color: '#3498DB',
                  border: '2px solid #3498DB',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#3498DB';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#3498DB';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontWeight: '700', marginRight: '8px' }}>+</span> 
                {term.substring(0, 120)}{term.length > 120 ? '...' : ''}
              </button>
            ))}
            {defaultTerms.filter(term => !extraPoints.includes(term)).length > 4 && (
              <button
                type="button"
                onClick={loadAllDefaultTerms}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)',
                  marginTop: '5px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.3)';
                }}
              >
                + Add All Remaining Terms ({defaultTerms.filter(term => !extraPoints.includes(term)).length - 4} more)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Current Terms List */}
      {extraPoints.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {extraPoints.map((point, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '15px',
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#3498DB';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{
                flexShrink: 0,
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                fontWeight: '700',
                marginTop: '4px',
                boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)'
              }}>
                {index + 1}
              </div>
              <textarea
                value={point}
                onChange={(e) => updateExtraPoint(index, e.target.value)}
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  minHeight: '80px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  color: '#2c3e50'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3498DB';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                rows="3"
              />
              <button
                type="button"
                onClick={() => removeExtraPoint(index)}
                style={{
                  flexShrink: 0,
                  padding: '10px',
                  color: '#e74c3c',
                  background: 'transparent',
                  border: '2px solid #e74c3c',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '4px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#e74c3c';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#e74c3c';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Trash2 style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {extraPoints.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#95a5a6',
          background: 'rgba(52, 152, 219, 0.03)',
          borderRadius: '12px',
          border: '2px dashed #cbd5e0'
        }}>
          <FileText style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 15px',
            color: '#cbd5e0'
          }} />
          <p style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: '#7f8c8d',
            margin: '0 0 8px 0'
          }}>
            No terms and conditions added yet.
          </p>
          <p style={{
            fontSize: '0.9rem',
            color: '#95a5a6',
            margin: 0
          }}>
            Add standard terms or create custom conditions above.
          </p>
        </div>
      )}
    </section>
  );
};

export default TermsAndConditions;