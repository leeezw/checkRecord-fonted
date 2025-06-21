import CreateModal from '@/pages/Admin/student/components/CreateModal';
import UpdateModal from '@/pages/Admin/student/components/UpdateModal';
import { deleteStudentUsingPost, importExcelUsingPost, listSchool, listSchoolAddress, listStudentByPageUsingPost } from '@/services/backend/studentController';
import { PlusOutlined, UploadOutlined, InboxOutlined, ExportOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Modal, Select, Space, Typography, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { request } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';

const { Dragger } = Upload;

/**
 * 学生管理页面
 */
const StudentAdminPage: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Student>();
  const [exporting, setExporting] = useState<boolean>(false); // 新增导出加载状态
  const [selectedExportSchool, setSelectedExportSchool] = useState<string | undefined>(undefined); // 新增选中的学校
  const [schoolOptions, setSchoolOptions] = useState<{label: string; value: string}[]>([]);
  const [addressOptions, setAddressOptions] = useState<{label: string; value: string}[]>([]);
  const [exportModalVisible, setExportModalVisible] = useState<boolean>(false); // 新增导出模态框状态
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
  // 身份证号正则验证
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;

    // 新增：处理导出功能
    const handleExport = async () => {
        setExporting(true);
        try {
          // 构建请求 URL
          const params = new URLSearchParams({
            name: selectedExportSchool || '',
          });
      
          const response = await fetch(`http://localhost:8101/api/student/export?${params.toString()}`, {
            method: 'GET',
            headers: {
              // 如果你后端有权限控制，可以加上 Token
              // 'Authorization': `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error(`请求失败，状态码：${response.status}`);
          }
      
          // 获取 Blob 数据
          const blob = await response.blob();
      
          // 创建下载链接
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
      
          // 设置下载文件名
          const fileName = selectedExportSchool
            ? `学生数据_${selectedExportSchool}.xlsx`
            : '全部学生数据.xlsx';
          link.setAttribute('download', fileName);
      
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      
          message.success('导出成功');
          setExportModalVisible(false);
        } catch (error: any) {
          message.error(`导出失败：${error.message}`);
        } finally {
          setExporting(false);
        }
      };
      
      
      
      
      
  
  // 手机号正则验证
  const phoneRegex = /^1[3-9]\d{9}$/;

  const handleDelete = async (row: API.Student) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteStudentUsingPost({ id: row.id as any });
      hide();
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  const handleImport = (visible: boolean) => {
    setImportModalVisible(visible);
    if (!visible) {
      setFileList([]);
    }
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择文件');
      return;
    }

    setUploading(true);
    try {
      await importExcelUsingPost(fileList[0] as unknown as File);
      message.success('导入成功');
      setImportModalVisible(false);
      setFileList([]);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(`导入失败: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const columns: ProColumns<API.Student>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '身份证号',
      dataIndex: 'userid',
      valueType: 'text',
      formItemProps: {
        rules: [
          { required: true, message: '请输入身份证号' },
          { pattern: idCardRegex, message: '请输入有效的身份证号' }
        ],
      },
    },
    {
      title: '学籍卡号',
      dataIndex: 'stuid',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入学籍卡号' }],
      },
    },
    {
      title: '姓名',
      dataIndex: 'username',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入姓名' }],
      },
    },
    {
        title: '性别',
        dataIndex: 'schoolarea',
        valueType: 'radio',
        fieldProps: {
          options: [
            { label: '男', value: '男' },
            { label: '女', value: '女' }
          ] 
        },
        formItemProps: {
          rules: [{ required: true, message: '请选择性别' }],
        },
        hideInSearch: true,
      },
    {
      title: '手机号',
      dataIndex: 'userphone',
      valueType: 'text',
      formItemProps: {
        rules: [
          { required: true, message: '请输入手机号' },
          { pattern: phoneRegex, message: '请输入有效的手机号' }
        ],
      },
    },
    {
      title: '年级',
      dataIndex: 'usergrade',
      hideInSearch: true,
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入年级' }],
      },
    },
    {
      title: '班级',
      dataIndex: 'userclass',
      hideInSearch: true,
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入班级' }],
      },
    },
    {
        title: '学校名称',
        dataIndex: 'schoolname',
        valueType: 'select',
        fieldProps: {
          options: schoolOptions,
          showSearch: true,
          filterOption: (input, option) => 
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        },
        hideInSearch: true,
        formItemProps: {
          rules: [{ required: true, message: '请选择学校名称' }],
        },
      },
      {
        title: '学校所在地',
        dataIndex: 'schoolprovince',
        valueType: 'select',
        fieldProps: {
          options: addressOptions,
          showSearch: true,
          filterOption: (input, option) => 
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        },
        hideInSearch: true,
        formItemProps: {
          rules: [{ required: true, message: '请选择学校所在地' }],
        },
        render: (_, record) => record.schoolprovince, // 简化显示
      },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      valueType: 'date',
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '请选择出生日期' }],
      },
    },
    {
      title: '检查日期',
      dataIndex: 'checkday',
      hideInSearch: true,
      valueType: 'date',
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createtime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updatetime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link onClick={() => {
            setCurrentRow(record);
            setUpdateModalVisible(true);
          }}>
            修改
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Student>
        headerTitle={'学生管理'}
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 120 }}
        toolBarRender={() => [
          <Button 
            type="primary" 
            key="primary" 
            onClick={() => setCreateModalVisible(true)}
          >
            <PlusOutlined /> 新建学生
          </Button>,
          <Button 
            type="primary" 
            key="import" 
            onClick={() => handleImport(true)}
          >
            <UploadOutlined /> 批量导入
          </Button>,
                    // 新增导出按钮
                    <Button 
                    type="primary" 
                    key="export" 
                    onClick={() => setExportModalVisible(true)}
                  >
                    <ExportOutlined /> 批量导出
                  </Button>,
        ]}
        
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listStudentByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.StudentQueryRequest);
          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
      />

            {/* 导出模态框 */}
            <Modal
        title="批量导出学生"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        onOk={handleExport}
        confirmLoading={exporting}
        okText="开始导出"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <label>选择学校：</label>
          <Select
            style={{ width: '100%', marginTop: 8 }}
            placeholder="请选择学校（不选则导出全部学生）"
            value={selectedExportSchool}
            onChange={setSelectedExportSchool}
            options={[
              { label: '全部学校', value: '' }, // 使用空字符串表示全部
              ...schoolOptions
            ]}
            allowClear
          />
        </div>
        <p>将导出Excel格式的学生数据文件</p>
      </Modal>
      
      {/* 新建模态框 */}
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => setCreateModalVisible(false)}
      />
      
      {/* 编辑模态框 */}
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => setUpdateModalVisible(false)}
      />
      
      {/* 导入模态框 - 这是新增的关键部分 */}
      <Modal
        title="批量导入学生"
        open={importModalVisible}
        onCancel={() => handleImport(false)}
        onOk={handleUpload}
        confirmLoading={uploading}
        okText="开始导入"
        cancelText="取消"
      >
        <Dragger
          name="file"
          multiple={false}
          fileList={fileList}
          beforeUpload={(file) => {
            setFileList([file]);
            return false;
          }}
          onRemove={() => {
            setFileList([]);
          }}
          accept=".xlsx,.xls"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
          <p className="ant-upload-hint">
            支持Excel文件(.xlsx, .xls)，请确保文件格式正确
          </p>
        </Dragger>
      </Modal>
    </PageContainer>
  );
};

export default StudentAdminPage;