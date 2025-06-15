import CreateModal from '@/pages/Admin/student/components/CreateModal';
import UpdateModal from '@/pages/Admin/student/components/UpdateModal';
import { deleteStudentUsingPost, importExcelUsingPost, listStudentByPageUsingPost } from '@/services/backend/studentController';
import { PlusOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Modal, Space, Typography, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useRef, useState } from 'react';

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

  // 身份证号正则验证
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  
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
      valueType: 'text',
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '请输入学校名称' }],
      },
    },
    {
      title: '学校所在地',
      dataIndex: 'schoolprovince',
      hideInSearch: true,
      valueType: 'text',
      render: (_, record) => (
        `${record.schoolprovince || ''}${record.schoolcity || ''}${record.schoolarea || ''}${record.schooltown || ''}`
      ),
      search: false,
      formItemProps: {
        rules: [{ required: true, message: '请输入学校所在地' }],
      },
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