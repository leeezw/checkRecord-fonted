import React, { useEffect, useState } from 'react';
import { 
  Form, Input, Select, Radio, Button, message, Typography, Divider, DatePicker, Checkbox, Spin 
} from 'antd';
import moment from 'moment';
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'antd';
import { 
  addStudentUsingPost, 
  updateStudentUsingPost,
  listStudentByPageUsingPost,
  listSchool, 
  listSchoolAddress 
} from '@/services/backend/studentController';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

interface ScreeningData {
  general_check: {
    result: string[];
    notes?: string;
  };
  forward_bending_test: {
    thoracic_section: {
      result: string;
      atr_value: string;
    };
    thoracolumbar_section: {
      result: string;
      atr_value: string;
    };
    lumbar_section: {
      result: string;
      atr_value: string;
    };
  };
  spine_motion_test: {
    performed: string;
    thoracic_atr?: string;
    thoracolumbar_atr?: string;
    lumbar_atr?: string;
  };
  anterior_posterior_check: {
    general_result: string[];
    prone_test_result?: string[];
  };
  medical_history: string[];
  bad_posture: string[];
  other_special_situation?: string;
  screening_result: {
    results: string[];
    scoliosis_grade?: number;
  };
  suggestion?: string;
}

interface SchoolOption {
  label: string;
  value: string;
}

const SpineExaminationForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoliosisChecked, setScoliosisChecked] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState<SchoolOption[]>([]);
  const [addressOptions, setAddressOptions] = useState<SchoolOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [existingStudent, setExistingStudent] = useState<API.Student | null>(null);
  
  // 加载学校和地址选项
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [schoolRes, addressRes] = await Promise.all([
          listSchool(),
          listSchoolAddress()
        ]);
        
        if (schoolRes.code === 0) {
          setSchoolOptions(schoolRes.data?.map(item => ({
            label: item.name || '',
            value: item.name || ''
          })) || []);
        }
        
        if (addressRes.code === 0) {
          setAddressOptions(addressRes.data?.map(item => ({
            label: item.name || '',
            value: item.name || ''
          })) || []);
        }
      } catch (error) {
        message.error('加载学校和地址数据失败');
      }
    };

    loadOptions();
  }, []);

  // 根据身份证号查询学生信息
  const fetchStudentByIdCard = async (idCard: string) => {
    if (!idCard) return;
    
    setLoading(true);
    try {
      const response = await listStudentByPageUsingPost({ userid: idCard });
      if (response.code === 0 && response.data) {
        setExistingStudent(response.data.records[0]);
        fillFormData(response.data.records[0]);
        message.success('已加载学生信息');
      } else {
        setExistingStudent(null);
        form.resetFields();
        message.info('未找到该学生信息，请填写完整表单');
      }
    } catch (error) {
      message.error('查询学生信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 填充表单数据
  const fillFormData = (student: API.Student) => {
    if (!student) return;
    
    try {
      const profile = student.userpprofile ? JSON.parse(student.userpprofile) : {};
      
      form.setFieldsValue({
        name: student.username,
        schoolarea: student.schoolarea,
        userphone: student.userphone,
        idCard: student.userid,
        SchoolCard: student.stuid,
        grade: student.usergrade,
        class: student.userclass,
        schoolLocation: student.schoolprovince,
        schoolName: student.schoolname,
        birthDate: student.birthdate ? moment(student.birthdate) : null,
        checkDate: student.checkdate ? moment(student.checkdate) : null,
        examinerSignature: student.schoolcity,
        
        // 筛查数据
        spineScoliosisGeneralCheck: profile?.general_check?.result || [],
        spineScoliosisThoracicSection: profile?.forward_bending_test?.thoracic_section?.result ? [profile.forward_bending_test.thoracic_section.result] : [],
        thoracicATR: profile?.forward_bending_test?.thoracic_section?.atr_value || '',
        spineScoliosisLumbarThoracicSection: profile?.forward_bending_test?.thoracolumbar_section?.result ? [profile.forward_bending_test.thoracolumbar_section.result] : [],
        lumbarThoracicATR: profile?.forward_bending_test?.thoracolumbar_section?.atr_value || '',
        spineScoliosisLumbarSection: profile?.forward_bending_test?.lumbar_section?.result ? [profile.forward_bending_test.lumbar_section.result] : [],
        lumbarATR: profile?.forward_bending_test?.lumbar_section?.atr_value || '',
        spineMotionExperiment: profile?.spine_motion_test?.performed || '',
        spineMotionATRThoracic: profile?.spine_motion_test?.thoracic_atr || '',
        spineMotionATRLumbarThoracic: profile?.spine_motion_test?.thoracolumbar_atr || '',
        spineMotionATRLumbar: profile?.spine_motion_test?.lumbar_atr || '',
        spineAnteriorPosteriorCheck: profile?.anterior_posterior_check?.general_result || [],
        spineAnteriorPosteriorProneTest: profile?.anterior_posterior_check?.prone_test_result || [],
        medicalHistory: profile?.medical_history || [],
        badPostureScreening: profile?.bad_posture || [],
        otherSpecialSituation: profile?.other_special_situation || '',
        screeningResult: profile?.screening_result?.results || [],
        screeningResultGrade: profile?.screening_result?.scoliosis_grade || 1,
        suggestion: profile?.suggestion || '',
      });
      
      // 设置脊柱侧弯复选框状态
      if (profile?.screening_result?.results?.includes('③脊柱侧弯（__级）')) {
        setScoliosisChecked(true);
      } else {
        setScoliosisChecked(false);
      }
    } catch (error) {
      console.error('解析学生数据失败', error);
      message.error('解析学生数据失败');
    }
  };

  // 身份证号输入完成时查询学生信息
  const handleIdCardBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const idCard = e.target.value;
    if (!idCard) return;
    
    // 验证身份证号格式
    if (!/^\d{17}[\dXx]$/.test(idCard)) {
      message.warning('身份证号格式不正确');
      return;
    }
    
    await fetchStudentByIdCard(idCard);
  };

  // 提交表单
  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      // 构建筛查数据JSON
      const screeningData: ScreeningData = {
        general_check: {
          result: values.spineScoliosisGeneralCheck || [],
          notes: ''
        },
        forward_bending_test: {
          thoracic_section: {
            result: values.spineScoliosisThoracicSection?.[0] || '',
            atr_value: values.thoracicATR || ''
          },
          thoracolumbar_section: {
            result: values.spineScoliosisLumbarThoracicSection?.[0] || '',
            atr_value: values.lumbarThoracicATR || ''
          },
          lumbar_section: {
            result: values.spineScoliosisLumbarSection?.[0] || '',
            atr_value: values.lumbarATR || ''
          }
        },
        spine_motion_test: {
          performed: values.spineMotionExperiment || '',
          thoracic_atr: values.spineMotionATRThoracic,
          thoracolumbar_atr: values.spineMotionATRLumbarThoracic,
          lumbar_atr: values.spineMotionATRLumbar
        },
        anterior_posterior_check: {
          general_result: values.spineAnteriorPosteriorCheck || [],
          prone_test_result: values.spineAnteriorPosteriorProneTest
        },
        medical_history: values.medicalHistory || [],
        bad_posture: values.badPostureScreening || [],
        other_special_situation: values.otherSpecialSituation,
        screening_result: {
          results: values.screeningResult || [],
          scoliosis_grade: values.screeningResult?.includes('③脊柱侧弯（__级）') 
            ? values.screeningResultGrade 
            : undefined
        },
        suggestion: values.suggestion
      };

      // 准备学生数据
      const studentData: API.StudentAddRequest = {
        username: values.name,
        schoolarea: values.schoolarea,
        userphone: values.userphone,
        userid: values.idCard,
        stuid: values.SchoolCard,
        usergrade: values.grade,
        userclass: values.class,
        schoolprovince: values.schoolLocation,
        schoolname: values.schoolName,
        birthdate: values.birthDate?.format('YYYY-MM-DD'),
        checkdate: values.checkDate?.format('YYYY-MM-DD'),
        userprofile: JSON.stringify(screeningData),
        schoolcity: values.examinerSignature
      };

      // 判断是新增还是更新
      let response;
      if (existingStudent) {
        // 更新学生信息
        studentData.id = existingStudent.id;
        response = await updateStudentUsingPost(studentData);
      } else {
        // 新增学生
        response = await addStudentUsingPost(studentData);
      }
      
      if (response.code === 0) {
        message.success(`${existingStudent ? '更新' : '保存'}成功`);
        form.resetFields();
        setExistingStudent(null);
        setScoliosisChecked(false);
      } else {
        message.error(response.message || `${existingStudent ? '更新' : '保存'}失败`);
      }
    } catch (error: any) {
      message.error(`提交过程中发生错误: ${error.message}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 监听脊柱侧弯结果变化
  const handleScreeningResultChange = (checkedValues: string[]) => {
    setScoliosisChecked(checkedValues.includes('③脊柱侧弯（__级）'));
  };

  // 监听一般检查变化
  const handleGeneralCheckChange = (checkedValues: string[]) => {
    form.setFieldsValue({
      spineAnteriorPosteriorCheck: checkedValues
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('验证失败字段:', errorInfo.errorFields);
    message.error('表单验证失败，请检查输入');
  };

  return (
    <Spin spinning={loading} tip="加载学生信息中...">
      <Form
        form={form}
        name="spine_examination_form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{
          spineAnteriorPosteriorCheck: [],
          spineAnteriorPosteriorProneTest: [],
          spineMotionExperiment: undefined
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {/* 个人基本情况 */}
        <Title level={3} style={{ marginBottom: 16 }}>个人基本情况</Title>
        <Divider />
        
        {existingStudent && (
          <div style={{ marginBottom: 16, padding: '8px 16px', background: '#e6f7ff', borderRadius: 4 }}>
            <span style={{ color: '#1890ff' }}>已加载学生信息，当前为更新模式</span>
          </div>
        )}
        
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        
        <Form.Item
          name="schoolarea"
          label="性别"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Radio.Group>
            <Radio value="男">男</Radio>
            <Radio value="女">女</Radio>
          </Radio.Group>
        </Form.Item>
        
        <Form.Item
          name="userhone"
          label="联系电话（父母）"
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
          ]}
        >
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        
        <Form.Item
          name="idCard"
          label="身份证号"
          rules={[
            { required: true, message: '请输入身份证号' },
            { pattern: /^\d{17}[\dXx]$/, message: '请输入正确的身份证号' }
          ]}
        >
          <Input.Search 
            placeholder="请输入身份证号" 
            onBlur={handleIdCardBlur}
            enterButton="查询"
            onSearch={(value) => fetchStudentByIdCard(value)}
          />
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
          rules={[{ required: true, message: '请选择学校所在地' }]}
        >
          <Select
            placeholder="请选择学校所在地"
            options={addressOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        
        <Form.Item
          name="schoolName"
          label="学校"
          rules={[{ required: true, message: '请选择学校' }]}
        >
          <Select
            placeholder="请选择学校"
            options={schoolOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        
        <div style={{ display: 'flex' }}>
          <Form.Item
            name="birthday"
            label="出生日期"
            style={{ flex: 1, marginRight: 8 }}
            rules={[{ required: true, message: '请选择出生日期' }]}
          >
            <DatePicker placeholder="选择出生日期" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="checkday"
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
          rules={[
            { 
              required: true, 
              type: 'array',
              min: 1,
              message: '请至少选择一项检查结果'
            }
          ]}
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
            rules={[
              { 
                required: true, 
                type: 'array',
                min: 1,
                message: '请选择胸段情况'
              }
            ]}
          >
            <Checkbox.Group>
              <div style={{ marginBottom: 8 }}>
                <Checkbox value="①无侧弯">①无侧弯</Checkbox>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Checkbox value="②左低右高">②左低右高</Checkbox>
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
            rules={[
              { 
                required: true, 
                type: 'array',
                min: 1,
                message: '请选择腰胸段情况'
              }
            ]}
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
            rules={[
              { 
                required: true, 
                type: 'array',
                min: 1,
                message: '请选择腰段情况'
              }
            ]}
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
          // rules={[
          //   { 
          //     required: false, 
          //     message: '请选择是否进行脊柱运动实验',
          //     validator: (_, value) => 
          //       value ? Promise.resolve() : Promise.reject(new Error('请选择是否进行脊柱运动实验'))
          //   }
          // ]}
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
            rules={[
              ({ getFieldValue }) => ({
                required: getFieldValue('spineMotionExperiment') === '①是',
                message: '请输入胸段ATR值'
              })
            ]} 
          >
            <Input placeholder="请输入胸段ATR值" />
          </Form.Item>
          
          <Form.Item
            name="spineMotionATRLumbarThoracic"
            label="腰胸段ATR"
            dependencies={['spineMotionExperiment']}
            rules={[
              ({ getFieldValue }) => ({
                required: getFieldValue('spineMotionExperiment') === '①是',
                message: '请输入腰胸段ATR值'
              })
            ]} 
          >
            <Input placeholder="请输入腰胸段ATR值" />
          </Form.Item>
          
          <Form.Item
            name="spineMotionATRLumbar"
            label="腰段ATR"
            dependencies={['spineMotionExperiment']}
            rules={[
              ({ getFieldValue }) => ({
                required: getFieldValue('spineMotionExperiment') === '①是',
                message: '请输入腰段ATR值'
              })
            ]} 
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
          rules={[
            { 
              required: true, 
              type: 'array',
              min: 1,
              message: '请至少选择一项检查结果'
            }
          ]}
        >
          <Checkbox.Group onChange={handleGeneralCheckChange}>
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
          dependencies={['spineAnteriorPosteriorCheck']}
          rules={[
            ({ getFieldValue }) => ({
              required: (getFieldValue('spineAnteriorPosteriorCheck') || []).some(
                (val: string) => val === '②前凸体征' || val === '③后凸体征'
              ),
              message: '请选择俯卧试验结果'
            })
          ]}
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
          rules={[
            { 
              required: true, 
              type: 'array',
              min: 1,
              message: '请选择病史情况'
            }
          ]}
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
          rules={[
            { 
              required: true, 
              type: 'array',
              min: 1,
              message: '请选择筛查结果'
            }
          ]}
        >
          <Checkbox.Group style={{ width: '100%' }} onChange={handleScreeningResultChange}>
            <div style={{ marginBottom: 8 }}>
              <Checkbox value="①正常">①正常</Checkbox>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Checkbox value="②姿势不良">②姿势不良</Checkbox>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Checkbox value="③脊柱侧弯（__级）">③脊柱侧弯（__级）</Checkbox>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Checkbox value="④脊柱前凸异常">④脊柱前凸异常</Checkbox>
            </div>
            <div>
              <Checkbox value="⑤脊柱后凸异常">⑤脊柱后凸异常</Checkbox>
            </div>
          </Checkbox.Group>
        </Form.Item>
        
        {scoliosisChecked && (
          <Form.Item
            name="screeningResultGrade"
            label="脊柱侧弯等级"
            rules={[{ required: true, message: '请输入脊柱侧弯等级' }]}
          >
            <InputNumber min={1} max={10} placeholder="请输入1-10级" />
          </Form.Item>
        )}
        
        <Form.Item
          name="suggestion"
          label="建议"
        >
          <TextArea placeholder="请输入建议" rows={3} />
        </Form.Item>
        
        <Form.Item
          name="examinerSignature"
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
            {existingStudent ? '更新学生信息' : '提交表单'}
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default SpineExaminationForm;