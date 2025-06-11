import { Button, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import { enqueueSnackbar } from "notistack";
import { useFormik } from "formik";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    controller.getAll(endpoints.users).then((data) => {
      setUsers([...data.filter((u) => u.role === "client")]);
    });
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Profile Image",
      dataIndex: "profileImage",
      render: (value, record) => {
        return (
          <img
            width={70}
            src={value}
            alt={record.fullName}
            title={record.fullName}
          />
        );
      },
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      filters: users.map((user) => ({
        text: user.fullName,
        value: user.fullName,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.fullName.includes(value),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      filters: users.map((user) => ({
        text: user.email,
        value: user.email,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.email.includes(value),
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
    },
    {
      title: "User Balance",
      dataIndex: "balance",
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: "Joined at",
      dataIndex: "registeredAt",
      sorter: (a, b) => new Date(a.registeredAt) - new Date(b.registeredAt),
      render: (value) => {
        return <span>{new Date(value).toDateString()}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_, record) => {
        return (
          <Button
            onClick={() => {
              if (record.isBanned) {
                //un-ban
                controller.update(endpoints.users, record.id, {
                  isBanned: false,
                  banUntil: null,
                });
                enqueueSnackbar(`user unbanned`, {
                  autoHideDuration: 2000,
                  variant: "success",
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                  },
                });
                setUsers([
                  ...users.map((u) => {
                    if (u.id == record.id) {
                      return {
                        ...u,
                        isBanned: false,
                        banUntil: null,
                      };
                    } else {
                      return u;
                    }
                  }),
                ]);
              } else {
                showModal(true);
                setUserId(record.id);
              }
            }}
            variant="outlined"
            color="gold"
          >
            {record.isBanned ? "unban" : "ban"}
          </Button>
        );
      },
    },
  ];

  const formik = useFormik({
    initialValues: {
      banMinutes: "",
    },
    onSubmit: async (values, actions) => {
      console.log("values: ", values);
      actions.resetForm();
      await controller.update(endpoints.users, userId, {
        isBanned: true,
        banUntil: new Date(
          Date.now() + +values.banMinutes * 60 * 1000 + 14_400_000
        ),
      });

      setUsers([
        ...users.map((u) => {
          if (u.id == userId) {
            return {
              ...u,
              isBanned: true,
              banUntil: new Date(
                Date.now() + +values.banMinutes * 60 * 1000 + 14_400_000
              ),
            };
          } else {
            return u;
          }
        }),
      ]);

      enqueueSnackbar(`user banned for ${formik.values.banMinutes} minutes`, {
        autoHideDuration: 2000,
        variant: "warning",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      setUserId(null);
      handleOk();
    },
  });
  return (
    <>
      <div className="flex items-center justify-center gap-x-8 pt-8 mb-3.5">
        <h1 className="text-center text-2xl text-blue-800">Users</h1>
      </div>
      <Table
        style={{ padding: "6px 20px" }}
        dataSource={users}
        columns={columns}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["3", "5", "10"],
        }}
      />

      <Modal
        title="Set User Ban minutes"
        closable={{ "aria-label": "Custom Close Button" }}
        onCancel={handleCancel}
        onOk={formik.handleSubmit}
        open={isModalOpen}
      >
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <Input
            value={formik.values.banMinutes}
            name="banMinutes"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="enter minutes"
            min={1}
            max={120}
            required
          />
        </form>
      </Modal>
    </>
  );
};

export default AdminUser;
