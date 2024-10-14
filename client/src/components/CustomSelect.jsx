// React Select
import Select from 'react-select';

// React Hook Form
import { Controller } from "react-hook-form";

// React Bootstrap Components
import { Form } from 'react-bootstrap';

// Utility Functions
import { getPlatformIcon } from '../utils/helper';

const CustomSelect = ({ control, name, setValue, watchLinks, index, errors }) => {
    const options = [
        {
            value: 'GitHub',
            label: 'GitHub'
        },
        {
            value: 'Frontend Mentor',
            label: 'Frontend Mentor'
        },
        {
            value: 'Twitter',
            label: 'Twitter'
        },
        {
            value: 'LinkedIn',
            label: 'LinkedIn'
        },
        {
            value: 'YouTube',
            label: 'YouTube'
        },
        {
            value: 'Facebook',
            label: 'Facebook'
        },
        {
            value: 'Twitch',
            label: 'Twitch'
        },
        {
            value: 'Dev.to',
            label: 'Dev.to'
        },
        {
            value: 'Codewars',
            label: 'Codewars'
        },
        {
            value: 'Codepen',
            label: 'Codepen'
        },
        {
            value: 'freeCodeCamp',
            label: 'freeCodeCamp'
        },
        {
            value: 'GitLab',
            label: 'GitLab'
        },
        {
            value: 'Hashnode',
            label: 'Hashnode'
        },
        {
            value: 'Stack Overflow',
            label: 'Stack Overflow'
        }
    ];


    const formatOptionLabel = ({ value, label }) => (
        <div className='d-flex align-items-center'>
            {getPlatformIcon(value)}
            <span className='ms-2'>{label}</span>
        </div>
    );

    return <div>
        <Form.Label className="mt-2">Platform</Form.Label>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select
                    options={options}
                    formatOptionLabel={formatOptionLabel}
                    placeholder="Select an option..."
                    {...field}
                    onChange={(selected) => {
                        if (selected) {
                            if (watchLinks?.length > 0 && watchLinks[index]?.platform?.value) {
                                const currentSelected = watchLinks[index]?.platform?.value;
                                if (currentSelected !== selected.value) {
                                    field.onChange(selected);
                                    setValue(`links.${index}.link`, '');
                                }
                            } else {
                                field.onChange(selected);
                            }
                        }
                    }}
                />
            )}
            rules={{
                required: 'Platform selection is required'
            }}
        />
        {
            errors.items?.length > 0 && errors.items?.[index]?.platform && (
                <span className="text-danger">
                    {errors.items[index].platform.message}
                </span>
            )
        }
    </div>
};

export default CustomSelect;
