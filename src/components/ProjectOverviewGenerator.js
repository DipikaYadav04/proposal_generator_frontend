import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Building, Ruler, RefreshCw, Sparkles } from 'lucide-react';

const OVERVIEW_TEMPLATES = {
    'energy-audit': [
        (p, c, a) => `The ${p} project is a commercial/industrial facility located in ${c}, spanning a total built-up area of ${a} sq. ft. The facility requires a comprehensive energy audit to evaluate current energy consumption patterns, identify inefficiencies across major systems including HVAC, lighting, and electrical distribution, and recommend actionable energy conservation measures to optimize operational costs and reduce carbon footprint.`,
        (p, c, a) => `${p}, situated in ${c}, encompasses a built-up area of ${a} sq. ft. A detailed energy audit is proposed to assess the facility's energy performance, benchmark consumption against industry standards, and develop a prioritized roadmap for energy efficiency improvements across all building systems and processes.`,
        (p, c, a) => `Located in ${c}, ${p} covers an area of ${a} sq. ft. This energy audit aims to conduct a thorough assessment of the facility's energy usage, evaluate equipment efficiency, perform power quality analysis, and identify energy-saving opportunities to optimize operational costs and promote environmental sustainability.`,
    ],
    'water-audit': [
        (p, c, a) => `The ${p} project is located in ${c}, with a total built-up area of ${a} sq. ft. A comprehensive water audit is proposed to assess current water consumption patterns, identify water wastage points, evaluate water treatment systems, and recommend water conservation strategies to optimize usage and promote sustainable water management.`,
        (p, c, a) => `${p}, situated in ${c}, spans an area of ${a} sq. ft. The proposed water audit will systematically evaluate water usage across the facility, identify leakage and inefficiency areas, and develop actionable recommendations for water conservation and recycling measures.`,
        (p, c, a) => `Located in ${c}, ${p} encompasses ${a} sq. ft. of built-up area. This water audit is designed to analyze the facility's water balance, assess consumption efficiency, and provide a comprehensive plan for water optimization and sustainable resource management.`,
    ],
    'fls-audit': [
        (p, c, a) => `The ${p} project is located in ${c}, covering a total built-up area of ${a} sq. ft. A comprehensive Fire & Life Safety (FLS) audit is proposed to evaluate the existing fire protection and life safety systems, assess compliance with applicable codes and standards, and recommend improvements to ensure occupant safety and regulatory compliance.`,
        (p, c, a) => `${p}, situated in ${c}, spans ${a} sq. ft. The FLS audit will thoroughly assess fire detection, suppression, and evacuation systems across the facility, evaluate emergency preparedness measures, and identify gaps in fire and life safety compliance.`,
        (p, c, a) => `Located in ${c}, ${p} covers an area of ${a} sq. ft. This Fire & Life Safety audit aims to review all fire protection infrastructure, emergency response systems, and safety protocols to ensure the facility meets the highest standards of occupant safety and regulatory requirements.`,
    ],
    'hotel-audit': [
        (p, c, a) => `The ${p} is a hospitality property located in ${c}, with a total built-up area of ${a} sq. ft. A detailed energy audit is proposed to evaluate the hotel's energy consumption across guest rooms, common areas, kitchen, laundry, and HVAC systems, and to recommend energy-efficient solutions that reduce operational costs while maintaining guest comfort.`,
        (p, c, a) => `${p}, a hotel facility situated in ${c}, encompasses ${a} sq. ft. of built-up area. The energy audit will assess consumption patterns across all hotel operations, benchmark against hospitality industry standards, and develop a strategic plan for energy optimization and sustainability.`,
        (p, c, a) => `Located in ${c}, ${p} spans a total area of ${a} sq. ft. This comprehensive hotel energy audit aims to evaluate energy usage across all departments, identify efficiency improvement opportunities in HVAC, lighting, kitchen equipment, and water heating systems, and propose cost-effective energy conservation measures.`,
    ],
    'mep-proposal': [
        (p, c, a) => `The ${p} project is located in ${c}, with a total built-up area of ${a} sq. ft. The MEP consultancy services will encompass the design and engineering of Mechanical, Electrical, and Plumbing systems to ensure optimal building performance, energy efficiency, and compliance with applicable codes and standards.`,
        (p, c, a) => `${p}, situated in ${c}, covers a total area of ${a} sq. ft. Our MEP consultancy will deliver comprehensive mechanical, electrical, and plumbing engineering solutions designed for efficiency, sustainability, and seamless integration with the building's architectural vision.`,
        (p, c, a) => `Located in ${c}, ${p} spans ${a} sq. ft. The proposed MEP services include detailed design, system selection, and engineering of all mechanical, electrical, and plumbing infrastructure to achieve optimal performance, energy efficiency, and long-term operational reliability.`,
    ],
    'mep-third-party': [
        (p, c, a) => `The ${p} project is located in ${c}, with a total built-up area of ${a} sq. ft. The MEP Third Party Commissioning services will encompass Testing, Adjusting, Balancing & Commissioning of mechanical, electrical, and plumbing systems to verify performance, ensure compliance, and optimize building systems operation.`,
        (p, c, a) => `${p}, situated in ${c}, covers a total area of ${a} sq. ft. Our MEP Third Party Commissioning scope includes development of commissioning plans, functional performance testing, and delivery of comprehensive commissioning reports to ensure all systems perform as designed.`,
        (p, c, a) => `Located in ${c}, ${p} spans ${a} sq. ft. The proposed MEP Third Party Commissioning services include design study, development of Testing & Commissioning plans, functional performance tests, and submission of commissioning documentation for all MEP systems.`,
    ],
    'igbc-new-building': [
        (p, c, a) => `The ${p} is a new building project located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green New Building certification, demonstrating a strong commitment to sustainable construction practices, energy efficiency, water conservation, and creating a healthy indoor environment for occupants.`,
        (p, c, a) => `${p}, a new construction project situated in ${c}, encompasses ${a} sq. ft. of built-up area. The project seeks IGBC Green New Building certification to incorporate sustainable design strategies from inception, ensuring optimal resource utilization and minimal environmental impact throughout the building's lifecycle.`,
        (p, c, a) => `Located in ${c}, the ${p} project covers an area of ${a} sq. ft. As a new development pursuing IGBC Green New Building certification, the project will integrate green building principles including energy-efficient design, sustainable materials, water management, and enhanced indoor environmental quality.`,
    ],
    'igbc-new-building-pre-final': [
        (p, c, a) => `The ${p} is a new building project located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green New Building certification (Pre + Final), demonstrating a strong commitment to sustainable construction practices, energy efficiency, water conservation, and creating a healthy indoor environment for occupants.`,
        (p, c, a) => `${p}, a new construction project situated in ${c}, encompasses ${a} sq. ft. of built-up area. The project seeks IGBC Green New Building Pre + Final certification to incorporate sustainable design strategies from inception through certification, ensuring optimal resource utilization and minimal environmental impact.`,
        (p, c, a) => `Located in ${c}, the ${p} project covers an area of ${a} sq. ft. As a new development pursuing IGBC Green New Building Pre + Final certification, the project will integrate green building principles including energy-efficient design, sustainable materials, water management, and enhanced indoor environmental quality.`,
    ],
    'igbc-existing-building': [
        (p, c, a) => `The ${p} is an existing building located in ${c}, with a total built-up area of ${a} sq. ft. The building seeks IGBC Green Existing Building certification to demonstrate its commitment to sustainable operations, energy efficiency improvements, water conservation, and maintaining a healthy indoor environment for all occupants.`,
        (p, c, a) => `${p}, an existing facility situated in ${c}, spans ${a} sq. ft. The project pursues IGBC Green Existing Building certification to validate its ongoing efforts in sustainable building operations, resource optimization, and environmental stewardship while enhancing occupant comfort and well-being.`,
        (p, c, a) => `Located in ${c}, ${p} covers a total area of ${a} sq. ft. The IGBC Green Existing Building certification will recognize the building's operational excellence in sustainability, including energy performance optimization, water efficiency measures, waste management practices, and indoor environmental quality standards.`,
    ],
    'igbc-green-campus': [
        (p, c, a) => `The ${p} is a campus development located in ${c}, with a total area of ${a} sq. ft. The project aims to achieve IGBC Green Campus certification, showcasing sustainable land use, energy-efficient infrastructure, comprehensive water management, and an environmentally responsible approach to campus planning and operations.`,
        (p, c, a) => `${p}, a campus project situated in ${c}, encompasses ${a} sq. ft. The campus seeks IGBC Green Campus certification to demonstrate leadership in sustainable campus development, integrating green infrastructure, renewable energy systems, and ecological conservation measures across the entire campus footprint.`,
        (p, c, a) => `Located in ${c}, the ${p} campus spans ${a} sq. ft. Pursuing IGBC Green Campus certification, the project will implement holistic sustainability strategies covering site ecology, energy performance, water stewardship, waste management, and creation of a healthy, productive environment for all campus users.`,
    ],
    'igbc-green-factory': [
        (p, c, a) => `The ${p} is a factory facility located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green Factory certification, demonstrating commitment to sustainable industrial practices, energy efficiency in manufacturing processes, water conservation, and responsible waste management.`,
        (p, c, a) => `${p}, an industrial facility situated in ${c}, encompasses ${a} sq. ft. The factory seeks IGBC Green Factory certification to validate its sustainable manufacturing operations, including energy-efficient processes, water recycling systems, and environmentally responsible production practices.`,
        (p, c, a) => `Located in ${c}, ${p} covers a total area of ${a} sq. ft. The IGBC Green Factory certification will recognize the facility's commitment to green industrial operations, incorporating energy optimization, resource conservation, emission reduction, and worker health and safety best practices.`,
    ],
    'igbc-green-healthcare': [
        (p, c, a) => `The ${p} is a healthcare facility located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green Healthcare certification, integrating sustainable design principles to create a healing environment that promotes patient recovery, staff well-being, and environmental responsibility.`,
        (p, c, a) => `${p}, a healthcare project situated in ${c}, spans ${a} sq. ft. The facility seeks IGBC Green Healthcare certification to demonstrate excellence in sustainable healthcare design, ensuring energy efficiency, superior indoor air quality, infection control, and minimal environmental impact.`,
        (p, c, a) => `Located in ${c}, ${p} encompasses ${a} sq. ft. Pursuing IGBC Green Healthcare certification, this facility will incorporate evidence-based design strategies for sustainability, patient comfort, and staff productivity while maintaining the highest standards of healthcare service delivery.`,
    ],
    'igbc-green-homes': [
        (p, c, a) => `The ${p} is a residential project located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green Homes certification, creating sustainable living spaces with energy-efficient design, water conservation features, and healthy indoor environments for residents.`,
        (p, c, a) => `${p}, a residential development situated in ${c}, encompasses ${a} sq. ft. The project seeks IGBC Green Homes certification to provide eco-friendly living spaces that optimize energy use, conserve water, reduce waste, and promote a healthy lifestyle for all residents.`,
        (p, c, a) => `Located in ${c}, ${p} spans ${a} sq. ft. The IGBC Green Homes certification will validate the project's commitment to sustainable residential design, incorporating green building materials, renewable energy integration, and biophilic design elements for enhanced quality of life.`,
    ],
    'igbc-green-school': [
        (p, c, a) => `The ${p} is an educational facility located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green School certification, creating a sustainable learning environment that promotes student health, reduces environmental impact, and serves as a living laboratory for environmental education.`,
        (p, c, a) => `${p}, a school project situated in ${c}, encompasses ${a} sq. ft. The facility seeks IGBC Green School certification to demonstrate leadership in sustainable education infrastructure, ensuring optimal daylighting, indoor air quality, and resource-efficient operations for enhanced learning outcomes.`,
        (p, c, a) => `Located in ${c}, ${p} covers an area of ${a} sq. ft. Pursuing IGBC Green School certification, the project will integrate sustainable design strategies that create healthy, productive learning spaces while educating students about environmental stewardship and sustainability.`,
    ],
    'igbc-green-health-wellbeing': [
        (p, c, a) => `The ${p} is located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green Health & Well-Being certification, prioritizing occupant health through superior indoor air quality, biophilic design, access to natural light, and wellness-focused amenities.`,
        (p, c, a) => `${p}, situated in ${c}, spans ${a} sq. ft. The project seeks IGBC Green Health & Well-Being certification to create spaces that actively promote physical and mental well-being through evidence-based design strategies, healthy materials, and wellness infrastructure.`,
        (p, c, a) => `Located in ${c}, ${p} encompasses ${a} sq. ft. The IGBC Green Health & Well-Being certification will recognize the project's dedication to creating healthy built environments that enhance occupant comfort, productivity, and overall well-being through sustainable design practices.`,
    ],
    'igbc-green-services-building': [
        (p, c, a) => `The ${p} is a services building located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green Services Building certification, demonstrating commitment to sustainable building operations, energy efficiency, water conservation, and creating a healthy, productive environment for all occupants and visitors.`,
        (p, c, a) => `${p}, a services building situated in ${c}, encompasses ${a} sq. ft. The project seeks IGBC Green Services Building certification to validate its sustainable design and operational practices, including energy performance optimization, water management, and enhanced indoor environmental quality.`,
        (p, c, a) => `Located in ${c}, ${p} covers an area of ${a} sq. ft. Pursuing IGBC Green Services Building certification, the project will implement comprehensive sustainability measures covering energy efficiency, water conservation, waste reduction, and occupant health to achieve operational excellence.`,
    ],
    'igbc-green-resort': [
        (p, c, a) => `The ${p} is a resort project located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green Resort certification, demonstrating commitment to sustainable hospitality practices, energy efficiency, water conservation, ecological preservation, and creating a healthy environment for guests and staff.`,
        (p, c, a) => `${p}, a resort development situated in ${c}, encompasses ${a} sq. ft. The project seeks IGBC Green Resort certification to integrate sustainable design principles with hospitality excellence, ensuring minimal environmental impact while enhancing guest experience through eco-friendly operations and green infrastructure.`,
        (p, c, a) => `Located in ${c}, ${p} spans ${a} sq. ft. Pursuing IGBC Green Resort certification, the project will incorporate green building strategies covering energy optimization, water management, waste reduction, biodiversity conservation, and sustainable landscape design to achieve operational excellence in eco-tourism.`,
    ],
    'igbc-green-hotel': [
        (p, c, a) => `The ${p} is a hotel project located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green Hotel certification, demonstrating commitment to sustainable hospitality practices, energy efficiency, water conservation, and creating a healthy environment for guests and staff.`,
        (p, c, a) => `${p}, a hotel development situated in ${c}, encompasses ${a} sq. ft. The project seeks IGBC Green Hotel certification to integrate sustainable design principles with hospitality excellence, ensuring optimal energy performance, water efficiency, and enhanced guest experience through green building practices.`,
        (p, c, a) => `Located in ${c}, ${p} spans ${a} sq. ft. Pursuing IGBC Green Hotel certification, the project will incorporate green building strategies covering energy optimization, water management, sustainable materials, and indoor environmental quality to achieve excellence in eco-friendly hospitality operations.`,
    ],
    'igbc-green-interiors': [
        (p, c, a) => `The ${p} is an interior fit-out project located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Green Interiors certification, prioritizing sustainable interior design, healthy indoor air quality, energy-efficient lighting, and use of eco-friendly materials to create a productive and comfortable indoor environment.`,
        (p, c, a) => `${p}, an interior project situated in ${c}, encompasses ${a} sq. ft. The project seeks IGBC Green Interiors certification to demonstrate excellence in sustainable interior fit-out practices, including low-VOC materials, efficient lighting design, thermal comfort, and responsible material sourcing.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. Pursuing IGBC Green Interiors certification, the project will integrate sustainable design strategies for interior spaces, focusing on indoor environmental quality, energy efficiency, water conservation, and use of recycled and locally sourced materials.`,
    ],
    'igbc-mrts': [
        (p, c, a) => `The ${p} is a mass rapid transit system project located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC MRTS certification, demonstrating commitment to sustainable transit infrastructure, energy-efficient station design, water conservation, and creating healthy, accessible spaces for commuters.`,
        (p, c, a) => `${p}, a transit infrastructure project situated in ${c}, encompasses ${a} sq. ft. The project seeks IGBC MRTS certification to validate its sustainable design and operational practices for mass transit systems, including energy performance optimization, water management, and enhanced commuter experience.`,
        (p, c, a) => `Located in ${c}, ${p} spans ${a} sq. ft. Pursuing IGBC MRTS certification, the project will implement comprehensive sustainability measures for transit infrastructure covering energy efficiency, water conservation, waste management, indoor environmental quality, and accessible design for all users.`,
    ],
    'igbc-net-zero': [
        (p, c, a) => `The ${p} is located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve IGBC Net Zero certification, targeting net-zero performance across energy, water, and waste through ultra-efficient building design, on-site renewable energy generation, water conservation, and comprehensive waste management strategies.`,
        (p, c, a) => `${p}, situated in ${c}, spans ${a} sq. ft. The project seeks IGBC Net Zero certification to demonstrate that buildings can operate with minimal environmental impact by achieving net-zero targets in energy consumption, water usage, and waste generation through innovative design and management approaches.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. Pursuing IGBC Net Zero certification, this project will showcase cutting-edge sustainability by achieving net-zero performance in energy, water, and waste through passive design, high-performance systems, renewable energy, water recycling, and zero-waste strategies.`,
    ],
    'ecbc-a': [
        (p, c, a) => `The ${p} project is located in ${c}, with a total built-up area of ${a} sq. ft. The project requires ECBC compliance assessment for Form A, ensuring the building envelope design meets the Energy Conservation Building Code standards for thermal performance and energy efficiency.`,
        (p, c, a) => `${p}, situated in ${c}, spans ${a} sq. ft. ECBC Form A compliance services will evaluate the building envelope components including walls, roof, glazing, and fenestration to ensure adherence to the Energy Conservation Building Code for optimal thermal performance.`,
        (p, c, a) => `Located in ${c}, ${p} encompasses ${a} sq. ft. The ECBC Form A compliance assessment will verify that the building envelope design meets prescribed energy efficiency standards, covering thermal transmittance values, solar heat gain coefficients, and daylight integration requirements.`,
    ],
    'ecbc-bc': [
        (p, c, a) => `The ${p} project is located in ${c}, with a total built-up area of ${a} sq. ft. ECBC compliance assessment for Forms B & C is proposed, covering the mechanical systems (HVAC) and electrical systems (lighting, power) to ensure energy-efficient design meeting code requirements.`,
        (p, c, a) => `${p}, situated in ${c}, spans ${a} sq. ft. The ECBC Forms B & C compliance services will evaluate HVAC system efficiency, lighting power density, and electrical system design to ensure the building meets the Energy Conservation Building Code requirements for mechanical and electrical performance.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. The proposed ECBC Forms B & C assessment will verify compliance of mechanical and electrical systems with energy efficiency standards, including HVAC performance, lighting design, and power distribution efficiency.`,
    ],
    'ecbc-abc': [
        (p, c, a) => `The ${p} project is located in ${c}, with a total built-up area of ${a} sq. ft. Comprehensive ECBC compliance assessment for Forms A, B & C is proposed, covering the building envelope, mechanical systems (HVAC), and electrical systems (lighting, power) to ensure complete energy code compliance.`,
        (p, c, a) => `${p}, situated in ${c}, encompasses ${a} sq. ft. The complete ECBC Forms A, B & C compliance services will evaluate all building systems including envelope thermal performance, HVAC efficiency, and lighting/electrical design for comprehensive energy code adherence.`,
        (p, c, a) => `Located in ${c}, ${p} spans ${a} sq. ft. The proposed ECBC Forms A, B & C assessment provides end-to-end energy code compliance verification covering building envelope, mechanical systems, electrical systems, and overall building energy performance.`,
    ],
    'leed-hospitality': [
        (p, c, a) => `The ${p} is a hospitality project located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve LEED Certification for Hospitality, demonstrating commitment to sustainable hospitality design, energy efficiency, water conservation, and creating a healthy environment for guests and staff while minimizing environmental impact.`,
        (p, c, a) => `${p}, a hospitality development situated in ${c}, encompasses ${a} sq. ft. The project seeks LEED Hospitality certification to integrate sustainable design principles with world-class hospitality, ensuring optimal energy performance, water efficiency, and superior indoor environmental quality.`,
        (p, c, a) => `Located in ${c}, ${p} spans ${a} sq. ft. Pursuing LEED Certification for Hospitality, the project will implement comprehensive sustainability strategies covering energy optimization, water management, sustainable materials, and enhanced guest experience through green building practices.`,
    ],
    'leed-core-shell': [
        (p, c, a) => `The ${p} is a core and shell development located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve LEED Core & Shell Certification, focusing on sustainable base building design including structure, envelope, and MEP systems to enable high-performance tenant fit-outs.`,
        (p, c, a) => `${p}, a core and shell project situated in ${c}, encompasses ${a} sq. ft. The project seeks LEED Core & Shell certification to deliver a sustainable base building that maximizes energy efficiency, water conservation, and indoor environmental quality for future tenants.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. Pursuing LEED Core & Shell Certification, the project will implement sustainable strategies for the building envelope, HVAC systems, lighting infrastructure, and water management to create a high-performance base building.`,
    ],
    'leed-nc': [
        (p, c, a) => `The ${p} is a new construction project located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve LEED New Construction (NC) Certification, incorporating sustainable design strategies from inception to ensure energy efficiency, water conservation, and reduced environmental impact throughout the building's lifecycle.`,
        (p, c, a) => `${p}, a new construction project situated in ${c}, encompasses ${a} sq. ft. The project seeks LEED NC certification to demonstrate leadership in sustainable building design, integrating high-performance building systems, renewable energy strategies, and environmentally responsible construction practices.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. Pursuing LEED NC Certification, the project will integrate green building principles including energy-efficient HVAC systems, optimized building envelope, sustainable materials, water management, and enhanced indoor environmental quality for all occupants.`,
    ],
    'leed-new-construction': [
        (p, c, a) => `The ${p} is a new construction project located in ${c}, with a total built-up area of ${a} sq. m. The project aims to achieve LEED BD+C (Building Design and Construction) Certification, incorporating sustainable design strategies from inception to ensure energy efficiency, water conservation, and reduced environmental impact throughout the building's lifecycle.`,
        (p, c, a) => `${p}, a new construction project situated in ${c}, encompasses ${a} sq. m. The project seeks LEED BD+C certification to demonstrate leadership in sustainable building design, integrating high-performance building systems, LEED commissioning, life cycle assessment, and environmentally responsible construction practices.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. m. Pursuing LEED BD+C Certification, the project will integrate green building principles including energy-efficient HVAC systems, optimized building envelope, building commissioning, whole-building LCA, sustainable materials, and enhanced indoor environmental quality for all occupants.`,
    ],
    'leed-ebom': [
        (p, c, a) => `The ${p} is an existing building located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve LEED EBOM (Existing Buildings: Operations & Maintenance) Certification, demonstrating excellence in sustainable building operations, energy performance optimization, and environmental stewardship.`,
        (p, c, a) => `${p}, an existing facility situated in ${c}, spans ${a} sq. ft. The project seeks LEED EBOM certification to validate ongoing sustainable operations including energy management, water efficiency, waste reduction, and indoor environmental quality improvements.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. Pursuing LEED EBOM Certification, the project will implement best practices in building operations and maintenance to optimize energy use, reduce environmental impact, and enhance occupant comfort and productivity.`,
    ],
    'leed-net-zero-carbon': [
        (p, c, a) => `The ${p} is located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve LEED Net Zero Carbon Certification, targeting net-zero carbon emissions through a combination of ultra-efficient building design, on-site renewable energy generation, and carbon offset strategies.`,
        (p, c, a) => `${p}, situated in ${c}, spans ${a} sq. ft. The project seeks LEED Net Zero Carbon certification to demonstrate that buildings can operate with zero net carbon emissions through aggressive demand reduction, renewable energy integration, and verified carbon accounting.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. Pursuing LEED Net Zero Carbon Certification, this project will showcase cutting-edge sustainability by achieving net-zero carbon performance through energy efficiency, renewable energy production, and comprehensive carbon management strategies.`,
    ],
    'leed-zero-water': [
        (p, c, a) => `The ${p} is located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve LEED Zero Water Certification, targeting net-zero water consumption through innovative water harvesting, recycling, and conservation strategies to eliminate reliance on municipal water supply.`,
        (p, c, a) => `${p}, situated in ${c}, spans ${a} sq. ft. The project seeks LEED Zero Water certification to demonstrate leadership in water sustainability by achieving a balance between total water consumption and alternative water supply through rainwater harvesting, greywater recycling, and water-efficient systems.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. Pursuing LEED Zero Water Certification, the project will implement comprehensive water management strategies including rainwater collection, wastewater treatment, water-efficient fixtures, and drought-resistant landscaping.`,
    ],
    'leed-idci': [
        (p, c, a) => `The ${p} is an interior design and construction project located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve LEED v4 ID+C: Interior Design and Construction Certification, prioritizing sustainable interior fit-out practices, healthy indoor environments, and resource-efficient design.`,
        (p, c, a) => `${p}, an interior fit-out project situated in ${c}, encompasses ${a} sq. ft. The project seeks LEED v4 ID+CI certification to demonstrate excellence in sustainable interior construction, including low-emitting materials, energy-efficient lighting, thermal comfort, and waste reduction during construction.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. Pursuing LEED v4 ID+CI Certification, the project will integrate sustainable interior design strategies focusing on indoor air quality, daylighting, material transparency, and occupant well-being to create high-performance interior spaces.`,
    ],
    'edge-consultancy-audit': [
        (p, c, a) => `The ${p} is located in ${c}, with a total built-up area of ${a} sq. ft. EDGE consultancy and audit services are proposed to evaluate the building's resource efficiency and guide it toward EDGE certification, focusing on energy savings, water conservation, and reduced embodied energy in materials.`,
        (p, c, a) => `${p}, situated in ${c}, spans ${a} sq. ft. The EDGE consultancy will assess the building's sustainability performance against EDGE benchmarks and provide strategic recommendations for achieving certification through energy, water, and materials efficiency improvements.`,
        (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. The proposed EDGE audit will benchmark the building's resource efficiency, identify improvement opportunities, and develop a clear pathway toward EDGE certification through optimized energy, water, and material usage.`,
    ],
};

const DEFAULT_TEMPLATES = [
    (p, c, a) => `The ${p} project is located in ${c}, with a total built-up area of ${a} sq. ft. The project aims to achieve high standards of sustainability, energy efficiency, and environmental responsibility through comprehensive design and operational strategies.`,
    (p, c, a) => `${p}, situated in ${c}, spans a total area of ${a} sq. ft. The project is committed to implementing sustainable practices that optimize energy consumption, conserve resources, and create a healthy environment for all occupants.`,
    (p, c, a) => `Located in ${c}, ${p} covers ${a} sq. ft. The project seeks to integrate sustainable design principles, energy-efficient systems, and environmentally responsible practices to achieve outstanding performance and reduced environmental impact.`,
];

const formatAreaWithCommas = (value) => {
    if (!value) return '';
    const numericValue = value.toString().replace(/,/g, '');
    const lastThree = numericValue.substring(numericValue.length - 3);
    const otherNumbers = numericValue.substring(0, numericValue.length - 3);
    if (otherNumbers !== '') {
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return lastThree;
};

const ProjectOverviewGenerator = ({ formData, handleChange, serviceType }) => {
    const [templateIndex, setTemplateIndex] = useState(0);
    const [isGenerated, setIsGenerated] = useState(false);

    const templates = OVERVIEW_TEMPLATES[serviceType] || DEFAULT_TEMPLATES;

    const handleInputChange = (fieldName) => (e) => {
        let value = e.target.value;
        if (fieldName === 'areaSqFt') {
            value = e.target.value.replace(/[^0-9]/g, '');
        }
        handleChange({ target: { name: fieldName, value } });
    };

    const generateOverview = useCallback((index) => {
        const name = formData.projectName?.trim();
        const city = formData.cityName?.trim();
        const area = formData.areaSqFt?.toString().replace(/,/g, '');

        if (!name || !city || !area) return;

        const formattedArea = formatAreaWithCommas(area);
        const tpl = templates[index % templates.length];
        const text = tpl(name, city, formattedArea);

        handleChange({ target: { name: 'projectDescription', value: text } });
        setIsGenerated(true);
    }, [formData.projectName, formData.cityName, formData.areaSqFt, templates, handleChange]);

    const handleGenerate = () => {
        generateOverview(templateIndex);
    };

    const handleRegenerate = () => {
        const nextIndex = (templateIndex + 1) % templates.length;
        setTemplateIndex(nextIndex);
        generateOverview(nextIndex);
    };

    const allFieldsFilled = formData.projectName?.trim() && formData.cityName?.trim() && formData.areaSqFt?.toString().replace(/,/g, '');

    const wordCount = formData.projectDescription?.trim().split(/\s+/).filter(w => w).length || 0;

    useEffect(() => {
        if (!formData.projectDescription) {
            setIsGenerated(false);
        }
    }, [formData.projectDescription]);

    return (
        <div style={{ width: '100%' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px'
            }}>
                <Sparkles style={{ width: '20px', height: '20px', color: '#2980B9' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#2980B9', margin: 0 }}>
                    Project Overview Generator
                </h3>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px',
                marginBottom: '16px'
            }}>
                <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="projectName" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building style={{ width: '14px', height: '14px' }} />
                        Project Name:
                    </label>
                    <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName || ''}
                        onChange={handleInputChange('projectName')}
                        placeholder="e.g., ABC Tower"
                        required
                    />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="cityName" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin style={{ width: '14px', height: '14px' }} />
                        City Name:
                    </label>
                    <input
                        type="text"
                        id="cityName"
                        name="cityName"
                        value={formData.cityName || ''}
                        onChange={handleInputChange('cityName')}
                        placeholder="e.g., Mumbai, Maharashtra"
                        required
                    />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="areaSqFt" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Ruler style={{ width: '14px', height: '14px' }} />
                        Area (Sq. Ft.):
                    </label>
                    <input
                        type="text"
                        id="areaSqFt"
                        name="areaSqFt"
                        value={formatAreaWithCommas(formData.areaSqFt || '')}
                        onChange={handleInputChange('areaSqFt')}
                        placeholder="e.g., 50,000"
                        required
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!allFieldsFilled}
                    style={{
                        padding: '10px 20px',
                        background: allFieldsFilled
                            ? 'linear-gradient(135deg, #2980B9 0%, #3498DB 100%)'
                            : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: allFieldsFilled ? 'pointer' : 'not-allowed',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Sparkles style={{ width: '16px', height: '16px' }} />
                    Generate Overview
                </button>

                {isGenerated && (
                    <button
                        type="button"
                        onClick={handleRegenerate}
                        style={{
                            padding: '10px 20px',
                            background: 'linear-gradient(135deg, #2980B9 0%, #3498DB 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <RefreshCw style={{ width: '16px', height: '16px' }} />
                        Regenerate
                    </button>
                )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="projectDescription" style={{ margin: 0 }}>Project Overview:</label>
                    <span style={{
                        fontSize: '0.85rem',
                        color: wordCount > 100 ? '#e74c3c' : '#666',
                        fontWeight: '600'
                    }}>
                        {wordCount} / 100 words
                    </span>
                </div>
                <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription || ''}
                    onChange={(e) => {
                        handleChange(e);
                        setIsGenerated(true);
                    }}
                    placeholder="Fill in the project details above and click 'Generate Overview', or type your project overview manually..."
                    rows="8"
                    required
                    style={{
                        border: isGenerated ? '2px solid #2980B933' : undefined,
                        transition: 'border-color 0.3s ease'
                    }}
                />
                {wordCount > 100 && (
                    <p style={{
                        fontSize: '0.85rem',
                        color: '#e74c3c',
                        margin: '5px 0 0 0',
                        fontWeight: '500'
                    }}>
                        Please reduce to maximum 100 words for backend processing
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProjectOverviewGenerator;
