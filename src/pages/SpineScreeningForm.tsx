import React, { useState } from'react';
import { Form, Input, Select, Radio, Button, message, Typography, Divider } from 'antd';
const { Option } = Select;
const { Title } = Typography;

const { TextArea } = Input;

const SpineExaminationForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = (values) => {
    setIsSubmitting(true);
    // 这里可以添加提交表单数据到后端的逻辑，比如使用fetch或axios
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
      <Title level={3}>个人基本情况</Title>
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
        name="idCardOrSchoolCard"
        label="身份证号/学籍卡号"
        rules={[{ required: true, message: '请输入身份证号/学籍卡号' }]}
      >
        <Input placeholder="请输入身份证号/学籍卡号" />
      </Form.Item>
      <Form.Item
        name="grade"
        label="年级"
        rules={[{ required: true, message: '请输入年级' }]}
      >
        <Input placeholder="请输入年级" />
      </Form.Item>
      <Form.Item
        name="class"
        label="班级"
        rules={[{ required: true, message: '请输入班级' }]}
      >
        <Input placeholder="请输入班级" />
      </Form.Item>
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
      <Form.Item
        name="birthDate"
        label="出生日期"
        rules={[{ required: true, message: '请输入出生日期' }]}
      >
        <Input placeholder="年/月/日" />
      </Form.Item>
      <Form.Item
        name="examinationDate"
        label="检查时间"
        rules={[{ required: true, message: '请输入检查时间' }]}
      >
        <Input placeholder="年/月/日" />
      </Form.Item>

      {/* 脊柱弯曲异常记录筛查表 - 脊柱侧弯筛查 */}
      <Title level={2}>脊柱弯曲异常记录筛查表</Title>
      <Divider />   
      
         <Title level={3}>脊柱侧弯筛查</Title>
      <Divider />
      <Form.Item
        name="spineScoliosisGeneralCheck"
        label="（1）一般检查"
        rules={[{ required: true, message: '请选择一般检查结果' }]}
      >
        <Radio.Group>
          <Radio value="①正常">①正常</Radio>
          <Radio value="②双肩不等高">②双肩不等高</Radio>
          <Radio value="③双侧肩胛骨下角不等高">③双侧肩胛骨下角不等高</Radio>
          <Radio value="④两侧腰窝不对称">④两侧腰窝不对称</Radio>
          <Radio value="⑤双侧髂嵴不等高">⑤双侧髂嵴不等高</Radio>
          <Radio value="⑥棘突连线倾斜或偏离正中线">⑥棘突连线倾斜或偏离正中线</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="spineScoliosisThoracicSection"
        label="胸段"
        rules={[{ required: true, message: '请选择胸段情况' }]}
      >
        <Radio.Group>
          <Radio value="①无侧弯">①无侧弯</Radio>
          <Radio value="②左底右高">②左底右高</Radio>
          <Radio value="③左高右低">③左高右低</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="thoracicATR"
        label="躯干旋转角度ATR"
      >
        <Input placeholder="请输入角度值" />
      </Form.Item>
      <Form.Item
        name="spineScoliosisLumbarThoracicSection"
        label="腰胸段"
        rules={[{ required: true, message: '请选择腰胸段情况' }]}
      >
        <Radio.Group>
          <Radio value="①无侧弯">①无侧弯</Radio>
          <Radio value="②左底右高">②左底右高</Radio>
          <Radio value="③左高右低">③左高右低</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="lumbarThoracicATR"
        label="躯干旋转角度ATR"
      >
        <Input placeholder="请输入角度值" />
      </Form.Item>
      <Form.Item
        name="spineScoliosisLumbarSection"
        label="腰段"
        rules={[{ required: true, message: '请选择腰段情况' }]}
      >
        <Radio.Group>
          <Radio value="①无侧弯">①无侧弯</Radio>
          <Radio value="②左底右高">②左底右高</Radio>
          <Radio value="③左高右低">③左高右低</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="lumbarATR"
        label="躯干旋转角度ATR"
      >
        <Input placeholder="请输入角度值" />
      </Form.Item>
      <Form.Item
        name="spineMotionExperiment"
        label="（3）是否进行脊柱运动实验"
        rules={[{ required: true, message: '请选择是否进行脊柱运动实验' }]}
      >
        <Radio.Group>
          <Radio value="①是">①是</Radio>
          <Radio value="②否">②否</Radio>
        </Radio.Group>
      </Form.Item>
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

      {/* 脊柱前后弯曲异常筛查 */}
      <Title level={3}>脊柱前后弯曲异常筛查</Title>
      <Divider />
      <Form.Item
        name="spineAnteriorPosteriorCheck"
        label="（4）一般检查"
        rules={[{ required: true, message: '请选择一般检查结果' }]}
      >
        <Radio.Group>
          <Radio value="①前后凸体征消失">①前后凸体征消失</Radio>
          <Radio value="②前凸体征">②前凸体征</Radio>
          <Radio value="③后凸体征">③后凸体征</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="spineAnteriorPosteriorProneTest"
        label="（5）俯卧试验"
        rules={[{ required: true, message: '请选择俯卧试验结果' }]}
      >
        <Radio.Group>
          <Radio value="①前后凸体征消失">①前后凸体征消失</Radio>
          <Radio value="②前凸体征">②前凸体征</Radio>
          <Radio value="③后凸体征">③后凸体征</Radio>
        </Radio.Group>
      </Form.Item>

      {/* 疾病史 */}
      <Title level={3}>疾病史</Title>
      <Divider />
      <Form.Item
        name="medicalHistory"
        label="（6）病史"
        rules={[{ required: true, message: '请选择病史情况' }]}
      >
        <Radio.Group>
          <Radio value="①无">①无</Radio>
          <Radio value="②脊柱弯曲异常常家族史">②脊柱弯曲异常常家族史</Radio>
          <Radio value="③脊柱外伤病史">③脊柱外伤病史</Radio>
          <Radio value="④脊柱手术历史">④脊柱手术历史</Radio>
        </Radio.Group>
      </Form.Item>

      {/* 常见不良体态筛查 */}
      <Title level={3}>常见不良体态筛查</Title>
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
        <TextArea placeholder="请输入其他特殊情况" />
      </Form.Item>
      <Form.Item
        name="screeningResult"
        label="筛查结果"
        rules={[{ required: true, message: '请选择筛查结果' }]}
      >
        <Radio.Group>
          <Radio value="①正常">①正常</Radio>
          <Radio value="②姿势不良">②姿势不良</Radio>
          <Radio value="③脊柱侧弯（__级）">③脊柱侧弯（__级）</Radio>
          <Radio value="④脊柱前凸异常">④脊柱前凸异常</Radio>
          <Radio value="⑤脊柱后凸异常">⑤脊柱后凸异常</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="suggestion"
        label="建议"
      >
        <TextArea  placeholder="请输入建议" />
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
        >
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SpineExaminationForm;