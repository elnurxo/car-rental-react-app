import { Table } from "antd";
import { useEffect, useState } from "react";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import { Button, Popconfirm, Modal, Input, Select, Checkbox } from "antd";
import { Link } from "react-router-dom";
import {
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineDirectionsCar,
} from "react-icons/md";
import { enqueueSnackbar } from "notistack";
import { useFormik } from "formik";
import carValidationSchema from "../../validations/addCarValidation";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatingCarId, setUpdatingCarId] = useState(null);

  useEffect(() => {
    controller.getAll(endpoints.cars).then((resp) => {
      setCars([...resp]);
    });
  }, []);

  const carToUpdate = cars.find((car) => car.id === updatingCarId);

  const confirm = async (id) => {
    await controller.delete(endpoints.cars, id);
    setCars([...cars.filter((c) => c.id !== id)]);
    enqueueSnackbar("Car deleted successfully!", {
      autoHideDuration: 2000,
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  };

  const columns = [
    {
      title: "Car Image",
      dataIndex: "imageUrl",
      render: (imageUrl, record) => {
        return (
          <img width={90} src={imageUrl} key={record.id} alt={record.model} />
        );
      },
    },
    {
      title: "Car Brand",
      dataIndex: "brand",
      filters: Array.from(new Set(cars.map((car) => car.brand))).map(
        (brand) => ({
          text: brand,
          value: brand,
        })
      ),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.brand.includes(value),
      render: (value, record) => {
        return (
          <span
            className={record.availability ? "text-green-600" : "text-red-600"}
          >
            {value}
          </span>
        );
      },
    },
    {
      title: "Car Model",
      dataIndex: "model",
      filters: Array.from(new Set(cars.map((car) => car.model))).map(
        (model) => ({
          text: model,
          value: model,
        })
      ),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.model.includes(value),
    },
    {
      title: "Year",
      dataIndex: "year",
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: "Type",
      dataIndex: "type",
      filters: cars.map((car) => ({
        text: car.type,
        value: car.type,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.type.includes(value),
    },
    {
      title: "Price per day",
      dataIndex: "pricePerDay",
      sorter: (a, b) => a.pricePerDay - b.pricePerDay,
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (value) => {
        return (
          <div className="flex gap-x-1.5">
            <Link to={`/cars/${value}`}>
              <Button variant="outlined" color="green">
                <MdOutlineDirectionsCar />
              </Button>
            </Link>
            <Button
              onClick={() => {
                setUpdatingCarId(value);
                setIsUpdateModalOpen(true);
              }}
              variant="outlined"
              color="blue"
            >
              <MdOutlineEdit />
            </Button>
            {/* delete button */}
            <Popconfirm
              title="Delete the car"
              description="Are you sure to delete this car?"
              onConfirm={() => confirm(value)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>
                <MdOutlineDelete />
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  // Add New Car Modal Handlers
  const showAddModal = () => {
    setIsModalOpen(true);
    addFormik.resetForm();
  };
  const handleAddCancel = () => {
    setIsModalOpen(false);
  };

  const addFormik = useFormik({
    initialValues: {
      brand: "",
      model: "",
      year: "",
      type: "",
      pricePerDay: "",
      availability: false,
      imageUrl: "",
    },
    validationSchema: carValidationSchema,
    onSubmit: async (values, actions) => {
      const { data: postedCar } = await controller.post(endpoints.cars, values);
      setCars((prevCars) => [...prevCars, postedCar]);
      actions.resetForm();
      enqueueSnackbar("Car posted successfully!", {
        autoHideDuration: 2000,
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      setIsModalOpen(false);
    },
  });

  // Update Car Modal Handlers
  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
    setUpdatingCarId(null);
    updateFormik.resetForm();
  };

  const updateFormik = useFormik({
    initialValues: {
      brand: carToUpdate?.brand || "",
      model: carToUpdate?.model || "",
      year: carToUpdate?.year || "",
      type: carToUpdate?.type || "",
      pricePerDay: carToUpdate?.pricePerDay || "",
      availability: carToUpdate?.availability || false,
      imageUrl: carToUpdate?.imageUrl || "",
    },
    validationSchema: carValidationSchema,
    onSubmit: async (values, actions) => {
      if (!updatingCarId) return;

      const { data: updatedCar } = await controller.update(
        endpoints.cars,
        updatingCarId,
        values
      );
      setCars((prevCars) => {
        const idx = prevCars.findIndex((c) => c.id === updatedCar.id);
        if (idx !== -1) {
          const updatedCars = [...prevCars];
          updatedCars[idx] = updatedCar;
          return updatedCars;
        }
        return prevCars;
      });
      actions.resetForm();
      enqueueSnackbar("Car updated successfully!", {
        autoHideDuration: 2000,
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      setIsUpdateModalOpen(false);
      setUpdatingCarId(null);
    },
    enableReinitialize: true,
  });

  const carTypeOptions = [
    { value: "", label: "Select car type" },
    { value: "coupe", label: "Coupe" },
    { value: "crossover", label: "Crossover" },
    { value: "electric", label: "Electric" },
    { value: "hatchback", label: "Hatchback" },
    { value: "hybrid", label: "Hybrid" },
    { value: "minivan", label: "Minivan" },
    { value: "pickup-truck", label: "Pickup Truck" },
    { value: "sedan", label: "Sedan" },
    { value: "sports-car", label: "Sports Car" },
    { value: "station-wagon", label: "Station Wagon" },
    { value: "suv", label: "SUV" },
  ];

  return (
    <>
      <div className="flex items-center justify-center gap-x-8 pt-8 mb-3.5">
        <h1 className="text-center text-2xl text-blue-800">Cars</h1>
        <Button onClick={showAddModal} variant="dashed" color="orange">
          Add Car
        </Button>
      </div>
      <Table
        style={{ padding: "6px 20px" }}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["3", "5", "10"],
        }}
        rowKey={"id"}
        columns={columns}
        dataSource={cars}
        onChange={onChange}
      />

      {/* Add New Car Modal */}
      <Modal
        title="Add New Car Modal 🚗"
        closable
        open={isModalOpen}
        onOk={addFormik.handleSubmit}
        onCancel={handleAddCancel}
        okButtonProps={{
          disabled: !addFormik.isValid || addFormik.isSubmitting,
        }}
      >
        <form
          onSubmit={addFormik.handleSubmit}
          className="flex flex-col gap-2 mt-3.5"
        >
          <Input
            value={addFormik.values.brand}
            status={
              addFormik.errors.brand && addFormik.touched.brand ? "error" : ""
            }
            name="brand"
            onChange={addFormik.handleChange}
            onBlur={addFormik.handleBlur}
            type="text"
            required
            placeholder="Car brand"
          />
          {addFormik.errors.brand && addFormik.touched.brand && (
            <div className="text-red-500 text-xs">{addFormik.errors.brand}</div>
          )}

          <Input
            value={addFormik.values.model}
            status={
              addFormik.errors.model && addFormik.touched.model ? "error" : ""
            }
            name="model"
            onChange={addFormik.handleChange}
            onBlur={addFormik.handleBlur}
            type="text"
            required
            placeholder="Car model"
          />
          {addFormik.errors.model && addFormik.touched.model && (
            <div className="text-red-500 text-xs">{addFormik.errors.model}</div>
          )}

          <Input
            value={addFormik.values.year}
            status={
              addFormik.errors.year && addFormik.touched.year ? "error" : ""
            }
            name="year"
            onChange={addFormik.handleChange}
            onBlur={addFormik.handleBlur}
            type="number"
            min={1800}
            max={new Date().getFullYear()}
            required
            placeholder="Car year"
          />
          {addFormik.errors.year && addFormik.touched.year && (
            <div className="text-red-500 text-xs">{addFormik.errors.year}</div>
          )}

          <Input
            type="number"
            status={
              addFormik.errors.pricePerDay && addFormik.touched.pricePerDay
                ? "error"
                : ""
            }
            value={addFormik.values.pricePerDay}
            name="pricePerDay"
            onChange={addFormik.handleChange}
            onBlur={addFormik.handleBlur}
            min={10}
            required
            placeholder="Car price per day"
          />
          {addFormik.errors.pricePerDay && addFormik.touched.pricePerDay && (
            <div className="text-red-500 text-xs">
              {addFormik.errors.pricePerDay}
            </div>
          )}

          <Input
            type="url"
            status={
              addFormik.errors.imageUrl && addFormik.touched.imageUrl
                ? "error"
                : ""
            }
            value={addFormik.values.imageUrl}
            name="imageUrl"
            onChange={addFormik.handleChange}
            onBlur={addFormik.handleBlur}
            addonBefore="https://"
            required
            placeholder="Car image URL"
          />
          {addFormik.errors.imageUrl && addFormik.touched.imageUrl && (
            <div className="text-red-500 text-xs">
              {addFormik.errors.imageUrl}
            </div>
          )}

          <Select
            value={addFormik.values.type}
            status={
              addFormik.errors.type && addFormik.touched.type ? "error" : ""
            }
            name="type"
            onChange={(value) => {
              addFormik.setFieldValue("type", value);
            }}
            onBlur={() => addFormik.setFieldTouched("type", true)} // Manually set touched for Select
            showSearch
            placeholder="Select car type"
            optionFilterProp="label"
            options={carTypeOptions}
          />
          {addFormik.errors.type && addFormik.touched.type && (
            <div className="text-red-500 text-xs">{addFormik.errors.type}</div>
          )}

          <Checkbox
            checked={addFormik.values.availability} // Use 'checked' for Checkbox, not 'value'
            name="availability"
            onChange={addFormik.handleChange}
            onBlur={addFormik.handleBlur}
          >
            Is this car available?
          </Checkbox>
        </form>
      </Modal>

      {/* Edit Car Modal */}
      <Modal
        title="Update Car Modal 🚗"
        closable
        open={isUpdateModalOpen}
        onOk={updateFormik.handleSubmit}
        onCancel={handleUpdateCancel}
        // Disable OK button if form is invalid or submitting
        okButtonProps={{
          disabled: !updateFormik.isValid || updateFormik.isSubmitting,
        }}
      >
        <form
          onSubmit={updateFormik.handleSubmit}
          className="flex flex-col gap-2 mt-3.5"
        >
          <Input
            value={updateFormik.values.brand}
            status={
              updateFormik.errors.brand && updateFormik.touched.brand
                ? "error"
                : ""
            }
            name="brand"
            onChange={updateFormik.handleChange}
            onBlur={updateFormik.handleBlur}
            type="text"
            required
            placeholder="Car brand"
          />
          {updateFormik.errors.brand && updateFormik.touched.brand && (
            <div className="text-red-500 text-xs">
              {updateFormik.errors.brand}
            </div>
          )}

          <Input
            value={updateFormik.values.model}
            status={
              updateFormik.errors.model && updateFormik.touched.model
                ? "error"
                : ""
            }
            name="model"
            onChange={updateFormik.handleChange}
            onBlur={updateFormik.handleBlur}
            type="text"
            required
            placeholder="Car model"
          />
          {updateFormik.errors.model && updateFormik.touched.model && (
            <div className="text-red-500 text-xs">
              {updateFormik.errors.model}
            </div>
          )}

          <Input
            value={updateFormik.values.year}
            status={
              updateFormik.errors.year && updateFormik.touched.year
                ? "error"
                : ""
            }
            name="year"
            onChange={updateFormik.handleChange}
            onBlur={updateFormik.handleBlur}
            type="number"
            min={1800}
            max={new Date().getFullYear()}
            required
            placeholder="Car year"
          />
          {updateFormik.errors.year && updateFormik.touched.year && (
            <div className="text-red-500 text-xs">
              {updateFormik.errors.year}
            </div>
          )}

          <Input
            type="number"
            status={
              updateFormik.errors.pricePerDay &&
              updateFormik.touched.pricePerDay
                ? "error"
                : ""
            }
            value={updateFormik.values.pricePerDay}
            name="pricePerDay"
            onChange={updateFormik.handleChange}
            onBlur={updateFormik.handleBlur}
            min={10}
            required
            placeholder="Car price per day"
          />
          {updateFormik.errors.pricePerDay &&
            updateFormik.touched.pricePerDay && (
              <div className="text-red-500 text-xs">
                {updateFormik.errors.pricePerDay}
              </div>
            )}

          <Input
            type="url"
            status={
              updateFormik.errors.imageUrl && updateFormik.touched.imageUrl
                ? "error"
                : ""
            }
            value={updateFormik.values.imageUrl}
            name="imageUrl"
            onChange={updateFormik.handleChange}
            onBlur={updateFormik.handleBlur}
            addonBefore="https://"
            required
            placeholder="Car image URL"
          />
          {updateFormik.errors.imageUrl && updateFormik.touched.imageUrl && (
            <div className="text-red-500 text-xs">
              {updateFormik.errors.imageUrl}
            </div>
          )}

          <Select
            value={updateFormik.values.type}
            status={
              updateFormik.errors.type && updateFormik.touched.type
                ? "error"
                : ""
            }
            name="type"
            onChange={(value) => {
              updateFormik.setFieldValue("type", value);
            }}
            onBlur={() => updateFormik.setFieldTouched("type", true)}
            showSearch
            placeholder="Select car type"
            optionFilterProp="label"
            options={carTypeOptions}
          />
          {updateFormik.errors.type && updateFormik.touched.type && (
            <div className="text-red-500 text-xs">
              {updateFormik.errors.type}
            </div>
          )}

          <Checkbox
            checked={updateFormik.values.availability}
            name="availability"
            onChange={updateFormik.handleChange}
            onBlur={updateFormik.handleBlur}
          >
            Is this car available?
          </Checkbox>
        </form>
      </Modal>
    </>
  );
};

export default AdminCars;
