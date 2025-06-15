import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Upload,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Divider,
  InputNumber,
  message,
  UploadFile,
  Switch,
} from "antd";
import {
  InboxOutlined,
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  LinkOutlined,
  CodeOutlined,
  UndoOutlined,
  RedoOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "./AddPet.scss";
import { _request } from "../../../network/Api";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

interface Category {
  id: number;
  name: string;
}

interface AddPetFormData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  ageMonths: number;
  breed: string;
  color: string;
  gender: "male" | "female";
  healthStatus: string;
  vaccinationStatus: string;
  certificateInfo: string;
  weight: number;
  imageUrl: string;
  isActive: boolean;
  categoryId: number;
}

const AddPet: React.FC = () => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    _request({
      path: "/categories",
      method: "GET",
      onSuccess(response) {
        if (response.success && response.data) {
          setCategories(response.data);
        }
      },
      onError(error) {
        console.log("Failed to fetch categories:", error);
        message.error("Failed to load categories");
      },
    });
  };

  // Method 1: Convert image to base64 string
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".png,.jpg,.jpeg",
    fileList,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }: any) => {
      try {
        // Method 1: Convert to base64 (recommended for small images)
        // const base64String = await convertToBase64(file);
        // setImageUrl(base64String);
        // onSuccess({ url: base64String });
        // message.success(`${file.name} processed successfully`);

        // Method 2: Use object URL (alternative approach)
        const objectUrl = URL.createObjectURL(file);
        setImageUrl(objectUrl);
        onSuccess({ url: objectUrl });
        message.success(`${file.name} processed successfully`);

        // Method 3: Store file reference for later upload
        // You can store the file and upload it when submitting the form
        // setImageFile(file);
        // const previewUrl = URL.createObjectURL(file);
        // setImageUrl(previewUrl);
        // onSuccess({ url: previewUrl });
        // message.success(`${file.name} ready for upload`);

      } catch (error) {
        onError(error);
        message.error(`${file.name} processing failed`);
      }
    },
    onChange({ fileList: newFileList }: { fileList: UploadFile[] }) {
      setFileList(newFileList);
    },
    onRemove: () => {
      setImageUrl("");
      setFileList([]);
    },
    onDrop(e: React.DragEvent) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
    form.setFieldsValue({ description: e.target.value });
  };

  const formatText = (type: string) => {
    console.log(`Format ${type} applied`);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const petData: AddPetFormData = {
        name: values.name,
        description: values.description || description,
        price: values.price,
        stockQuantity: values.stockQuantity,
        ageMonths: values.ageMonths,
        breed: values.breed,
        color: values.color,
        gender: values.gender,
        healthStatus: values.healthStatus,
        vaccinationStatus: values.vaccinationStatus,
        certificateInfo: values.certificateInfo || "",
        weight: values.weight,
        imageUrl: imageUrl, // This will be base64 string or object URL
        isPet: true,
        isActive: values.isActive !== undefined ? values.isActive : true,
        categoryId: parseInt(values.categoryId),
      };

      _request({
        path: "/admin/products",
        method: "POST",
        body: petData,
        onSuccess(response) {
          if (response.success) {
            message.success("Pet added successfully!");
            form.resetFields();
            setDescription("");
            setFileList([]);
            setImageUrl("");
          }
          setLoading(false);
        },
        onError(error) {
          console.log("Error adding pet:", error);
          message.error("Failed to add pet. Please try again.");
          setLoading(false);
        },
      });
    } catch (error) {
      console.log("Validation failed:", error);
      message.error("Please fill in all required fields");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setDescription("");
    setFileList([]);
    setImageUrl("");
  };

  return (
    <div className="product-form-container">
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col span={16}>
            <Card className="main-card">
              <Title level={4} className="section-title">
                Thông tin cơ bản
              </Title>

              <Form.Item
                label={<span>Tên thú cưng</span>}
                name="name"
                rules={[
                  { required: true, message: "Tên thú cưng là bắt buộc" },
                ]}
              >
                <Input
                  placeholder="Nhập tên thú cưng"
                  className="product-name-input"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span>Tuổi (tháng)</span>}
                    name="ageMonths"
                    rules={[{ required: true, message: "Tuổi là bắt buộc" }]}
                  >
                    <InputNumber
                      placeholder="Nhập tuổi (tháng)"
                      className="product-name-input"
                      min={0}
                      max={300}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span>Cân nặng (kg)</span>}
                    name="weight"
                    rules={[
                      { required: true, message: "Cân nặng là bắt buộc" },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập cân nặng"
                      className="product-name-input"
                      min={0}
                      step={0.1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span>Màu sắc</span>}
                    name="color"
                    rules={[{ required: true, message: "Màu sắc là bắt buộc" }]}
                  >
                    <Input
                      placeholder="Nhập màu sắc"
                      className="product-name-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span>Giới tính</span>}
                    name="gender"
                    rules={[
                      { required: true, message: "Giới tính là bắt buộc" },
                    ]}
                  >
                    <Select placeholder="Chọn giới tính">
                      <Option value="male">Đực</Option>
                      <Option value="female">Cái</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={<span>Giống</span>}
                name="breed"
                rules={[{ required: true, message: "Giống là bắt buộc" }]}
              >
                <Input
                  placeholder="Nhập giống thú cưng"
                  className="product-name-input"
                />
              </Form.Item>

              <Divider />

              <Title level={4} className="section-title">
                Hình ảnh và mô tả
              </Title>

              <Dragger {...uploadProps} className="media-upload">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined
                    style={{ fontSize: "48px", color: "#1890ff" }}
                  />
                </p>
                <p className="ant-upload-text">
                  Kéo thả hình ảnh vào đây hoặc click để chọn file
                </p>
                <p className="ant-upload-hint">
                  Chỉ chấp nhận file ảnh (PNG, JPG, JPEG) dưới 5MB
                </p>
              </Dragger>

              {/* Option to input image URL manually */}
              <Form.Item
                label={<span>Hoặc nhập URL hình ảnh</span>}
                name="imageUrlInput"
                style={{ marginTop: 16 }}
              >
                <Input
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => {
                    if (e.target.value) {
                      setImageUrl(e.target.value);
                      setFileList([]); // Clear file list if URL is provided
                    }
                  }}
                />
              </Form.Item>

              {/* Preview image */}
              {imageUrl && (
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>Xem trước hình ảnh:</Title>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      border: "1px solid #d9d9d9",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              )}

              <Form.Item
                label="Mô tả chi tiết"
                name="description"
                className="description-section"
              >
                <div className="editor-container">
                  <div className="editor-toolbar">
                    <Select
                      defaultValue="paragraph"
                      className="format-select"
                      size="small"
                    >
                      <Option value="paragraph">Paragraph</Option>
                      <Option value="heading1">Heading 1</Option>
                      <Option value="heading2">Heading 2</Option>
                    </Select>

                    <div className="toolbar-buttons">
                      <Button
                        type="text"
                        size="small"
                        icon={<BoldOutlined />}
                        onClick={() => formatText("bold")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<ItalicOutlined />}
                        onClick={() => formatText("italic")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<StrikethroughOutlined />}
                        onClick={() => formatText("strikethrough")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<UnorderedListOutlined />}
                        onClick={() => formatText("unordered-list")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<OrderedListOutlined />}
                        onClick={() => formatText("ordered-list")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<LinkOutlined />}
                        onClick={() => formatText("link")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<CodeOutlined />}
                        onClick={() => formatText("code")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<UndoOutlined />}
                        onClick={() => formatText("undo")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<RedoOutlined />}
                        onClick={() => formatText("redo")}
                      />
                    </div>
                  </div>

                  <TextArea
                    placeholder="Nhập mô tả chi tiết về thú cưng..."
                    value={description}
                    onChange={handleDescriptionChange}
                    className="description-textarea"
                    rows={6}
                  />
                </div>
              </Form.Item>

              <div className="helper-text">
                Thêm mô tả để thú cưng dễ được tìm thấy hơn.
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <div className="sidebar">
              <Card className="thumbnail-card">
                <Title level={5} className="card-title">
                  Thông tin sức khỏe
                </Title>

                <Form.Item
                  label={<span>Tình trạng sức khỏe</span>}
                  name="healthStatus"
                  rules={[
                    {
                      required: true,
                      message: "Tình trạng sức khỏe là bắt buộc",
                    },
                  ]}
                >
                  <Select placeholder="Chọn tình trạng sức khỏe">
                    <Option value="Excellent">Tuyệt vời</Option>
                    <Option value="Good">Tốt</Option>
                    <Option value="Fair">Bình thường</Option>
                    <Option value="Poor">Kém</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span>Trạng thái tiêm phòng</span>}
                  name="vaccinationStatus"
                  rules={[
                    {
                      required: true,
                      message: "Trạng thái tiêm phòng là bắt buộc",
                    },
                  ]}
                >
                  <Select placeholder="Chọn trạng thái tiêm phòng">
                    <Option value="Fully Vaccinated">Đã tiêm đủ</Option>
                    <Option value="Partially Vaccinated">Tiêm một phần</Option>
                    <Option value="Not Vaccinated">Chưa tiêm</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span>Thông tin chứng nhận</span>}
                  name="certificateInfo"
                >
                  <Input
                    placeholder="VD: VKA, VCK..."
                    className="product-name-input"
                  />
                </Form.Item>
              </Card>

              <Card className="files-card">
                <Title level={5}>Thông tin bán hàng</Title>

                <Form.Item
                  label={<span>Giá bán (VND)</span>}
                  name="price"
                  rules={[{ required: true, message: "Giá bán là bắt buộc" }]}
                >
                  <InputNumber
                    placeholder="Nhập giá bán"
                    className="product-name-input"
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    // parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span>Số lượng</span>}
                  name="stockQuantity"
                  rules={[{ required: true, message: "Số lượng là bắt buộc" }]}
                >
                  <InputNumber
                    placeholder="Nhập số lượng"
                    className="product-name-input"
                    min={0}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Card>

              <Card className="status-card">
                <div className="status-header">
                  <Title level={5} className="card-title">
                    Trạng thái hoạt động
                  </Title>
                </div>
                <Form.Item name="isActive" valuePropName="checked" initialValue={true}>
                  <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
                </Form.Item>
                <div className="helper-text small">
                  Thiết lập trạng thái hoạt động của thú cưng.
                </div>
              </Card>

              <Card className="details-card">
                <Title level={5} className="card-title">
                  Giống loài
                </Title>

                <div className="detail-section">
                  <label className="detail-label">Danh mục</label>
                  <Form.Item
                    name="categoryId"
                    rules={[
                      { required: true, message: "Danh mục là bắt buộc" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn danh mục"
                      className="categories-select"
                      style={{ width: "100%" }}
                      loading={categories.length === 0}
                    >
                      {categories.map((category) => (
                        <Option key={category.id} value={category.id.toString()}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <div className="helper-text small">
                    Chọn danh mục cho thú cưng.
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>

        <Row gutter={24} className="actions-btn">
          <Col>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              icon={loading ? <LoadingOutlined /> : undefined}
            >
              {loading ? "Đang thêm..." : "Thêm thú cưng"}
            </Button>
          </Col>
          <Col>
            <Button type="default" onClick={handleCancel}>
              Hủy bỏ
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddPet;