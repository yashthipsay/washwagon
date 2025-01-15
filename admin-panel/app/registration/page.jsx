'use client';
import OlaMap from '../components/OlaMap';
import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Typography, 
  Card, 
  Divider, 
  Upload, 
  TimePicker, 
  Button, 
  Steps, 
  message,
  Select,
  InputNumber,
  Radio,
  Modal
} from 'antd';
import { LoadingOutlined, PlusOutlined, BankOutlined, ShopOutlined, UserOutlined, EnvironmentOutlined, PictureOutlined, SettingOutlined, CheckCircleOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import Autocomplete from '../components/olaMapsAutocomplete';
const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = TimePicker;

export default function RegisterLaundry() {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountValidated, setAccountValidated] = useState(null); // null=not checked, false=invalid, true=valid
  const [validationType, setValidationType] = useState('bank'); // 'bank' or 'upi'
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  const steps = [
    { title: 'Laundry Details', icon: <ShopOutlined /> },
    { title: 'Owner Info', icon: <UserOutlined /> },
    { title: 'Location', icon: <EnvironmentOutlined /> },
    { title: 'Images', icon: <PictureOutlined /> },
    { title: 'Facilities', icon: <SettingOutlined /> },
    { title: 'Bank Details', icon: <BankOutlined /> },
  ];

  const validateBankAccount = async () => {
    const ownerName = form.getFieldValue(['ownerDetails', 'fullname']);
    const ownerEmail = form.getFieldValue(['ownerDetails', 'email']);
    const ownerPhone = form.getFieldValue(['ownerDetails', 'phone']);
    
    if (validationType === 'upi') {
      const upiAddress = form.getFieldValue(['bankDetails', 'upiAddress']);
      
      if (!upiAddress) {
        message.error('Please enter UPI address');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/bank-verification/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: ownerName,
            email: ownerEmail,
            contact: ownerPhone,
            upiAddress
          })
        });

        const data = await response.json();

        if (data.success) {
          setAccountValidated(true);
          message.success('UPI address verified successfully!');
          form.setFieldsValue({ bankValidationData: data.validation });
        } else {
          setAccountValidated(false);
          message.error(data.error || 'UPI verification failed');
        }
      } catch (error) {
        setAccountValidated(false);
        message.error('Error verifying UPI address');
      } finally {
        setLoading(false);
      }
    } else {
      const accountNumber = form.getFieldValue(['bankDetails', 'accountNumber']);
      const ifscCode = form.getFieldValue(['bankDetails', 'ifscCode']);
      
      if (!accountNumber || !ifscCode) {
        message.error('Please enter account number and IFSC code');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/bank-verification/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accountNumber,
            ifsc: ifscCode,
            name: ownerName,
            email: ownerEmail,
            contact: ownerPhone
          })
        });

        const data = await response.json();

        if (data.success) {
          setAccountValidated(true);
          message.success('Bank account verified successfully!');
          form.setFieldsValue({ bankValidationData: data.validation });
        } else {
          setAccountValidated(false);
          message.error(data.error || 'Bank account verification failed');
        }
      } catch (error) {
        setAccountValidated(false);
        message.error('Error verifying bank account');
      } finally {
        setLoading(false);
      }
    }
};


