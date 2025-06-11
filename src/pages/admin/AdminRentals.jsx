import { useEffect, useState } from "react";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import { Table, Select, Button } from "antd";
import { enqueueSnackbar } from "notistack";

const AdminRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    controller.getAll(endpoints.rentals).then((resp) => {
      setRentals([...resp]);
    });
    controller.getAll(endpoints.users).then((resp) => {
      setUsers([...resp]);
    });
  }, []);

  const columns = [
    {
      title: "Rented by",
      dataIndex: "userId",
      render: (value, record) => {
        const user = users.find((u) => u.id === value);
        return <span key={record.id}>{user?.email || "Unknown user"}</span>;
      },
    },
    {
      title: "Rented Car",
      dataIndex: "carName",
      filters: Array.from(new Set(rentals.map((rental) => rental.carName))).map(
        (carName) => ({
          text: carName,
          value: carName,
        })
      ),
      filterSearch: true,
      onFilter: (value, record) => record.carName.includes(value),
      sorter: (a, b) => a.carName.localeCompare(b.carName),
    },
    {
      title: "Rental Date",
      dataIndex: "rentalDate",
      render: (value) => {
        return <span>{new Date(value).toDateString()}</span>;
      },
      sorter: (a, b) => new Date(a.rentalDate) - new Date(b.rentalDate),
    },
    {
      title: "Return Date",
      dataIndex: "returnDate",
      render: (value) => {
        return <span>{new Date(value).toDateString()}</span>;
      },
      sorter: (a, b) => new Date(a.returnDate) - new Date(b.returnDate),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "days",
      dataIndex: "days",
      sorter: (a, b) => a.days - b.days,
    },
    {
      title: "Rental Status",
      dataIndex: "id",
      render: (value, record) => {
        return (
          <Select
            onChange={async (updatedStatus) => {
              await controller.update(endpoints.rentals, value, {
                status: updatedStatus,
              });
              enqueueSnackbar("rental status updated successfully!", {
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
                autoHideDuration: 2000,
                variant: "success",
              });
            }}
            defaultValue={record.status}
            style={{ width: 120 }}
            options={[
              { value: "booked", label: "booked" },
              { value: "approved", label: "approved" },
              { value: "canceled", label: "canceled" },
            ]}
          />
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "id",
      render: (value) => {
        return (
          <Button
            onClick={async () => {
              await controller.delete(endpoints.rentals, value);
              enqueueSnackbar("rental deleted successfully!", {
                autoHideDuration: 2000,
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
                variant: "success",
              });
              setRentals([...rentals.filter((r) => r.id != value)]);
            }}
            variant="dashed"
            danger
          >
            delete
          </Button>
        );
      },
    },
  ];
  return (
    <>
      <div className="flex items-center justify-center gap-x-8 pt-8 mb-3.5">
        <h1 className="text-center text-2xl text-blue-800">Rentals</h1>
      </div>
      {/* table antd */}
      <Table
        rowKey={"id"}
        style={{ padding: "6px 20px" }}
        dataSource={rentals}
        columns={columns}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["3", "5", "10"],
        }}
      />
    </>
  );
};

export default AdminRentals;
