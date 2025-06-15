import React, { useState } from 'react';
import { Form, Input, Select, Radio, Button, message, Typography, Divider, DatePicker, Checkbox } from 'antd';
const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'antd';



const SpineExaminationForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange: InputNumberProps['onChange'] = (value) => {
    console.log('changed', value);
  };
  const onFinish = (values) => {
    setIsSubmitting(true);
    console.log('Form values:', values);
    setTimeout(() => {
      message.success('表单提交成功');
      setIsSubmitting(false);
    }, 1000);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name="spine_examination_form"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {/* 个人基本情况 */}
      <Title level={3} style={{ marginBottom: 16 }}>个人基本情况</Title>
      <Divider />
      <Form.Item
        name="name"
        label="姓名"
        rules={[{ required: true, message: '请输入姓名' }]}
      >
        <Input placeholder="请输入姓名" />
      </Form.Item>
      
      <Form.Item
        name="gender"
        label="性别"
        rules={[{ required: true, message: '请选择性别' }]}
      >
        <Radio.Group>
          <Radio value="男">男</Radio>
          <Radio value="女">女</Radio>
        </Radio.Group>
      </Form.Item>
      
      <Form.Item
        name="parentPhone"
        label="联系电话（父母）"
        rules={[{ required: true, message: '请输入联系电话' }]}
      >
        <Input placeholder="请输入联系电话" />
      </Form.Item>
      
      <Form.Item
        name="idCard"
        label="身份证号"
        rules={[{ required: true, message: '请输入身份证号' }]}
      >
        <Input.Search placeholder="请输入身份证号" />
      </Form.Item>

      <Form.Item
        name="SchoolCard"
        label="学籍卡号"
        rules={[{ required: true, message: '请输入学籍卡号' }]}
      >
        <Input placeholder="请输入学籍卡号" />
      </Form.Item>
      
      <div style={{ display: 'flex' }}>
        <Form.Item
          name="grade"
          label="年级"
          style={{ flex: 1, marginRight: 8 }}
          rules={[{ required: true, message: '请输入年级' }]}
        >
          <Input placeholder="请输入年级" />
        </Form.Item>
        
        <Form.Item
          name="class"
          label="班级"
          style={{ flex: 1 }}
          rules={[{ required: true, message: '请输入班级' }]}
        >
          <Input placeholder="请输入班级" />
        </Form.Item>
      </div>
      
      <Form.Item
        name="schoolLocation"
        label="学校所在地"
        rules={[{ required: true, message: '请输入学校所在地' }]}
      >
        <Input placeholder="请输入县（区、市）" />
      </Form.Item>
      
      <Form.Item
        name="schoolName"
        label="学校"
        rules={[{ required: true, message: '请输入学校名称' }]}
      >
        <Input placeholder="请输入学校名称" />
      </Form.Item>
      
      <div style={{ display: 'flex' }}>
        <Form.Item
          name="birthDate"
          label="出生日期"
          style={{ flex: 1, marginRight: 8 }}
          rules={[{ required: true, message: '请选择出生日期' }]}
        >
          <DatePicker placeholder="选择出生日期" style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="examinationDate"
          label="检查时间"
          style={{ flex: 1 }}
          rules={[{ required: true, message: '请选择检查时间' }]}
        >
          <DatePicker placeholder="选择检查时间" style={{ width: '100%' }} />
        </Form.Item>
      </div>

      {/* 脊柱弯曲异常记录筛查表 - 脊柱侧弯筛查 */}
      <Title level={3} style={{ marginTop: 24, marginBottom: 16 }}>脊柱弯曲异常记录筛查表</Title>
      <Divider />   
      
      <Title level={4} style={{ marginBottom: 16 }}>一、脊柱侧弯筛查</Title>
      <Divider />
      
      <Form.Item
        name="spineScoliosisGeneralCheck"
        label="（1）一般检查"
        rules={[{ required: true, message: '请选择一般检查结果' }]}
      >
        <Checkbox.Group style={{ width: '100%' }}>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="①正常">①正常</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="②双肩不等高">②双肩不等高</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="③双侧肩胛骨下角不等高">③双侧肩胛骨下角不等高</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="④两侧腰窝不对称">④两侧腰窝不对称</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="⑤双侧髂嵴不等高">⑤双侧髂嵴不等高</Checkbox>
          </div>
          <div>
            <Checkbox value="⑥棘突连线倾斜或偏离正中线">⑥棘突连线倾斜或偏离正中线</Checkbox>
          </div>
        </Checkbox.Group>
      </Form.Item>

      <Title level={5} style={{ marginBottom: 16 }}>（2）前屈试验</Title>
      
      <div style={{ marginLeft: 24, marginBottom: 16 }}>
        <Form.Item
          name="spineScoliosisThoracicSection"
          label="胸段"
          rules={[{ required: true, message: '请选择胸段情况' }]}
        >
          <Checkbox.Group>
            <div style={{ marginBottom: 8 }}>
              <Checkbox value="①无侧弯">①无侧弯</Checkbox>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Checkbox value="②左底右高">②左低右高</Checkbox>
            </div>
            <div>
              <Checkbox value="③左高右低">③左高右低</Checkbox>
            </div>
          </Checkbox.Group>
        </Form.Item>
        
        <Form.Item
          name="thoracicATR"
          label="躯干旋转角度ATR"
        >
          <Input placeholder="请输入角度值" />
        </Form.Item>
      </div>
      
      <div style={{ marginLeft: 24, marginBottom: 16 }}>
        <Form.Item
          name="spineScoliosisLumbarThoracicSection"
          label="腰胸段"
          rules={[{ required: true, message: '请选择腰胸段情况' }]}
        >
          <Checkbox.Group>
            <div style={{ marginBottom: 8 }}>
              <Checkbox value="①无侧弯">①无侧弯</Checkbox>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Checkbox value="②左底右高">②左底右高</Checkbox>
            </div>
            <div>
              <Checkbox value="③左高右低">③左高右低</Checkbox>
            </div>
          </Checkbox.Group>
        </Form.Item>
        
        <Form.Item
          name="lumbarThoracicATR"
          label="躯干旋转角度ATR"
        >
          <Input placeholder="请输入角度值" />
        </Form.Item>
      </div>
      
      <div style={{ marginLeft: 24, marginBottom: 16 }}>
        <Form.Item
          name="spineScoliosisLumbarSection"
          label="腰段"
          rules={[{ required: true, message: '请选择腰段情况' }]}
        >
          <Checkbox.Group>
            <div style={{ marginBottom: 8 }}>
              <Checkbox value="①无侧弯">①无侧弯</Checkbox>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Checkbox value="②左底右高">②左底右高</Checkbox>
            </div>
            <div>
              <Checkbox value="③左高右低">③左高右低</Checkbox>
            </div>
          </Checkbox.Group>
        </Form.Item>
        
        <Form.Item
          name="lumbarATR"
          label="躯干旋转角度ATR"
        >
          <Input placeholder="请输入角度值" />
        </Form.Item>
      </div>
      
      <Form.Item
        name="spineMotionExperiment"
        label="（3）是否进行脊柱运动实验"
        rules={[{ required: true, message: '请选择是否进行脊柱运动实验' }]}
      >
        <Radio.Group>
          <Radio value="①是">①是</Radio>
          <Radio value="②否">②否</Radio>
        </Radio.Group>
        <div style={{color: 'red'}}> (1选项后进行躯干旋转测量仪检查)</div>
      </Form.Item>
      
      <div style={{ marginLeft: 24, marginBottom: 16 }}>
        <Form.Item
          name="spineMotionATRThoracic"
          label="胸段ATR"
          dependencies={['spineMotionExperiment']}
          rules={[{ required: false }]} 
        >
          <Input placeholder="请输入胸段ATR值" />
        </Form.Item>
        
        <Form.Item
          name="spineMotionATRLumbarThoracic"
          label="腰胸段ATR"
          dependencies={['spineMotionExperiment']}
          rules={[{ required: false }]} 
        >
          <Input placeholder="请输入腰胸段ATR值" />
        </Form.Item>
        
        <Form.Item
          name="spineMotionATRLumbar"
          label="腰段ATR"
          dependencies={['spineMotionExperiment']}
          rules={[{ required: false }]} 
        >
          <Input placeholder="请输入腰段ATR值" />
        </Form.Item>
      </div>

      {/* 脊柱前后弯曲异常筛查 */}
      <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>二、脊柱前后弯曲异常筛查</Title>
      <Divider />
      
      <Form.Item
        name="spineAnteriorPosteriorCheck"
        label="（4）一般检查"
        rules={[{ required: true, message: '请选择一般检查结果' }]}
      >
        <Checkbox.Group>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="①前后凸体征消失">①前后凸体征消失</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="②前凸体征">②前凸体征</Checkbox>
          </div>
          <div>
            <Checkbox value="③后凸体征">③后凸体征</Checkbox>
          </div>
        </Checkbox.Group>
        <div style={{color: 'red'}}> (2和3选项后进行俯卧试验)</div>
      </Form.Item>
      
      <Form.Item
        name="spineAnteriorPosteriorProneTest"
        label="（5）俯卧试验"
        rules={[{ required: false, message: '请选择俯卧试验结果' }]}
      >
        <Checkbox.Group>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="①前后凸体征消失">①前后凸体征消失</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="②前凸体征">②前凸体征</Checkbox>
          </div>
          <div>
            <Checkbox value="③后凸体征">③后凸体征</Checkbox>
          </div>
        </Checkbox.Group>
      </Form.Item>

      {/* 疾病史 */}
      <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>三、疾病史</Title>
      <Divider />
      
      <Form.Item
        name="medicalHistory"
        label="（6）病史"
        rules={[{ required: true, message: '请选择病史情况' }]}
      >
        <Checkbox.Group>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="①无">①无</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="②脊柱弯曲异常常家族史">②脊柱弯曲异常常家族史</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="③脊柱外伤病史">③脊柱外伤病史</Checkbox>
          </div>
          <div>
            <Checkbox value="④脊柱手术历史">④脊柱手术历史</Checkbox>
          </div>
        </Checkbox.Group>
      </Form.Item>

      {/* 常见不良体态筛查 */}
      <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>四、常见不良体态筛查</Title>
      <Divider />
      
      <Form.Item
        name="badPostureScreening"
        label="常见不良体态筛查"
        rules={[{ required: true, message: '请选择不良体态情况' }]}
      >
        <Select mode="multiple">
          <Option value="1. 颈前倾">1. 颈前倾</Option>
          <Option value="2. 骨盆前倾">2. 骨盆前倾</Option>
          <Option value="3. 骨盆后倾">3. 骨盆后倾</Option>
          <Option value="4. O型腿、X型腿">4. O型腿、X型腿</Option>
          <Option value="5. 长短腿">5. 长短腿</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name="otherSpecialSituation"
        label="其他特殊情况"
      >
        <TextArea placeholder="请输入其他特殊情况" rows={3} />
      </Form.Item>
      
      <Form.Item
        name="screeningResult"
        label="筛查结果"
        rules={[{ required: true, message: '请选择筛查结果' }]}
      >
        <Checkbox.Group style={{ width: '100%' }}>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="①正常">①正常</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="②姿势不良">②姿势不良</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="③脊柱侧弯（__级）">③脊柱侧弯（<InputNumber min={0} max={100} defaultValue={0} onChange={onChange} />级）</Checkbox>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox value="④脊柱前凸异常">④脊柱前凸异常</Checkbox>
          </div>
          <div>
            <Checkbox value="⑤脊柱后凸异常">⑤脊柱后凸异常</Checkbox>
          </div>
        </Checkbox.Group>
      </Form.Item>
      
      <Form.Item
        name="suggestion"
        label="建议"
      >
        <TextArea placeholder="请输入建议" rows={3} />
      </Form.Item>
      
      <Form.Item
        name="signer"
        label="填表人/筛查人签名"
        rules={[{ required: true, message: '请输入签名' }]}
      >
        <Input placeholder="请输入签名" />
      </Form.Item>
      
      <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          size="large"
          style={{ width: '100%', marginTop: 24 }}
        >
          提交表单
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SpineExaminationForm;