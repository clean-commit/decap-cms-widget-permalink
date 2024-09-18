import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const Control = ({
  field,
  forID,
  value,
  classNameWrapper,
  onChange,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [inputVal, setInputVal] = useState(decodeSlug(value));

  const slugify = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^\w^/\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const isValid = () => {
    if (!inputVal) return true;
    const parser = document.createElement('a');
    parser.href = `http://example.com${prepareUrl(inputVal)}/`;
    return parser.pathname !== inputVal
      ? { error: { message: 'Invalid permalink.' } }
      : true;
  };

  function decodeSlug(val) {
    let prefix = field.get('prefix', '');

    if (prefix) {
      val = val.replace(`/${prefix}/`, '');
    }

    if (val === '/') {
      return '';
    }

    return val
      .split('/')
      .filter((n) => n && n !== prefix)
      .join('/');
  }

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const handleChange = (e) => {
    setInputVal(e.target.value);
  };

  const prepareUrl = (val) => {
    let result = val;
    let prefix = field.get('prefix', '');

    if (val === '') {
      return '/';
    }

    if (result.charAt(0) !== '/') {
      result = `/${result}/`;
    }

    if (prefix) {
      result = `/${prefix}${result}`;
    }

    return result;
  };

  const saveEdit = () => {
    let slug = slugify(inputVal);
    setShowEdit(false);
    setInputVal(slug);

    const updatedUrl = prepareUrl(slug);
    onChange(updatedUrl);
  };

  const url = field.get('url', '');
  const prefix = field.get('prefix', '');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 14 }}>Permalink:</span>
        {showEdit ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{ fontSize: 14, display: 'flex', alignItems: 'center' }}>
              {url}/ {prefix && <span>{prefix}/</span>}
            </div>
            <input
              id={forID}
              className={classNameWrapper}
              style={{ height: 20, padding: 5 }}
              value={inputVal}
              onChange={handleChange}
            />
            <span>/</span>
            <button onClick={saveEdit}>OK</button>
            <button onClick={toggleEdit}>Cancel</button>
          </div>
        ) : (
          <>
            <a
              style={{ color: 'blue', textDecoration: 'underline' }}
              href={`${url}${value}`}
              target='_blank'
              rel='noopener noreferrer'>
              {url}
              {value}
            </a>
            <button onClick={toggleEdit}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

Control.propTypes = {
  onChange: PropTypes.func.isRequired,
  forID: PropTypes.string,
  value: PropTypes.node,
  classNameWrapper: PropTypes.string.isRequired,
};

Control.defaultProps = {
  value: '',
};

export const Widget = {
  // name that will be used in config.yml
  name: 'permalink',
  controlComponent: Control,
};
