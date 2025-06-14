import CreateModal from '@/pages/Admin/student/components/CreateModal';
import UpdateModal from '@/pages/Admin/student/components/UpdateModal';
import { deleteStudentUsingPost, listStudentByPageUsingPost } from '@/services/backend/studentController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * 学生管理页面
 *
 * @constructor
 */
const StudentAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前学生点击的数据
  const [currentRow, setCurrentRow] = useState<API.Student>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.Student) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteStudentUsingPost({
        id: row.id as any,
      });
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

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.Student>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '身份证号',
      dataIndex: 'userid',
      valueType: 'text',
    },
    {
      title: '学籍卡号',
      dataIndex: 'stuid',
      valueType: 'text',
    },
    {
      title: '姓名',
      dataIndex: 'username',
      valueType: 'text',
    },
    {
      title: '手机号',
      dataIndex: 'userphone',
      valueType: 'text',
    },
    {
      title: '年级',
      dataIndex: 'usergrade',
      valueType: 'text',
    },
    {
      title: '班级',
      dataIndex: 'userclass',
      valueType: 'text',
    },
    {
      title: '学校名称',
      dataIndex: 'schoolname',
      valueType: 'text',
    },
    {
      title: '学校所在地',
      dataIndex: 'schoolprovince',
      valueType: 'text',
      render: (_, record) => (
        `${record.schoolProvince || ''}${record.schoolCity || ''}${record.schoolArea || ''}${record.schoolTown || ''}`
      ),
      search: false,
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      valueType: 'date',
    },
    {
      title: '检查日期',
      dataIndex: 'checkday',
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
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
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
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建学生
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
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default StudentAdminPage;