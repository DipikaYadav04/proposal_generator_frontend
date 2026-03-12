import React from 'react';

const SERVICE_CATEGORIES = {
    'audit-commissioning': {
        label: 'Audit & Commissioning',
        templates: [
            { value: 'energy-audit', label: 'Energy Audit (Industry)' },
            { value: 'water-audit', label: 'Water Audit' },
            { value: 'fls-audit', label: 'FLS Audit' },
            { value: 'hotel-audit', label: 'Hotel Energy Audit' },
        ],
    },
    'ecbc': {
        label: 'ECBC',
        templates: [
            { value: 'ecbc-a', label: 'ECBC Form A' },
            { value: 'ecbc-bc', label: 'ECBC Form B&C' },
            { value: 'ecbc-abc', label: 'ECBC Form A, B & C' },
        ],
    },
    'green': {
        label: 'GREEN',
        subcategories: {
            'igbc': {
                label: 'IGBC',
                templates: [
                    { value: 'igbc-new-building', label: 'IGBC New Building' },
                    { value: 'igbc-existing-building', label: 'IGBC Existing Building' },
                    { value: 'igbc-green-campus', label: 'IGBC Green Campus' },
                    { value: 'igbc-green-factory', label: 'IGBC Green Factory Certification' },
                    { value: 'igbc-green-healthcare', label: 'IGBC Green Healthcare' },
                    { value: 'igbc-green-homes', label: 'IGBC Green Homes' },
                    { value: 'igbc-green-school', label: 'IGBC Green School' },
                    { value: 'igbc-green-health-wellbeing', label: 'IGBC Green Health & Well-Being Certification' },
                    { value: 'igbc-green-services-building', label: 'IGBC Green Services Building Certification' },
                    { value: 'igbc-green-resort', label: 'IGBC Green Resort' },
                    { value: 'igbc-green-interiors', label: 'IGBC Green Interiors Certification' },
                    { value: 'igbc-mrts', label: 'IGBC MRTS Certification' },
                    { value: 'igbc-net-zero', label: 'IGBC Net Zero Certification' },
                ],
            },
            'edge': {
                label: 'EDGE',
                templates: [
                    { value: 'edge-consultancy-audit', label: 'EDGE Consultancy & Audit' },
                ],
            },
        },
    },
    'mep': {
        label: 'MEP',
        templates: [
            { value: 'mep-proposal', label: 'MEP Proposal' },
        ],
    },
    'others': {
        label: 'Others',
        templates: [
            { value: 'template2', label: 'Other Service (Simple Proposal)' },
        ],
    },
};

const Step1Form = ({ formData, handleChange, handleCategoryChange, handleSubCategoryChange, handleNext }) => {
    const selectedCategory = formData.serviceCategory || '';
    const selectedSubCategory = formData.serviceSubCategory || '';
    const categoryData = SERVICE_CATEGORIES[selectedCategory];

    const hasSubcategories = categoryData?.subcategories != null;

    let availableTemplates = [];
    if (hasSubcategories) {
        if (selectedSubCategory) {
            availableTemplates = categoryData.subcategories[selectedSubCategory]?.templates || [];
        }
    } else if (categoryData) {
        availableTemplates = categoryData.templates || [];
    }

    return (
        <div className="form-step">
            <h2>Step 1: Basic Information</h2>

            <div className="form-group">
                <label htmlFor="serviceCategory">Select Service Category:</label>
                <select
                    id="serviceCategory"
                    name="serviceCategory"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    required
                    className="template-selector"
                >
                    <option value="">Choose a category...</option>
                    {Object.entries(SERVICE_CATEGORIES).map(([key, cat]) => (
                        <option key={key} value={key}>{cat.label}</option>
                    ))}
                </select>
            </div>

            {hasSubcategories && (
                <div className="form-group">
                    <label htmlFor="serviceSubCategory">Select Sub-Category:</label>
                    <select
                        id="serviceSubCategory"
                        name="serviceSubCategory"
                        value={selectedSubCategory}
                        onChange={handleSubCategoryChange}
                        required
                        className="template-selector"
                    >
                        <option value="">Choose a sub-category...</option>
                        {Object.entries(categoryData.subcategories).map(([key, sub]) => (
                            <option key={key} value={key}>{sub.label}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="form-group">
                <label htmlFor="template">Select Service Type:</label>
                <select
                    id="template"
                    name="template"
                    value={formData.template}
                    onChange={handleChange}
                    required
                    disabled={hasSubcategories ? !selectedSubCategory : !selectedCategory}
                    className="template-selector"
                >
                    <option value="">
                        {hasSubcategories
                            ? (selectedSubCategory ? 'Choose a service...' : 'Select a sub-category first')
                            : (selectedCategory ? 'Choose a service...' : 'Select a category first')
                        }
                    </option>
                    {availableTemplates.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                    Select the type of service proposal you want to create
                </p>
            </div>

            <div className="form-group">
                <label htmlFor="clientName">Proposal Name:</label>
                <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Enter proposal name"
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="submittedTo">Submitted to:</label>
                <input
                    type="text"
                    id="submittedTo"
                    name="submittedTo"
                    value={formData.submittedTo}
                    onChange={handleChange}
                    placeholder="Enter recipient name"
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="button-group">
                <button type="submit" className="btn-next">Next</button>
            </div>
        </div>
    );
};

export default Step1Form;
