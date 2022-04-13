import { Formik } from 'formik';
import json5 from 'json5';
import React, { useState } from 'react';
import '../components/Convertor.css'

const Convector = () => {
  const [input, setInput] = useState([])
  const [converted, setConverted] = useState([])
  const correctObjExample = { "a": "1", "b": true, "c": [1, 2, 3], "d": "https://gist.github.com/" }
  const regExpUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const regExpUuid = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
  const regExpIp = /^(\b25[0-6]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  const regExpDate = /^(0?[1-9]|1[0-2])\/?:?(0?[1-9]|1\d|2\d|3[01])\/?:?(19|2[0-9]|3[0-9])\d{2}$/;
  const LongPhoneNumber = /^\+?[0-9][0-9]\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$/;
  const shortPhoneNumber = /^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$/;
  const regExpMail = /\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/;
  const regExpText = /^[a-zA-ZА-Яа-яА-ЯҐЄІЇ ]*$/;
  const regExpWord = /^[a-zA-ZА-Яа-яА-ЯҐЄІЇ]*[ ]*$/;
  const regExpZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

  const handleConvert = (obj) => {
    const resultObj = {};

    for (let key in obj) {
      if (typeof (obj[key]) === 'object') resultObj[key] = 'object';
      if (Array.isArray(obj[key])) resultObj[key] = 'array';
      if (typeof (obj[key]) === 'boolean') resultObj[key] = 'boolean';

      if (Number(obj[key]) === 0 || !!Number(obj[key])) {
        if (LongPhoneNumber.test(obj[key])) {
          resultObj[key] = 'phone number'
        } else if (shortPhoneNumber.test(obj[key])) {
          resultObj[key] = 'phone number'
        } else if (obj[key].toString().includes('.')) {
          resultObj[key] = 'double (floating-point digit)'
        }
        else if (regExpZip.test(obj[key])) {
          resultObj[key] = 'zip (postal code)'
        } else if (typeof (obj[key]) !== 'boolean' && typeof (obj[key]) !== 'object') {
          debugger
          resultObj[key] = 'integer'
        };
      } else if (typeof (obj[key]) !== 'boolean' && typeof (obj[key]) !== 'object' && !Array.isArray(obj[key]) && typeof (obj[key]) !== 'number') {
        resultObj[key] = 'undefined'
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
    const resultArray = Object.entries(resultObj);
    setConverted(resultArray);
  };

  return (
    <div className='container'>
      <h1>Json Convertor</h1>
      <Formik
        initialValues={{ name: '' }}
        onSubmit={(values) => {
          let baseObj
          try {
            baseObj = json5.parse(values.name)
            setInput(Object.entries(baseObj));
          } catch {
            alert(
              `Sorry, but your object has incorrect structure.\nPlease, check your object.\n 
              Example of correct object:\n${JSON.stringify(correctObjExample, null, 2)}`
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
        <span>Input Object:</span>
        <div className='curly_brackets'>&#123;</div>
        <div className='inner_block'>
          {
            input.map(el => {
              return (
                <div >
                  {`"${el[0]}"`} : {JSON.stringify(el[1])},
                </div>
              )
            })
          }
        </div>
        <div className='curly_brackets'>&#125;</div>
      </div>

      <div className='converted_object'>
        <span>Converted Object:</span>
        <div className='curly_brackets'>&#123;</div>
        <div>
          {
            converted.map(el => {
              return (
                <div className='inner_block'>
                  {`"${el[0]}"`} : {`"${el[1]}"`}
                </div>
              )
            })
          }
        </div>
        <div className='curly_brackets'>&#125;</div>
      </div>
      <div>*Date format could be MM/DD/YYYY or MM:DD:YYYY</div>
      <div>*Internet protocol address should not include any spaces between numbers or you will get the undefined type</div>
    </div >
  );
};

export default Convector;
