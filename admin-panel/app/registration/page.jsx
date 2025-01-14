'use client';

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
  InputNumber
} from 'antd';
import { LoadingOutlined, PlusOutlined, BankOutlined, ShopOutlined, UserOutlined, EnvironmentOutlined, PictureOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = TimePicker;

export default function RegisterLaundry() {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: 'Laundry Details', icon: <ShopOutlined /> },
    { title: 'Owner Info', icon: <UserOutlined /> },
    { title: 'Location', icon: <EnvironmentOutlined /> },
    { title: 'Images', icon: <PictureOutlined /> },
    { title: 'Facilities', icon: <SettingOutlined /> },
    { title: 'Bank Details', icon: <BankOutlined /> },
  ];

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // API call here
      const response = await fetch('/api/laundryOwners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        message.success('Registration successful!');
        form.resetFields();
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      message.error('Registration failed. Please try again.');
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
              label="Contact"
              name={['ownerDetails', 'contact']}
              rules={[
                { required: true, message: 'Please enter email or phone' },
                {
                  validator: (_, value) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const phoneRegex = /^\d{10}$/;
                    if (emailRegex.test(value) || phoneRegex.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Please enter valid email or phone');
                  }
                }
              ]}
            >
              <Input placeholder="Enter email or phone number" />
            </Form.Item>
          </>
        );

      case 2:
        return (
          <>
            <Title level={4}>Location Details</Title>
            <Form.Item
              label="Address Line 1"
              name={['shopLocation', 'address1']}
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter street address" />
            </Form.Item>
            <Form.Item
              label="Address Line 2"
              name={['shopLocation', 'address2']}
            >
              <Input placeholder="Enter apartment, suite, etc." />
            </Form.Item>
            <Form.Item
              label="Landmark"
              name={['shopLocation', 'landmark']}
            >
              <Input placeholder="Enter nearby landmark" />
            </Form.Item>
            <Form.Item
              label="Pincode"
              name={['shopLocation', 'pincode']}
              rules={[{ required: true, pattern: /^\d{6}$/, message: 'Please enter valid pincode' }]}
            >
              <Input placeholder="Enter pincode" />
            </Form.Item>
            <Form.Item label="Coordinates">
              <Input.Group compact>
                <Form.Item
                  name={['shopLocation', 'lat']}
                  rules={[{ required: false }]}
                >
                  <InputNumber placeholder="Latitude" style={{ width: '50%' }} />
                </Form.Item>
                <Form.Item
                  name={['shopLocation', 'lon']}
                  rules={[{ required: false }]}
                >
                  <InputNumber placeholder="Longitude" style={{ width: '50%' }} />
                </Form.Item>
              </Input.Group>
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
                            rules={[{ required: true, message: 'Please enter account type' }]}
                        >
                            <Input prefix={<BankOutlined />} placeholder="Enter account type" />
                        </Form.Item>
                        </>
                    );

      // Add remaining cases for other steps...
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          Register Your Laundry
        </Title>
        
        <Steps current={current} items={steps} style={{ marginBottom: '24px' }} />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
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
      </Card>
    </div>
  );
}