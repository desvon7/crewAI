import React, { useState } from 'react';
import { colors, spacing, typography } from '../../theme';
import { NodeType } from './FlowNode';

interface PropertyPanelProps {
  isVisible: boolean;
  selectedNode?: {
    id: string;
    type: NodeType;
    title: string;
    description?: string;
    properties?: Record<string, any>;
  };
  onClose?: () => void;
  onPropertyChange?: (property: string, value: any) => void;
}

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  validation?: (value: any) => string | null;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  isVisible,
  selectedNode,
  onClose,
  onPropertyChange,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const panelStyle: React.CSSProperties = {
    width: spacing.panel.width,
    height: '100%',
    backgroundColor: colors.background.card,
    borderLeft: `1px solid ${colors.border.light}`,
    padding: spacing.panel.padding,
    display: isVisible ? 'flex' : 'none',
    flexDirection: 'column',
    gap: spacing[4],
    overflow: 'auto',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing[3],
    borderBottom: `1px solid ${colors.border.light}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    padding: spacing[1],
    borderRadius: spacing[1],
    transition: 'all 0.2s ease',
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  };

  const labelStyle: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  };

  const inputStyle: React.CSSProperties = {
    padding: spacing[2],
    border: `1px solid ${colors.border.light}`,
    borderRadius: spacing[1],
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    transition: 'all 0.2s ease',
  };

  const errorInputStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: colors.error[500],
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: typography.fontFamily.sans.join(', '),
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const checkboxStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    cursor: 'pointer',
  };

  const checkboxInputStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    accentColor: colors.primary[500],
  };

  const errorStyle: React.CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: colors.error[500],
    marginTop: spacing[1],
  };

  const saveButtonStyle: React.CSSProperties = {
    padding: `${spacing[2]} ${spacing[4]}`,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: spacing[1],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: 'auto',
  };

  // Node type specific fields
  const getNodeFields = (type: NodeType): FormField[] => {
    const commonFields: FormField[] = [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        placeholder: 'Enter node title',
        required: true,
        validation: (value) => !value ? 'Title is required' : null,
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter node description',
      },
    ];

    switch (type) {
      case 'agent':
        return [
          ...commonFields,
          {
            key: 'role',
            label: 'Role',
            type: 'text',
            placeholder: 'e.g., Research Analyst',
            required: true,
          },
          {
            key: 'goal',
            label: 'Goal',
            type: 'textarea',
            placeholder: 'What should this agent accomplish?',
            required: true,
          },
          {
            key: 'backstory',
            label: 'Backstory',
            type: 'textarea',
            placeholder: 'Agent background and context',
          },
        ];
      case 'task':
        return [
          ...commonFields,
          {
            key: 'expectedOutput',
            label: 'Expected Output',
            type: 'textarea',
            placeholder: 'What should this task produce?',
            required: true,
          },
          {
            key: 'maxRetries',
            label: 'Max Retries',
            type: 'number',
            placeholder: '3',
          },
        ];
      case 'tool':
        return [
          ...commonFields,
          {
            key: 'toolType',
            label: 'Tool Type',
            type: 'select',
            options: [
              { value: 'search', label: 'Search Tool' },
              { value: 'file', label: 'File Tool' },
              { value: 'web', label: 'Web Tool' },
              { value: 'custom', label: 'Custom Tool' },
            ],
            required: true,
          },
          {
            key: 'parameters',
            label: 'Parameters',
            type: 'textarea',
            placeholder: 'JSON parameters for the tool',
          },
        ];
      case 'condition':
        return [
          ...commonFields,
          {
            key: 'conditionType',
            label: 'Condition Type',
            type: 'select',
            options: [
              { value: 'if', label: 'If' },
              { value: 'switch', label: 'Switch' },
              { value: 'loop', label: 'Loop' },
            ],
            required: true,
          },
          {
            key: 'condition',
            label: 'Condition Logic',
            type: 'textarea',
            placeholder: 'Enter condition logic',
            required: true,
          },
        ];
      default:
        return commonFields;
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }
    if (field.validation) {
      return field.validation(value);
    }
    return null;
  };

  const handleSave = () => {
    if (!selectedNode) return;

    const fields = getNodeFields(selectedNode.type);
    const newErrors: Record<string, string> = {};

    // Validate all fields
    fields.forEach(field => {
      const error = validateField(field, formData[field.key]);
      if (error) {
        newErrors[field.key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save the data
    onPropertyChange && Object.entries(formData).forEach(([key, value]) => {
      onPropertyChange(key, value);
    });
  };

  const renderField = (field: FormField) => {
    const value = formData[field.key] || selectedNode?.properties?.[field.key] || '';
    const error = errors[field.key];

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            style={error ? { ...textareaStyle, borderColor: colors.error[500] } : textareaStyle}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        );
      case 'select':
        return (
          <select
            style={error ? { ...selectStyle, borderColor: colors.error[500] } : selectStyle}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            style={error ? { ...inputStyle, borderColor: colors.error[500] } : inputStyle}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.key, parseInt(e.target.value) || 0)}
          />
        );
      case 'boolean':
        return (
          <div style={checkboxStyle}>
            <input
              type="checkbox"
              style={checkboxInputStyle}
              checked={value}
              onChange={(e) => handleInputChange(field.key, e.target.checked)}
            />
            <span style={{ fontSize: typography.fontSize.sm }}>{field.label}</span>
          </div>
        );
      default:
        return (
          <input
            type="text"
            style={error ? { ...inputStyle, borderColor: colors.error[500] } : inputStyle}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        );
    }
  };

  if (!isVisible || !selectedNode) {
    return null;
  }

  const fields = getNodeFields(selectedNode.type);

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleStyle}>Properties</div>
        <button style={closeButtonStyle} onClick={onClose}>
          ×
        </button>
      </div>

      {/* Node Info */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Node Information</div>
        <div style={{ 
          padding: spacing[3], 
          backgroundColor: colors.gray[50], 
          borderRadius: spacing[1],
          border: `1px solid ${colors.border.light}`,
        }}>
          <div style={{ 
            fontSize: typography.fontSize.sm, 
            fontWeight: typography.fontWeight.medium,
            color: colors.text.primary,
            marginBottom: spacing[1],
          }}>
            {selectedNode.title}
          </div>
          <div style={{ 
            fontSize: typography.fontSize.xs, 
            color: colors.text.secondary,
            textTransform: 'capitalize',
          }}>
            {selectedNode.type} Node
          </div>
        </div>
      </div>

      {/* Properties Form */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Configuration</div>
        {fields.map(field => (
          <div key={field.key} style={fieldStyle}>
            {field.type !== 'boolean' && (
              <label style={labelStyle}>
                {field.label}
                {field.required && <span style={{ color: colors.error[500] }}> *</span>}
              </label>
            )}
            {renderField(field)}
            {errors[field.key] && (
              <div style={errorStyle}>{errors[field.key]}</div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button style={saveButtonStyle} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default PropertyPanel; 