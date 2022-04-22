import { Formik } from 'formik';
import json5 from 'json5';
import { parse } from 'json-in-order';
import React, { useState } from 'react';
import '../components/Convertor.css'

const Convector = () => {
  let firstObj = [];
  const [converted, setConverted] = useState([]);
  const regExpUrl = /^ *https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]* *)$/;
  const regExpUuid = /^ *[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12} *$/;
  const regExpIp = /^ *(\b25[0-9]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]? *) *(\. *( *25[0-5] *|2[0-4][0-9] *|[01]?[0-9][0-9]? *)){3}$/;
  const regExpDate = /^ *(0?[1-9]|1[0-2]) *\/?:? *(0?[1-9]|1\d|2\d|3[01]) *\/?:? *(19|2[0-9]|3[0-9])\d{2}$/;
  const LongPhoneNumber = /^\+?[0-9][0-9]\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$/;
  const shortPhoneNumber = /^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$/;
  const regExpMail = /^ *\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,6} *$/;
  const regExpText = /[a-zA-ZА-Яа-яА-ЯҐЄІЇ ,.!?]*/;
  const regExpWord = /^[a-zA-ZА-Яа-яА-ЯҐЄІЇ']*[ ]*$/;
  const regExpZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

  const handleConvert = (obj) => {
    const resultObj = {};
    let firstArray = [];
    let secondArray = [];

    for (let key in obj) {
      if (typeof (obj[key]) === 'object') {
        if (obj[key] === null) {
          resultObj[key] = 'null'
        } else {
          resultObj[key] = 'object';
        }
      }

      if (Array.isArray(obj[key])) resultObj[key] = 'array';
      if (typeof (obj[key]) === 'boolean') resultObj[key] = 'boolean';

      if (Number(obj[key]) === 0 || !!Number(obj[key])) {
        if (typeof (obj[key]) !== 'object') {
          if (LongPhoneNumber.test(obj[key])) {
            resultObj[key] = 'phone number'
          } else if (shortPhoneNumber.test(obj[key])) {
            resultObj[key] = 'phone number'
          } else if (obj[key].toLocaleString('fullwide', { useGrouping: false }).includes(',') ||
            obj[key].toLocaleString('fullwide', { useGrouping: false }).includes('.')) {
            resultObj[key] = 'double (floating-point digit)'
          }
          else if (regExpZip.test(obj[key])) {
            resultObj[key] = 'zip (postal code)'
          } else if (typeof (obj[key]) !== 'boolean' && typeof (obj[key]) !== 'object') {
            resultObj[key] = 'integer'
          };
        } else if (typeof (obj[key]) !== 'boolean' && typeof (obj[key]) !== 'object' && !Array.isArray(obj[key]) && typeof (obj[key]) !== 'number') {
          resultObj[key] = 'undefined'
        }
      };

      if (typeof (obj[key]) === 'string') {
        if (!Number(obj[key])) {
          if (regExpMail.test(obj[key])) {
            resultObj[key] = 'email'
          } else if (regExpDate.test(obj[key])) {
            resultObj[key] = 'date'
          } else if (regExpUrl.test(obj[key])) {
            resultObj[key] = 'url'
          } else if (regExpUuid.test(obj[key])) {
            resultObj[key] = 'uuid'
          } else if (regExpIp.test(obj[key])) {
            resultObj[key] = 'ip protocol'
          } else if (!obj[key].length) {
            resultObj[key] = 'empty string'
          } else if (obj[key].length) {
            if (regExpText.test(obj[key])) {
              if (regExpWord.test(obj[key])) {
                resultObj[key] = 'word'
              } else {
                obj[key].length > 20 ? resultObj[key] = 'text' : resultObj[key] = 'title'
              };
            };
          };
        };
      } else if (typeof (obj[key]) !== 'boolean' && typeof (obj[key]) !== 'object' && !Array.isArray(obj[key]) && typeof (obj[key]) !== 'number') {
        resultObj[key] = 'undefined'
      };
    };

    firstArray = Object.entries(resultObj);
    [...firstObj].forEach(el => {
      firstArray.forEach(el2 => {
        if (el2.includes(el[0])) {
          secondArray.push(el2)
        }
      })
    })
    setConverted(secondArray);
  };

  return (
    <div className='container'>
      <h1>Json Convertor</h1>
      <Formik
        initialValues={{ name: '' }}
        onSubmit={(values) => {
          let baseObj = values.name
            .replace(/\+/g, '')
            .replace(/:\s*\[([^[\]]*)]/g, function (match, p1, p2) {
              return ': [' + p1.replace(/:/g, '@colon@') + ']';
            })
            .replace(/:\s*\[([^"]*)]/g, function (match, p1, p2) {
              return ': [' + p1.replace(/'/g, '"') + ']';
            })
            .replace(/:\s*"([^"]*)"/g, function (match, p1) {
              return ': "' + p1.replace(/:/g, '@colon@') + '"';
            })
            .replace(/:\s*'([^']*)'/g, function (match, p1) {
              return ': "' + p1.replace(/:/g, '@colon@') + '"';
            })
            .replace(/(['"])?([a-z0-9A-Z_ ]+)(['"])?\s*:/g, '"$2": ')
            .replace(/@colon@/g, ':')
            .replace(/,\s*}/g, ' }')
          try {
            firstObj = parse(baseObj);
            baseObj = json5.parse(baseObj);
          } catch {
            alert(
              `Sorry, but your object has incorrect structure.\nPlease, check your object.`
            )
          }
          handleConvert(baseObj);
        }}
      >
        {props => (
          <form onSubmit={props.handleSubmit}>
            <input
              type="text"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.name}
              name="name"
              placeholder='put your object here'
            />
            <button type="submit" className='btn'>Convert</button>
          </form>
        )}
      </Formik>
      <div className='converted_object'>
        <span>Converted Object:</span>
        <div className='curly_brackets'>&#123;</div>
        <div className='inner_block'>
          {
            converted.map((el, index) => {
              return (
                <div key={index}>
                  {`"${el[0]}"`} : {`"${el[1]}"`}
                </div>
              )
            })
          }
        </div>
        <div className='curly_brackets'>&#125;</div>
      </div>
      <div>*Date format could be MM/DD/YYYY or MM:DD:YYYY</div>
    </div >
  );
};


export default Convector;