const onFinish = async () => {
  try {
    setLoading(true);

    // Collect all form values
    const allValues = form.getFieldsValue(true);

    // Format timings from RangePicker
    const timings = allValues.timings
      ? `${allValues.timings[0].format('HH:mm')} - ${allValues.timings[1].format('HH:mm')}`
      : null;

    // Prepare images array
    const images = imageUrls.map((file) => file.url || file.thumbUrl);

    // Prepare complete form data
    const formData = {
      laundryDetails: {
        name: allValues.laundryDetails?.name,
        description: allValues.laundryDetails?.description,
      },
      ownerDetails: {
        fullname: allValues.ownerDetails?.fullname,
        email: allValues.ownerDetails?.email,
        phone: allValues.ownerDetails?.phone,
      },
      shopLocation: {
        address1: allValues.shopLocation?.address1,
        address2: allValues.shopLocation?.address2,
        landmark: allValues.shopLocation?.landmark,
        pincode: allValues.shopLocation?.pincode,
        lat: allValues.shopLocation?.lat,
        lon: allValues.shopLocation?.lon,
      },
      images: images,
      facilities: allValues.facilities,
      timings: timings,
      bankDetails:
        validationType === 'upi'
          ? {
              upiAddress: allValues.bankDetails?.upiAddress,
              validationType: 'upi',
            }
          : {
              accountNumber: allValues.bankDetails?.accountNumber,
              ifscCode: allValues.bankDetails?.ifscCode,
              accountType: allValues.bankDetails?.accountType,
              validationType: 'bank',
            },
      bankValidationData: allValues.bankValidationData,
    };

    console.log('Payload:', formData); // Inspect the payload

    const response = await fetch('http://localhost:5000/api/laundryOwners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    message.success('Registration successful!');
    form.resetFields();
    setCurrent(0);
    setImageUrls([]);
    setAccountValidated(null);
  } catch (error) {
    console.error('Registration error:', error);
    message.error(error.message || 'Registration failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const next = async () => {
    try {
      await form.validateFields();
      setCurrent(current + 1);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <>
            <Title level={4}>Laundry Details</Title>
            <Form.Item
              label="Laundry Name"
              name={['laundryDetails', 'name']}
              rules={[{ required: true, message: 'Please enter laundry name' }]}
            >
              <Input prefix={<ShopOutlined />} placeholder="Enter laundry name" />
            </Form.Item>
            <Form.Item
              label="Description"
              name={['laundryDetails', 'description']}
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <TextArea 
                placeholder="Describe your laundry services..."
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </>
        );
  
      case 1:
        return (
          <>
            <Title level={4}>Owner Details</Title>
            <Form.Item
              label="Full Name"
              name={['ownerDetails', 'fullname']}
              rules={[{ required: true, message: 'Please enter full name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter full name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name={['ownerDetails', 'email']}
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter email address" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name={['ownerDetails', 'phone']}
              rules={[
                { required: true, message: 'Please enter phone number' },
                { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number' }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
            </Form.Item>
          </>
        );
  
      case 2:
        return (
          <>
            <Title level={4}>Location Details</Title>
            <Form.Item
              label="Select Location Method"
              name={['shopLocation', 'method']}
              initialValue="autocomplete"
            >
              <Radio.Group>
                <Radio.Button value="autocomplete">Search Address</Radio.Button>
                <Radio.Button value="map">Pick on Map</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item noStyle shouldUpdate>
  {({ getFieldValue }) => {
    const method = getFieldValue(['shopLocation', 'method']);
    if (method === 'autocomplete') {
      return (
        <>

        <Form.Item
          label="Location"
          name={['shopLocation', 'address']}
          rules={[{ required: true, message: 'Please select a location' }]}
        >
          <Autocomplete
            apiKey="tx0FO1vtsTuqyz45MEUIJiYDTFMJOPG9bWR3Yd4k"
            initialValue={form.getFieldValue(['shopLocation', 'address'])}
            onSelect={(item) => {
              console.log('Autocomplete selected:', item);
              form.setFieldsValue({
                shopLocation: {
                  address: item.description,
                  lat: item.geometry.location.lat,
                  lon: item.geometry.location.lng,
                  method: 'autocomplete',
                },
              });
              console.log('Form values after autocomplete:', form.getFieldsValue());
            }}
          />
        </Form.Item>
        </>
      );
    } else {
      return (
        <>
          <Form.Item>
            <Button type="primary" onClick={() => setMapModalOpen(true)}>
              Open Map
            </Button>
          </Form.Item>
          <Form.Item
            name={['shopLocation', 'address']}
            label="Location"
            rules={[{ required: true, message: 'Please select a location' }]}
          >
            <Input readOnly placeholder="Coordinates will appear once saved" />
          </Form.Item>
          <Modal
            title="Pick on Map"
            open={mapModalOpen}
            footer={null}
            onCancel={() => setMapModalOpen(false)}
            width="100%"
            style={{ top: 10 }}
          >
            <div style={{ height: '100%', width: '100%' }}>
            <OlaMap
  apiKey="tx0FO1vtsTuqyz45MEUIJiYDTFMJOPG9bWR3Yd4k"
  onLocationSelect={(coords) => {
    console.log('Selected location:', coords);
    form.setFieldsValue({
      shopLocation: {
        address: coords.address || '',
        lat: coords.lat,      // Add latitude
        lon: coords.lon,      // Add longitude
        method: 'map'
      },
    });
  }}
  onClose={() => setMapModalOpen(false)}
/>
            </div>
          </Modal>
        </>
      );
    }
  }}
</Form.Item>
          </>
        );
  
      case 3: 
        return (
          <>
            <Title level={4}>Upload Images</Title>
            <Upload
              listType="picture-card"
              fileList={imageUrls}
              beforeUpload={() => false}
              onChange={({ fileList }) => setImageUrls(fileList)}
            >
              {imageUrls.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </>
        );
  
      case 4:
        return (
          <>
            <Title level={4}>Facilities</Title>
            <Form.Item
              label="Facilities"
              name="facilities"
              rules={[{ required: true, message: 'Please select facilities' }]}
            >
              <Select mode="multiple" placeholder="Select facilities">
                <Select.Option value="Washing">Washing</Select.Option>
                <Select.Option value="Ironing">Ironing</Select.Option>
                <Select.Option value="Dry Cleaning">Dry Cleaning</Select.Option>
                <Select.Option value="Pickup & Delivery">Pickup & Delivery</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Timings"
              name="timings"
              rules={[{ required: true, message: 'Please select timings' }]}
            >
              <RangePicker format="HH:mm" />
            </Form.Item>
          </>
        );
  
      case 5:
        return (
          <>
            <Title level={4}>Bank Details</Title>
            <Form.Item
              name="validationType"
              initialValue="bank"
            >
              <Radio.Group onChange={(e) => setValidationType(e.target.value)} value={validationType}>
                <Radio value="bank">Bank Account</Radio>
                <Radio value="upi">UPI Address</Radio>
              </Radio.Group>
            </Form.Item>
            
            <div style={{ 
              padding: '24px',
              border: `2px solid ${accountValidated === null ? '#faad14' : accountValidated ? '#52c41a' : '#ff4d4f'}`,
              borderRadius: '8px',
              marginBottom: '24px',
              transition: 'all 0.3s ease'
            }}>
              {validationType === 'bank' ? (
                <>
                  <Form.Item
                    label="Account Number"
                    name={['bankDetails', 'accountNumber']}
                    rules={[{ required: true, message: 'Please enter account number' }]}
                  >
                    <Input prefix={<BankOutlined />} placeholder="Enter account number" />
                  </Form.Item>
                  <Form.Item
                    label="Re-enter Account Number"
                    name={['bankDetails', 'confirmAccountNumber']}
                    dependencies={[['bankDetails', 'accountNumber']]}
                    rules={[
                      { required: true, message: 'Please confirm account number' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue(['bankDetails', 'accountNumber']) === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Account numbers do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input prefix={<BankOutlined />} placeholder="Re-enter account number" />
                  </Form.Item>
                  <Form.Item
                    label="IFSC Code"
                    name={['bankDetails', 'ifscCode']}
                    rules={[{ required: true, message: 'Please enter IFSC code' }]}
                  >
                    <Input prefix={<BankOutlined />} placeholder="Enter IFSC code" />
                  </Form.Item>
                  <Form.Item
                    label="Account Type"
                    name={['bankDetails', 'accountType']}
                    rules={[{ required: true, message: 'Please select account type' }]}
                  >
                    <Select placeholder="Select account type">
                      <Select.Option value="savings">Savings</Select.Option>
                      <Select.Option value="current">Current</Select.Option>
                    </Select>
                  </Form.Item>
                </>
              ) : (
                <Form.Item
                  label="UPI Address"
                  name={['bankDetails', 'upiAddress']}
                  rules={[
                    { required: true, message: 'Please enter UPI address' },
                    { pattern: /^[\w\.\-_]{3,}@[a-zA-Z]{3,}/, message: 'Please enter a valid UPI address' }
                  ]}
                >
                  <Input prefix={<BankOutlined />} placeholder="Enter UPI address (e.g. user@bank)" />
                </Form.Item>
              )}
              
              <Button 
                type="primary"
                onClick={validateBankAccount}
                loading={loading}
                icon={accountValidated ? <CheckCircleOutlined /> : null}
                style={{ width: '100%', marginTop: '12px' }}
              >
                Validate {validationType === 'bank' ? 'Bank Details' : 'UPI Address'}
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          Register Your Laundry
        </Title>
        
        <Steps current={current} onChange={setCurrent} items={steps} style={{ marginBottom: '24px' }} />
        <Form.Provider
        onFormFinish={(name, { values }) => {
          console.log('Form values:', values); // You can combine values here if needed
        }}
        >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          onValuesChange={(changedValues, allValues) => {
            console.log('Updated form values:', allValues);
          }}
        >
          {renderStepContent()}

          <Divider />

          <div style={{ textAlign: 'right' }}>
            {current > 0 && (
              <Button style={{ marginRight: 8 }} onClick={prev}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            )}
          </div>
        </Form>
        </Form.Provider>
      </Card>
    </div>
  );
}